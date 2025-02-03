# Pipeline Documentation

This directory contains documentation for the CI/CD pipeline setup and workflow.

## GitHub Actions Workflow

The workflow is triggered on push to the master branch and follows these steps:

1. Checkout code
2. Setup Node.js environment
3. Install dependencies
4. Install Serverless Framework
5. Deploy to Dev environment
6. Deploy to Prod environment (only on master branch)

## Configuration Overview

### Workflow File
`.github/workflows/deploy.yml` contains the pipeline configuration:
- Triggers on push to master
- Uses Node.js 16.x
- Runs on ubuntu-latest
- Handles both dev and prod deployments

### Required Secrets
The following secrets must be configured in GitHub repository settings:
- AWS_ACCESS_KEY_ID
- AWS_SECRET_ACCESS_KEY

### Multi-stage Deployment
The pipeline supports two stages:
- Development (dev)
- Production (prod)

Each stage uses its own DynamoDB table and API Gateway endpoint.