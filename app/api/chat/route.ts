import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { getPersonById } from "@/lib/people";

const client = new Anthropic();

export async function POST(req: NextRequest) {
  const { personId, situation } = await req.json();

  if (!personId || !situation?.trim()) {
    return NextResponse.json(
      { error: "personId and situation are required" },
      { status: 400 }
    );
  }

  const person = getPersonById(personId);
  if (!person) {
    return NextResponse.json({ error: "Unknown person" }, { status: 400 });
  }

  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    system: person.systemPrompt,
    messages: [
      {
        role: "user",
        content: `The user describes the following situation or problem:\n\n${situation.trim()}\n\nRespond as ${person.name} would.`,
      },
    ],
  });

  const text =
    message.content[0].type === "text" ? message.content[0].text : "";

  return NextResponse.json({ response: text, person: person.name });
}
