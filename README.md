# VentAI - The Ultimate Venting Platform

A platform where users can express their frustrations and negative experiences in a sarcastic way, with AI-powered content moderation to ensure safe venting.

## Features

- User authentication and profile management
- Vent posts with sarcasm scoring
- AI-powered content moderation
- Real-time notifications for post deletions
- Text prediction for enhanced venting experience
- Points system for sarcastic content

## Architecture

The platform follows a microservices architecture with the following components:

- Frontend (React + TypeScript)
- User Service
- Post Service
- Content Moderation Service
- Notification Service
- AI Service

## Tech Stack

- Frontend: React, TypeScript, Material-UI
- Backend: Node.js, Express, TypeScript
- Database: PostgreSQL
- Message Queue: RabbitMQ
- Container Orchestration: Kubernetes
- CI/CD: GitHub Actions
- AI/ML: TensorFlow.js, Hugging Face Transformers
- Monitoring: Prometheus, Grafana

## Getting Started

### Prerequisites

- Docker
- Docker Compose
- Node.js (v18+)
- Kubernetes cluster (for production)
- PostgreSQL
- RabbitMQ

### Development Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   # Install frontend dependencies
   cd frontend
   npm install

   # Install backend dependencies
   cd ../backend
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```

4. Start development servers:
   ```bash
   # Start frontend
   cd frontend
   npm run dev

   # Start backend services
   cd ../backend
   docker-compose up
   ```

## Project Structure

```
ventai/
├── frontend/                 # React frontend application
├── backend/
│   ├── user-service/        # User management service
│   ├── post-service/        # Post management service
│   ├── moderation-service/  # Content moderation service
│   ├── notification-service/# Notification service
│   └── ai-service/         # AI/ML service
├── infrastructure/          # Kubernetes and infrastructure configs
├── scripts/                 # Utility scripts
└── docs/                   # Documentation
```