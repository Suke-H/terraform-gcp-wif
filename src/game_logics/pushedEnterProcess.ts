import { GameState } from "../types/GameState";

import { checkWordValidity } from "./checkWordValidity";
import { checkWordMatch } from "./checkWordMatch";
import { checkClear } from "./checkClear";

import { AlphabetMatch } from "../interfaces/AlphabetMatch";

export const pushedEnterProcess = async (
  correctAnswer: string,
  answerList: string[][],
  matchList: string[][],
  round: number,
  setMatchList: React.Dispatch<React.SetStateAction<string[][]>>,
  setAlphabetMatch: React.Dispatch<React.SetStateAction<AlphabetMatch>>,
  setGameState: React.Dispatch<React.SetStateAction<GameState>>
): Promise<boolean> => {
  // 単語の妥当性判定
  const isValid = await checkWordValidity(answerList, round);
  if (!isValid) return false;

  // 単語一致判定
  const tmpMatchList = checkWordMatch(
    correctAnswer,
    answerList,
    matchList,
    round
  );
  // クリア判定
  const _gameState = checkClear(correctAnswer, answerList, round);
  setGameState(_gameState);

  // スタイル更新
  setMatchList(tmpMatchList);

  // アルファベットの判定リスト更新
  const newMatch: AlphabetMatch = {};
  for (let i = 0; i < 5; i++) {
    newMatch[answerList[round - 1][i]] = tmpMatchList[round - 1][i] as
      | "Green"
      | "Yellow"
      | "Black";
  }
  setAlphabetMatch((prevMatch: AlphabetMatch) => ({
    ...prevMatch,
    ...newMatch,
  }));

  return true;
};
