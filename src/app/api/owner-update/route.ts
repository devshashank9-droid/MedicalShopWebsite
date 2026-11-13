import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { isOwnerSessionValid } from "@/lib/ownerAuth";

export async function POST(request: Request) {
  const authorized = await isOwnerSessionValid();
  if (!authorized) {
    return NextResponse.json(
      { success: false, message: "Unauthorized owner session." },
      { status: 401 },
    );
  }

  if (!adminDb) {
    return NextResponse.json(
      {
        success: false,
        message:
          "Firebase Admin is not initialized. Check FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY in .env.local.",
      },
      { status: 500 },
    );
  }

  try {
    const body = await request.json();
    const storeRef = adminDb.collection("pharmacy").doc("kajal-medical-hall");

    if (body.reset === true) {
      await storeRef.delete();
      return NextResponse.json({ success: true });
    }

    const patch: Record<string, unknown> = { updatedAt: Date.now() };

    if (
      body.boardMode === "open" ||
      body.boardMode === "closed" ||
      body.boardMode === "auto"
    ) {
      patch.boardMode = body.boardMode;
    }
    if (typeof body.reopenTime === "string") {
      patch.reopenTime = body.reopenTime.slice(0, 80);
    }
    if (
      body.ownerPhoto === null ||
      (typeof body.ownerPhoto === "string" &&
        body.ownerPhoto.startsWith("data:image/") &&
        body.ownerPhoto.length < 400_000)
    ) {
      patch.ownerPhoto = body.ownerPhoto;
    }
    if (Array.isArray(body.categories)) {
      patch.categories = body.categories.slice(0, 50);
    }
    if (Array.isArray(body.symptoms)) {
      patch.symptoms = body.symptoms.slice(0, 20);
    }

    await storeRef.set(patch, { merge: true });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Owner update Firestore error:", err);
    const reason =
      err instanceof Error ? err.message : "Unknown Firestore write error.";
    return NextResponse.json(
      { success: false, message: `Save failed: ${reason}` },
      { status: 500 },
    );
  }
}
