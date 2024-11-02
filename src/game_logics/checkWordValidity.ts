import axios from "axios"; 

// 単語の妥当性判定
export const checkWordValidity = async ( answerList: string[][], round: number ) : Promise<boolean> => {
    const { data } = await axios.post('https://yan5p8s0dg.execute-api.ap-southeast-2.amazonaws.com/WORDLE', 
		{"word": answerList[round - 1].join("")},);
    if (data.isValid === undefined) {
		return false;
    }

    return data.isValid;
}