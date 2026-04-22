export interface AnimalCard {
  id: string;
  nameZh: string;
  nameEn: string;
  ipa: string;
  dialogue: {
    animalQuestion: string;
    animalAnswer: string;
    animalAnswerZh: string;
    officeQuestion: string;
    officeAnswer: string;
    officeAnswerZh: string;
    focusVerb: string;
  };
}

const requiredTopLevel: Array<keyof AnimalCard> = [
  "id",
  "nameZh",
  "nameEn",
  "ipa",
  "dialogue",
];

function isNonEmpty(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function validateAnimalCards(cards: AnimalCard[]): AnimalCard[] {
  const idSet = new Set<string>();

  for (const card of cards) {
    for (const field of requiredTopLevel) {
      if (!(field in card)) {
        throw new Error(`Missing field: ${field}`);
      }
    }

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(card.id)) {
      throw new Error(`Invalid id format: ${card.id}`);
    }

    if (idSet.has(card.id)) {
      throw new Error(`Duplicate id: ${card.id}`);
    }

    idSet.add(card.id);

    const stringFields = [
      card.nameZh,
      card.nameEn,
      card.ipa,
      card.dialogue.animalQuestion,
      card.dialogue.animalAnswer,
      card.dialogue.animalAnswerZh,
      card.dialogue.officeQuestion,
      card.dialogue.officeAnswer,
      card.dialogue.officeAnswerZh,
      card.dialogue.focusVerb,
    ];

    if (!stringFields.every(isNonEmpty)) {
      throw new Error(`Empty display field found in: ${card.id}`);
    }

    if (!(card.ipa.startsWith("/") && card.ipa.endsWith("/"))) {
      throw new Error(`IPA format invalid: ${card.id}`);
    }
  }

  return cards;
}
