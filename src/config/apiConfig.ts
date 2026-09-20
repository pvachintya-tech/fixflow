// FixFlow API Configuration
// TODO: Replace placeholder values with actual AWS credentials and endpoints

export const API_CONFIG = {
  // Amazon API Gateway endpoint for FixFlow backend
  bedrockEndpoint: 'https://YOUR_API_GATEWAY_URL/api/v1',

  // API Key for authentication
  apiKey: 'YOUR_API_KEY_HERE',

  // AWS Region
  region: 'us-east-1',

  // Amazon Bedrock model ID for complaint analysis
  modelId: 'anthropic.claude-3-sonnet-20240229-v1:0',

  // Amazon Titan Embeddings model for semantic search
  embeddingsModelId: 'amazon.titan-embed-text-v2:0',

  // OpenSearch endpoint for vector search
  openSearchEndpoint: 'https://YOUR_OPENSEARCH_ENDPOINT',

  // Feature flags
  useMockData: true, // Set to false when backend is connected
};
