# AI Answer Evaluation Tests

A Playwright and TypeScript project for automated evaluation of AI responses using the OpenAI API.

## Project Structure

- `src/` - source code
    - `ai/` - clients and services for working with the OpenAI API
    - `evaluation/` - response evaluation logic (AI Judge)
- `tests/ai/` - automated tests for validating response quality
- `test-data/ai/` - test data and prompts in JSON format
- `playwright.config.ts` - Playwright configuration

## Requirements

- Node.js (v18+ recommended)
- OpenAI API key

## Installation

1. Install dependencies:
```bash
npm install
```

2. Install Playwright browsers:
```bash
npx playwright install chromium
```

## Configuration

Create a .env file in the project root and add your OpenAI key:
```env
OPENAI_API_KEY=your_api_key_here
```

## Running Tests

- Run all tests:
```bash
npm test
```

- Run only AI tests:
```bash
npm run test:ai
```

- Run tests in UI mode:
```bash
npx playwright test --ui
```

- View the report:
```bash
npm run report
```
