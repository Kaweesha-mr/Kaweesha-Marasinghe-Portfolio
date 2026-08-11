import assert from "node:assert/strict";
import { access } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    {
      ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
    },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders Kaweesha's portfolio", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Kaweesha Marasinghe — Software Engineer<\/title>/i);
  assert.match(html, /Software engineer building/);
  assert.match(html, /Switchgear \/ ADMS/);
  assert.match(html, /NEXA Platform/);
  assert.match(html, /Synapse CI/);
  assert.match(html, /kaweesha\.mr@gmail\.com/);
  assert.match(html, /Kaweesha-Marasinghe-Resume-2\.pdf/);
  assert.doesNotMatch(html, /Your site is taking shape|codex-preview|react-loading-skeleton/i);
});

test("portfolio assets exist", async () => {
  await access(new URL("../public/images/kaweesha-avatar.png", import.meta.url));
  await access(new URL("../public/Kaweesha-Marasinghe-Resume-2.pdf", import.meta.url));
});
