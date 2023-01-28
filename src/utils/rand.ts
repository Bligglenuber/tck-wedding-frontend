export function randNorm(): number {
  return Math.random();
}

export function randInt(maxEx: number, minInc: number = 0): number {
  return minInc + Math.floor(randNorm() * (maxEx - minInc));
}

export function randUserId(): string {
  return randInt(10000, 1000).toString();
}

export function randName(): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const vowels = 'AEIOUY';
  let count = randInt(6, 3);
  let name = '';
  let letter;
  while (count) {
    count--;
    if (letter) {
      if (vowels.includes(letter)) {
        letter = letters[randInt(letters.length)];
      } else {
        letter = vowels[randInt(vowels.length)];
      }
    } else {
      letter = letters[randInt(letters.length)];
    }
    name += letter;
  }
  return name;
}

export function randStageId(): string {
  return randInt(2).toString();
}

export function randScore(): number {
  return Math.floor((randNorm() ** 2) * 100000);
}

export function randScoreData(total: number) {
  const scores = [];
  while (scores.length < total) {
    const userId = randUserId();
    const nameCount = randInt(4, 1);
    for (let nameIndex = 0; nameIndex < nameCount; nameIndex++) {
      const name = randName();
      const scoreCount = randInt(4, 1);
      for (let scoreIndex = 0; scoreIndex < scoreCount; scoreIndex++) {
        const stageId = randStageId();
        const score = randScore();
        scores.push({ userId, name, stageId, score, data: '' });
      }
    }
  }
  return scores;
}
