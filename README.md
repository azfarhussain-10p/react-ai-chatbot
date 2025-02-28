# React AI Chatbot: Multi-Model Integration

![React](https://img.shields.io/badge/React-18.2+-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-4.4+-646CFF?logo=vite)

A sophisticated conversational interface integrating cutting-edge AI models from OpenAI (ChatGPT), Google AI (Gemini), and DeepSeek (R1). Built with React.js and modern web development practices.

## Overview

This enterprise-grade chatbot solution demonstrates seamless integration of multiple AI providers while maintaining a unified conversational experience. Key architectural features include:

- **Multi-Model Support**: Simultaneous integration with ChatGPT, Gemini AI, and DeepSeek
- **Real-Time Streaming**: Dynamic content delivery with progressive response rendering
- **Markdown Processing**: Structured content presentation with code syntax highlighting
- **State Management**: Robust handling of asynchronous API interactions
- **Component Architecture**: Modular UI components following React best practices

## Features

- Cross-platform AI provider integration
- Configurable model selection interface
- Error handling with retry mechanisms
- Loading state animations
- Responsive UI design
- Environment-based configuration

## Prerequisites

- Node.js v22.12+ / npm v9.8+
- API credentials:
  - OpenAI API Key
  - Google AI Studio API Key
  - DeepSeek API Key

## Getting Started

### 1. Repository Setup

```bash
git clone https://github.com/your-username/react-ai-chatbot.git
cd react-ai-chatbot 
```
### 2. Dependency Installation
```bash
npm install
```
### 3. Environment Configuration
  - Create `.env.local` from template:
```bash
  cp .env.example .env.local
  ```
  - Update API credentials in `.env.local`:
```bash
VITE_OPENAI_API_KEY="your_actual_openai_key"
VITE_GEMINI_API_KEY="your_actual_gemini_key"
VITE_DEEPSEEK_API_KEY="your_actual_deepseek_key"
```
⚠️ Security Notice: Never commit `.env.local` to version control

### 4. Application Execution
```bash
npm run dev
```
Access the application at http://localhost:5173

## API Key Configuration

Before running the application, obtain API keys from these providers:

| Service       | Environment Variable       | Key Acquisition Steps                         |
|---------------|----------------------------|-----------------------------------------------|
| **ChatGPT**   | `VITE_OPENAI_API_KEY`       | 1. [Sign up](https://platform.openai.com/signup)<br>2. Navigate to [API Keys](https://platform.openai.com/api-keys)<br>3. Create new secret key |
| **Gemini AI** | `VITE_GEMINI_API_KEY`       | 1. Access [Google AI Studio](https://makersuite.google.com/)<br>2. Click "Get API Key"<br>3. Create key in Google Cloud Console |
| **DeepSeek**  | `VITE_DEEPSEEK_API_KEY`     | 1. Visit [DeepSeek Platform](https://platform.deepseek.com/)<br>2. Register/Login<br>3. Navigate to [API Keys](https://platform.deepseek.com/api_keys) |

**Security Notes:**
- 🔐 Never commit API keys to version control
- 💳 Some services require payment method registration for API access
- 📊 Monitor usage through provider dashboards:
  - [OpenAI Usage](https://platform.openai.com/usage)
  - [Google Cloud Console](https://console.cloud.google.com/)
  - [DeepSeek Usage](https://platform.deepseek.com/usage)