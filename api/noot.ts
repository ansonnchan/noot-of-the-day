import type { IncomingMessage, ServerResponse } from "node:http";
import { requestBoatmanFact } from "../server/boatmanProxy.js";

export default async function handler(
  request: IncomingMessage,
  response: ServerResponse,
) {
  if (request.method !== "GET") {
    response.statusCode = 405;
    response.setHeader("Allow", "GET");
    response.end(JSON.stringify({ success: false }));
    return;
  }

  try {
    const data = await requestBoatmanFact();
    response.statusCode = 200;
    response.setHeader("Content-Type", "application/json; charset=utf-8");
    response.setHeader("Cache-Control", "no-store");
    response.end(JSON.stringify(data));
  } catch {
    response.statusCode = 502;
    response.setHeader("Content-Type", "application/json; charset=utf-8");
    response.setHeader("Cache-Control", "no-store");
    response.end(JSON.stringify({ success: false }));
  }
}

