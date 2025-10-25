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
