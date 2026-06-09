// Servidor de produção (Bun) para Railway.
// Serve os assets estáticos de dist/client e roteia o restante pelo
// handler SSR (dist/server/server.js, um fetch handler web-standard).
import handler from "./dist/server/server.js";

const PORT = Number(process.env.PORT) || 3000;
const CLIENT_DIR = "./dist/client";

const server = Bun.serve({
  port: PORT,
  hostname: "0.0.0.0",
  idleTimeout: 30,
  async fetch(request) {
    const { pathname } = new URL(request.url);

    // Arquivos estáticos do client (assets, robots.txt, etc.) — sem path traversal.
    if (pathname !== "/" && !pathname.includes("..")) {
      const file = Bun.file(CLIENT_DIR + pathname);
      if (await file.exists()) {
        return new Response(file);
      }
    }

    // SSR para o resto.
    return handler.fetch(request, {}, {});
  },
  error(err) {
    console.error(err);
    return new Response("Internal Server Error", { status: 500 });
  },
});

console.log(`Front SSR ouvindo em http://${server.hostname}:${server.port}`);
