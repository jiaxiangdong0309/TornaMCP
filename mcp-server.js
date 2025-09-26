#!/usr/bin/env node

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} = require('@modelcontextprotocol/sdk/types.js');

// 导入你的Torna服务
const {
  getApiDocsByName,
  getAllApiDocs,
  getApiDocDetail,
} = require('./src/services/tornaService');

class TornaMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'torna-mcp',
        version: '0.1.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
  }

  setupToolHandlers() {
    // 列出可用工具
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'get_torna_api_docs',
            description: '获取Torna中的API接口文档信息',
            inputSchema: {
              type: 'object',
              properties: {
                apiName: {
                  type: 'string',
                  description: 'API名称或关键词',
                },
                projectId: {
                  type: 'string',
                  description: '可选，Torna项目ID',
                },
              },
              required: ['apiName'],
            },
          },
          {
            name: 'list_all_torna_apis',
            description: '列出所有可用的Torna API接口',
            inputSchema: {
              type: 'object',
              properties: {
                projectId: {
                  type: 'string',
                  description: '可选，Torna项目ID',
                },
                limit: {
                  type: 'number',
                  description: '可选，限制返回的API数量',
                },
              },
              required: [],
            },
          },
          {
            name: 'get_torna_api_detail',
            description: '获取特定API的详细信息',
            inputSchema: {
              type: 'object',
              properties: {
                apiId: {
                  type: 'string',
                  description: 'API的唯一标识符',
                },
                projectId: {
                  type: 'string',
                  description: '可选，Torna项目ID',
                },
              },
              required: ['apiId'],
            },
          },
        ],
      };
    });

    // 处理工具调用
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'get_torna_api_docs':
            const apiDocs = await getApiDocsByName(args.apiName, args.projectId);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(apiDocs, null, 2),
                },
              ],
            };

          case 'list_all_torna_apis':
            const allApis = await getAllApiDocs(args.projectId, args.limit);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(allApis, null, 2),
                },
              ],
            };

          case 'get_torna_api_detail':
            const apiDetail = await getApiDocDetail(args.apiId, args.projectId);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(apiDetail, null, 2),
                },
              ],
            };

          default:
            throw new Error(`未知的工具: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `错误: ${error.message}`,
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
    console.error('Torna MCP服务器已启动');
  }
}

const server = new TornaMCPServer();
server.run().catch(console.error);
