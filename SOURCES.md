# Official Sources Registry

**Team principle — official sources first.** For any framework / library / API / CLI / cloud-service specifics, no agent answers from training data. Resolve it through the official MCP, skill, or plugin below. Prefer first-party sources over third-party blogs. Training data is a starting hypothesis to verify, never the answer.

Agents: consult the row for the stack you're working in. The PM (`engineering-team`) uses this table to route and to wire any newly-minted specialist to its official source.

| Stack / domain | Official source (use this) | How |
|---|---|---|
| **Any library/framework/API** (universal fallback) | **Context7 MCP** | `resolve-library-id` → `query-docs`. Their global rule already mandates this. |
| **Svelte / SvelteKit** | **Svelte MCP** + `svelte:*` skills | `mcp__svelte__list-sections` → `get-documentation`; validate with `svelte-autofixer`; `svelte:svelte-core-bestpractices`. Optional `svelte:svelte-file-editor` agent. |
| **React Router 7** (framework mode, ex-Remix) | **Context7** (`react-router` v7) | API changed hard from Remix/RR6 — always verify loaders/actions/typegen. |
| **Postgres + drivers** (Drizzle / Prisma / postgres.js / pg / Kysely) | **Context7** | Resolve the exact driver id before writing queries/migrations. |
| **Auth** (Better Auth) | **Better Auth MCP** | `mcp__better-auth__search_docs` → `get_doc`. |
| **Vercel** (deploy, AI SDK, Next, Functions, Workflow, AI Gateway) | **`vercel:*` skills** + Vercel MCP | e.g. `vercel:ai-sdk`, `vercel:nextjs`, `vercel:deployments-cicd`, `vercel:vercel-cli`. |
| **Sanity CMS** | **`sanity:*` skills** + Sanity MCP | `sanity:sanity-best-practices`, `get_schema` before querying. |
| **Cloudflare** (Workers, D1, KV, R2, Hyperdrive) | **Cloudflare MCP** | `mcp__claude_ai_Cloudflare_Developer_Platform__*` + `search_cloudflare_documentation`. |
| **Integrations** (Linear, Notion, Drive, PayPal, Stripe) | their **official MCP** | Use the connected MCP server, not scraped docs. |
| **Astro** *(planned specialist)* | **Context7** (`astro`) + astro docs | Until a dedicated `astro-builder` exists, use the general path + Context7. |

**When a stack has no row:** use Context7 as the fallback, and tell the PM so it can add a row here (and, if the stack recurs, recommend minting a dedicated specialist — see `ROSTER.md`).
