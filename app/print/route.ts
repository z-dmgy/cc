import animalsRaw from "@/data/animals.json";
import { type AnimalCard, validateAnimalCards } from "@/lib/animal-skill";

type PrintLayout = "37" | "49";

const layoutConfig: Record<
  PrintLayout,
  { rows: number; cols: number; rowHeightMm: number; pageHeightMm: number }
> = {
  "37": { rows: 8, cols: 3, rowHeightMm: 37.095, pageHeightMm: 297 },
  "49": { rows: 6, cols: 3, rowHeightMm: 49.494, pageHeightMm: 297 },
};

export const runtime = "nodejs";

function isPrintLayout(value: string | null): value is PrintLayout {
  return value === "37" || value === "49";
}

function parseIds(value: string | null) {
  if (!value) {
    return [];
  }

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function normalizeText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function highlightVerb(text: string, verb: string) {
  const escapedVerb = verb.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = normalizeText(text).split(new RegExp(`(\\b${escapedVerb}\\b)`, "i"));

  return parts
    .map((part) =>
      part.toLowerCase() === verb.toLowerCase()
        ? `<strong>${escapeHtml(part)}</strong>`
        : escapeHtml(part),
    )
    .join("");
}

function chunkCards(items: AnimalCard[], size: number) {
  const pages: AnimalCard[][] = [];

  for (let index = 0; index < items.length; index += size) {
    pages.push(items.slice(index, index + size));
  }

  return pages;
}

function isLongTitle(card: AnimalCard, layout: PrintLayout) {
  const titleText = `${card.nameZh}${card.nameEn}${card.ipa}${card.dialogue.focusVerb}`;
  return titleText.length > (layout === "37" ? 32 : 40);
}

function cardHtml(card: AnimalCard, layout: PrintLayout) {
  const verb = card.dialogue.focusVerb;
  const rowSizeClass = layout === "37" ? "small" : "large";
  const titleClass = isLongTitle(card, layout) ? " title-compact" : "";
  return `
    <article class="card ${rowSizeClass}">
      <div class="title${titleClass}">
        <span>${escapeHtml(normalizeText(card.nameZh))} · ${escapeHtml(normalizeText(card.nameEn))}</span>
        <strong class="ipa">${escapeHtml(normalizeText(card.ipa))}</strong>
        <span class="verb">V:<strong>${escapeHtml(normalizeText(verb))}</strong></span>
      </div>
      <div class="qa">
        <div class="question">${highlightVerb(card.dialogue.animalQuestion, verb)}</div>
        <div class="answer">${highlightVerb(card.dialogue.animalAnswer, verb)}</div>
        <div class="zh">(${escapeHtml(normalizeText(card.dialogue.animalAnswerZh))})</div>
      </div>
      <div class="qa">
        <div class="question">${highlightVerb(card.dialogue.officeQuestion, verb)}</div>
        <div class="answer">${highlightVerb(card.dialogue.officeAnswer, verb)}</div>
        <div class="zh">(${escapeHtml(normalizeText(card.dialogue.officeAnswerZh))})</div>
      </div>
    </article>`;
}

function pageHtml(pageCards: AnimalCard[], layout: PrintLayout) {
  const config = layoutConfig[layout];
  const perPage = config.rows * config.cols;
  const cells = Array.from({ length: perPage }, (_, index) => pageCards[index]);

  return `
    <section class="page layout-${layout}">
      ${cells
        .map((card) => `<div class="cell">${card ? cardHtml(card, layout) : ""}</div>`)
        .join("")}
    </section>`;
}

function html(cards: AnimalCard[], layout: PrintLayout) {
  const config = layoutConfig[layout];
  const perPage = config.rows * config.cols;
  const pages = chunkCards(cards, perPage);
  const cellHeight = config.rowHeightMm;
  const contentPadding = layout === "37" ? "0.8mm 0.27mm" : "1.5mm 0.27mm";

  return `<!doctype html>
  <html lang="zh-CN">
    <head>
      <meta charset="utf-8" />
      <title>Animal Cards PDF ${layout}</title>
      <style>
        @page {
          size: A4;
          margin: 0;
        }

        * {
          box-sizing: border-box;
        }

        html,
        body {
          margin: 0;
          padding: 0;
          width: 210mm;
          background: #fff;
          color: #17221b;
          font-family: "Microsoft YaHei", "SimSun", Arial, sans-serif;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }

        .page {
          width: 210mm;
          height: ${config.pageHeightMm}mm;
          display: grid;
          grid-template-columns: repeat(${config.cols}, 70mm);
          grid-template-rows: repeat(${config.rows}, ${cellHeight}mm);
          align-content: start;
          overflow: hidden;
          break-after: page;
          page-break-after: always;
        }

        .page:last-child {
          break-after: auto;
          page-break-after: auto;
        }

        .cell {
          width: 70mm;
          height: ${cellHeight}mm;
          padding: 0;
          margin: 0;
          overflow: hidden;
          border: 0.3mm dashed #aaa;
        }

        .card {
          width: 100%;
          height: 100%;
          border: 0;
          border-radius: 0;
          margin: 0;
          padding: ${contentPadding};
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          overflow: hidden;
          background: #fff;
        }

        .title {
          align-items: baseline;
          display: flex;
          flex-wrap: nowrap;
          font-weight: 700;
          gap: 1.2mm;
          line-height: 1.12;
          margin-bottom: ${layout === "37" ? "1.2mm" : "2.1mm"};
          min-width: 0;
          white-space: nowrap;
        }

        .title > span:first-child {
          flex: 0 1 auto;
          min-width: 0;
          overflow-wrap: anywhere;
        }

        .small .title {
          font-size: 8.9pt;
        }

        .large .title {
          font-size: 11.5pt;
        }

        .small .title-compact {
          font-size: 8.4pt;
          flex-wrap: wrap;
          row-gap: 0.1mm;
          white-space: normal;
        }

        .large .title-compact {
          font-size: 11pt;
          flex-wrap: wrap;
          row-gap: 0.3mm;
          white-space: normal;
        }

        .ipa {
          flex: 0 0 auto;
          font-family:
            "Charis SIL",
            "Doulos SIL",
            "Gentium Plus",
            "Segoe UI",
            "Arial Unicode MS",
            "Times New Roman",
            serif;
        }

        .verb {
          flex: 0 0 auto;
        }

        .qa {
          line-height: ${layout === "37" ? "1.15" : "1.28"};
          margin-top: ${layout === "37" ? "0.45mm" : "1mm"};
        }

        .answer {
          margin-top: ${layout === "37" ? "0.15mm" : "0.35mm"};
        }

        .zh {
          color: #526259;
          font-size: ${layout === "37" ? "6.1pt" : "7.8pt"};
          margin-top: ${layout === "37" ? "0.05mm" : "0.25mm"};
        }

        .small .qa {
          font-size: 10.1pt;
        }

        .large .qa {
          font-size: 11.8pt;
        }

        strong {
          font-weight: 800;
        }
      </style>
    </head>
    <body>
      ${pages.map((page) => pageHtml(page, layout)).join("")}
    </body>
  </html>`;
}

export function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const layout = requestUrl.searchParams.get("layout");
  const ids = parseIds(requestUrl.searchParams.get("ids"));

  if (!isPrintLayout(layout)) {
    return Response.json({ error: "layout must be 37 or 49" }, { status: 400 });
  }

  const allCards = validateAnimalCards(animalsRaw as AnimalCard[]);
  const cards =
    ids.length > 0 ? allCards.filter((card) => ids.includes(card.id)) : allCards;

  return new Response(html(cards, layout), {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  });
}
