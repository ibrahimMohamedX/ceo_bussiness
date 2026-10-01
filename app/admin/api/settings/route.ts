import { NextResponse } from "next/server";

import { verifySession } from "@/src/lib/admin/session";
import {
  ApiError,
  getSiteSettings,
  updateSiteSettings,
} from "@/src/lib/admin/settings";

// Admin site settings route: GET (read) and PATCH (update) the singleton.

function toError(e: unknown) {
  if (
    e &&
    typeof e === "object" &&
    "status" in e &&
    "message" in e &&
    (e as ApiError).name === "ApiError"
  ) {
    const apiError = e as ApiError;
    return NextResponse.json(
      { error: apiError.message },
      { status: apiError.status },
    );
  }
  return NextResponse.json({ error: "Internal error" }, { status: 500 });
}

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await verifySession();
  try {
    const settings = await getSiteSettings(session);

    console.log("SETTINGS GET RESULT:", {
      whatsappMessageAr: settings.whatsappMessageAr,
      whatsappMessageEn: settings.whatsappMessageEn,
    });

    return NextResponse.json({ settings });
  } catch (e) {
    return toError(e);
  }
}

export async function PATCH(request: Request) {
  const session = await verifySession();
  try {
    const body = (await request.json()) as Parameters<
      typeof updateSiteSettings
    >[1];

    console.log("SETTINGS PATCH BODY:", body);

    const settings = await updateSiteSettings(session, body);
    return NextResponse.json({ settings });
  } catch (e) {
    return toError(e);
  }
}





