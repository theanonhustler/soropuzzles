// Import necessary modules
import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";

const updatePointsAndGameplays = async (userIdToUpdate, points, gameplays) => {
  const { data, error } = await supabase
    .from("users")
    .update({ points, gameplays })
    .eq("username", userIdToUpdate);

  if (error) {
    console.error("Error updating points and gameplays:", error.message);
    return false;
  }

  return true;
};

export async function POST(req) {
  try {
    const { sellpoints, userAddress } = await req.json();
    if (![50, 100, 200, 500].includes(sellpoints)) {
      return NextResponse.json(
        { message: "Points should be 50/100/200 or 500" },
        { status: 400 }
      );
    }
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select()
      .eq("username", userAddress)
      .single();

    if (userError) {
      console.error("Error fetching user data:", userError.message);
      return NextResponse.error("Internal Server Error", 500);
    }

    // Perform any validation checks if needed
    if (userData.points < sellpoints) {
      return NextResponse.json(
        { message: "Insufficient points for conversion" },
        { status: 400 }
      );
    }
    // Implement the logic for converting points to gameplays
    // For example, calculate the new gameplays count based on sellpoints
    let newGameplaysCount = 0;
    let points = userData.points - sellpoints;
    if (sellpoints === 50) {
      newGameplaysCount = userData.gameplays + 5;
    } else if (sellpoints === 100) {
      newGameplaysCount = userData.gameplays + 12;
    } else if (sellpoints === 200) {
      newGameplaysCount = userData.gameplays + 25;
    } else if (sellpoints === 500) {
      newGameplaysCount = userData.gameplays + 75;
    }

    // Update the user's points and gameplays in the database
    const success = await updatePointsAndGameplays(
      userAddress,
      points, // Assuming points are not changed during conversion
      newGameplaysCount
    );

    if (!success) {
      console.error("Failed to update points and gameplays");
      return NextResponse.error("Failed to update points and gameplays", 500);
    }

    return NextResponse.json({
      message: "Points converted to gameplays successfully",
      gameplays: newGameplaysCount,
      points
    });
  } catch (error) {
    console.error("Error converting points to gameplays:", error.message);
    return NextResponse.error("Internal Server Error", 500);
  }
}
