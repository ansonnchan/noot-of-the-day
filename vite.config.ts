import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { requestBoatmanFact } from "./server/boatmanProxy.ts";

export default defineConfig({
  plugins: [
    react(),
    {
      name: "boatman-development-proxy",
      configureServer(server) {
        server.middlewares.use("/api/noot", async (request, response) => {
          if (request.method !== "GET") {
            response.statusCode = 405;
            response.end(JSON.stringify({ success: false }));
            return;
          }

          try {
            const data = await requestBoatmanFact();
            response.statusCode = 200;
            response.setHeader("Content-Type", "application/json; charset=utf-8");
            response.end(JSON.stringify(data));
          } catch {
            response.statusCode = 502;
            response.setHeader("Content-Type", "application/json; charset=utf-8");
            response.end(JSON.stringify({ success: false }));
          }
        });
      },
    },
  ],
});
