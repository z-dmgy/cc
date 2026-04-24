"use client";

import { useMemo, useState } from "react";
import animalsRaw from "@/data/animals.json";
import { AnimalCardItem } from "@/components/animal-card";
import { type AnimalCard, validateAnimalCards } from "@/lib/animal-skill";

const animals = validateAnimalCards(animalsRaw as AnimalCard[]);

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [previewLayout, setPreviewLayout] = useState<"37" | "49">("37");
  const [showPreview, setShowPreview] = useState(false);

  function exportPdf(layout: "37" | "49") {
    window.location.href = `/api/export-pdf?layout=${layout}`;
  }

  const filtered = useMemo(() => {
    const lowerQuery = query.toLowerCase();

    return animals.filter((item) => {
      return (
        item.nameZh.includes(query) ||
        item.nameEn.toLowerCase().includes(lowerQuery) ||
        item.dialogue.focusVerb.toLowerCase().includes(lowerQuery) ||
        item.dialogue.animalQuestion.toLowerCase().includes(lowerQuery) ||
        item.dialogue.officeQuestion.toLowerCase().includes(lowerQuery)
      );
    });
  }, [query]);

  const previewUrl = `/print?layout=${previewLayout}`;

  return (
    <main>
      <h1>动物卡片学习站</h1>
      <p className="sub">80 张动物卡片，适合宝宝启蒙，也适合你练习高频动词和职场口语。</p>

      <div className="toolbar">
        <input
          className="input"
          placeholder="搜索动物名 / 动词 / 问句..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="button" type="button" onClick={() => exportPdf("37")}>
          导出 PDF 37
        </button>
        <button className="button" type="button" onClick={() => exportPdf("49")}>
          导出 PDF 49
        </button>
        <button className="button secondary" type="button" onClick={() => setShowPreview((value) => !value)}>
          {showPreview ? "隐藏预览" : "预览打印"}
        </button>
      </div>

      {showPreview ? (
        <section className="preview-panel" aria-label="PDF 打印预览">
          <div className="preview-toolbar">
            <div>
              <h2>打印预览</h2>
              <p className="preview-note">直接预览 PDF 使用的打印页面，不需要先导出。</p>
            </div>
            <div className="preview-actions">
              <button
                className={`button ${previewLayout === "37" ? "" : "secondary"}`}
                type="button"
                onClick={() => setPreviewLayout("37")}
              >
                37 布局
              </button>
              <button
                className={`button ${previewLayout === "49" ? "" : "secondary"}`}
                type="button"
                onClick={() => setPreviewLayout("49")}
              >
                49 布局
              </button>
            </div>
          </div>
          <iframe className="print-preview" title={`PDF 打印预览 ${previewLayout}`} src={previewUrl} />
        </section>
      ) : null}

      <section className="grid">
        {filtered.map((animal) => (
          <AnimalCardItem key={animal.id} card={animal} />
        ))}
      </section>
    </main>
  );
}
