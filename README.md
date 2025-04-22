# Supplier Risk Compliance Assistant

A Next.js web application with a chat interface that helps users perform supplier risk assessment tasks. Built using the Vercel AI SDK with custom tool calling functionality.

## Features

- Chat interface powered by Vercel AI SDK
- Custom tool for querying a mock supplier risk database
- Support for various supplier risk queries:
  - Highest risk suppliers
  - Suppliers by industry
  - Suppliers by risk category
  - Suppliers by location
  - Suppliers above a minimum risk score
  - General supplier search

## Technology Stack

- **Frontend**: Next.js
- **AI Integration**: Vercel AI SDK
- **Styling**: TailwindCSS
- **Deployment**: Vercel

## Architecture and Design Decisions

### Project Structure

```
compliance-assistant/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts       # API route for chat functionality
│   ├── layout.tsx
│   └── page.tsx               # Main page with chat interface
├── components/
│   ├── ChatInput.tsx          # Chat input component
│   ├── ChatMessage.tsx        # Individual message component
│   └── ChatWindow.tsx         # Main chat container
├── lib/
│   ├── actions/
│   │   └── supplierRisk.ts    # Tool implementation for supplier risk
│   ├── suppliers.ts           # Mock supplier database
│   └── utils.ts               # Utility functions
├── public/
│   └── ...
├── tailwind.config.js
├── next.config.js
└── package.json
```


### Tool Implementation

I implemented the Supplier Risk Search Tool which allows users to query a mockup database of fictional suppliers. The tool supports various query types to filter and search for suppliers based on different criteria such as risk score, industry, location, and risk categories.

The implementation follows a clean architecture with:

1. **Mock Database** - A collection of 10 fictional suppliers with relevant attributes
2. **Query Functions** - Methods to filter and search this database
3. **Tool Implementation** - A custom function that processes queries and returns results through the AI chat interface

### Chat Interface

The chat interface is built using the Vercel AI SDK, which provides:

- Real-time streaming of AI responses
- Tool calling capabilities
- Loading states for better UX

The UI is designed to be intuitive with a clear separation between user and assistant messages, and visual indicators for when tools are being executed.

## Setup Instructions

### Prerequisites

- Node.js 18 or higher
- An API key for an LLM service (OpenAI, Claude, etc.)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/xhadix/compliance-assistant.git
   cd compliance-assistant
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with your API key:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```
   
   Note: You can use other LLM providers by modifying the API route.

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.


You can ask the assistant questions about suppliers such as:

- "What are the top 3 suppliers with the highest risk scores?"
- "Show me all suppliers in the healthcare industry"
- "Which suppliers have financial compliance risks?"
- "Are there any high-risk suppliers in Europe?"
- "Show me suppliers with a risk score above 7"

The assistant will process your query, call the appropriate tool function, and present the results in a clear, formatted manner.