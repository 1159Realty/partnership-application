import { NextRequest, NextResponse } from "next/server";
import { fetchPublicProfile } from "@/lib/api/public-profile/server.public-profile";

export async function GET(req: NextRequest) {
  const publicId = req.nextUrl.searchParams.get("publicId");

  if (!publicId) {
    return NextResponse.json({ error: "Missing publicId" }, { status: 400 });
  }

  try {
    const profile = await fetchPublicProfile(publicId);
    return NextResponse.json(profile);
  } catch (error) {
    console.error("Error fetching public profile:", error);
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }
}
