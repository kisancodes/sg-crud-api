# Security Best Practices

This project follows these security best practices:

1. No hardcoded credentials - AWS credentials are managed through IAM roles
2. Environment variables - Sensitive values are passed through environment variables
3. Test configuration - Test data is stored in configuration files
4. IAM least privilege - IAM roles are scoped to minimum required permissions
5. DynamoDB table names - Generated dynamically using service name and stage

## AWS Credentials
- Uses AWS SDK default credential provider chain
- IAM roles defined in serverless.yml
- No hardcoded access keys

## Test Environment
- Test configuration stored in config/test.json
- Environment variables managed through jest.setup.js
- No sensitive data in test files