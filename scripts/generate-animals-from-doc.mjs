import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const sourcePath = path.join(root, "animal_doc_paragraphs.txt");
const outputPath = path.join(root, "data", "animals.json");

function normalizeText(value) {
  return value.replace(/\s+/g, " ").replace(/^\uFEFF/, "").trim();
}

function toId(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const raw = fs.readFileSync(sourcePath, "utf8").replace(/^\uFEFF/, "");
const lines = raw
  .split(/\r?\n/)
  .map((line) => normalizeText(line))
  .filter(Boolean);

const animals = [];

for (const line of lines) {
  const match = line.match(/^(\d+)\.\s*(.+?)——(.+?)\s*(\/[^/]+\/)/);
  if (!match) continue;

  animals.push({
    nameZh: normalizeText(match[2]),
    nameEn: normalizeText(match[3]).toLowerCase(),
    ipa: normalizeText(match[4]),
  });
}

const focusVerbCycle = [
  "see",
  "find",
  "see",
  "pick",
  "look",
  "count",
  "hold",
  "want",
  "like",
  "need",
  "love",
  "go",
  "help",
  "do",
  "play",
  "use",
  "wait",
  "tell",
  "smile",
  "come",
];

const focusVerbs = Array.from({ length: 80 }, (_, index) => focusVerbCycle[index % 20]);

const babyQuestions = [
  "What is this now?",
  "Where is it now?",
  "Who is that there?",
  "Which one is it?",
  "What color is it?",
  "How many are here?",
  "Is it yours now?",
  "Do you want it?",
  "Would you like it?",
  "What do you need now?",
  "Do you like it?",
  "Are you ready now?",
  "Can you help now?",
  "How do we do it?",
  "What are you doing?",
  "May I have it?",
  "When is it now?",
  "What time is it?",
  "How is it going?",
  "Why is it here?",
];

const officeNouns = [
  ["file", "文件"],
  ["desk", "桌子"],
  ["client", "客户"],
  ["paper", "纸"],
  ["note", "便签"],
  ["card", "卡片"],
  ["plan", "计划"],
  ["chart", "图表"],
  ["report", "报告"],
  ["email", "邮件"],
  ["room", "会议室"],
  ["team", "团队"],
  ["task", "任务"],
  ["phone", "电话"],
  ["list", "清单"],
  ["page", "页面"],
  ["clock", "时钟"],
  ["draft", "草稿"],
  ["copy", "复印件"],
  ["slide", "幻灯片"],
];

const officePlaces = [
  ["on the desk", "在桌上"],
  ["by the door", "在门边"],
  ["in the box", "在盒子里"],
  ["near the wall", "在墙边"],
  ["in the tray", "在托盘里"],
  ["on the cart", "在推车上"],
  ["in the room", "在会议室里"],
  ["by the screen", "在屏幕边"],
];

const officeTimes = [
  ["at nine", "九点"],
  ["at ten", "十点"],
  ["at one", "一点"],
  ["at three", "三点"],
];

const clockTimes = [
  ["Nine o'clock.", "九点。"],
  ["Ten o'clock.", "十点。"],
  ["One o'clock.", "一点。"],
  ["Three o'clock.", "三点。"],
];

const moodWords = [
  ["good", "很好"],
  ["fine", "不错"],
  ["better", "更好了"],
  ["smooth", "很顺利"],
];

const animalPlaces = [
  ["here", "在这里"],
  ["there", "在那里"],
  ["up here", "在上面"],
  ["down there", "在下面"],
];

const animalColors = [
  ["green", "绿色"],
  ["gray", "灰色"],
  ["brown", "棕色"],
  ["black", "黑色"],
];

const animalCounts = [
  ["one", "一只"],
  ["two", "两只"],
  ["three", "三只"],
  ["four", "四只"],
];

function articleFor(word) {
  return /^[aeiou]/i.test(word) ? "an" : "a";
}

function animalCountText(nameEn, countWord) {
  return countWord === "one" ? nameEn : `${nameEn}s`;
}

function babyDialogue(animal, verb, round, slot) {
  const place = animalPlaces[round];
  const color = animalColors[round];
  const count = animalCounts[round];
  const time = officeTimes[round];
  const clock = clockTimes[round];
  const mood = moodWords[round];
  const a = articleFor(animal.nameEn);
  const countLabel = count[0] === "one" ? animal.nameEn : `${animal.nameEn}s`;

  const builders = [
    () => ({
      q: babyQuestions[0],
      a: `It is ${a} ${animal.nameEn}. We can see it.`,
      zh: `这是${animal.nameZh}。看看${animal.nameZh}。`,
    }),
    () => ({
      q: babyQuestions[1],
      a: `The ${animal.nameEn} is ${place[0]}. We can find it.`,
      zh: `${animal.nameZh}${place[1]}。找找${animal.nameZh}。`,
    }),
    () => ({
      q: babyQuestions[2],
      a: `That is the ${animal.nameEn}. We can see it.`,
      zh: `那是${animal.nameZh}。看看${animal.nameZh}。`,
    }),
    () => ({
      q: babyQuestions[3],
      a: `This is the ${animal.nameEn}. Pick this one.`,
      zh: `选${animal.nameZh}。就是这个。`,
    }),
    () => ({
      q: babyQuestions[4],
      a: `The ${animal.nameEn} is ${color[0]}. Look at it.`,
      zh: `${animal.nameZh}是${color[1]}的。看看${animal.nameZh}。`,
    }),
    () => ({
      q: babyQuestions[5],
      a:
        count[0] === "one"
          ? `One ${animal.nameEn} is here. Count it now.`
          : `${count[0]} ${countLabel} are here. Count them now.`,
      zh: `${count[1]}${animal.nameZh}。数数${animal.nameZh}。`,
    }),
    () => ({
      q: babyQuestions[6],
      a: `Yes, it is my ${animal.nameEn}. I can hold it.`,
      zh: `对，这是我的${animal.nameZh}。拿着${animal.nameZh}。`,
    }),
    () => ({
      q: babyQuestions[7],
      a: `Yes, I want the ${animal.nameEn} now.`,
      zh: `想要这个${animal.nameZh}。`,
    }),
    () => ({
      q: babyQuestions[8],
      a: `Yes, I would like the ${animal.nameEn}.`,
      zh: `好呀，我喜欢这个${animal.nameZh}。`,
    }),
    () => ({
      q: babyQuestions[9],
      a: `I need the ${animal.nameEn} now.`,
      zh: `我现在需要${animal.nameZh}。`,
    }),
    () => ({
      q: babyQuestions[10],
      a: `Yes, I really like the ${animal.nameEn}.`,
      zh: `对，我很喜欢${animal.nameZh}。`,
    }),
    () => ({
      q: babyQuestions[11],
      a: `Yes, I am ready for the ${animal.nameEn}.`,
      zh: `好了，去看${animal.nameZh}吧。`,
    }),
    () => ({
      q: babyQuestions[12],
      a: `Yes, I can help the ${animal.nameEn}.`,
      zh: `可以，帮帮${animal.nameZh}。`,
    }),
    () => ({
      q: babyQuestions[13],
      a: `We do it with the ${animal.nameEn} card.`,
      zh: `我们和${animal.nameZh}一起做。`,
    }),
    () => ({
      q: babyQuestions[14],
      a: `I am playing with the ${animal.nameEn}.`,
      zh: `我在和${animal.nameZh}一起玩。`,
    }),
    () => ({
      q: babyQuestions[15],
      a: `Yes, you may use the ${animal.nameEn} card.`,
      zh: `可以，用${animal.nameZh}卡。`,
    }),
    () => ({
      q: babyQuestions[16],
      a: `It is ${time[0]}. The ${animal.nameEn} can wait.`,
      zh: `${time[1]}。等${animal.nameZh}。`,
    }),
    () => ({
      q: babyQuestions[17],
      a: `It is ${clock[0].toLowerCase()} The ${animal.nameEn} is here.`,
      zh: `${clock[1]}。告诉${animal.nameZh}时间。`,
    }),
    () => ({
      q: babyQuestions[18],
      a: `The ${animal.nameEn} is ${mood[0]} today. It looks nice.`,
      zh: `${animal.nameZh}${mood[1]}。对着${animal.nameZh}笑一笑。`,
    }),
    () => ({
      q: babyQuestions[19],
      a: `The ${animal.nameEn} is here because it can come.`,
      zh: `${animal.nameZh}会过来。`,
    }),
  ];

  return builders[slot]();
}

function officeDialogue(round, slot) {
  const noun = officeNouns[(slot + round * 5) % officeNouns.length];
  const noun2 = officeNouns[(slot + round * 5 + 7) % officeNouns.length];
  const place = officePlaces[(slot + round) % officePlaces.length];
  const time = officeTimes[round];
  const clock = clockTimes[(round + slot) % clockTimes.length];
  const mood = moodWords[(round + slot) % moodWords.length];

  const builders = [
    () => ({
      q: "What is this now?",
      a: `It is the ${noun[0]}.`,
      zh: `这是${noun[1]}。`,
    }),
    () => ({
      q: `Where is the ${noun[0]}?`,
      a: `It is ${place[0]}.`,
      zh: `${noun[1]}${place[1]}。`,
    }),
    () => ({
      q: "Who is that there?",
      a: `That is the ${noun[0]} team lead.`,
      zh: `那是${noun[1]}负责人。`,
    }),
    () => ({
      q: "Which one do we use?",
      a: `Use this ${noun[0]} now.`,
      zh: `用这个${noun[1]}。`,
    }),
    () => ({
      q: `What color is the ${noun[0]}?`,
      a: `The ${noun[0]} is blue.`,
      zh: `${noun[1]}是蓝色的。`,
    }),
    () => ({
      q: `How many ${noun[0]}s do we need?`,
      a: `We need two ${noun[0]}s.`,
      zh: `我们需要两份${noun[1]}。`,
    }),
    () => ({
      q: `Is this ${noun[0]} yours?`,
      a: `Yes, it is mine.`,
      zh: `对，这是我的。`,
    }),
    () => ({
      q: `Do you want this ${noun[0]}?`,
      a: `Yes, I want it now.`,
      zh: `要，我现在就要。`,
    }),
    () => ({
      q: `Would you like this ${noun[0]}?`,
      a: `Yes, please send it.`,
      zh: `好，请发给我。`,
    }),
    () => ({
      q: "What do you need now?",
      a: `I need the ${noun[0]}.`,
      zh: `我现在需要${noun[1]}。`,
    }),
    () => ({
      q: `Do you like this ${noun[0]}?`,
      a: `Yes, it looks very clear.`,
      zh: `喜欢，看起来很清楚。`,
    }),
    () => ({
      q: "Are you ready for the meeting?",
      a: `Yes, the ${noun[0]} is ready now.`,
      zh: `好了，${noun[1]}也准备好了。`,
    }),
    () => ({
      q: "Can you help me?",
      a: `Yes, I can check the ${noun[0]}.`,
      zh: `可以，我来检查${noun[1]}。`,
    }),
    () => ({
      q: "How do we do it?",
      a: `First, open the file now.`,
      zh: `先打开${noun[1]}。`,
    }),
    () => ({
      q: "What are you doing?",
      a: `I am updating the ${noun[0]}.`,
      zh: `我在更新${noun[1]}。`,
    }),
    () => ({
      q: `May I use the ${noun[0]}?`,
      a: `Yes, use it now.`,
      zh: `可以，你现在用吧。`,
    }),
    () => ({
      q: `When is the ${noun[0]} review?`,
      a: `It is ${time[0]}.`,
      zh: `${time[1]}。`,
    }),
    () => ({
      q: "What time is it now?",
      a: `It is ${clock[0].toLowerCase()}`,
      zh: `${clock[1]}`,
    }),
    () => ({
      q: "How is it going?",
      a: `The ${noun[0]} is going ${mood[0]}.`,
      zh: `${noun[1]}${mood[1]}。`,
    }),
    () => ({
      q: `Why do we need the ${noun2[0]}?`,
      a: `It helps us finish the ${noun[0]}.`,
      zh: `因为它能帮到${noun[1]}。`,
    }),
  ];

  return builders[slot]();
}

if (animals.length !== 80) {
  throw new Error(`Animal count mismatch, expected 80 got ${animals.length}`);
}

if (focusVerbs.length !== 80) {
  throw new Error(`Verb count mismatch, expected 80 got ${focusVerbs.length}`);
}

const cards = animals.map((animal, index) => {
  const round = Math.floor(index / 20);
  const slot = index % 20;
  const verb = focusVerbs[index];
  const baby = babyDialogue(animal, verb, round, slot);
  const office = officeDialogue(round, slot);

  return {
    id: toId(animal.nameEn),
    nameZh: animal.nameZh,
    nameEn: animal.nameEn,
    ipa: animal.ipa,
    dialogue: {
      animalQuestion: baby.q,
      animalAnswer: baby.a,
      animalAnswerZh: baby.zh,
      officeQuestion: office.q,
      officeAnswer: office.a,
      officeAnswerZh: office.zh,
      focusVerb: verb,
    },
  };
});

function isNonEmpty(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function wordCount(value) {
  return value
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

function hasAnimalKeyword(answer, nameEn) {
  const normalizedAnswer = answer.toLowerCase();
  const parts = nameEn
    .toLowerCase()
    .split(/[\s-]+/)
    .filter((part) => part.length >= 3);

  return parts.some((part) => normalizedAnswer.includes(part));
}

function validate(cardsToCheck) {
  const ids = new Set();

  for (const card of cardsToCheck) {
    const strings = [
      card.id,
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

    if (ids.has(card.id)) {
      throw new Error(`Duplicate id: ${card.id}`);
    }

    ids.add(card.id);

    if (!strings.every(isNonEmpty)) {
      throw new Error(`Empty field detected in ${card.id}`);
    }

    if (!card.ipa.startsWith("/") || !card.ipa.endsWith("/")) {
      throw new Error(`IPA invalid: ${card.id}`);
    }

    if (!hasAnimalKeyword(card.dialogue.animalAnswer, card.nameEn)) {
      throw new Error(`Baby answer missing keyword for ${card.id}`);
    }

    if (card.dialogue.animalQuestion.length > 36) {
      throw new Error(`Baby question too long for ${card.id}`);
    }

    if (card.dialogue.animalAnswer.length > 52) {
      throw new Error(`Baby answer too long for ${card.id}`);
    }

    if (card.dialogue.officeQuestion.length > 38) {
      throw new Error(`Office question too long for ${card.id}`);
    }

    if (card.dialogue.officeAnswer.length > 42) {
      throw new Error(`Office answer too long for ${card.id}`);
    }

    for (const [label, text] of [
      ["baby question", card.dialogue.animalQuestion],
      ["baby answer", card.dialogue.animalAnswer],
      ["office question", card.dialogue.officeQuestion],
      ["office answer", card.dialogue.officeAnswer],
    ]) {
      if (wordCount(text) < 4) {
        throw new Error(`${label} too short for ${card.id}: ${text}`);
      }
    }
  }
}

validate(cards);
fs.writeFileSync(outputPath, `${JSON.stringify(cards, null, 2)}\n`, "utf8");
console.log(`Generated ${cards.length} cards -> ${outputPath}`);
