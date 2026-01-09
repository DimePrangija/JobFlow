import { NextResponse } from "next/server";
import { validateRequest } from "@/lib/auth";
import { lucia } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const { session } = await validateRequest();
    
    if (session) {
      await lucia.invalidateSession(session.id);
    }
    
    const sessionCookie = lucia.createSessionCookie("");
    (await cookies()).set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

