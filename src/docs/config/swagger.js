import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Vehicle Management API',
      version: '1.0.0',
      description: 'API para gerenciamento de veículos'
    },
    tags: [
      {
        name: 'Health',
        description: 'Rota de verificação de saúde da API'
      },
      {
        name: 'Vehicles',
        description: 'Rotas relacionadas a vendas de veículos'
      },
    ],
    servers: [
      {
        url: "http://localhost:" + process.env.PORT + "/api"
      }
    ]
  },
  apis: ['./src/docs/*.js']
};

export const swaggerSpec = swaggerJsdoc(options);