import React, { useState, useEffect } from "react";
import { AlphabetMatch } from "../interfaces/AlphabetMatch";
import { GameState } from "../types/GameState";

type appProps = {
  round: number;
  setRound: React.Dispatch<React.SetStateAction<number>>;
  columncnt: number;
  setColumncnt: React.Dispatch<React.SetStateAction<number>>;
  answerList: string[][];
  setAnswerList: React.Dispatch<React.SetStateAction<string[][]>>;
  setJudge: React.Dispatch<React.SetStateAction<boolean>>;
  alphabetMatch: AlphabetMatch;
  gameState: GameState;
  isLoadFinished: boolean;
};

type Props = {
  round: number;
  setRound: React.Dispatch<React.SetStateAction<number>>;
  columncnt: number;
  setColumncnt: React.Dispatch<React.SetStateAction<number>>;
  answerList: string[][];
  setAnswerList: React.Dispatch<React.SetStateAction<string[][]>>;
  keyLayout: string[];
  setJudge: React.Dispatch<React.SetStateAction<boolean>>;
  alphabetMatch: AlphabetMatch;
  gameState: GameState;
  isLoadFinished: boolean;
};

// アルファベットの判定リストを表す型をAlphabetMatchに変更
const KeyboardRow = (props: Props) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const updateDimensions = () => {
    setWindowWidth(window.innerWidth);
  };
  useEffect(() => {
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const updateAnswer = (
    prevState: string[][],
    letter: string,
    row: number,
    column: number
  ) => {
    const tmpList = Array.from(prevState);
    tmpList[row][column] = letter;

    return tmpList;
  };

  const handleClick = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    const letter = event.currentTarget.value;

    // ゲームが終了している場合は何もしない
    if (props.gameState !== "Playing") return;

    // ロードが完了していない場合は何もしない
    if (!props.isLoadFinished) return;

    // Enter入力
    if (letter == "Enter") {
      // 文字数不足
      if (props.columncnt < 5) {
        alert("文字数が足りません");
      }

      // 5文字入力した場合はフラグ送信（判定依頼）
      else {
        props.setJudge(true);
      }
    }

    // Delete入力
    else if (letter == "Delete") {
      // 1文字以上入力
      if (props.columncnt > 0) {
        props.setAnswerList((prevState) =>
          updateAnswer(prevState, "", props.round - 1, props.columncnt - 1)
        );
        props.setColumncnt((prev) => prev - 1);
      }
    }

    // アルファベット入力
    else if (props.columncnt < 5) {
      props.setAnswerList((prevState) =>
        updateAnswer(prevState, letter, props.round - 1, props.columncnt)
      );
      props.setColumncnt((prev) => prev + 1);
    }
  };

  // キーボードのCSSスタイル
  const keyboardStyle: React.CSSProperties = {
    borderSpacing: windowWidth < 600 ? "3px 3px" : "6px 6px",
    display: "flex",
    justifyContent: "center",
  };

  // ボタンのCSSスタイル
  const buttonStyle: React.CSSProperties = {
    backgroundColor: "d9d9d9",
    borderRadius: "4px",
    border: "none",
    width: windowWidth < 600 ? "30px" : "45px",
    height: windowWidth < 600 ? "45px" : "60px",
    fontSize: windowWidth < 600 ? "10px" : "13px",
    fontWeight: "bold",
    cursor: "pointer",
  };

  // EnterとDeleteのCSSスタイル
  // buttonStyleとの差分のみ記述
  const enterAndDeleteButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    width: windowWidth < 600 ? "50px" : "70px",
  };

  // AlphabetMatchの結果に基づくスタイル
  const matchStyles: Record<string, React.CSSProperties> = {
    NoUse: {}, // NoUseはデフォルトスタイルを使用
    Green: { backgroundColor: "538d4e" },
    Yellow: { backgroundColor: "b59f3b" },
    Black: { backgroundColor: "3a3a3c" },
  };

  // スタイルを決定する関数
  const getButtonStyle = (key: string, matchResult: Record<string, string>) => {
    // EnterとDelete用のスタイル
    if (key === "Enter" || key === "Delete") {
      return {
        ...buttonStyle,
        ...enterAndDeleteButtonStyle,
        ...matchStyles[matchResult[key]], // matchResultからスタイルを適用
      };
    }

    // 通常キー用のスタイル
    return {
      ...buttonStyle,
      ...matchStyles[matchResult[key]], // matchResultからスタイルを適用
    };
  };

  return (
    // mapによりキーボードtable作成
    <table id="keyboard-row" style={keyboardStyle}>
      <tbody>
        <tr>
          {props.keyLayout.map((key, i) => (
            <td id="alphabet-key" key={i}>
              {/* EnterとDeleteのときのみstyleを変更 */}
              <button
                value={key}
                onClick={handleClick}
                style={getButtonStyle(key, props.alphabetMatch)}
              >
                {key}
              </button>
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  );
};

export const Keyboard = (props: appProps) => {
  const upKeyLayout: string[] = [
    "Q",
    "W",
    "E",
    "R",
    "T",
    "Y",
    "U",
    "I",
    "O",
    "P",
  ];
  const middleKeyLayout: string[] = [
    "A",
    "S",
    "D",
    "F",
    "G",
    "H",
    "J",
    "K",
    "L",
  ];
  const downKeyLayout: string[] = [
    "Enter",
    "Z",
    "X",
    "C",
    "V",
    "B",
    "N",
    "M",
    "Delete",
  ];

  return (
    <div className="Keyboard">
      <KeyboardRow
        round={props.round}
        setRound={props.setRound}
        columncnt={props.columncnt}
        setColumncnt={props.setColumncnt}
        answerList={props.answerList}
        setAnswerList={props.setAnswerList}
        keyLayout={upKeyLayout}
        setJudge={props.setJudge}
        alphabetMatch={props.alphabetMatch}
        gameState={props.gameState}
        isLoadFinished={props.isLoadFinished}
      />
      <KeyboardRow
        round={props.round}
        setRound={props.setRound}
        columncnt={props.columncnt}
        setColumncnt={props.setColumncnt}
        answerList={props.answerList}
        setAnswerList={props.setAnswerList}
        keyLayout={middleKeyLayout}
        setJudge={props.setJudge}
        alphabetMatch={props.alphabetMatch}
        gameState={props.gameState}
        isLoadFinished={props.isLoadFinished}
      />
      <KeyboardRow
        round={props.round}
        setRound={props.setRound}
        columncnt={props.columncnt}
        setColumncnt={props.setColumncnt}
        answerList={props.answerList}
        setAnswerList={props.setAnswerList}
        keyLayout={downKeyLayout}
        setJudge={props.setJudge}
        alphabetMatch={props.alphabetMatch}
        gameState={props.gameState}
        isLoadFinished={props.isLoadFinished}
      />
    </div>
  );
};
