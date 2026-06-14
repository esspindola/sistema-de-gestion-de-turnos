import "dotenv/config";

const required = ["PORT", "MONGO_URI", "JWT_SECRET", "JWT_EXPIRES_IN"];

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Faltan variables de entorno requeridas: ${key}`);
  }
}

export const env = {
  port: process.env.PORT,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN,
};
