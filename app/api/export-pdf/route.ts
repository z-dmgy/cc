import { execFile } from "node:child_process";
import { randomUUID } from "node:crypto";
import { existsSync } from "node:fs";
import { readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

type PdfLayout = "37" | "49";

const chromePaths = [
  // macOS
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  // Windows
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
];

export const runtime = "nodejs";

function isPdfLayout(value: string | null): value is PdfLayout {
  return value === "37" || value === "49";
}

function buildPrintUrl(requestUrl: URL, layout: PdfLayout) {
  const printUrl = new URL("/print", requestUrl.origin);
  printUrl.searchParams.set("layout", layout);

  const ids = requestUrl.searchParams.get("ids");
  if (ids) {
    printUrl.searchParams.set("ids", ids);
  }

  return printUrl.toString();
}

function findBrowser() {
  return chromePaths.find((browserPath) => existsSync(browserPath));
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const layout = requestUrl.searchParams.get("layout");

  if (!isPdfLayout(layout)) {
    return Response.json({ error: "layout must be 37 or 49" }, { status: 400 });
  }

  const browser = findBrowser();

  if (!browser) {
    return Response.json({ error: "Chrome or Edge was not found" }, { status: 500 });
  }

  const pdfPath = path.join(tmpdir(), `animal-cards-${layout}-${randomUUID()}.pdf`);
  const printUrl = buildPrintUrl(requestUrl, layout);

  try {
    await execFileAsync(browser, [
      "--headless=new",
      "--disable-gpu",
      "--no-sandbox",
      "--disable-extensions",
      "--run-all-compositor-stages-before-draw",
      "--virtual-time-budget=1000",
      "--print-to-pdf-no-header",
      `--print-to-pdf=${pdfPath}`,
      printUrl,
    ]);

    const pdf = await readFile(pdfPath);

    return new Response(pdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="animal-cards-${layout}.pdf"`,
      },
    });
  } finally {
    await rm(pdfPath, { force: true });
  }
}
