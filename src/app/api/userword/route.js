import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";

export async function POST(req) {
  try {
    const data = await req.json();
    console.log(data);
    const { data: existData, error } = await supabase
      .from("table_name")
      .select()
      .eq("username", data.userId)
      .single();
    let points = 0;
    let id = null;
    if (error) {
      console.error("Error processing authentication request:", error.message);
      return NextResponse.error("Internal Server Error", 500);
    }
    if (existData) {
      points = existData.points + 1;
      id = existData.id;
    }
    const { data: updateData, error: updateError } = await supabase
      .from("table_name")
      .update({ points })
      .eq("id", id);

      const { data: userData, error: userError } = await supabase
      .from("table_name")
      .select()
      .eq("username", data.userId)
      .single();
    return NextResponse.json(userData);
  } catch (error) {
    console.error("Error processing authentication request:", error.message);
    return NextResponse.error("Internal Server Error", 500);
  }
}
