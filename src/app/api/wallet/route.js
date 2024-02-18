import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { supabase } from "../../../lib/supabase";

export async function POST(req) {
  try {
    const data = await req.json();
    console.log(data);
    const { data: existData, error } = await supabase
      .from("users")
      .select()
      .eq("username", data.web3Address)
      .single();
    let userId = null;
    let referralCode = null;
    let referredBy = null;
    let points = 0;
    let gameplays = 10;
    if (error) {
      console.log("err", error);
      userId = generateShortUserId();
      referralCode = generateReferalCode();
      const { data: newUser, error: newUserError } = await supabase
        .from("users")
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
      referralCode = existData.referralCode;
      referredBy = existData.referredBy;
      gameplays = existData.gameplays;
    }
    console.log(userId, "existData");
    const jwtToken = createJwt(data.web3Address);
    console.log(jwtToken);
    return NextResponse.json({
      userId,
      jwtToken,
      points,
      referralCode,
      referredBy,
      gameplays,
    });
  } catch (error) {
    console.error("Error processing authentication request:", error.message);
    return NextResponse.error("Internal Server Error", 500);
  }
}
