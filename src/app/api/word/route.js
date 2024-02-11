import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";

export async function GET() {
  try {
    const { data: existData, error } = await supabase
      .from("words")
      .select();
    if (error) {
      console.log("err", error);
      return NextResponse.error({ error: "Internal Server Error" }, 500);
    }
    if (existData) {
      console.log("existData", existData);
    }
    const randomIndex = Math.floor(Math.random() * existData.length);
    const randomWord = existData[randomIndex];

    const response = {
      hint: randomWord?.hint,
      id: randomWord?.id,
    };
    console.log(response);
    return NextResponse.json(randomWord);
  } catch (error) {
    console.error("Error processing authentication request:", error.message);
    return NextResponse.error("Internal Server Error", 500);
  }
  // const cryptoWords = [
  //   {
  //     word: "nodes",
  //     hint: "These XAI made a lot of money recently.",
  //   },
  //   {
  //     word: "wagmi",
  //     hint: "2024 is the year when ______",
  //   },
  //   {
  //     word: "chain",
  //     hint: "Fundamental component of blockchain technology.",
  //   },
  //   {
  //     word: "apple",
  //     hint: "Doesn't run half of the Web3 games in the world.",
  //   },
  //   {
  //     word: "smart",
  //     hint: "Mentioning contracts is not complete.",
  //   },
  // ];
  // const randomIndex = Math.floor(Math.random() * cryptoWords.length);
  // const randomCryptoWord = cryptoWords[randomIndex];
  // return NextResponse.json(randomCryptoWord);
}
