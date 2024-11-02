import axios from 'axios';

export const getTodaysWord = async ( 
    setCorrectAnswer:  React.Dispatch<React.SetStateAction<string>>, 
    setTodaysNo: React.Dispatch<React.SetStateAction<number>>
    ) => {
    const { data } = await axios.post('https://es5eaffo90.execute-api.ap-southeast-2.amazonaws.com/WORDLE', {});
    if (data.todays_word === undefined) {
		return;
    }
    setCorrectAnswer(data.todays_word);
    setTodaysNo(data.todays_no);
  };