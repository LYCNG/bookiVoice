import { NextRequest, NextResponse } from 'next/server';
import { searchBookSegments } from '@/lib/actions/book.actions';

/**
 * Vapi Tool Call Request Body
 * Vapi sends an array of tool calls; each call has a name and function arguments.
 */
interface VapiToolCall {
    type: 'function';
    function: {
        name: string;
        arguments: Record<string, unknown>;
    };
}

interface VapiRequestBody {
    message: {
        type: string;
        toolCallList: VapiToolCall[];
    };
}

/**
 * POST /api/vapi/search-book
 * Handles Vapi tool calls for searching book content by keyword.
 */
export async function POST(req: NextRequest) {
    try {
        const body: VapiRequestBody = await req.json();

        // Vapi sends a "tool-calls" message type
        const toolCallList = body.message?.toolCallList ?? [];

        // Find the "search book" tool call
        const searchCall = toolCallList.find(
            (tc) => tc.type === 'function' && tc.function.name === 'search book',
        );

        if (!searchCall) {
            return NextResponse.json(
                { error: 'No "search book" tool call found in request.' },
                { status: 400 },
            );
        }

        const { bookId, query } = searchCall.function.arguments as {
            bookId: string;
            query: string;
        };

        if (!bookId || !query) {
            return NextResponse.json(
                { error: 'Missing required parameters: bookId and query.' },
                { status: 400 },
            );
        }

        // Fetch the top 3 matching segments
        const result = await searchBookSegments(bookId, query, 3);

        let resultText: string;

        if (!result.success || !result.data || result.data.length === 0) {
            resultText = 'No information found about this topic.';
        } else {
            // Combine all matching segments' content, separated by double new lines
            resultText = (result.data as Array<{ content: string }>)
                .map((seg) => seg.content)
                .join('\n\n');
        }

        // Return result in the Vapi tool call response format
        return NextResponse.json({
            results: [
                {
                    toolCallId: (searchCall as VapiToolCall & { id?: string }).id ?? '',
                    result: resultText,
                },
            ],
        });
    } catch (error) {
        console.error('[vapi/search-book] Error:', error);
        return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
    }
}
