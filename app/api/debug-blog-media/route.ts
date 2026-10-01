import { NextResponse } from "next/server";
import { getPublicFirestore } from "@/src/lib/firebase/admin";

export async function GET() {
  try {
    const db = getPublicFirestore();

    if (!db) {
      return NextResponse.json(
        { error: "Database unavailable" },
        { status: 500 }
      );
    }

    const posts = await db.collection("blogPosts").get();

    const result = [];

    for (const postDoc of posts.docs) {
      const post = postDoc.data();
      const mediaSnap = await postDoc.ref.collection("media").get();

      result.push({
        id: postDoc.id,
        title: post.title?.en ?? "",
        slug: post.slug ?? "",
        status: post.status ?? "",
        coverMediaId: post.coverMediaId ?? null,
        media: mediaSnap.docs.map((mediaDoc) => {
          const m = mediaDoc.data();

          return {
            id: mediaDoc.id,
            fileName: m.fileName ?? null,
            publicId: m.publicId ?? null,
            resourceType: m.resourceType ?? null,
            storagePath: m.storagePath ?? null,
            kind: m.kind ?? null,
            sortOrder: m.sortOrder ?? null,
          };
        }),
      });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

