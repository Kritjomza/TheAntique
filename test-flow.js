const scores = { I: 0, E: 0, T: 0, F: 0, S: 0, C: 0 };
const choice = { text: "กล่องไม้แข็งแรง...", effect: { I: 1, S: 1 } };

let latestScores = { ...scores };
Object.entries(choice.effect).forEach(([axis, value]) => {
  latestScores[axis] += value;
});

function calculateArchetype(scores) {
  const isI = scores.I >= scores.E;
  const isT = scores.T >= scores.F;
  const isS = scores.S >= scores.C;
  return isI && isT && isS ? "กล้องฟิล์มเยอรมันเก่า" : "สมุดบันทึกปกหนังทำมือ";
}
console.log(calculateArchetype(latestScores));
