# Quick Mail Sender

A full-stack web application that allows users to send emails instantly and leverage AI to draft email content, providing a fast and efficient alternative to traditional email clients.

## Features

- **Lightning Fast Email Sending**: Send emails instantly with optimized delivery
- **AI-Powered Content Generation**: Generate compelling email content with AI assistance using Google Gemini
- **Real-time Validation**: Email validation and user feedback
- **Secure & Reliable**: Enterprise-grade security with rate limiting and CORS protection
- **Modern UI**: Beautiful, responsive interface built with Next.js and Tailwind CSS

## Tech Stack

### Frontend
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion

### Backend
- Python 3.9+
- FastAPI
- Pydantic
- Uvicorn

### Services
- Brevo API (Email delivery)
- Google Gemini API (AI content generation)

## Prerequisites

- Node.js 18+ and npm/pnpm
- Python 3.9+
- Brevo account and API key
- Google Gemini API key

## Setup Instructions

### 1. Clone and Install Frontend Dependencies

```bash
# Install frontend dependencies
pnpm install
```

### 2. Setup Backend

```bash
# Install Python dependencies
pip install -r requirements.txt

# Copy environment variables
cp env.example .env

# Edit .env file with your API keys
# BREVO_API_KEY=your_brevo_api_key_here
# BREVO_FROM_EMAIL=your_verified_email@example.com
# BREVO_FROM_NAME=Quick Mail Sender
# GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Get API Keys

#### Brevo Setup
1. Create a Brevo account at https://www.brevo.com
2. Generate an API key in the Brevo dashboard (SMTP & API > API Keys)
3. Verify your sender email address
4. Add the API key and verified email to your `.env` file

#### Google Gemini Setup
1. Go to https://makersuite.google.com/app/apikey
2. Create a new API key
3. Add the API key to your `.env` file

### 4. Run the Application

#### Start the Backend (Terminal 1)
```bash
python run_server.py
```

#### Start the Frontend (Terminal 2)
```bash
pnpm dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://127.0.0.1:8000

## API Endpoints

### Health Check
- `GET /` - API health status

### Email Operations
- `POST /send-email` - Send an email via Brevo
- `POST /generate-body` - Generate email body with AI

## Rate Limiting

- Email sending: 15 requests/minute per IP
- AI generation: 10 requests/minute per IP

## Security Features

- CORS protection
- Rate limiting
- Input validation
- Structured logging
- Error handling

## Development

### Backend Development
```bash
# Run with auto-reload
python run_server.py
```

### Frontend Development
```bash
# Run development server
pnpm dev
```

## 🚀 Production Deployment

This application can be deployed with:
- **Frontend**: Vercel
- **Backend**: Render

### Quick Start Deployment

1. **Read the Quick Reference** (5 minutes)
   ```
   📄 DEPLOYMENT_QUICK_REFERENCE.md
   ```

2. **Follow the Detailed Guide** (15 minutes)
   ```
   📖 DEPLOYMENT_GUIDE.md
   ```

3. **Track Your Progress**
   ```
   ✅ DEPLOYMENT_CHECKLIST.md
   ```

4. **Understand the Architecture**
   ```
   🏗️ DEPLOYMENT_ARCHITECTURE.md
   ```

### What You'll Need
- GitHub account (for code hosting)
- Vercel account (for frontend) - Free
- Render account (for backend) - Free tier available
- Your API keys (Brevo, Gemini)

### Deployment Time
- Backend (Render): ~10 minutes
- Frontend (Vercel): ~5 minutes
- **Total**: ~15 minutes

### Costs
- **Free Tier**: $0/month (perfect for testing)
- **Production**: $7/month (Render always-on backend)

---

## 📚 Documentation

- `DEPLOYMENT_GUIDE.md` - Complete deployment walkthrough
- `DEPLOYMENT_QUICK_REFERENCE.md` - Quick command reference
- `DEPLOYMENT_CHECKLIST.md` - Step-by-step checklist
- `DEPLOYMENT_ARCHITECTURE.md` - Architecture diagrams
- `DEPLOYMENT_FILES_SUMMARY.md` - What each file does

---

## Production Deployment (Old - See Above for New Guide)

1. Set `DEBUG=False` in your environment
2. Configure proper CORS origins
3. Use a production WSGI server like Gunicorn
4. Set up proper logging and monitoring

## License

MIT License - see LICENSE file for details.