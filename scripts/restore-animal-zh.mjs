import fs from "node:fs";
import path from "node:path";

const filePath = path.join(process.cwd(), "data", "animals.json");
const raw = fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, "");
const data = JSON.parse(raw);

const animalZhMap = {
  "crocodile": "是的，它可以在水里。",
  "hippo": "是的，它有一张大嘴。",
  "cat": "是的，它会快速跳跃。",
  "mosquito": "是的，我们可以说 mosquito。",
  "raccoon": "是的，它可以爬到树上。",
  "conch": "是的，我们可以在海边找到海螺。",
  "horse": "是的，它会发出很大的声音。",
  "dragonfly": "是的，我们认识蜻蜓。",
  "polar-bear": "是的，我觉得它很强壮。",
  "seal": "是的，它可以快速潜水。",
  "walrus": "是的，我们能清楚地看见它。",
  "sea-turtle": "是的，它会在夜里出来。",
  "shark": "是的，我想要鲨鱼卡片。",
  "dolphin": "是的，我们可以看看它。",
  "magpie": "是的，我们可以用喜鹊卡片。",
  "rooster": "是的，我们可以找到它。",
  "red-crowned-crane": "是的，我们可以给它一些食物。",
  "rabbit": "是的，我可以给你讲讲它。",
  "camel": "是的，它可以活动很久。",
  "pigeon": "是的，我们可以把它叫作鸽子。",
  "shrimp": "是的，它会试着藏起来。",
  "monkey": "是的，你可以问关于它的问题。",
  "crab": "是的，它需要干净的水。",
  "deer": "是的，它在这里觉得很安全。",
  "parrot": "是的，它可以变得安静。",
  "lion": "是的，它会在夜里离开洞穴。",
  "grasshopper": "是的，我们可以把它放在这里。",
  "mink": "是的，它的意思是“要小心”。",
  "spider": "是的，它可以在这里保持不动。",
  "ant": "是的，我们可以让它先过去。",
  "dog": "是的，它现在可以开始跑了。",
  "tiger": "是的，它今天看起来很平静。",
  "sea-horse": "是的，我们现在可以帮助它。",
  "chameleon": "是的，我们可以聊聊它。",
  "panda": "是的，它可以慢慢转身。",
  "sheep": "是的，它现在可以开始活动。",
  "penguin": "是的，我可以再给你看一次。",
  "kingfisher": "是的，我们能听到它。",
  "octopus": "是的，它可以玩贝壳。",
  "chimpanzee": "是的，它可以跑得很快。",
  "bee": "是的，它会在花丛间飞来飞去。",
  "cow": "是的，它可以生活在农场。",
  "duck": "是的，我相信它会游泳。",
  "mouse": "是的，它可以把食物带回家。",
  "jellyfish": "是的，它会蜇人。",
  "hen": "是的，我可以写写它。",
  "squirrel": "是的，它可以坐在树枝上。",
  "siskin": "是的，它可以站在树枝上。",
  "turtle": "是的，它可能会迷路。",
  "owl": "是的，我们可以付费看它。",
  "peacock": "是的，我们今天可以看到它。",
  "swallow": "是的，这张图片可以放进燕子。",
  "cattle": "是的，它们可以继续穿过草地。",
  "ostrich": "是的，孩子们可以认识它。",
  "koala": "是的，它可以慢慢换位置。",
  "eagle": "是的，它可以带着小鸟往前飞。",
  "giraffe": "是的，我能听懂这个故事。",
  "oriole": "是的，我们可以在这里看它。",
  "wolf": "是的，它可以跟着妈妈。",
  "swan": "是的，它可以停在湖边。",
  "zebra": "是的，它可以找到一条安全的路。",
  "fox": "是的，我们现在可以聊聊它。",
  "sparrow": "是的，我可以读这张卡片。",
  "hedgehog": "是的，我们可以花一分钟看看它。",
  "leopard": "是的，它可以长得很快。",
  "woodpecker": "是的，它可以把嘴张得很大。",
  "sea-lion": "是的，它可以在岩石上走。",
  "butterfly-fish": "是的，它在比赛中可以游得很快。",
  "clownfish": "是的，这张卡片可以教新单词。",
  "kangaroo": "是的，人们可以在动物园近距离看它。",
  "butterfly": "是的，我记得它。",
  "donkey": "是的，我喜欢它。",
  "killer-whale": "是的，我觉得它很聪明。",
  "snail": "是的，它会在雨后出现。",
  "mantis": "是的，我们今天可以买一本。",
  "sea-gull": "是的，我们可以在这里等它。",
  "pig": "是的，这张图片很适合上猪这一课。",
  "ladybug": "是的，我可以把它发出去。",
  "elephant": "是的，我觉得它会动起来。",
  "globefish": "是的，它可以搭一个安全的藏身处。"
};

const officeZhMap = {
  "conch": "是的，我现在可以去拿文件。",
  "sea-turtle": "是的，我现在可以过来。",
  "mink": "是的，这张便签表示我们应该再等一会儿。",
  "sheep": "是的，我们现在可以开始这节课。",
  "octopus": "是的，我们现在可以播放视频。",
  "chimpanzee": "是的，我现在可以运行这个程序。",
  "bee": "是的，我们可以把会议改到周五。",
  "cow": "是的，这条说明可以保留在报告里。",
  "duck": "是的，我相信这个结果。",
  "swallow": "是的，报告可以包含这张图表。",
  "swan": "是的，我们现在可以暂停这个任务。",
  "snail": "是的，更新现在可以显示在屏幕上。",
  "mantis": "是的，我们今天可以买一台新打印机。",
  "sea-gull": "是的，我们现在可以等回复。"
};

for (const item of data) {
  if (animalZhMap[item.id]) {
    item.dialogue.animalAnswerZh = animalZhMap[item.id];
  }
  if (officeZhMap[item.id]) {
    item.dialogue.officeAnswerZh = officeZhMap[item.id];
  }
}

fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
console.log("restored animal and office zh");
