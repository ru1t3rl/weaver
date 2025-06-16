import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function generateApiClient(): Promise<void> {
    // Get API URL from environment variable set by Aspire
    const apiUrl = import.meta.env.services__webapi__http__0 || 'http://localhost:5532';

    try {
        console.log(`Generating API client from: ${apiUrl}/openapi/v1.json`);
        
        await execAsync(
            `curl ${apiUrl}/openapi/v1.json | jq '.' > openapi.json`    
        );

        const { stdout, stderr } = await execAsync(
            `orval --config src/orval.config.ts`
        );

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

// Execute the function
generateApiClient();