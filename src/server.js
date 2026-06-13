import "./config/env.js";
import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";
import app from "./app.js";

async function start() {
  await connectDB();
  app.listen(env.port, () => {
    console.log(`Servidor corriendo en el puerto: ${env.port}`);
    console.log(`Swagger corriendo en el puerto: ${env.port}/api/docs`);
  });
}

start().catch((err) => {
  console.error("El servidor fallo al inicializar:", err);
  process.exit(1);
});
