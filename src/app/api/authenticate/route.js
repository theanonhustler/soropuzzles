import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { supabase } from "../../../lib/supabase";

const createJwt = (web3Address) => {
  const secretKey = "your-secret-key";
  const token = jwt.sign({ web3Address }, secretKey, { expiresIn: "1h" });
  return token;
};
const generateShortUserId = () => {
  const characters = "0123456789";
  let userId = "";

  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    userId += characters.charAt(randomIndex);
  }

  return userId;
};
const generateReferalCode = () => {
  const characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let referral = "";

  for (let i = 0; i < 5; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    referral += characters.charAt(randomIndex);
  }

  return referral;
};
export async function POST(req) {
  try {
    const data = await req.json();
    console.log(data);
    const { data: existData, error } = await supabase
      .from("table_name")
      .select()
      .eq("username", data.web3Address)
      .single();
    let userId = null;
    let referralCode = null;
    let points = 0;
    if (error) {
      console.log("err", error);
      userId = generateShortUserId();
      referralCode = generateReferalCode();
      const { data: newUser, error: newUserError } = await supabase
        .from("table_name")
        .upsert(
          [{ id: userId, username: data.web3Address, referralCode }] // User data to upserts
        );

      if (newUserError) {
        console.error("Error creating new user:", newUserError.message);
        return NextResponse.error({ error: "Internal Server Error" }, 500);
      }
    }
    if (existData) {
      console.log("existData", existData);
      userId = existData.username;
      points = existData.points;
    }
    console.log(userId, "existData");
    const jwtToken = createJwt(data.web3Address);
    console.log(jwtToken);
    return NextResponse.json({ userId, jwtToken, points });
  } catch (error) {
    console.error("Error processing authentication request:", error.message);
    return NextResponse.error("Internal Server Error", 500);
  }
}
