# VERDANT AMBIENTAL

Site institucional em português brasileiro para uma consultoria ambiental fictícia, com apresentação comercial do futuro VERDANT CONTROL.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- O site institucional não requer banco de dados, autenticação ou serviços externos.

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/verdant` — site institucional React, TypeScript e Tailwind, servido na raiz.
- Briefing completo: `.local/conversation-workspace/files/attached_assets/Pasted--PROMPT-PARA-O-REPLIT-DESENVOLVIMENTO-DE-SITE-INSTITUCI_1795097783956.txt`.

## Architecture decisions

- Esta etapa é exclusivamente institucional e de apresentação comercial. Não implementar o software SaaS, banco, IA, envio de e-mail, upload ou autenticação real.
- Login e formulário de contato devem informar claramente a ausência de integração. Nunca simular autenticação ou envio bem-sucedido, nem armazenar senhas.
- Os dados comerciais e profissionais são fictícios, devem ser identificados como ilustrativos e ficar centralizados para substituição.

## Product

- Início, empresa, serviços, tecnologia, equipe técnica, conteúdos, artigos, contato, login, política de privacidade, termos e página não encontrada.
- VERDANT CONTROL é um produto futuro: demonstrar visualmente dashboard, documentos, calendário, condicionantes e alertas.

## User preferences

- Respeitar o briefing integral, não entregar apenas uma landing page.
- Identidade premium corporativa, com predominância de branco e verde-claro; cores #B7DCC3, #39845B, #194D36, #FFFFFF, #F5F9F6 e #58645D.
- Não inventar clientes, depoimentos, resultados, anos de experiência, certificações ou registros profissionais.
- Não prometer aprovação de licenças ou resultados garantidos. Quando aplicável, indicar profissionais habilitados e parceiros técnicos especializados.
- Informações legais e técnicas relevantes e resultados futuros de IA requerem validação humana.

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
