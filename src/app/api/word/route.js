/**
 * Retrieves a list of characters from the characters.json file.
 * @returns {Promise<Object>} A promise that resolves to an object containing the characters data.
 */

import { NextResponse } from "next/server";

export async function GET() {
  const cryptoWords = [
    {
      word: "nodes",
      hint: "These XAI made a lot of money recently.",
    },
    {
      word: "wagmi",
      hint: "2024 is the year when ______",
    },
    {
      word: "chain",
      hint: "Fundamental component of blockchain technology.",
    },
    {
      word: "apple",
      hint: "Doesn't run half of the Web3 games in the world.",
    },
    {
      word: "smart",
      hint: "Mentioning contracts is not complete.",
    },
  ];
  const randomIndex = Math.floor(Math.random() * cryptoWords.length);
  const randomCryptoWord = cryptoWords[randomIndex];
  return NextResponse.json(randomCryptoWord);
}
