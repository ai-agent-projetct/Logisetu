/**
 * Dev server for the LogiSetu site.
 *
 * This machine has no native PHP, and php.net is unreachable from here, so the
 * site is served by real PHP 8.3 compiled to WebAssembly (@php-wasm/node).
 * The project directory is mounted into the PHP filesystem, so edits to .php
 * files are picked up without restarting.
 *
 *   node .tools/serve.mjs [port]
 */

import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

import { loadNodeRuntime, createNodeFsMountHandler } from '@php-wasm/node';
import { PHP, PHPRequestHandler } from '@php-wasm/universal';

const PORT = Number(process.argv[2] ?? 8000);
const PROJECT = path.resolve(fileURLToPath(new URL('..', import.meta.url)), 'logisetu');
const DOCROOT = '/var/www';

// processId has no default outside php-wasm's own test suite; it only needs to
// be unique per worker, and this server runs a single PHP instance.
const runtime = await loadNodeRuntime('8.3', {
  emscriptenOptions: { processId: 1 },
});

const php = new PHP(runtime);

php.mkdir(DOCROOT);
await php.mount(DOCROOT, createNodeFsMountHandler(PROJECT));

const handler = new PHPRequestHandler({
  php,
  documentRoot: DOCROOT,
  absoluteUrl: `http://localhost:${PORT}`,
});

const server = createServer(async (req, res) => {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);

  // PHPRequestHeaders is Record<string, string> — Node gives us arrays for
  // repeated headers, so collapse those the way HTTP does.
  const headers = {};
  for (const [key, value] of Object.entries(req.headers)) {
    headers[key] = Array.isArray(value) ? value.join(', ') : String(value);
  }

  try {
    const response = await handler.request({
      url: req.url,
      method: req.method,
      headers,
      body: chunks.length ? new Uint8Array(Buffer.concat(chunks)) : undefined,
    });

    res.writeHead(response.httpStatusCode, response.headers);
    res.end(Buffer.from(response.bytes));

    const flag = response.httpStatusCode >= 400 ? ' <-- ' : '  ';
    console.log(`${response.httpStatusCode}${flag}${req.method} ${req.url}`);
  } catch (error) {
    console.error(`500     ${req.method} ${req.url}\n`, error);
    res.writeHead(500, { 'content-type': 'text/plain' });
    res.end(String(error?.stack ?? error));
  }
});

server.listen(PORT, () => {
  console.log(`LogiSetu running on http://localhost:${PORT}`);
  console.log(`Serving ${PROJECT} via PHP ${php.phpVersion ?? '8.3'} (wasm)`);
});
