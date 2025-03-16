# Freepik MCP Server

An MCP server implementation for interacting with Freepik's API, providing access to stock photos and Mystic AI image generation capabilities.

## Features

- Search Freepik resources (photos, vectors, PSDs)
- Get detailed resource information
- Download resources
- Generate images using Mystic AI
- Check image generation status

## Prerequisites

- Node.js 18 or higher
- A Freepik API key (see [API Setup Guide](docs/API_SETUP.md))

## Installation

```bash
# Create a new directory for your MCP servers
mkdir mcp-servers
cd mcp-servers

# Clone the repository
git clone https://github.com/MCERQUA/freepik-mcp.git
cd freepik-mcp

# Install dependencies
npm install

# Build the server
npm run build
```

## Configuration

1. First, obtain your Freepik API key by following the instructions in [API_SETUP.md](docs/API_SETUP.md)

2. Add the server to your MCP settings file:

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

## Available Tools

### search_resources
Search for Freepik resources with various filters:
```typescript
{
  term?: string;          // Search term
  limit?: number;         // Results per page
  order?: 'relevance' | 'recent';
  filters?: {
    orientation?: {
      landscape?: boolean;
      portrait?: boolean;
      square?: boolean;
      panoramic?: boolean;
    };
    content_type?: {
      photo?: boolean;
      psd?: boolean;
      vector?: boolean;
    };
    license?: {
      freemium?: boolean;
      premium?: boolean;
    };
  };
}
```

### get_resource
Get detailed information about a specific resource:
```typescript
{
  id: number;  // Resource ID to get details for
}
```

### download_resource
Get download URL for a specific resource:
```typescript
{
  id: number;  // Resource ID to download
}
```

### generate_image
Generate an image using Freepik Mystic AI:
```typescript
{
  prompt: string;         // Text description of the image to generate
  resolution?: '2k' | '4k';
  aspect_ratio?: 'square_1_1' | 'classic_4_3' | 'traditional_3_4' | 
                 'widescreen_16_9' | 'social_story_9_16';
  realism?: boolean;      // Enable realistic style
  engine?: 'automatic' | 'magnific_illusio' | 'magnific_sharpy' | 'magnific_sparkle';
  creative_detailing?: number;  // 0-100
}
```

### check_status
Check the status of a Mystic image generation task:
```typescript
{
  task_id: string;  // ID of the generation task to check
}
```

## Development

```bash
# Install dependencies
npm install

# Build the server
npm run build

# Run in development mode
npm run dev
```

## Error Handling

The server implements comprehensive error handling:

- API errors are logged with detailed information
- Input validation using Zod schemas
- Proper error responses with context
- Rate limiting awareness

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT
