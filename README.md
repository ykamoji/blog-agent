# AI News Dashboard

A modern web application that aggregates and displays AI-related news articles from three major sources: **YouTube**, **Anthropic**, and **OpenAI**. The application features a visually attractive dashboard with an intelligent backend pipeline powered by AI agents.

## Visit

https://blog-agent-git-deployment-ykamojis-projects.vercel.app/

## Overview

The AI News Dashboard provides users with a curated feed of the latest AI news, organized by source category. Users can trigger backend scrapers to fetch fresh content and optionally receive digest emails.

## Application Workflow
The application executes a multi-stage AI-powered pipeline when triggered:

1. **Scraper Stage** (`scrapper`)
   - Fetches raw articles from YouTube, Anthropic, and OpenAI sources
   - Collects metadata: title, summary, URL, publication date

2. **Anthropic Stage** (`anthropic`)
   - Uses Claude AI to analyze and enhance article summaries
   - Extracts key insights and relevance scores
   - Ensures content quality and consistency

3. **YouTube Stage** (`youtube`)
   - Processes video content from YouTube channels
   - Generates video descriptions and relevance metadata

4. **Digest Stage** (`digest`)
   - Compiles processed articles into a structured digest
   - Organizes content by category and relevance

5. **Email Stage** (`email`)
   - Optionally sends the compiled digest to the provided email address
   - Formats content for readability

Each stage displays real-time progress with status indicators (loading, success, error).

## AI Agents

The application leverages **Google ADK ** for intelligent content processing:

### Integration Points
- **Content Analysis**:  Analyzes raw article content to generate quality summaries
- **Information Extraction**: Extracts key concepts, entities, and relevance from AI news
- **Quality Assurance**: Ensures consistency and accuracy across different sources
- **Digest Compilation**: Intelligently organizes and formats digests for readability

### AI Agent Architecture
The backend implements a modular agent-based pipeline where each stage (scraper, Anthropic, YouTube, digest, email) operates as an independent agent that can:
- Execute asynchronously
- Report success/failure status
- Pass structured data to the next stage
- Handle errors gracefully

This design allows for:
- **Resilience**: Failure in one stage doesn't cascade without proper error handling
- **Maintainability**: Each agent has a single responsibility
- **Real-time Feedback**: Progress updates visible to users as each stage completes

## Technology Stack

**Frontend**:
- Next.js 16 with React 19

**Backend**:
- Flask for API endpoints
- Google ADK integration

**Infrastructure**:
- Full-stack JavaScript/Python hybrid application

## Features

✨ **Modern Dashboard** - Visually attractive interface with category-based design
📱 **Responsive Design** - Works seamlessly on mobile, tablet, and desktop
🤖 **AI-Powered Processing** - Claude analyzes and enhances article content
📧 **Email Digests** - Optional email delivery of curated news
🎯 **Time Range Filtering** - Control how recent articles should be
🔄 **Real-time Progress** - Visual pipeline status during background processing
🔗 **Direct Article Links** - One-click access to full articles
