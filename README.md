# JobPsych AI Assistant Backend

A TypeScript Express.js backend for JobPsych AI assistant application with Google Gemini integration, featuring career psychology insights, job analysis, and professional development guidance.

## Features

- 🚀 **Express.js 5.x** with TypeScript
- 🧠 **Google Gemini 2.5 Flash** integration for career psychology
- 🎯 **JobPsych Specialization** - Career coaching, job analysis, and professional development
- 🏗️ **Functional Architecture** - Clean separation of concerns with functional controllers
- 🛡️ **Security** with Helmet, CORS, Rate Limiting, and Compression
- 📝 **Console Logging** with Winston (production-optimized)
- ✅ **Validation** with Joi schemas
- 🧪 **Testing** with Jest (essential test suite)
- 📊 **Code Quality** with ESLint
- 🔧 **Development** with hot reload (ts-node-dev)
- 🐳 **Docker** support with multi-stage builds
- ☁️ **Deployment** ready for Vercel serverless and Docker Hub

## API Endpoints

### Health Check

- `GET /api/health` - Basic health check with system metrics
- `GET /api/health/detailed` - Detailed system information and service status

### AI Assistant

- `POST /api/ai/chat` - General chat with JobPsych AI assistant
- `POST /api/ai/coaching` - Career coaching sessions with specialized guidance
- `POST /api/ai/analyze-job` - Job analysis and career fit assessment
- `POST /api/ai/analyze` - Text analysis (sentiment, summary, keywords)
- `POST /api/ai/career-path` - Career path recommendations
- `POST /api/ai/interview-prep` - Interview preparation assistance
- `POST /api/ai/skill-gap` - Skill gap analysis
- `GET /api/ai/models` - Get available AI models
- `GET /api/ai/status` - AI service status and configuration

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

### Required

| Variable         | Description           | Default  |
| ---------------- | --------------------- | -------- |
| `GEMINI_API_KEY` | Google Gemini API key | Required |

### Optional

| Variable                  | Description               | Default               |
| ------------------------- | ------------------------- | --------------------- |
| `NODE_ENV`                | Environment mode          | `development`         |
| `PORT`                    | Server port               | `4000`                |
| `API_PREFIX`              | API route prefix          | `/api`                |
| `AI_MODEL`                | Google Gemini model       | `gemini-2.5-flash`    |
| `LOG_LEVEL`               | Winston logging level     | `info`                |
| `RATE_LIMIT_WINDOW_MS`    | Rate limiting window (ms) | `900000` (15 minutes) |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window   | `100`                 |

## Project Structure

```
jobpsych-ai-assistant/
├── api/
│   └── index.ts                 # Vercel serverless entry point
├── src/
│   ├── index.ts                 # Main Express application
│   ├── controllers/
│   │   ├── ai.controller.ts     # Functional AI endpoint handlers
│   │   └── diagnostic.controller.ts # API diagnostics
│   ├── middleware/
│   │   ├── errorHandler.ts      # Global error handling with async wrapper
│   │   └── validation.ts        # Joi request validation middleware
│   ├── routes/
│   │   ├── ai.routes.ts         # AI API routes with comprehensive validation
│   │   └── health.routes.ts     # Health check endpoints
│   ├── services/
│   │   └── ai.service.ts        # Google Gemini AI integration service
│   ├── utils/
│   │   └── logger.ts            # Console-based Winston logging
│   └── __tests__/               # Essential test suite
│       ├── setup.ts             # Test environment configuration
│       ├── app.test.ts          # Core application tests
│       ├── ai.service.test.ts   # AI service tests
│       ├── errorHandler.test.ts # Error handling tests
│       └── logger.test.ts       # Logger tests
├── .github/workflows/
│   └── docker-build-and-push.yml # CI/CD pipeline for Docker Hub
├── Dockerfile                   # Multi-stage Docker build
├── docker-compose.yml           # Local development setup
├── vercel.json                  # Vercel deployment configuration
├── package.json                 # Dependencies and scripts
├── tsconfig.json               # TypeScript configuration
├── jest.config.js              # Jest testing configuration
├── eslint.config.js            # ESLint v9 flat configuration
├── WORKFLOW.md                 # Complete development workflow docs
└── .env                        # Environment variables
```

## API Usage Examples

### General Chat with JobPsych AI

```bash
curl -X POST http://localhost:5000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "I need career advice for transitioning to tech",
    "context": "I have 5 years in marketing",
    "sessionType": "coaching"
  }'
```

### Career Coaching Session

```bash
curl -X POST http://localhost:5000/api/ai/coaching \
  -H "Content-Type: application/json" \
  -d '{
    "query": "How do I negotiate a better salary?",
    "sessionType": "goal_setting",
    "userContext": "Mid-level developer with 3 years experience"
  }'
```

### Job Analysis

```bash
curl -X POST http://localhost:5000/api/ai/analyze-job \
  -H "Content-Type: application/json" \
  -d '{
    "jobDescription": "Senior Software Engineer position requiring React and Node.js",
    "userProfile": "Full-stack developer with 4 years experience",
    "analysisType": "fit"
  }'
```

### Text Analysis

```bash
curl -X POST http://localhost:5000/api/ai/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "text": "I love working with this team!",
    "analysisType": "sentiment"
  }'
```

### Career Path Recommendations

```bash
curl -X POST http://localhost:5000/api/ai/career-path \
  -H "Content-Type: application/json" \
  -d '{
    "currentRole": "Software Developer",
    "experience": "3 years in web development",
    "interests": "AI, machine learning, leadership",
    "goals": "Become a tech lead within 2 years"
  }'
```

## Development

### Local Development

```bash
# Install dependencies
npm install

# Start development server (http://localhost:5000)
npm run dev

# Run tests
npm test

# Run linting
npm run lint

# Build for production
npm run build

# Start production server
npm start
```

### Docker Development

```bash
# Build and run with Docker Compose
docker-compose up --build

# Or build and run manually
docker build -t jobpsych-ai-assistant .
docker run -p 8080:8080 \
  -e GEMINI_API_KEY=your_api_key \
  -e NODE_ENV=production \
  jobpsych-ai-assistant
```

### Available Scripts

- **`npm run dev`** - Development server with hot reload
- **`npm run build`** - Build TypeScript to JavaScript
- **`npm run start`** - Start production server
- **`npm run test`** - Run Jest tests
- **`npm run test:watch`** - Run tests in watch mode
- **`npm run test:coverage`** - Run tests with coverage
- **`npm run lint`** - Run ESLint
- **`npm run lint:fix`** - Fix ESLint issues
- **`npm run clean`** - Clean build directory
- **`npm run docker:build`** - Build Docker image
- **`npm run docker:run`** - Run Docker container
- **`npm run docker:compose`** - Run with Docker Compose

## Architecture

### Technology Stack

- **Runtime**: Node.js 20 (Alpine Linux in Docker)
- **Language**: TypeScript (compiled to CommonJS)
- **Framework**: Express.js 5.x with functional architecture
- **AI Service**: Google Gemini 2.5 Flash
- **Validation**: Joi schemas with comprehensive request validation
- **Security**: Helmet, CORS, Rate Limiting (100 req/15min), Compression
- **Logging**: Console-based Winston logging (production-optimized)
- **Testing**: Jest with ts-jest, essential test suite
- **Linting**: ESLint v9 with TypeScript rules
- **Development**: ts-node-dev with hot reload

### Deployment Options

#### Vercel (Serverless)

```bash
# Deploy to Vercel
vercel --prod
```

- **Entry Point**: `api/index.ts`
- **Build**: Automatic TypeScript compilation
- **Environment**: Set `GEMINI_API_KEY` in Vercel dashboard

#### Docker Hub

```bash
# Pull and run from Docker Hub
docker pull rafiq9323/jobpsych-ai-assistant:latest
docker run -p 8080:8080 \
  -e GEMINI_API_KEY=your_api_key \
  -e NODE_ENV=production \
  rafiq9323/jobpsych-ai-assistant:latest
```

#### GitHub Actions CI/CD

- **Automated Testing**: Runs on every push and PR
- **Docker Build**: Multi-platform builds (linux/amd64, linux/arm64)
- **Security Scanning**: Optional Trivy vulnerability scanning
- **Docker Hub Push**: Automatic deployment to `rafiq9323/jobpsych-ai-assistant`

### Key Features

- **Functional Architecture**: Pure functions for controllers and services
- **Error Handling**: Comprehensive error handling with detailed logging
- **Request Validation**: Joi schemas for all API endpoints
- **Rate Limiting**: Configurable rate limiting to prevent abuse
- **Health Checks**: Basic and detailed health check endpoints
- **Security**: Multiple layers of security middleware
- **Testing**: Essential test suite with mocked AI service
- **Documentation**: Complete workflow documentation in `WORKFLOW.md`

## Troubleshooting

### Common Issues

#### "GEMINI_API_KEY not configured"

```bash
# Check if environment variable is set
echo $GEMINI_API_KEY

# Set for development
export GEMINI_API_KEY=your_actual_api_key_here
```

#### "Rate limit exceeded"

- **Cause**: Too many requests from the same IP
- **Solution**: Wait 15 minutes or adjust `RATE_LIMIT_WINDOW_MS` and `RATE_LIMIT_MAX_REQUESTS`

#### "AI service unavailable (503)"

- **Cause**: Google Gemini API issues or invalid API key
- **Solution**: Check API key validity and Google AI Studio quota

#### Tests hanging

- **Cause**: Server running during tests
- **Solution**: Tests automatically prevent server startup with `NODE_ENV=test`

### Debug Mode

```bash
# Enable detailed logging
LOG_LEVEL=debug npm run dev

# Check environment variables
node -e "console.log(process.env)"
```

## Documentation

For complete workflow documentation, deployment guides, and API reference, see:

- **[WORKFLOW.md](./WORKFLOW.md)** - Complete development workflow and deployment guide
- **[API Documentation](./WORKFLOW.md#api-endpoints)** - Detailed API endpoint documentation
- **[Docker Guide](./WORKFLOW.md#deployment)** - Docker deployment and configuration

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes and add tests
4. Run tests: `npm test`
5. Run linting: `npm run lint`
6. Commit your changes: `git commit -am 'Add some feature'`
7. Push to the branch: `git push origin feature/your-feature`
8. Submit a pull request
