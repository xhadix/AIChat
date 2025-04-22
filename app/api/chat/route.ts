// app/api/chat/route.ts

import { StreamingTextResponse, Message, experimental_StreamData } from 'ai';
import { experimental_createAIActionHandler } from 'ai/rsc';
import OpenAI from 'openai';
import { querySuppliers } from '@/lib/actions/supplierRisk';

// Initialize the OpenAI client
// You can also use Claude, Gemini or other providers
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

// Define the actions available to the model
const runAIAction = experimental_createAIActionHandler({
  actions: {
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
  },
});

export async function POST(req: Request) {
  // Parse the request body
  const { messages } = await req.json();

  // Create a data stream instance to send custom data
  const data = new experimental_StreamData();

  // Prepare the messages for the model
  const formattedMessages = messages.map((message: Message) => ({
    role: message.role === 'user' ? 'user' : 'assistant',
    content: message.content,
  }));
  
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

  // Call the model with actions available
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',  // You can also use gpt-3.5-turbo or other models
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

  // Process the response stream
  const stream = OpenAI.streamUtils.formatFunctionCallsAsMarkdown(response, {
    async experimental_onFunctionCall(call) {
      if (call.name === 'searchSuppliers') {
        // Execute the supplier search function
        const result = await runAIAction(call.name, call.arguments);
        
        // Add the result to the data stream
        data.append({ type: 'searchResult', value: result });
        
        // Return the result to the model
        return JSON.stringify(result);
      }
    },
  });

  // Return the response as a streaming response
  return new StreamingTextResponse(stream, { headers: {} }, data);
}