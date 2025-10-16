# AI Chat Configuration

## Environment Variables

Add the following environment variable to your `.env.local` file:

```bash
NEXT_PUBLIC_AI_SERVICE_URL=https://n8n.serperp.com/webhook-test/chat
```

## API Details

### Endpoint
- **URL**: `https://n8n.serperp.com/webhook-test/chat`
- **Method**: POST
- **Content-Type**: application/json

### Request Body
```json
{
  "token": "JWT_TOKEN_FROM_CLERK_AUTH",
  "message": "User message here"
}
```

### Response
```json
{
  "output": "AI response message"
}
```

## Features Implemented

1. **AI Chat API Integration**
   - JWT token authentication using Clerk
   - POST request to AI service endpoint
   - Error handling and retry functionality

2. **Custom Hook (useAIChat)**
   - Message state management
   - Loading states
   - Error handling
   - Retry functionality
   - Clear chat functionality

3. **Updated AIChatWindow Component**
   - Real-time chat interface
   - Message history
   - Loading indicators
   - Error states with retry
   - Suggestion buttons
   - Auto-scroll to latest messages
   - Clear chat functionality

4. **User Experience**
   - Sliding panel animation
   - Responsive design
   - Loading states
   - Error handling
   - Retry functionality
   - Clear chat option
   - Suggestion prompts

## Usage

The AI chat is accessible via the ✨ button in the top-right corner of the application. Users can:

1. Click the AI button to open the chat panel
2. Type messages or click suggestion buttons
3. View AI responses in real-time
4. Retry failed messages
5. Clear chat history
6. Close the panel when done

The AI service will receive the user's JWT token and message, and respond with relevant information about their tasks and projects.
