import type { AnimalCard } from "@/lib/animal-skill";

type ExportLayout = "37" | "49";

const layouts: Record<ExportLayout, { rows: number; cols: number; rowHeight: number }> = {
  "37": { rows: 8, cols: 3, rowHeight: 2103 },
  "49": { rows: 6, cols: 3, rowHeight: 2801 },
};

const encoder = new TextEncoder();

function xmlEscape(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function run(text: string, size = 18, bold = false) {
  return `
      <w:r>
        <w:rPr>
          ${bold ? "<w:b/>" : ""}
          <w:sz w:val="${size}"/>
          <w:szCs w:val="${size}"/>
        </w:rPr>
        <w:t xml:space="preserve">${xmlEscape(text)}</w:t>
      </w:r>`;
}

function paragraph(text: string, size = 18, bold = false, after = 18) {
  return `
    <w:p>
      <w:pPr>
        <w:spacing w:before="0" w:after="${after}" w:line="215" w:lineRule="auto"/>
        <w:ind w:left="0" w:right="0" w:firstLine="0"/>
      </w:pPr>
      ${run(text, size, bold)}
    </w:p>`;
}

function paragraphRuns(runs: string[], after = 18) {
  return `
    <w:p>
      <w:pPr>
        <w:spacing w:before="0" w:after="${after}" w:line="215" w:lineRule="auto"/>
        <w:ind w:left="0" w:right="0" w:firstLine="0"/>
      </w:pPr>
      ${runs.join("")}
    </w:p>`;
}

function sentenceWithVerb(text: string, verb: string, size = 14) {
  const escapedVerb = verb.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(\\b${escapedVerb}\\b)`, "i"));

  return parts.map((part) => run(part, size, part.toLowerCase() === verb.toLowerCase()));
}

function cardCell(card?: AnimalCard) {
  const body = card
    ? [
        paragraph(`${card.nameZh}  ${card.nameEn}`, 19, true, 10),
        paragraphRuns(
          [
            run(card.ipa, 15, true),
            run("    Verb: ", 15),
            run(card.dialogue.focusVerb, 15, true),
          ],
          14,
        ),
        paragraphRuns(
          [
            ...sentenceWithVerb(card.dialogue.animalQuestion, card.dialogue.focusVerb, 13),
            run("  ", 13),
            ...sentenceWithVerb(card.dialogue.animalAnswer, card.dialogue.focusVerb, 13),
            run(` (${card.dialogue.animalAnswerZh})`, 13),
          ],
          14,
        ),
        paragraphRuns(
          [
            ...sentenceWithVerb(card.dialogue.officeQuestion, card.dialogue.focusVerb, 13),
            run("  ", 13),
            ...sentenceWithVerb(card.dialogue.officeAnswer, card.dialogue.focusVerb, 13),
            run(` (${card.dialogue.officeAnswerZh})`, 13),
          ],
          0,
        ),
      ].join("")
    : paragraph("");

  return `
    <w:tc>
      <w:tcPr>
        <w:tcW w:w="3968" w:type="dxa"/>
        <w:tcBorders>
          <w:top w:val="single" w:sz="6" w:space="0" w:color="D6E0D8"/>
          <w:left w:val="single" w:sz="6" w:space="0" w:color="D6E0D8"/>
          <w:bottom w:val="single" w:sz="6" w:space="0" w:color="D6E0D8"/>
          <w:right w:val="single" w:sz="6" w:space="0" w:color="D6E0D8"/>
        </w:tcBorders>
        <w:shd w:fill="FFFFFF"/>
        <w:tcMar>
          <w:top w:w="110" w:type="dxa"/>
          <w:left w:w="135" w:type="dxa"/>
          <w:bottom w:w="110" w:type="dxa"/>
          <w:right w:w="135" w:type="dxa"/>
        </w:tcMar>
        <w:vAlign w:val="center"/>
      </w:tcPr>
      ${body}
    </w:tc>`;
}

function table(cards: Array<AnimalCard | undefined>, layout: (typeof layouts)[ExportLayout]) {
  const rows = [];

  for (let rowIndex = 0; rowIndex < layout.rows; rowIndex += 1) {
    const cells = [];

    for (let colIndex = 0; colIndex < layout.cols; colIndex += 1) {
      const cardIndex = rowIndex * layout.cols + colIndex;
      cells.push(cardCell(cards[cardIndex]));
    }

    rows.push(`
      <w:tr>
        <w:trPr>
          <w:cantSplit/>
          <w:trHeight w:hRule="exact" w:val="${layout.rowHeight}"/>
        </w:trPr>
        ${cells.join("")}
      </w:tr>`);
  }

  return `
    <w:tbl>
      <w:tblPr>
        <w:tblW w:w="11906" w:type="dxa"/>
        <w:tblInd w:w="0" w:type="dxa"/>
        <w:tblBorders>
          <w:top w:val="none" w:sz="0" w:space="0" w:color="auto"/>
          <w:left w:val="none" w:sz="0" w:space="0" w:color="auto"/>
          <w:bottom w:val="none" w:sz="0" w:space="0" w:color="auto"/>
          <w:right w:val="none" w:sz="0" w:space="0" w:color="auto"/>
          <w:insideH w:val="none" w:sz="0" w:space="0" w:color="auto"/>
          <w:insideV w:val="none" w:sz="0" w:space="0" w:color="auto"/>
        </w:tblBorders>
        <w:tblLayout w:type="fixed"/>
        <w:tblCellMar>
          <w:top w:w="0" w:type="dxa"/>
          <w:left w:w="0" w:type="dxa"/>
          <w:bottom w:w="0" w:type="dxa"/>
          <w:right w:w="0" w:type="dxa"/>
        </w:tblCellMar>
        <w:tblLook w:val="0000"/>
      </w:tblPr>
      <w:tblGrid>
        <w:gridCol w:w="3968"/>
        <w:gridCol w:w="3968"/>
        <w:gridCol w:w="3968"/>
      </w:tblGrid>
      ${rows.join("")}
    </w:tbl>`;
}

function documentXml(cards: AnimalCard[], layoutName: ExportLayout) {
  const layout = layouts[layoutName];
  const perPage = layout.rows * layout.cols;
  const pages = [];

  for (let index = 0; index < cards.length; index += perPage) {
    pages.push(cards.slice(index, index + perPage));
  }

  const tables = pages
    .map((pageCards, index) => {
      const pageTable = table(pageCards, layout);
      const pageBreak =
        index < pages.length - 1
          ? '<w:p><w:r><w:br w:type="page"/></w:r></w:p>'
          : "";

      return `${pageTable}${pageBreak}`;
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
  <w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
    <w:body>
      ${tables}
      <w:sectPr>
        <w:type w:val="continuous"/>
        <w:pgSz w:w="11906" w:h="16838"/>
        <w:pgMar w:top="6" w:right="0" w:bottom="0" w:left="0" w:header="720" w:footer="720" w:gutter="0"/>
        <w:cols w:space="720"/>
      </w:sectPr>
    </w:body>
  </w:document>`;
}

function crc32(bytes: Uint8Array) {
  let crc = 0xffffffff;

  for (const byte of bytes) {
    crc ^= byte;

    for (let index = 0; index < 8; index += 1) {
      crc = crc & 1 ? (crc >>> 1) ^ 0xedb88320 : crc >>> 1;
    }
  }

  return (crc ^ 0xffffffff) >>> 0;
}

function dosTime(date: Date) {
  return (
    ((date.getHours() & 0x1f) << 11) |
    ((date.getMinutes() & 0x3f) << 5) |
    ((date.getSeconds() / 2) & 0x1f)
  );
}

function dosDate(date: Date) {
  return (
    (((date.getFullYear() - 1980) & 0x7f) << 9) |
    (((date.getMonth() + 1) & 0xf) << 5) |
    (date.getDate() & 0x1f)
  );
}

function writeUInt16(value: number) {
  const bytes = new Uint8Array(2);
  const view = new DataView(bytes.buffer);
  view.setUint16(0, value, true);
  return bytes;
}

function writeUInt32(value: number) {
  const bytes = new Uint8Array(4);
  const view = new DataView(bytes.buffer);
  view.setUint32(0, value, true);
  return bytes;
}

function concat(parts: Uint8Array[]) {
  const total = parts.reduce((sum, part) => sum + part.length, 0);
  const output = new Uint8Array(total);
  let offset = 0;

  for (const part of parts) {
    output.set(part, offset);
    offset += part.length;
  }

  return output;
}

function zip(files: Array<{ name: string; content: string }>) {
  const now = new Date();
  const localParts: Uint8Array[] = [];
  const centralParts: Uint8Array[] = [];
  let offset = 0;

  for (const file of files) {
    const nameBytes = encoder.encode(file.name);
    const contentBytes = encoder.encode(file.content);
    const fileCrc = crc32(contentBytes);
    const time = dosTime(now);
    const date = dosDate(now);

    const localHeader = concat([
      writeUInt32(0x04034b50),
      writeUInt16(20),
      writeUInt16(0x0800),
      writeUInt16(0),
      writeUInt16(time),
      writeUInt16(date),
      writeUInt32(fileCrc),
      writeUInt32(contentBytes.length),
      writeUInt32(contentBytes.length),
      writeUInt16(nameBytes.length),
      writeUInt16(0),
      nameBytes,
    ]);

    localParts.push(localHeader, contentBytes);

    const centralHeader = concat([
      writeUInt32(0x02014b50),
      writeUInt16(20),
      writeUInt16(20),
      writeUInt16(0x0800),
      writeUInt16(0),
      writeUInt16(time),
      writeUInt16(date),
      writeUInt32(fileCrc),
      writeUInt32(contentBytes.length),
      writeUInt32(contentBytes.length),
      writeUInt16(nameBytes.length),
      writeUInt16(0),
      writeUInt16(0),
      writeUInt16(0),
      writeUInt16(0),
      writeUInt32(0),
      writeUInt32(offset),
      nameBytes,
    ]);

    centralParts.push(centralHeader);
    offset += localHeader.length + contentBytes.length;
  }

  const centralDirectory = concat(centralParts);
  const localFiles = concat(localParts);
  const end = concat([
    writeUInt32(0x06054b50),
    writeUInt16(0),
    writeUInt16(0),
    writeUInt16(files.length),
    writeUInt16(files.length),
    writeUInt32(centralDirectory.length),
    writeUInt32(localFiles.length),
    writeUInt16(0),
  ]);

  return concat([localFiles, centralDirectory, end]);
}

export function createCardsDocx(cards: AnimalCard[], layoutName: ExportLayout) {
  return zip([
    {
      name: "[Content_Types].xml",
      content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
      <Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
        <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
        <Default Extension="xml" ContentType="application/xml"/>
        <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
      </Types>`,
    },
    {
      name: "_rels/.rels",
      content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
      <Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
        <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
      </Relationships>`,
    },
    {
      name: "word/document.xml",
      content: documentXml(cards, layoutName),
    },
  ]);
}

export function isExportLayout(value: string | null): value is ExportLayout {
  return value === "37" || value === "49";
}
