# Card Schema Reference

## Type

```ts
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
```

## Validation Checklist

1. ID unique and kebab-case.
2. Every string non-empty after trim.
3. `ipa` starts and ends with `/`.
4. Dialogues contain both English and Chinese explanation fields.
5. Record count must match document animal entries.
6. At least 80 focus verbs must appear, and each verb must occur at least 2 times.
