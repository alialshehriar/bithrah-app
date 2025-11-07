import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export const maxDuration = 60;

export async function GET(request: NextRequest) {
  const debug: any = {
    timestamp: new Date().toISOString(),
    env: {
      hasOpenAIKey: !!process.env.OPENAI_API_KEY,
      keyLength: process.env.OPENAI_API_KEY?.length || 0,
      keyPrefix: process.env.OPENAI_API_KEY?.substring(0, 10) || 'NOT_FOUND',
    },
    test: {
      status: 'pending',
      error: null,
      response: null,
    },
  };

  // Test OpenAI API
  if (process.env.OPENAI_API_KEY) {
    try {
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      const completion = await openai.chat.completions.create(
        {
          model: 'gpt-4-turbo',
          messages: [
            {
              role: 'user',
              content: 'Say "Hello from Vercel!" in JSON format',
            },
          ],
          max_tokens: 50,
          response_format: { type: 'json_object' },
        },
        {
          timeout: 30000,
        }
      );

      debug.test.status = 'success';
      debug.test.response = completion.choices[0].message.content;
    } catch (error: any) {
      debug.test.status = 'error';
      debug.test.error = {
        name: error.name,
        message: error.message,
        code: error.code,
        type: error.type,
        stack: error.stack?.split('\n').slice(0, 5),
      };
    }
  } else {
    debug.test.status = 'error';
    debug.test.error = 'OPENAI_API_KEY not found in environment';
  }

  return NextResponse.json(debug, { status: 200 });
}
