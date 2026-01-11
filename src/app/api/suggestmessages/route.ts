import { streamText } from 'ai'
import { google } from '@ai-sdk/google'

export const runtime = 'edge'

export async function POST(req: Request) {
  const { message } = await req.json()

  const { textStream } = await streamText({
    model: google('gemini-2.5-flash'),
    prompt: message,
    maxOutputTokens: 200
  })

  return new Response(textStream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked',
    },
  })
}



// "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What's a hobby you've recently started?||If you could have dinner with any historical figure, who would it be?||What's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment."
