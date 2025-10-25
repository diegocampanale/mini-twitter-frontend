import { NextResponse } from "next/server";

let POSTS = [
  {
    id: "1",
    author: { username: "francesco" },
    content: "Ciao a tutti! 🎉\n\nBenvenuti su MiniTwitter.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    author: { username: "simona" },
    content: "Primo post di Simona :)\n\n**Markdown** _supportato_.",
    createdAt: new Date().toISOString(),
  },
];

export async function GET() {
  return NextResponse.json(POSTS);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newPost = {
      id: String(Date.now()),
      author: body.author ?? { username: "anon" },
      content: body.content ?? "",
      createdAt: new Date().toISOString(),
    };
    POSTS = [newPost, ...POSTS];
    return NextResponse.json(newPost, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, content, oldUsername, newUsername } = body;

    // Bulk update author username
    if (oldUsername && newUsername) {
      let updated = 0;
      POSTS = POSTS.map((p) => {
        if (p.author?.username === oldUsername) {
          updated += 1;
          return { ...p, author: { ...(p.author || {}), username: newUsername } };
        }
        return p;
      });
      return NextResponse.json({ updated }, { status: 200 });
    }

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const idx = POSTS.findIndex((p) => p.id === id);
    if (idx === -1) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // If content provided, update it
    if (typeof content === "string") {
      POSTS[idx] = { ...POSTS[idx], content };
    }

    return NextResponse.json(POSTS[idx], { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
}
