# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an LLM-powered tarot reading web application deployed on Cloudflare Pages. The app provides a 3-card spread for "7-Day Evolution" readings using the DeepSeek API to generate interpretations.

## Architecture

### Deployment Model: Cloudflare Pages with Functions

This project uses Cloudflare Pages for static hosting with a Pages Function for API proxying.

**Project structure:**
- Static files (`index.html`, `style.css`, `script.js`) - Served directly by Cloudflare Pages
- `functions/api/tarot.js` - Cloudflare Pages Function that proxies DeepSeek API calls
- Accessible at `/api/tarot` endpoint

**Key architectural points:**
- Static assets are served directly from the root directory by Cloudflare Pages
- The Pages Function at `/api/tarot` proxies requests to DeepSeek API with secure API key storage
- Uses `onRequestPost` and `onRequestOptions` exports (Pages Function format)
- Environment variable `DEEPSEEK_API_KEY` is injected via Cloudflare Pages settings

### API Key Security

- DeepSeek API key stored as environment variable `DEEPSEEK_API_KEY` in Cloudflare Pages settings
- Frontend calls `/api/tarot` endpoint (local Pages Function)
- Function proxies requests to `https://api.deepseek.com/v1/chat/completions`
- API key never exposed to client-side code
- CORS headers configured to allow cross-origin requests

### Frontend Architecture

**Tarot Deck (script.js:1-19)**
- 22 Major Arcana cards
- 56 Minor Arcana cards (4 suits × 14 ranks)
- Full 78-card deck

**Card Drawing (script.js:22-26)**
- Random shuffle using `sort(() => 0.5 - Math.random())`
- 3-card positions: "Current State", "Focus for Growth", "Potential in 7 Days"

**Markdown Rendering (script.js:41-54)**
- Custom lightweight markdown parser
- Supports: bold, italic, headers (h1-h4), hr, bullet lists
- Converts markdown to HTML for display

**LLM Integration (script.js:57-78)**
- Calls `/api/tarot` Pages Function endpoint
- Uses `deepseek-chat` model
- Max 2000 tokens per response
- Structured prompt requesting markdown-formatted reading

## Common Commands

### Local Development
```bash
npx wrangler pages dev . --port=8787
```

### Deploy to Cloudflare Pages

**Via Git (recommended):**
Push to your connected Git repository - Cloudflare Pages will auto-deploy.

**Via CLI:**
```bash
npx wrangler pages deploy . --project-name=llm-tarot-reader
```

### View Live Logs
```bash
npx wrangler pages deployment tail
```

## Environment Variables

Set in Cloudflare Pages dashboard (Settings → Environment variables):
- `DEEPSEEK_API_KEY` - DeepSeek API key for generating readings

## Important Files

- `functions/api/tarot.js` - Cloudflare Pages Function for API proxy
- `index.html` - Main HTML page
- `script.js` - Frontend JavaScript (tarot logic and API calls)
- `style.css` - Styling
- `wrangler.jsonc` - Cloudflare Pages configuration

## Deployment Notes

This project is configured for Cloudflare Pages deployment. The `functions/` directory contains Pages Functions which are automatically deployed alongside static assets. The static files in the root directory are served directly, while the `/api/tarot` route is handled by the Pages Function.
