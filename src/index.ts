import { fromHono } from "chanfana";
import { Hono } from "hono";
import { TaskCreate } from "./endpoints/taskCreate";
import { TaskDelete } from "./endpoints/taskDelete";
import { TaskFetch } from "./endpoints/taskFetch";
import { TaskList } from "./endpoints/taskList";
import { MnemonicCreate } from "./endpoints/mnemonic/mnemonic-create";
import { MnemonicDelete } from "./endpoints/mnemonic/mnemonic-delete";
import { MnemonicFetch } from "./endpoints/mnemonic/mnemonic-fetch";
import { MnemonicList } from "./endpoints/mnemonic/mnemonic-list";

// Start a Hono app
const app = new Hono<{ Bindings: Env }>();

// Setup OpenAPI registry
const openapi = fromHono(app, {
  docs_url: "/",
});

// Register OpenAPI endpoints
openapi.get("/api/tasks", TaskList);
openapi.post("/api/tasks", TaskCreate);
openapi.get("/api/tasks/:taskSlug", TaskFetch);
openapi.delete("/api/tasks/:taskSlug", TaskDelete);

openapi.get("/api/mnemonics", MnemonicList);
openapi.post("/api/mnemonics", MnemonicCreate);
openapi.get("/api/mnemonics/:id", MnemonicFetch);
openapi.delete("/api/mnemonics/:id", MnemonicDelete);

// You may also register routes for non OpenAPI directly on Hono
// app.get('/test', (c) => c.text('Hono!'))

// Export the Hono app
export default app;
