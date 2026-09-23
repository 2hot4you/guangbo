import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const transport = new StdioClientTransport({
  command: "npx",
  args: ["-y", "@heroui/react-mcp@latest"],
});
const client = new Client({ name: "guangbo-heroui-verifier", version: "1.0.0" });

await client.connect(transport);
try {
  const listed = await client.listTools();
  const names = new Set(listed.tools.map((tool) => tool.name));
  for (const required of ["list_components", "get_component_docs"]) {
    if (!names.has(required)) throw new Error(`Missing HeroUI MCP tool: ${required}`);
  }

  const components = await client.callTool({ name: "list_components", arguments: {} });
  const componentText = components.content.map((item) => item.text ?? "").join("\n");
  if (components.isError || !componentText.includes("Button")) {
    throw new Error("HeroUI component list is empty");
  }

  const docsTool = listed.tools.find((tool) => tool.name === "get_component_docs");
  const props = docsTool.inputSchema.properties ?? {};
  const argumentsForDocs = "components" in props
    ? { components: ["Button"] }
    : "component_names" in props
      ? { component_names: ["Button"] }
      : { component: "Button" };
  const docs = await client.callTool({ name: "get_component_docs", arguments: argumentsForDocs });
  const docsText = docs.content.map((item) => item.text ?? "").join("\n");
  if (docs.isError || !docsText.includes("# Button")) {
    throw new Error("HeroUI Button docs are empty");
  }

  console.log(`HeroUI MCP verified: ${listed.tools.length} tools; component list and Button docs returned content.`);
  console.log(`Tools: ${listed.tools.map((tool) => tool.name).join(", ")}`);
  console.log(`list_components input schema: ${JSON.stringify(listed.tools.find((tool) => tool.name === "list_components").inputSchema)}`);
  console.log(`get_component_docs input schema: ${JSON.stringify(docsTool.inputSchema)}`);
  console.log(`list_components content blocks: ${components.content.length}; Button present: true`);
  console.log(`Button docs content blocks: ${docs.content.length}; markdown heading present: true`);
} finally {
  await client.close();
}
