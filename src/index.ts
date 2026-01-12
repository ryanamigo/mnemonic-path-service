import { fromHono } from "chanfana";
import { Hono } from "hono";
import { MnemonicCreate } from "./endpoints/mnemonic/mnemonic-create";
import { MnemonicDelete } from "./endpoints/mnemonic/mnemonic-delete";
import { MnemonicFetch } from "./endpoints/mnemonic/mnemonic-fetch";
import { MnemonicList } from "./endpoints/mnemonic/mnemonic-list";
import { Presign } from "./endpoints/bucket/presign";
import { Login } from "./endpoints/auth/login";

// Start a Hono app
const app = new Hono<{ Bindings: Env }>();

// Setup OpenAPI registry
const openapi = fromHono(app, {
  docs_url: "/",
});

openapi.get("/api/mnemonics", MnemonicList);
openapi.post("/api/mnemonics", MnemonicCreate);
openapi.get("/api/mnemonics/:id", MnemonicFetch);
openapi.delete("/api/mnemonics/:id", MnemonicDelete);

openapi.get("/api/bucket/presign", Presign);
openapi.post("/api/auth/login", Login);

// You may also register routes for non OpenAPI directly on Hono
// app.get('/test', (c) => c.text('Hono!'))

// Export the Hono app
export default app;
