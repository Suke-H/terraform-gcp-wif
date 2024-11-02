import React from "react";
import Divider from "@mui/material/Divider";
import styled from "styled-components";

export const Notes = () => {
	const HoverLink = styled.a`
		transition: transform 0.3s ease;
		display: inline-block;

		&:hover {
		transform: scale(1.1);
		}
	`;

	// 回答のCSSスタイル
	const noteStyle: React.CSSProperties = {
		marginBottom: "40px",
		marginTop: "100px",
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",

		color: "rgb(88, 88, 88)",

		fontFamily: [
		"Inter",
		"system-ui",
		"Avenir",
		"Helvetica",
		"Arial",
		"sans-serif",
		].join(","),
	};

	return (
		<div className="Notes" style={noteStyle}>
		<Divider
			sx={{
			borderBottomWidth: 3,
			width: "95%",
			}}
		/>

		<ul>
			<li>
			このサイトは、New York Times社の
			<a href="https://www.nytimes.com/games/wordle/index.html">WORDLE</a>
			をもとに作成した勉強用サイトです
			</li>
			<li>
			GitHubリポジトリは
			<a href="https://github.com/Suke-H/wordle-sample/">こちら</a>と<a href="https://github.com/Suke-H/wordle-in-gcp/">こちら</a>
			</li>
		</ul>

		<HoverLink href="https://kakutory.com/">
			<img src="kakutory_gray.png" alt="kakutory" width="300" />
		</HoverLink>
		</div>
	);
};
