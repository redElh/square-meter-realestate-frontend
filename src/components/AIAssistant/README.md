# AI Assistant Component

A beautiful, interactive AI assistant that helps users navigate and understand the Square Meter Real Estate application.

## Features

✨ **Beautiful UI**
- Elegant floating button with AI indicator badge
- Smooth animations using Framer Motion
- Gradient design matching your luxury real estate brand
- Responsive chat interface

💬 **Smart Conversations**
- Context-aware responses based on user queries
- Covers all major sections of the app
- Friendly, helpful tone
- Real-time typing indicators

🚀 **User Experience**
- Quick action buttons for common questions
- Auto-scroll to latest messages
- Keyboard shortcuts (Enter to send)
- Easy open/close functionality
- Always accessible from any page

## How It Works

The AI Assistant provides intelligent responses based on keywords in user messages:

- **Properties**: Guidance on browsing and searching properties
- **Selling**: Information about the selling process
- **Owners**: Details about owner services
- **Travel**: Info about vacation rentals
- **Contact**: How to reach the team
- **Authentication**: Account and login help
- **Dashboard**: Personalized features
- **Markets**: Market insights and trends
- **Investment**: Investment opportunities
- **Concierge**: Premium services
- **And more...**

## Usage

The AI Assistant is automatically included in your app and appears as a floating button in the bottom-right corner of every page.

### User Flow:
1. Click the sparkle icon button to open the assistant
2. Type a question or select a quick action
3. Receive instant, helpful responses
4. Continue the conversation or close the chat

## Customization

### Modify Responses

Edit the `getAIResponse` function in `AIAssistant.tsx` to customize responses:

```typescript
const getAIResponse = async (userMessage: string): Promise<string> => {
  // Add your custom logic here
}
```

### Change Appearance

Update the Tailwind classes to match your brand:

```typescript
// Button colors
className="bg-gradient-to-r from-amber-600 to-amber-700"

// Chat bubble colors
className="bg-gradient-to-r from-amber-600 to-amber-700 text-white"
```

### Add More Quick Actions

Modify the `quickActions` array:

```typescript
const quickActions = [
  "Your custom question 1",
  "Your custom question 2",
  // Add more...
];
```

## Integration with Real AI Services

To connect to a real AI backend (OpenAI, Anthropic, etc.), replace the `getAIResponse` function:

```typescript
const getAIResponse = async (userMessage: string): Promise<string> => {
  try {
    const response = await fetch('YOUR_API_ENDPOINT', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${YOUR_API_KEY}`,
      },
      body: JSON.stringify({
        message: userMessage,
        context: 'Square Meter Real Estate Assistant',
      }),
    });
    
    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('AI API Error:', error);
    return "I apologize, but I'm having trouble right now. Please try again.";
  }
};
```

## Dependencies

- `framer-motion`: For smooth animations
- `@heroicons/react`: For icons
- React hooks: useState, useRef, useEffect

All dependencies are already included in your project.

## Future Enhancements

Consider adding:
- 🔊 Voice input/output
- 🌐 Multi-language support (integrate with your i18n)
- 📊 Analytics tracking
- 💾 Conversation persistence
- 🤖 Integration with ChatGPT or Claude API
- 📱 Mobile-optimized version
- 🔔 Proactive suggestions based on user behavior
- 🎨 Theme customization options

## Technical Details

- Built with TypeScript for type safety
- Fully responsive design
- Accessible (ARIA labels included)
- Performant (optimized re-renders)
- No external API calls (fully client-side)

## Support

For questions or issues, contact the development team or refer to the main project documentation.
