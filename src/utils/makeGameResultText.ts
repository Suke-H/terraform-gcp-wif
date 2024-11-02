export const makeGameResultText = (matchList: string[][], todaysNo: number) => {
	const hashtag = "#MyWordleProject_" + todaysNo;
	const emojis = convertAnswerMatchToEmojis(matchList);
	const notes = "*An unofficial Wordle learning project.";
	const url = "https://kakutory.com/game_pages/MyWordleProject";

	return hashtag + "\n" + emojis + "\n\n" + notes + "\n" + url;
};

const convertAnswerMatchToEmojis = (matchList: string[][]): string => {
  const emojiList = matchList
    .map((row) => {
      return row
        .map((match) => {
          if (match === "Black") {
            return "⬛";
          } else if (match === "Yellow") {
            return "🟨";
          } else if (match === "Green") {
            return "🟩";
          } else {
            return "";
          }
        })
        .join(""); // 各行の絵文字を結合
    })
    .filter((row) => row.length > 0); // 空の行を除外
  return emojiList.join("\n"); // 空でない行のみを改行で結合
};
