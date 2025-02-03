# Setting up the CI/CD Pipeline

## GitHub Actions Setup

1. Navigate to your GitHub repository
2. Go to Settings > Secrets and variables > Actions
3. Add the following secrets:
   - AWS_ACCESS_KEY_ID
   - AWS_SECRET_ACCESS_KEY

## AWS IAM Setup

1. Create an IAM user for CI/CD with programmatic access
2. Attach the following policies:
   - AWSLambdaFullAccess
   - IAMFullAccess
   - AmazonAPIGatewayAdministrator
   - AmazonDynamoDBFullAccess
   - CloudFormationFullAccess
   - CloudWatchLogsFullAccess

## Workflow Configuration

The workflow is defined in `.github/workflows/deploy.yml` and includes:
- Automatic testing
- Multi-stage deployments
- Infrastructure as Code deployment
- Security best practices