# Freepik API Setup Guide

## Getting Your API Key

1. Create a Freepik Account
   - Visit [Freepik.com](https://www.freepik.com)
   - Click "Sign up" and create an account
   - Verify your email address

2. Access the Developer Portal
   - Log in to your Freepik account
   - Visit the [API Documentation](https://developer.freepik.com/)
   - Click "Get API Key"

3. Create an API Key
   - Fill out the required information about your intended API usage
   - Accept the terms of service
   - Your API key will be generated and displayed

## Configuring the MCP Server

1. Locate your MCP settings file:
   - VSCode extension: `~/.vscode/extensions/your-extension/settings/mcp_settings.json`
   - Claude desktop app: `~/Library/Application Support/Claude/claude_desktop_config.json`

2. Add the Freepik MCP server configuration:
   ```json
   {
     "mcpServers": {
       "freepik": {
         "command": "node",
         "args": ["path/to/freepik-mcp/build/index.js"],
         "env": {
           "FREEPIK_API_KEY": "your-api-key-here"
         },
         "disabled": false,
         "autoApprove": []
       }
     }
   }
   ```

3. Replace `your-api-key-here` with your actual Freepik API key

## Security Best Practices

1. Keep your API key secure:
   - Never commit your API key to version control
   - Use environment variables or secure configuration management
   - Rotate your API key periodically

2. Monitor API usage:
   - Keep track of your API consumption
   - Set up alerts for unusual activity
   - Review API logs regularly

3. Rate Limiting:
   - Be aware of Freepik's API rate limits
   - Implement appropriate error handling
   - Cache responses when possible

## Troubleshooting

If you encounter issues:

1. Verify your API key is correct
2. Check your network connection
3. Ensure your API key has the necessary permissions
4. Review Freepik's API documentation for any changes
5. Check the server logs for detailed error messages

For additional help, visit the [Freepik Developer Support](https://developer.freepik.com/support)