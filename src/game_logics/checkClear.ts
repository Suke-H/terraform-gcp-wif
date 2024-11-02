import { GameState } from "../types/GameState";

// クリア判定
export const checkClear = (
  correctAnswer: string,
  answerList: string[][],
  round: number
): GameState => {
  // 正解が空文字だった場合はサーバーエラー
  if (correctAnswer === "") {
    alert("Server Error: Please reload the page.");
    return "Playing";
  }

  // ワードを抽出
  const wordList = [];
  for (let j = 0; j < 5; j++) {
    wordList.push(answerList[round - 1][j]);
  }
  const submitWord = wordList.join("");

  // クリア
  if (submitWord == correctAnswer) {
    alert("clear!!");
    return "GameClear";
  }
  // 6回目で不正解だった場合
  else if (round == 6) {
    alert(correctAnswer);
    return "GameOver";
  }

  // ゲーム続行
  return "Playing";
};
