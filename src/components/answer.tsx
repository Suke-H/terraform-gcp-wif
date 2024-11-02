type Props = {
  answerList: string[][];
  matchList: string[][];
};

export const Answer = (props: Props) => {
	// 回答のCSSスタイル
	const answerStyle: React.CSSProperties = {
		borderSpacing: "6px 6px",
		display: "flex",
		justifyContent: "center",
		marginBottom: "40px",
		marginTop: "100px",
	};

	/* td要素のCSSスタイル */
	// Whiteスタイル
	const whiteTdStyle: React.CSSProperties = {
		border: "2px solid rgb(217, 217, 217)",
		width: "60px",
		height: "70px",

		fontSize: "30px",
		fontWeight: "bold",
		textAlign: "center",
		lineHeight: "60px",

		// 文字色
		color: "Black", // 背景色Whiteの時のみ

		// 背景色
		backgroundColor: "White",
	};

	// Blackスタイル
	const blackTdStyle = { ...whiteTdStyle };
	blackTdStyle["color"] = "White";
	blackTdStyle["backgroundColor"] = "3a3a3c";

	// Yellowスタイル
	const yellowTdStyle = { ...whiteTdStyle };
	yellowTdStyle["color"] = "White";
	yellowTdStyle["backgroundColor"] = "b59f3b";

	// Greenスタイル
	const greenTdStyle = { ...whiteTdStyle };
	greenTdStyle["color"] = "White";
	greenTdStyle["backgroundColor"] = "538d4e";

	const styleDict: { [key: string]: React.CSSProperties } = {
		"White": whiteTdStyle,
		"Black": blackTdStyle,
		"Yellow": yellowTdStyle,
		"Green": greenTdStyle,
	};

	return (
		// mapにより回答table作成
		<div className="Answer">
		<table id="answer" style={answerStyle}>
			<tbody>
			{props.answerList.map((answer, i) => (
				<tr key={i}>
				{answer.map((letter, j) => (
					<td key={j} style={styleDict[props.matchList[i][j]]}>
					{letter}
					</td>
				))}
				</tr>
			))}
			</tbody>
		</table>
		</div>
	);
};
