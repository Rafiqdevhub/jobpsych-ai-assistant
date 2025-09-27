# JobPsych AI Assistant - Complete Workflow Documentation

## Overview

JobPsych AI Assistant is a TypeScript Express.js backend application that provides career psychology insights, job analysis, and professional development guidance powered by Google Gemini AI. The application is designed with a functional architecture, containerized with Docker, and deployed on Vercel for serverless execution.

## Architecture

### Technology Stack

- **Runtime**: Node.js 20 (Alpine Linux in Docker)
- **Language**: TypeScript (compiled to CommonJS)
- **Framework**: Express.js 5.x
- **AI Service**: Google Gemini 2.5 Flash
- **Validation**: Joi schemas
- **Security**: Helmet, CORS, Rate Limiting
- **Compression**: Gzip compression
- **Logging**: Console-based logging (production-optimized)
- **Testing**: Jest with ts-jest
- **Linting**: ESLint with TypeScript rules
- **Development**: ts-node-dev with hot reload

### Project Structure

```text
jobpsych-ai-assistant/
├── api/
│   └── index.ts                 # Vercel serverless entry point
├── src/
│   ├── index.ts                 # Main Express application
│   ├── controllers/
│   │   └── ai.controller.ts     # Functional AI endpoint handlers
│   ├── middleware/
│   │   ├── errorHandler.ts      # Global error handling
│   │   └── validation.ts        # Request validation middleware
│   ├── routes/
│   │   ├── ai.routes.ts         # AI API routes with validation
│   │   └── health.routes.ts     # Health check routes
│   ├── services/
│   │   └── ai.service.ts        # Google Gemini AI integration
│   └── utils/
│       └── logger.ts            # Console logging utility
├── Dockerfile                   # Multi-stage Docker build
├── docker-compose.yml           # Local development setup
├── vercel.json                  # Vercel deployment config
├── package.json                 # Dependencies and scripts
├── tsconfig.json               # TypeScript configuration
├── jest.config.js              # Testing configuration
├── eslint.config.js            # Linting configuration
└── .env                        # Environment variables
```

## API Endpoints

### Base URL

- **Development**: `http://localhost:8080/api`
- **Production**: `https://your-vercel-url.vercel.app/api`

### Health Check Endpoints

#### GET `/api/health`

Basic health check endpoint returning system status.

**Response:**

```json
{
  "success": true,
  "data": {
    "status": "OK",
    "timestamp": "2024-01-01T00:00:00.000Z",
    "uptime": 123.456,
    "environment": "production",
    "version": "1.0.0",
    "memory": {
      "rss": 12345678,
      "heapTotal": 1234567,
      "heapUsed": 123456,
      "external": 12345
    }
  }
}
```

#### GET `/api/health/detailed`

Detailed health check with system information.

**Response:**

```json
{
  "success": true,
  "data": {
    "status": "OK",
    "timestamp": "2024-01-01T00:00:00.000Z",
    "uptime": 123.456,
    "environment": "production",
    "version": "1.0.0",
    "memory": { ... },
    "system": {
      "platform": "linux",
      "nodeVersion": "v20.10.0",
      "arch": "x64"
    },
    "services": {
      "ai": "connected",
      "database": "connected"
    }
  }
}
```

### AI Assistant Endpoints

#### POST `/api/ai/chat`

General chat with the JobPsych AI assistant.

**Request Body:**

```json
{
  "message": "I need career advice",
  "context": "I'm a software developer looking to advance",
  "model": "gemini-2.5-flash",
  "sessionType": "coaching"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "response": "Based on your experience as a software developer...",
    "model": "gemini-2.5-flash",
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

#### POST `/api/ai/coaching`

Career coaching session with specialized guidance.

**Request Body:**

```json
{
  "query": "How do I negotiate a better salary?",
  "sessionType": "goal_setting",
  "userContext": "Mid-level developer with 3 years experience"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "response": "Salary negotiation strategies...",
    "sessionType": "goal_setting",
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

#### POST `/api/ai/analyze-job`

Job analysis and career fit assessment.

**Request Body:**

```json
{
  "jobDescription": "Senior Software Engineer position...",
  "userProfile": "Full-stack developer with React and Node.js experience",
  "analysisType": "fit"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "analysis": {
      "fit_score": 85,
      "recommendations": ["Highlight React experience", "Learn TypeScript"],
      "skills_match": ["JavaScript", "React", "Node.js"]
    },
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

#### POST `/api/ai/analyze`

Text analysis for sentiment, summary, or keywords.

**Request Body:**

```json
{
  "text": "I love working with this team!",
  "analysisType": "sentiment"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "analysis": {
      "sentiment": "positive",
      "confidence": 0.95,
      "keywords": ["team", "love", "working"]
    },
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

#### GET `/api/ai/models`

Get available AI models.

**Response:**

```json
{
  "success": true,
  "data": {
    "models": [
      {
        "name": "gemini-2.5-flash",
        "description": "Fast and efficient model",
        "contextWindow": 32768
      }
    ],
    "default": "gemini-2.5-flash"
  }
}
```

#### GET `/api/ai/status`

AI service status and configuration.

**Response:**

```json
{
  "success": true,
  "data": {
    "status": "operational",
    "model": "gemini-2.5-flash",
    "lastChecked": "2024-01-01T00:00:00.000Z",
    "configuration": {
      "temperature": 0.7,
      "maxTokens": 2048
    }
  }
}
```

#### POST `/api/ai/career-path`

Career path recommendations based on current role and goals.

**Request Body:**

```json
{
  "currentRole": "Software Developer",
  "experience": "3 years in web development",
  "interests": "AI, machine learning, leadership",
  "goals": "Become a tech lead within 2 years"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "recommendations": [
      "Pursue tech lead position",
      "Learn system design",
      "Develop leadership skills"
    ],
    "timeline": "18-24 months",
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

#### POST `/api/ai/interview-prep`

Interview preparation assistance.

**Request Body:**

```json
{
  "jobDescription": "Senior Frontend Developer...",
  "userProfile": "React developer with 4 years experience",
  "interviewType": "technical"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "preparation": {
      "key_topics": ["React hooks", "performance optimization"],
      "practice_questions": ["Explain useEffect", "Component lifecycle"],
      "tips": ["Review system design", "Practice coding problems"]
    },
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

#### POST `/api/ai/skill-gap`

Skill gap analysis between current and target roles.

**Request Body:**

```json
{
  "targetRole": "Senior Software Engineer",
  "currentSkills": "JavaScript, React, Node.js, SQL",
  "desiredSkills": "TypeScript, AWS, Docker, System Design"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "analysis": {
      "missing_skills": ["TypeScript", "AWS", "Docker"],
      "skill_gaps": [
        {
          "skill": "TypeScript",
          "priority": "high",
          "resources": ["Official TypeScript docs", "Udemy courses"]
        }
      ],
      "learning_path": [
        "TypeScript fundamentals",
        "AWS basics",
        "Docker containers"
      ]
    },
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

## Data Flow

### Request Processing Flow

1. **Client Request** → Express middleware (helmet, cors, rate limiting)
2. **Route Matching** → Validation middleware (Joi schemas)
3. **Controller** → Business logic delegation to services
4. **Service** → AI processing (Google Gemini API calls)
5. **Response** → Formatted JSON response with error handling

### Error Handling

- **Validation Errors**: 400 Bad Request with detailed field errors
- **AI Service Errors**: 503 Service Unavailable with retry suggestions
- **Rate Limiting**: 429 Too Many Requests
- **Server Errors**: 500 Internal Server Error with correlation ID
- **Not Found**: 404 for invalid routes

### Rate Limiting

- **Window**: 15 minutes (configurable)
- **Max Requests**: 100 per IP (configurable)
- **Response**: JSON error with retry-after header

## Environment Configuration

### Required Variables

```bash
GEMINI_API_KEY=your_google_gemini_api_key_here
```

### Optional Variables

```bash
NODE_ENV=production
PORT=8080
API_PREFIX=/api
AI_MODEL=gemini-2.5-flash
CORS_ORIGIN=https://your-frontend-domain.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Development Workflow

### Local Development

```bash
# Install dependencies
npm install

# Start development server with hot reload
npm run dev

# Run tests
npm test

# Run linting
npm run lint

# Build for production
npm run build
```

### Docker Development

```bash
# Build and run with Docker Compose
docker-compose up --build

# Or build and run manually
docker build -t jobpsych-ai .
docker run -p 8080:8080 -e GEMINI_API_KEY=your_key jobpsych-ai
```

### Testing

```bash
# Unit tests
npm test

# Test coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

## Deployment

### Vercel Deployment

1. **Connect Repository**: Link GitHub repo to Vercel
2. **Environment Variables**: Set `GEMINI_API_KEY` in Vercel dashboard
3. **Build Settings**: Automatic detection from `vercel.json`
4. **Domain**: Custom domain or Vercel subdomain

### Docker Deployment

```bash
# Build image
docker build -t jobpsych-ai:latest .

# Run container
docker run -p 8080:8080 \
  -e GEMINI_API_KEY=your_key \
  -e NODE_ENV=production \
  jobpsych-ai:latest
```

### Production Considerations

- **Health Checks**: Use `/api/health` for load balancer checks
- **Logging**: Console output captured by hosting platform
- **Scaling**: Stateless design supports horizontal scaling
- **Monitoring**: Implement application monitoring for AI service calls
- **Backup**: Regular backup of environment configurations

## Security Features

### Request Security

- **Helmet**: Security headers (CSP, HSTS, etc.)
- **CORS**: Configurable origin restrictions
- **Rate Limiting**: DDoS protection
- **Input Validation**: Joi schema validation
- **Error Sanitization**: No sensitive data in error responses

### AI Service Security

- **API Key Protection**: Environment variable storage
- **Request Validation**: Input sanitization before AI calls
- **Response Filtering**: Safe content filtering
- **Rate Limiting**: AI service call throttling

## Monitoring and Maintenance

### Health Checks

- **Basic**: `/api/health` - System status
- **Detailed**: `/api/health/detailed` - Full system info
- **AI Status**: `/api/ai/status` - AI service connectivity

### Logs

- **Development**: Console output with timestamps
- **Production**: Platform-specific log aggregation
- **Error Tracking**: Correlation IDs for debugging

### Performance

- **Compression**: Gzip for response compression
- **Caching**: Implement Redis for session caching if needed
- **Optimization**: Bundle analysis and code splitting

## Troubleshooting

### Common Issues

#### "GEMINI_API_KEY not configured"

- **Cause**: Missing or invalid API key
- **Solution**: Check `.env` file and environment variables

#### "Rate limit exceeded"

- **Cause**: Too many requests from same IP
- **Solution**: Wait for rate limit window or increase limits

#### "AI service unavailable"

- **Cause**: Google Gemini API issues
- **Solution**: Check API key validity and quota

#### "Validation errors"

- **Cause**: Invalid request format
- **Solution**: Check API documentation and request schema

### Debug Mode

```bash
# Enable debug logging
DEBUG=jobpsych:* npm run dev

# Check environment
node -e "console.log(process.env)"
```

## Future Enhancements

### Planned Features

- **User Sessions**: Persistent conversation history
- **Analytics**: Usage tracking and insights
- **Multi-language**: Internationalization support
- **Voice Integration**: Speech-to-text for accessibility
- **Integration APIs**: Third-party career platforms

### Scalability Improvements

- **Database**: User profiles and conversation storage
- **Caching**: Redis for performance optimization
- **Queue System**: Background job processing
- **Microservices**: Separate AI processing service

This documentation provides a complete overview of the JobPsych AI Assistant application, covering all aspects from architecture to deployment and maintenance.
