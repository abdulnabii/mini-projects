# Project Architecture Overview

## System Design

The 30-Days 30-Projects suite follows a modular micro-app architecture.

## Tech Decisions

### Why Next.js 14?
- App Router reduces client bundle
- Built-in image optimization
- Edge runtime for low-latency APIs

### Why Supabase?
- PostgreSQL with Row Level Security
- Real-time subscriptions
- Free tier for portfolio traffic

### AI Integration Pattern

```typescript
const completion = await openai.chat.completions.create({
  model: 'gpt-4o',
  messages: [...history],
  stream: true,
});
```

_Collaboratively authored. Updated: 1787455557_
