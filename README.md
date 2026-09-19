# KAIROS — site oficial

Site em Next.js, React e TypeScript, com animações GSAP, Framer Motion, Three.js e OGL.

## Continuar em outro computador

Instale Git e Node.js 22 LTS (22.13 ou superior). Depois:

```bash
git clone https://github.com/guilhermeavitu1512-ai/kairos-software-house.git
cd kairos-software-house
npm ci
npm run dev
```

Abra http://localhost:3000. Para verificar a versão de produção:

```bash
npm run build
npm start
```

## Configuração privada

A apresentação pública e o briefing via WhatsApp não precisam de credenciais locais. Nunca publique `.env.local` ou tokens.

O código também preserva módulos legados de catálogo/admin. Para usá-los, copie `.env.example` para `.env.local` e configure as credenciais correspondentes com segurança. O repositório **não contém banco de dados, dados administrativos, backups ou credenciais**. Estes dados, se necessários, precisam ser transferidos separadamente por um meio privado.

Se as variáveis estiverem configuradas na Vercel, autentique-se na mesma conta e vincule este diretório ao projeto existente `kairos-software-house`:

```bash
npx vercel login
npx vercel link
npx vercel env pull .env.local
```

## Publicação

Projeto Vercel: `kairos-software-house`. Não vincule ao projeto VYNE.

```bash
npx vercel --prod
```

## Organização

- `app/`: páginas, estilos e rotas.
- `components/kairos/`: componentes do site e animações.
- `data/`: conteúdo editável de serviços, projetos e preços.
- `public/`: imagens, fontes/mídia e arquivos públicos.
- `lib/constants.ts`: dados de contato e WhatsApp.
- `.impeccable/`: decisões de design; instruções mais recentes substituem as anteriores.
- `tests/`: verificações; alguns scripts de navegador precisam de Playwright e variáveis `KAIROS_PLAYWRIGHT`, `KAIROS_BROWSER` e `KAIROS_CAPTURE_DIR`.

Não é necessário instalar skills ou extensões do Codex para executar o site. Scripts antigos de testes refletem etapas anteriores da direção visual; os testes de texto estável e wipes sem zoom representam o comportamento atual.

Esta cópia é independente do repositório VYNE original. O histórico anterior e arquivos temporários da estação antiga não foram publicados.
