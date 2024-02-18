// Import necessary modules
import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";

const updateReferrerPoints = async (userIdToUpdate, points, numRef) => {
  const { data, error } = await supabase
    .from("users")
    .update({ points, numRef })
    .eq("username", userIdToUpdate);

  if (error) {
    console.error("Error updating points:", error.message);
    return false;
  }

  return true;
};
const updateRefereePoints = async (userIdToUpdate, points, referredBy) => {
  const { data, error } = await supabase
    .from("users")
    .update({ points, referredBy })
    .eq("username", userIdToUpdate);

  if (error) {
    console.error("Error updating points:", error.message);
    return false;
  }

  return true;
};
export async function POST(req) {
  try {
    const { referralCode, userAddress } = await req.json();

    const { data: userData, error: userError } = await supabase
      .from("users")
      .select()
      .eq("username", userAddress)
      .single();
    console.log("userdaa", userData);
    console.log("usererror", userError);
    if (userError) {
      console.error("Error fetching user data:", userError.message);
      return NextResponse.json(
        { message: "Internal Server Error" },
        { status: 500 }
      );
    }

    if (userData && userData.referredBy) {
      return NextResponse.json(
        { message: "User is already referred!" },
        { status: 400 }
      );
    }
    if (referralCode === userData.referralCode) {
      return NextResponse.json(
        { message: "Cannot refer oneself!" },
        { status: 400 }
      );
    }
    const { data: referralData, error: referralError } = await supabase
      .from("users")
      .select()
      .eq("referralCode", referralCode)
      .single();
    console.log(referralData);
    console.log(referralError);
    if (referralError) {
      console.error("Error fetching referral data:", referralError.message);
      return NextResponse.json(
        { message: "Wrong Referral Code" },
        { status: 400 }
      );
    }

    if (!referralData) {
      console.log("here we are");
      return NextResponse.json(
        { message: "Wrong Referral Code" },
        { status: 400 }
      );
    }
    console.log("hiiii");
    const referralDataPoints = referralData.points + 10;
    const refereePoints = userData.points + 10;
    const referralDataRefCount = referralData.numRef + 1;
    const updateUserPoints = await updateRefereePoints(
      userAddress,
      refereePoints,
      referralCode
    );
    const updateReferralPoints = await updateReferrerPoints(
      referralData.username,
      referralDataPoints,
      referralDataRefCount
    );

    if (!updateUserPoints || !updateReferralPoints) {
      console.error("Failed to update points");
      return NextResponse.error("Failed to update points", 500);
    }


    return NextResponse.json({ message: "Referral successful", points: refereePoints });
  } catch (error) {
    console.error("Error processing referral:", error.message);
    return NextResponse.error("Internal Server Error", 500);
  }
}
