# JobPsych AI Assistant Backend

A TypeScript Express.js backend for JobPsych AI assistant application with Google Gemini integration, featuring career psychology insights, job analysis, and professional development guidance.

## Features

- 🚀 **Express.js** with TypeScript
- 🧠 **Google Gemini AI** integration for career psychology
- 🎯 **JobPsych Specialization** - Career coaching, job analysis, and professional development
- 🏗️ **Controller Architecture** - Clean separation of concerns
- 🛡️ **Security** with Helmet, CORS, and Rate Limiting
- 📝 **Logging** with Winston
- ✅ **Validation** with Joi
- 🧪 **Testing** with Jest
- 📊 **Code Quality** with ESLint
- 🔧 **Development** with hot reload (ts-node-dev)

## API Endpoints

### Health Check

- `GET /api/health` - Basic health check
- `GET /api/health/detailed` - Detailed system information

### AI Assistant

- `POST /api/ai/chat` - Chat with AI assistant
- `POST /api/ai/analyze` - Analyze text (sentiment, summary, keywords)
- `GET /api/ai/models` - Get available AI models
- `GET /api/ai/status` - AI service status

## Quick Start

1. **Install dependencies:**

   ```bashv
   npm install
   ```

2. **Configure environment:**

   ```bash
   cp .env .env.local
   # Edit .env.local with your configuration
   ```

3. **Development:**

   ```bash
   npm run dev
   ```

4. **Production:**
   ```bash
   npm run build
   npm start
   ```

## Environment Variables

| Variable      | Description        | Default                  |
| ------------- | ------------------ | ------------------------ |
| `NODE_ENV`    | Environment        | `development`            |
| `PORT`        | Server port        | `3000`                   |
| `AI_API_KEY`  | AI service API key | Required for AI features |
| `AI_MODEL`    | Default AI model   | `gpt-3.5-turbo`          |
| `LOG_LEVEL`   | Logging level      | `info`                   |
| `CORS_ORIGIN` | Allowed origins    | `http://localhost:3000`  |

## Project Structure

```
src/
├── index.ts              # Main application entry
├── controllers/          # Request handlers
│   └── ai.controller.ts  # AI endpoint controllers
├── middleware/           # Custom middleware
│   ├── errorHandler.ts   # Error handling
│   └── validation.ts     # Request validation
├── routes/              # API routes
│   ├── ai.routes.ts     # AI-related endpoints
│   └── health.routes.ts # Health check endpoints
├── services/            # Business logic
│   └── ai.service.ts    # Google Gemini AI service
└── utils/               # Utilities
    └── logger.ts        # Logging configuration
```

## API Usage Examples

### Chat with AI

```bash
curl -X POST http://localhost:3000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, how are you?"}'
```

### Analyze Text

```bash
curl -X POST http://localhost:3000/api/ai/analyze \
  -H "Content-Type: application/json" \
  -d '{"text": "I love this product!", "analysisType": "sentiment"}'
```

## Development

- **Linting:** `npm run lint`
- **Testing:** `npm test`
- **Build:** `npm run build`
