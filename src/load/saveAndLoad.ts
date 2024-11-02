import { saveGameDataInLocal, loadGameDataInLocal, resetGameDataInLocal } from "../utils/saveAndLoadInLocalStorage";
import { checkWordMatch } from "../game_logics/checkWordMatch";
import { checkClear } from "../game_logics/checkClear";
import { AlphabetMatch } from "../interfaces/AlphabetMatch";
import { GameState } from "../types/GameState";

export interface LoadDataSetters {
    setAnswerList: React.Dispatch<React.SetStateAction<string[][]>>;
    setMatchList: React.Dispatch<React.SetStateAction<string[][]>>;
    setGameState: React.Dispatch<React.SetStateAction<GameState>>;
    setRound: React.Dispatch<React.SetStateAction<number>>;
    setAlphabetMatch: React.Dispatch<React.SetStateAction<AlphabetMatch>>;
}

export const saveGameData = (todaysNo: number, answerList: string[][]) => {
    saveGameDataInLocal(todaysNo, answerList);
}

export const loadGameData = (todaysNo: number, correctAnswer: string, loadDataSetters: LoadDataSetters) => {
    // ローカルストレージからロード
    const answerList = loadGameDataInLocal(todaysNo);

    // ロードしたデータをセット
    loadDataSetters.setAnswerList(answerList);

    // ラウンド数をセット
    // answerListの中で空文字列がある場合はその行番号をセット
    const index = answerList.findIndex((row) => row.includes(""));
    // 空文字列がない(indexが-1)場合は6をセット
    const round = index !== -1 ? index : 6;

    loadDataSetters.setRound(round+1);

    // ラウンドが0だった場合
    if (round === 0) {
        // ローカルストレージをクリアして終了
        resetGameData();
        return;
    }

    // ゲームの状態をセット
    loadDataSetters.setGameState(checkClear(correctAnswer, answerList, round));

    // マッチリストをセット
    const matchList = calcMatchList(answerList, correctAnswer, round)
    loadDataSetters.setMatchList(matchList);

    // 使用したアルファベットをセット
    loadDataSetters.setAlphabetMatch(calcAlphabetMatch(answerList, matchList, round));
}

const resetGameData = () => {
    resetGameDataInLocal();
}

const calcMatchList = (answerList: string[][], correctAnswer: string, round: number): string[][] => {
    // 空配列を作成
    let matchList: string[][] = new Array(6);
    for (let i = 0; i < 6; i++) {
        matchList[i] = new Array(5).fill("White");
    }
    // 1文字ずつ判定
    for (let i = 1; i <= round; i++) {
        matchList = checkWordMatch(correctAnswer, answerList, matchList, i);
    }

    return matchList;
}

// 全アルファベットを'NoUse'で初期化する関数
const initializeAlphabetMatch = (): AlphabetMatch => {
    const result: AlphabetMatch = {};

    for (let charCode = 65; charCode <= 90; charCode++) {
        const letter = String.fromCharCode(charCode);
        result[letter] = "NoUse";
    }
    return result;
}

const calcAlphabetMatch = (answerList: string[][], matchList: string[][], round: number): AlphabetMatch => {
    const newMatch = initializeAlphabetMatch();
    for (let i = 0; i < round; i++) {
        for (let j = 0; j < 5; j++) {
            newMatch[answerList[i][j]] = matchList[i][j] as
                | "Green"
                | "Yellow"
                | "Black";
        }
    }

    return newMatch;
}
    


