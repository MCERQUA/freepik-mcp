#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';

import { FreepikClient } from './api/client.js';
import { 
  GenerateImageSchema, 
  CheckStatusSchema,
  SearchResourcesSchema,
  GetResourceSchema,
  DownloadResourceSchema
} from './types.js';

const API_KEY = process.env.FREEPIK_API_KEY;
if (!API_KEY) {
  throw new Error('FREEPIK_API_KEY environment variable is required');
}

class FreepikServer {
  private server: Server;
  private client: FreepikClient;

  constructor() {
    this.server = new Server(
      {
        name: 'freepik-mcp',
        version: '0.1.0',
      },
      {
        capabilities: {
          tools: {},
          resources: {},
        },
      }
    );

    this.client = new FreepikClient({ apiKey: API_KEY });

    this.setupToolHandlers();
    
    // Error handling
    this.server.onerror = (error) => console.error('[MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private setupToolHandlers() {
    // List available tools - This is the key method for inspection
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'search_resources',
          description: 'Search for Freepik resources (photos, vectors, PSDs) with filters',
          inputSchema: {
            type: 'object',
            properties: {
              term: {
                type: 'string',
                description: 'Search term'
              },
              limit: {
                type: 'number',
                description: 'Limit results per page (default: 20, max: 200)',
                default: 20,
                maximum: 200
              },
              order: {
                type: 'string',
                enum: ['relevance', 'recent'],
                description: 'Sort order',
                default: 'relevance'
              },
              filters: {
                type: 'object',
                description: 'Optional filters to apply to search results',
                properties: {
                  orientation: {
                    type: 'object',
                    description: 'Filter by image orientation',
                    properties: {
                      landscape: { type: 'boolean', description: 'Include landscape orientation' },
                      portrait: { type: 'boolean', description: 'Include portrait orientation' },
                      square: { type: 'boolean', description: 'Include square orientation' },
                      panoramic: { type: 'boolean', description: 'Include panoramic orientation' }
                    }
                  },
                  content_type: {
                    type: 'object',
                    description: 'Filter by content type',
                    properties: {
                      photo: { type: 'boolean', description: 'Include photos' },
                      psd: { type: 'boolean', description: 'Include PSDs' },
                      vector: { type: 'boolean', description: 'Include vectors' }
                    }
                  },
                  license: {
                    type: 'object',
                    description: 'Filter by license type',
                    properties: {
                      freemium: { type: 'boolean', description: 'Include freemium resources' },
                      premium: { type: 'boolean', description: 'Include premium resources' }
                    }
                  }
                }
              }
            },
            required: ['term']
          }
        },
        {
          name: 'get_resource',
          description: 'Get detailed information about a specific Freepik resource',
          inputSchema: {
            type: 'object',
            properties: {
              id: {
                type: 'number',
                description: 'Resource ID to get details for'
              }
            },
            required: ['id']
          }
        },
        {
          name: 'download_resource',
          description: 'Get download URL for a specific Freepik resource',
          inputSchema: {
            type: 'object',
            properties: {
              id: {
                type: 'number',
                description: 'Resource ID to download'
              }
            },
            required: ['id']
          }
        },
        {
          name: 'generate_image',
          description: 'Generate an AI image using Freepik Mystic (requires Freepik Premium)',
          inputSchema: {
            type: 'object',
            properties: {
              prompt: {
                type: 'string',
                description: 'Text description of the image to generate'
              },
              resolution: {
                type: 'string',
                enum: ['2k', '4k'],
                description: 'Image resolution',
                default: '2k'
              },
              aspect_ratio: {
                type: 'string',
                enum: ['square_1_1', 'classic_4_3', 'traditional_3_4', 'widescreen_16_9', 'social_story_9_16'],
                description: 'Image aspect ratio',
                default: 'square_1_1'
              },
              realism: {
                type: 'boolean',
                description: 'Enable realistic style',
                default: false
              },
              engine: {
                type: 'string',
                enum: ['automatic', 'magnific_illusio', 'magnific_sharpy', 'magnific_sparkle'],
                description: 'AI engine to use',
                default: 'automatic'
              },
              creative_detailing: {
                type: 'number',
                minimum: 0,
                maximum: 100,
                description: 'Level of creative detail (0-100)',
                default: 50
              }
            },
            required: ['prompt']
          }
        },
        {
          name: 'check_status',
          description: 'Check the status of a Freepik Mystic image generation task',
          inputSchema: {
            type: 'object',
            properties: {
              task_id: {
                type: 'string',
                description: 'ID of the generation task to check'
              }
            },
            required: ['task_id']
          }
        },
      ],
    }));

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      try {
        switch (request.params.name) {
          case 'search_resources': {
            const validatedParams = SearchResourcesSchema.parse(request.params.arguments);
            const result = await this.client.searchResources(validatedParams);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(result, null, 2),
                },
              ],
            };
          }

          case 'get_resource': {
            const { id } = GetResourceSchema.parse(request.params.arguments);
            const result = await this.client.getResourceDetails(id);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(result, null, 2),
                },
              ],
            };
          }

          case 'download_resource': {
            const { id } = DownloadResourceSchema.parse(request.params.arguments);
            const result = await this.client.downloadResource(id);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(result, null, 2),
                },
              ],
            };
          }

          case 'generate_image': {
            const validatedParams = GenerateImageSchema.parse(request.params.arguments);
            const result = await this.client.generateImage(validatedParams);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(result, null, 2),
                },
              ],
            };
          }

          case 'check_status': {
            const { task_id } = CheckStatusSchema.parse(request.params.arguments);
            const result = await this.client.checkStatus(task_id);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(result, null, 2),
                },
              ],
            };
          }

          default:
            throw new McpError(
              ErrorCode.MethodNotFound,
              `Unknown tool: ${request.params.name}`
            );
        }
      } catch (error) {
        console.error('[Tool Error]', error);
        return {
          content: [
            {
              type: 'text',
              text: error instanceof Error ? error.message : String(error),
            },
          ],
          isError: true,
        };
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Freepik MCP server running on stdio');
  }
}

const server = new FreepikServer();
server.run().catch(console.error);