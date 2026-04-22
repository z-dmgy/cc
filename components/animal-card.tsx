import type { AnimalCard } from "@/lib/animal-skill";

export function AnimalCardItem({ card }: { card: AnimalCard }) {
  return (
    <article className="card">
      <div className="title">
        <div>
          <div className="name">
            {card.nameZh} · {card.nameEn}
          </div>
          <div className="ipa">{card.ipa}</div>
        </div>
      </div>

      <div className="meta">高频动词：{card.dialogue.focusVerb}</div>

      <div className="block">
        <div className="q">{card.dialogue.animalQuestion}</div>
        <div className="a">{card.dialogue.animalAnswer}</div>
        <div className="zh">（{card.dialogue.animalAnswerZh}）</div>
      </div>

      <div className="block">
        <div className="q">{card.dialogue.officeQuestion}</div>
        <div className="a">{card.dialogue.officeAnswer}</div>
        <div className="zh">（{card.dialogue.officeAnswerZh}）</div>
      </div>
    </article>
  );
}
