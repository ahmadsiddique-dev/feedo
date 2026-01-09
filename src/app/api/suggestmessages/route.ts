import { streamText } from 'ai'
import { google } from '@ai-sdk/google'

export const runtime = 'edge'

export async function POST(req: Request) {
  const { message } = await req.json()

  const { textStream } = await streamText({
    model: google('gemini-1.5-flash'),
    prompt: message,
  })

  return new Response(textStream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked',
    },
  })
}
