import { NextRequest, NextResponse } from 'next/server'
import { streamAssistantResponse } from '@/lib/ai-assistant'
import { ChatMessage } from '@/types'

export async function POST(req: NextRequest) {
  try {
    const { message, history = [] } = await req.json() as {
      message: string
      history: ChatMessage[]
    }

    if (!message?.trim()) {
      return NextResponse.json({ error: 'No message provided' }, { status: 400 })
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OPENAI_API_KEY not configured. Add it to .env.local' },
        { status: 503 }
      )
    }

    const stream = await streamAssistantResponse(message, history, true)

    // Transform OpenAI stream to SSE
    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const data = JSON.stringify(chunk)
            controller.enqueue(encoder.encode(`data: ${data}\n\n`))
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        } catch (err) {
          controller.error(err)
        }
      },
    })

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (err) {
    console.error('[API] /api/assistant error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
