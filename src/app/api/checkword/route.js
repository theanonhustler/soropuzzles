import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";

const fetchUserPoints = async (address) => {
  const { data, error } = await supabase
    .from("users")
    .select()
    .eq("username", address)
    .single();

  if (error) {
    console.error("Error fetching user points:", error.message);
    return null;
  }
  console.log("hellllo", data);
  const solvedWords = data?.solved || [];
  const points = data?.points || 0;
  const gameplays = data?.gameplays || 0;
  const bonus = data.bonus;
  const response = { solvedWords, points, bonus, gameplays };
  return response;
};

async function updateUserPoints(
  address,
  newPoints,
  updatedGamePlays,
  solvedWords
) {
  const { error } = await supabase
    .from("users")
    .update({
      points: newPoints,
      gameplays: updatedGamePlays,
      solved: solvedWords,
    })
    .eq("username", address);

  if (error) {
    console.error("Error updating user points:", error.message);
    return false;
  }

  return true;
}
async function updateBonusPoints(address, newPoints) {
  const { error } = await supabase
    .from("users")
    .update({ points: newPoints, bonus: true })
    .eq("username", address);

  if (error) {
    console.error("Error updating user points:", error.message);
    return false;
  }

  return true;
}
const enterBoardWord = async (word, solution, username, wordId, tries) => {
  if (username && word === "LUMEN") {
    const userData = await fetchUserPoints(username);
    if (userData.points && !userData.bonus) {
      const updatedPoints = userData.points + 100;
      const success = await updateBonusPoints(username, updatedPoints);
      if (!success) {
        console.error("Failed to update user points.");
      } else {
        let sc = {
          type: "score",
          word,
        };
        sc.points = updatedPoints;
        sc.status = "WIN";
        sc.loggedIn = true;
        sc.bonus = true;
        return sc;
      }
    } else {
      console.error("Failed to fetch user points.");
    }
  }

  const matchedPositions = [];
  const correctCharArray = [];
  const presentCharArray = [];
  const absentCharArray = [];
  let score = [];
  let correct = 0;

  let letterCount = {};
  for (let i = 0; i < solution.length; i++) {
    let character = solution[i];
    if (letterCount[character]) {
      letterCount[character] += 1;
    } else {
      letterCount[character] = 1;
    }
  }
  for (let index = 0; index < solution.length; index++) {
    if (solution.charAt(index) === word[index]) {
      score.push("correct");
      correct += 1;
      letterCount[word[index]] -= 1;
      correctCharArray.push(word[index]);
    } else {
      score.push("PAIN");
    }
  }
  for (let index = 0; index < solution.length; index++) {
    if (score[index] !== "correct") {
      if (solution.includes(word[index]) && letterCount[word[index]] > 0) {
        score[index] = "present";
        letterCount[word[index]] -= 1;
        presentCharArray.push(word[index]);
      } else {
        score[index] = "absent";
        absentCharArray.push(word[index]);
      }
    }
  }

  let sc = {
    type: "score",
    word,
    score,
    presentCharArray,
    absentCharArray,
    correctCharArray,
    status: "IN PROGRESS",
  };
  const allCorrect = score.every((element) => element === "correct");
  if (allCorrect) {
    if (username) {
      const userData = await fetchUserPoints(username);
      console.log("sgshs", userData);
      if (userData) {
        const updatedPoints = userData.points + 10;
        const updatedGamePlays = userData.gameplays - 1;
        const solvedWords = [...userData.solvedWords, wordId];
        const success = await updateUserPoints(
          username,
          updatedPoints,
          updatedGamePlays,
          solvedWords
        );
        if (!success) {
          console.error("Failed to update user points.");
        } else {
          sc.points = updatedPoints;
          sc.status = "WIN";
          sc.loggedIn = true;
          sc.gameplays = updatedGamePlays;
        }
      } else {
        console.error("Failed to fetch user points.");
      }
    } else {
      sc.status = "WIN";
      sc.loggedIn = false;
    }
  }
  if (!allCorrect && tries === 6) {
    if (username) {
      const userData = await fetchUserPoints(username);
      if (userData) {
        const updatedPoints = userData.points;
        const updatedGamePlays = userData.gameplays - 1;
        const solvedWords = [...userData.solvedWords];
        const success = await updateUserPoints(
          username,
          updatedPoints,
          updatedGamePlays,
          solvedWords
        );
        if (!success) {
          console.error("Failed to update user points.");
        } else {
          sc.status = "LOST";
          sc.loggedIn = true;
          sc.gameplays = updatedGamePlays;
        }
      } else {
        console.error("Failed to fetch user points.");
      }
    }
  }
  return sc;
};
export async function POST(req) {
  try {
    const data = await req.json();
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
      const word = data.word.toUpperCase();
      const username = data.userId;
      const wordId = data.wordId;
      const tries = data.tries;
      const score = await enterBoardWord(
        word,
        solution,
        username,
        wordId,
        tries
      );
      console.log(score);
      return NextResponse.json(score);
    }
  } catch (error) {
    console.error("Error processing authentication request:", error.message);
    return NextResponse.error("Internal Server Error", 500);
  }
}
