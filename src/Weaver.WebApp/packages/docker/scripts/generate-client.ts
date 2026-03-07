import { exec } from 'child_process';
import { writeFileSync } from 'fs';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function generateApiClient(): Promise<void> {
  // Get API URL from environment variable set by Aspire
  const apiUrl = import.meta.env.services__webapi__http__0 || 'http://localhost:5297';

  console.log(`Generating API client from: ${apiUrl}/openapi/v1.json`);

  const openApiResponse = await downloadOpenapiJson(apiUrl);
  await writeToFile(openApiResponse);

  try {
    const { stdout, stderr } = await execAsync(`orval --config src/orval.config.ts`);

    if (stderr) {
      console.warn('Warning:', stderr);
    }

    console.log('API client generated successfully');
    if (stdout) {
      console.log(stdout);
    }
  } catch (error) {
    console.error('Failed to generate API client:', error);
    process.exit(1);
  }
}

async function downloadOpenapiJson(apiUrl: string): Promise<string> {
  let openApiResponse: string;

  console.log('Fetching OpenAPI specification...');
  try {
    const response = await fetch(`${apiUrl}/openapi/v1.json`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    openApiResponse = await response.text();
  } catch (error) {
    throw new Error(`Failed to fetch OpenAPI spec: ${error}`);
  }

  return openApiResponse;
}

async function writeToFile(openApi: string): Promise<void> {
  try {
    const parsedJson = JSON.parse(openApi);

    writeFileSync('openapi.json', JSON.stringify(parsedJson, null, 2));
    console.log('OpenAPI spec saved to openapi.json');
  } catch (error) {
    console.error('Response is not valid JSON:');
    console.error('First 500 characters of response:', openApi.substring(0, 500));
    throw new Error(`Invalid JSON response from OpenAPI endpoint: ${error}`);
  }
}

// Execute the function
generateApiClient();
