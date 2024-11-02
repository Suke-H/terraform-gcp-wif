import { useState, useEffect } from "react";

import { Answer } from "./components/answer";
import { Keyboard } from "./components/keyboard";
import { Notes } from "./components/notes";
import { ShareResultButton } from "./components/ShareResultButton";

import { AlphabetMatch } from "./interfaces/AlphabetMatch";
import { GameState } from "./types/GameState";

import { pushedEnterProcess } from "./game_logics/pushedEnterProcess";
import { getTodaysWord } from "./utils/getTodaysWord";
import { makeGameResultText } from "./utils/makeGameResultText";

import { saveGameData, loadGameData, LoadDataSetters } from "./load/saveAndLoad";

// debug
// import { resetGameDataInLocal } from "./utils/saveAndLoadInLocalStorage";

export const App = (): JSX.Element => {
  // （リスト初期化）
  const initAnswerList: string[][] = new Array(6);
  for (let i = 0; i < 6; i++) {
    initAnswerList[i] = new Array(5).fill("");
  }
  const initMatchList: string[][] = new Array(6);
  for (let i = 0; i < 6; i++) {
    initMatchList[i] = new Array(5).fill("White");
  }
  // 全アルファベットを'NoUse'で初期化する関数
  const initializeAlphabetMatch = (): AlphabetMatch => {
    const result: AlphabetMatch = {};
    for (let charCode = 65; charCode <= 90; charCode++) {
      const letter = String.fromCharCode(charCode);
      result[letter] = "NoUse";
    }
    return result;
  };
  // アルファベットの判定リストを初期化
  const initAlphabetMatch = initializeAlphabetMatch();

  /* State */

  // APIから取得するデータ
  const [todaysNo, setTodaysNo] = useState<number>(0); // 本日のお題番号
  const [correctAnswer, setCorrectAnswer] = useState<string>(""); // 今日の単語

  // セーブが必要なState
  const [answerList, setAnswerList] = useState<string[][]>(initAnswerList); // 回答欄の文字列

  // 上記を元にロードするState
  const [matchList, setMatchList] = useState<string[][]>(initMatchList); // 回答欄のマッチ状況(White/Black/Yellow/Grren)
  const [gameState, setGameState] = useState<GameState>("Playing"); // ゲームの状態(Playing/GameClear/GameOver)
  const [round, setRound] = useState<number>(0); // ラウンド(現在の行番号+1)
  const [alphabetMatch, setAlphabetMatch] =
    useState<AlphabetMatch>(initAlphabetMatch); // アルファベットの判定リスト

  // セーブ/ロードが不要なState
  const [judge, setJudge] = useState<boolean>(false); // Enterを押したか
  const [columncnt, setColumncnt] = useState(0); // 現在の列番号
  const [isLoadFinished, setIsLoadFinished] = useState<boolean>(false); // ロードが完了したか

  // 初回レンダリング時
  useEffect(() => {
    const fetchData = async () => {
      await getTodaysWord(setCorrectAnswer, setTodaysNo);
    };
  
    fetchData();
  }, []); // コンポーネントがマウントされたときに一度だけ実行される
  
  useEffect(() => {
    // todaysNoが更新されたときに実行する処理
    if (todaysNo === 0) return; // 初期値の場合は処理をスキップ

    // debug
    // resetGameDataInLocal();
  
    const loadDataSetters: LoadDataSetters = {
      setAnswerList: setAnswerList,
      setMatchList: setMatchList,
      setGameState: setGameState,
      setRound: setRound,
      setAlphabetMatch: setAlphabetMatch,
    };
  
    // todaysNo と correctAnswer が更新されていることを前提にロード処理を呼び出し
    loadGameData(todaysNo, correctAnswer, loadDataSetters);
    // ロード完了
    setIsLoadFinished(true);
  
  }, [todaysNo]); // todaysNoが変更されたときに実行される

  // Enterを押した際
  useEffect(() => {
    if (!judge) return;
    if (gameState !== "Playing") return;

    pushedEnterProcess(
      correctAnswer,
      answerList,
      matchList,
      round,
      setMatchList,
      setAlphabetMatch,
      setGameState
    ).then((isValid) => {
      /* 単語が妥当でない場合 */
      if (!isValid) {
        alert("データセットに存在しない単語です");

        // 回答欄を1行リセット
        setAnswerList((prevState) =>
          prevState.map((row, index) =>
            index === round - 1 ? Array(5).fill("") : row
          )
        );
        setColumncnt(0); // 列番号を0にリセット
      } else {

      /* 問題ない場合 */
        setRound(round + 1); // 次の行へ移行
        setColumncnt(0); // 列番号を0にリセット

        // セーブ処理
        saveGameData(todaysNo, answerList);
      }
    });

    setJudge(false);
  }, [judge]);

  return (
    <div className="App" style={appStyle}>
      <Answer answerList={answerList} matchList={matchList} />
      <Keyboard
        round={round}
        setRound={setRound}
        columncnt={columncnt}
        setColumncnt={setColumncnt}
        answerList={answerList}
        setAnswerList={setAnswerList}
        setJudge={setJudge}
        alphabetMatch={alphabetMatch}
        gameState={gameState}
        isLoadFinished={isLoadFinished}
      />
      <ShareResultButton resultText={makeGameResultText(matchList, todaysNo)} />
      <Notes />
    </div>
  );
};

const appStyle: React.CSSProperties = {
  margin: "0 auto",
  width: "100%",
  maxWidth: "600px", // 最大幅を指定する
};
