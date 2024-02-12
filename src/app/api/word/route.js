import { NextResponse } from "next/server";
import { unstable_noStore as noStore } from "next/cache";
import { supabase } from "../../../lib/supabase";

export async function POST(req) {
  const data = await req.json();
  noStore();
  try {
    if (data.username) {
      console.log(data.username);
      const { data: userSolvedData, error } = await supabase
        .from("table_name")
        .select("solved")
        .eq("username", data.username)
        .single();
      if (error) {
        console.log("we meet again 1");

        console.error(
          "Error processing authentication request:",
          error.message
        );
        return NextResponse.error("Internal Server Error", 500);
      }
      const solvedWords = userSolvedData?.solved || [];
      console.log("solvedwords", solvedWords);
      const { data: existData, error: wordError } = await supabase
        .from("words")
        .select()
        .filter("id", "not.in", `(${solvedWords.join(",")})`);
      if (wordError) {
        console.log("we meet again 2");

        console.error("Error fetching words data:", wordError.message);
        return NextResponse.error("Internal Server Error", 500);
      }
      if (!existData || existData.length === 0) {
        const customResponse = {
          message: "Congratulations! You have solved all available words.",
          completed: true,
        };
        return NextResponse.json(customResponse, { status: 200 });
      }

      const randomIndex = Math.floor(Math.random() * existData.length);
      const randomWord = existData[randomIndex];

      const response = {
        hint: randomWord?.hint,
        id: randomWord?.id,
        completed: false,
      };
      console.log(response);
      return NextResponse.json(response);
    } else {
      const response = {
        hint: "2024 is the year when we _____",
        id: 1111,
        completed: false,
      };
      return NextResponse.json(response);
    }
  } catch (error) {
    console.error("Error processing authentication request:", error.message);
    return NextResponse.error("Internal Server Error", 500);
  }
}
