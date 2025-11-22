<<<<<<< HEAD
# TextMetric Pro

A professional-grade text analyzer tool built with React.js, featuring real-time metrics, frequency analysis, and offline sentiment insights.

## Features

- **Real-time Text Analysis**: Instant calculation of words, characters (with/without spaces), sentences, and paragraphs.
- **Advanced Metrics**: Identifies the most frequent word and the longest word.
- **Local Sentiment Analysis**: A built-in offline algorithm to classify text as Positive, Negative, or Neutral.
- **Responsive Design**: Works seamlessly on desktop and mobile devices.
- **Export Capability**: Export analysis reports to CSV.
- **Docker Ready**: Fully containerized for easy deployment.

## Setup and Installation

### Prerequisites
- Node.js (v18+)
- Docker Desktop

### 1. Local Development (No Docker)

Use this to edit the code and see changes instantly.

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 2. Unit Testing

Run the test suite to ensure the analysis logic is working correctly.

```bash
npm test
```

### 3. Docker Deployment (Production)

This builds a production-ready container using Nginx to serve the app.

**Step 1: Build the Image**
```bash
# The --no-cache flag ensures we use the latest code changes
docker build --no-cache -t text-metric-pro .
```

**Step 2: Run the Container**
```bash
# Map port 8080 on your computer to port 80 inside the container
docker run -d -p 8080:80 text-metric-pro
```

**Step 3: Access the App**
Open [http://localhost:8080](http://localhost:8080) in your browser.

## Project Structure

- **src/components**: Reusable UI components (`StatCard`, `SentimentCard`).
- **src/services**: Core logic (`analyzer.ts`) and sentiment analysis (`localSentiment.ts`).
- **tests**: Unit tests files (`*.test.ts`).
- **Dockerfile**: Configuration for building the production image.
- **nginx.conf**: Server configuration for SPA routing.
=======
# Text-Metric-Pro
A React-based text analyzer that gives detailed metrics like word count, character stats, sentences, paragraphs, most frequent word, and longest word. Designed with a clean interface, strong performance, and full responsiveness. Includes optional sentiment analysis and Docker support.
>>>>>>> c94f72fc86c0f544aa8b07aee3b33f2495db0d81
