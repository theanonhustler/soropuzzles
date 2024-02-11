import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";

const enterBoardWord = (word, solution) => {
  let score = [];
  const matchedPositions = [];
  const correctCharArray = [];
  const presentCharArray = [];
  const absentCharArray = [];

  for (let i = 0; i < word.length; i++) {
    const char = word.charAt(i);
    if (solution.charAt(i) === char) {
      score.push("correct");
      correctCharArray.push(char);
      matchedPositions.push(i);
    } else if (solution.includes(char)) {
      const correctPosition = solution.indexOf(char);
      if (
        correctPosition !== -1 &&
        !matchedPositions.includes(correctPosition)
      ) {
        score.push("present");
        presentCharArray.push(char);
        matchedPositions.push(correctPosition);
      } else {
        score.push("absent");
        absentCharArray.push(char);
      }
    } else {
      score.push("absent");
      absentCharArray.push(char);
    }
  }

  console.log(score);
  let sc = {
    type: "score",
    word,
    score,
    presentCharArray,
    absentCharArray,
    correctCharArray,
  };
  return sc;
};
export async function POST(req) {
  try {
    const data = await req.json();
    console.log(data);
    const { data: existData, error } = await supabase
      .from("words")
      .select()
      .eq("id", data.wordId)
      .single();

    let id = null;
    if (error) {
      console.error("Error processing authentication request:", error.message);
      return NextResponse.error("Internal Server Error", 500);
    }
    if (existData) {
      const solution = existData.word;
      const word = data.word;
      const score = enterBoardWord(word, solution);
      console.log(score);
      return NextResponse.json(score);
    }
  } catch (error) {
    console.error("Error processing authentication request:", error.message);
    return NextResponse.error("Internal Server Error", 500);
  }
}
