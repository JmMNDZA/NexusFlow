const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'NexusFlow API',
      version: '1.0.0',
      description: 'Complete API documentation for NexusFlow - Web-based Collaborative Task and Project Management Tool'
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      },
      {
        url: 'http://localhost:5000',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            role: { type: 'string', enum: ['admin', 'member'] },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Project: {
          type: 'object',
          required: ['title', 'owner'],
          properties: {
            _id: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            owner: { $ref: '#/components/schemas/User' },
            status: { type: 'string', enum: ['active', 'completed', 'archived'] },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Task: {
          type: 'object',
          required: ['projectId', 'taskName'],
          properties: {
            _id: { type: 'string' },
            projectId: { type: 'string' },
            taskName: { type: 'string' },
            description: { type: 'string' },
            assignedTo: { $ref: '#/components/schemas/User' },
            priority: { type: 'string', enum: ['Low', 'Medium', 'High'] },
            status: { type: 'string', enum: ['todo', 'in-progress', 'completed'] },
            dueDate: { type: 'string', format: 'date' },
            subTasks: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  completed: { type: 'boolean' },
                  assignedTo: { type: 'string' }
                }
              }
            }
          }
        },
        Comment: {
          type: 'object',
          required: ['taskId', 'content'],
          properties: {
            _id: { type: 'string' },
            taskId: { type: 'string' },
            author: { $ref: '#/components/schemas/User' },
            content: { type: 'string' },
            mentionedUsers: { type: 'array', items: { $ref: '#/components/schemas/User' } },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Attachment: {
          type: 'object',
          required: ['taskId', 'fileName', 'fileUrl', 'fileType'],
          properties: {
            _id: { type: 'string' },
            taskId: { type: 'string' },
            fileName: { type: 'string' },
            fileUrl: { type: 'string' },
            fileType: { type: 'string' },
            uploadedBy: { $ref: '#/components/schemas/User' },
            fileSize: { type: 'number' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Workspace: {
          type: 'object',
          required: ['name', 'owner'],
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            owner: { $ref: '#/components/schemas/User' },
            members: { type: 'array', items: { $ref: '#/components/schemas/User' } },
            projects: { type: 'array', items: { $ref: '#/components/schemas/Project' } },
            isActive: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        }
      }
    },
    security: [{ BearerAuth: [] }]
  },
  apis: ['./routes/*.js', './controllers/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
