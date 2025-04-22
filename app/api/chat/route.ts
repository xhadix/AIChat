// app/api/chat/route.ts

import OpenAI from 'openai';
import { querySuppliers } from '../../../lib/actions/supplierRisk';

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

// Define the actions available to the model
const actions = {
  async searchSuppliers(query: {
    type: 'highest_risk' | 'by_industry' | 'by_risk_category' | 'by_location' | 'by_min_score' | 'search';
    value?: string;
    count?: number;
    minScore?: number;
  }) {
    try {
      return await querySuppliers(query);
    } catch (error) {
      console.error('Error in searchSuppliers action:', error);
      return { error: 'Failed to search suppliers' };
    }
  },
};

export async function POST(req: Request) {
  // Parse the request body
  const { messages } = await req.json();
  
  // Add a system message to instruct the AI
  const systemMessage = {
    role: "system",
    content: `You are a compliance assistant that helps users understand supplier risks. 
    You have access to a database of suppliers with risk information.
    
    You can search this database using the searchSuppliers function with the following query types:
    - highest_risk: Returns the suppliers with the highest risk scores (provide count parameter to specify how many)
    - by_industry: Returns suppliers in a specific industry (provide value parameter with industry name)
    - by_risk_category: Returns suppliers with a specific risk category (provide value parameter with category name)
    - by_location: Returns suppliers in a specific location (provide value parameter with location name)
    - by_min_score: Returns suppliers with a risk score above a minimum (provide minScore parameter)
    - search: General search across all supplier data (provide value parameter with search terms)
    
    Always try to understand what the user is looking for and use the appropriate search function.
    Format the results in a clear, easy-to-read format with appropriate headers and structure.`
  };

  // Prepare the messages for the model
  const formattedMessages = messages.map((message: any) => ({
    role: message.role === 'user' ? 'user' : 'assistant',
    content: message.content,
  }));

  try {
    // Call the model with actions available
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [systemMessage, ...formattedMessages],
      temperature: 0.7,
      stream: true,
      tools: [
        {
          type: 'function',
          function: {
            name: 'searchSuppliers',
            description: 'Search the supplier database for risk information',
            parameters: {
              type: 'object',
              properties: {
                type: {
                  type: 'string',
                  enum: ['highest_risk', 'by_industry', 'by_risk_category', 'by_location', 'by_min_score', 'search'],
                  description: 'The type of search to perform',
                },
                value: {
                  type: 'string',
                  description: 'The value to search for (industry, risk category, location, or search term)',
                },
                count: {
                  type: 'number',
                  description: 'Number of results to return for highest_risk queries',
                },
                minScore: {
                  type: 'number',
                  description: 'Minimum risk score threshold for by_min_score queries',
                },
              },
              required: ['type'],
            },
          },
        }
      ],
    });
    console.log("🚀 ~ POST ~ response:", response)

    // Create a stream for the response
    const chunks = [];
    const stream = new ReadableStream({
      async start(controller) {
        // Process the OpenAI stream
        for await (const chunk of response) {
          const content = chunk.choices[0]?.delta?.content || '';
          if (content) {
            chunks.push(content);
            controller.enqueue(new TextEncoder().encode(content));
          }
          
          // Handle function calls
          if (chunk.choices[0]?.delta?.tool_calls) {
            const toolCalls = chunk.choices[0].delta.tool_calls;
            for (const toolCall of toolCalls) {
              if (toolCall.function && toolCall.function.name === 'searchSuppliers' && toolCall.function.arguments) {
                try {
                  // Parse arguments and call the function
                  const args = JSON.parse(toolCall.function.arguments);
                  const result = await actions.searchSuppliers(args);
                  
                  // Send result to the stream
                  const resultStr = JSON.stringify(result);
                  controller.enqueue(new TextEncoder().encode(`\n\nSearch result: ${resultStr}\n\n`));
                } catch (error) {
                  console.error('Error processing tool call:', error);
                  controller.enqueue(new TextEncoder().encode('\n\nError: Failed to process search request\n\n'));
                }
              }
            }
          }
        }
        controller.close();
      }
    });

    // Return the stream
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    return new Response(JSON.stringify({ error: 'Failed to process request' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}