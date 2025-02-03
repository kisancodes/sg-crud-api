# Serverless CRUD API

This project demonstrates a serverless REST API built with AWS Lambda, API Gateway, and DynamoDB using the Serverless Framework.

## Features

- Serverless architecture using AWS Lambda and API Gateway
- CRUD operations with DynamoDB
- CI/CD pipeline using GitHub Actions
- Multi-stage deployments (dev/prod)
- Infrastructure as Code using Serverless Framework

## API Endpoints

- POST /items - Create a new item
- GET /items - List all items
- GET /items/{id} - Get a specific item
- PUT /items/{id} - Update an item
- DELETE /items/{id} - Delete an item

## Setup and Deployment

1. Install dependencies:
```bash
npm install
```

2. Deploy to dev environment:
```bash
npm run deploy:dev
```

3. Deploy to production:
```bash
npm run deploy:prod
```

## CI/CD Pipeline

The project uses GitHub Actions for continuous deployment. The pipeline is triggered on push to the master branch and deploys to both dev and prod environments.

### Pipeline Configuration

![GitHub Actions Workflow](docs/github-actions-workflow.png)

### Required GitHub Secrets

- AWS_ACCESS_KEY_ID
- AWS_SECRET_ACCESS_KEY

## Project Structure

```
.
├── src/
│   └── handlers/
│       ├── create.js
│       ├── list.js
│       ├── get.js
│       ├── update.js
│       └── delete.js
├── .github/
│   └── workflows/
│       └── deploy.yml
├── serverless.yml
├── package.json
└── README.md
```

## Testing

Run the test suite:
```bash
npm test
```

## Demo

A video demonstration of the application can be found here: [Demo Video Link]