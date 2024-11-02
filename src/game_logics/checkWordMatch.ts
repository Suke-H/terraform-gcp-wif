// 単語一致判定
export const checkWordMatch = ( correctAnswer: string, answerList: string[][], matchList: string[][], round: number ): string[][] => {
    // 一度ディープコピーする
    const tmpMatchList = Array.from(matchList);

    // 1文字ずつ判定
    for (let i = 0; i < 5; i++) {
		// 文字が一致
		if (correctAnswer.indexOf(answerList[round - 1][i]) !== -1) {
			// 位置も一致(Green)
			if (answerList[round - 1][i] === correctAnswer[i]) {
			tmpMatchList[round - 1][i] = "Green";
			}

			// 文字だけ一致(Yellow)
			else {
				tmpMatchList[round - 1][i] = "Yellow";
			}
		}

      // 文字も位置も一致していない(Black)
		else {
			tmpMatchList[round - 1][i] = "Black";
		}
    }
	
    return tmpMatchList;
  };