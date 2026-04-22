import animalsRaw from "@/data/animals.json";
import { createCardsDocx, isExportLayout } from "@/lib/docx-export";
import { type AnimalCard, validateAnimalCards } from "@/lib/animal-skill";

export const runtime = "nodejs";

function parseIds(value: string | null) {
  if (!value) {
    return [];
  }

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function GET(request: Request) {
  const url = new URL(request.url);
  const layout = url.searchParams.get("layout");
  const ids = parseIds(url.searchParams.get("ids"));

  if (!isExportLayout(layout)) {
    return Response.json({ error: "layout must be 37 or 49" }, { status: 400 });
  }

  const allCards = validateAnimalCards(animalsRaw as AnimalCard[]);
  const cards = ids.length > 0 ? allCards.filter((card) => ids.includes(card.id)) : allCards;
  const docx = createCardsDocx(cards, layout);
  const suffix = ids.length > 0 ? `-${ids.join("-")}` : "";

  return new Response(docx, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename="animal-cards-${layout}${suffix}.docx"`,
    },
  });
}
