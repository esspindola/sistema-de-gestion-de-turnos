import swaggerJsdoc from "swagger-jsdoc";
import { env } from "./env.js";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Sistema de Turnos Médicos API",
      version: "1.0",
      description:
        "API REST para gestión de turnos médicos con autenticación JWT y control de roles",
    },
    servers: [{ url: `http://localhost:${env.port}/api` }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./src/modules/**/*.routes.js"],
};

export const swaggerSpec = swaggerJsdoc(options);
