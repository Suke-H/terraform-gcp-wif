// アルファベットの判定を表す型を定義
type LetterJudgement = 'Green' | 'Yellow' | 'Black' | 'NoUse';

export interface AlphabetMatch {
    [key: string]: LetterJudgement;
}
  