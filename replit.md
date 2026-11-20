# VERDANT AMBIENTAL / VERDANT CONTROL

Produto em português brasileiro com site institucional público e uma área SaaS autenticada para gestão ambiental. Preserve o site institucional ao desenvolver a plataforma.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- A área `/controle` depende de PostgreSQL, Clerk e armazenamento privado para operações documentais.
- Não use dados fictícios nem mostre uma ação como concluída quando o serviço real estiver indisponível.

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/verdant` — site institucional e área autenticada VERDANT CONTROL, em React, TypeScript e Tailwind.
- `artifacts/api-server/src/control` — rotas de empresas, unidades, documentos, obrigações, alertas e registros.
- Briefing completo: `.local/conversation-workspace/files/attached_assets/Pasted--PROMPT-PARA-O-REPLIT-DESENVOLVIMENTO-DE-SITE-INSTITUCI_1795097783956.txt`.

## Architecture decisions

- A área logada usa Clerk com cookies no navegador; as permissões de empresa, unidade e módulo são validadas no servidor.
- Mantenha upload no armazenamento privado e metadados no PostgreSQL. Não substitua armazenamento persistente por disco local ou mocks.
- A análise automática por IA está pausada nesta etapa. Não solicite credenciais em texto nem habilite ações demonstrativas; reative a análise apenas quando o usuário pedir.
- Informações legais e condicionantes extraídas exigem validação humana antes de virarem obrigações.
- O formulário de contato não deve afirmar que enviou uma mensagem sem uma integração real.
- Os dados comerciais e profissionais fictícios do site institucional devem continuar identificados como ilustrativos e centralizados para substituição.

## Product

- O site público contém início, empresa, serviços, tecnologia, equipe técnica, conteúdos, artigos, contato, política de privacidade e termos.
- A área VERDANT CONTROL usa autenticação real e dados persistidos para documentos e registros ambientais.

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
