# Site oficial da Garcia Web

Página única em HTML, CSS e JavaScript puros. Sem instalação: as bibliotecas de animação (GSAP 3.15.0 + ScrollTrigger) são carregadas da CDN jsDelivr pelo `js/main.js`. Se a CDN falhar ou demorar, a página aparece completa, só que parada.

## Como abrir
- **Go Live (Live Server):** clique em "Go Live" na barra de baixo do editor. Abre em `http://127.0.0.1:5500/`. Funciona com a pasta `Garcia web` aberta (o `.vscode/settings.json` de lá aponta a raiz do servidor para `site/`) ou com a pasta `site` aberta direto.
- Dois cliques em `index.html` também abrem, mas a página 404 só funciona pelo Live Server ou publicada.

## Onde editar
- **`js/config.js`**: frase do início, número do WhatsApp, logo e etiqueta de cada projeto. Um valor `null` aparece no painel "Pendências" se `MODO_RASCUNHO` for `true` (no site publicado, deixe `false`).
- Textos de serviços, processo, perguntas frequentes e contato: direto no `index.html` (seções `#servicos`, `#processo`, `#duvidas` e `#contato`).
- `css/estilos.css`: visual (cores e fontes ficam nos tokens do topo do arquivo).
- `js/main.js`: comportamento (configurações, formulário, menu, portfólio ao vivo, animações).
- Para trocar ou acrescentar um projeto do portfólio: copie um `<article class="projeto">` no `index.html` e mude `data-projeto`, `data-url`, o nome e os links; a etiqueta fica no `js/config.js`. O site precisa aceitar ser exibido dentro de outro site (sem `X-Frame-Options: SAMEORIGIN`).

## Formulário de contato
Não envia nada para servidor nenhum: monta a mensagem (nome, negócio, tipo de site, Instagram, recado) e abre o WhatsApp com ela escrita. A pessoa decide se envia. Sem custo e sem banco de dados.

## Arquivos de publicação
- `favicon.ico`, `assets/icone-32.png`, `assets/icone-180.png` (iPhone): logo original reduzida sobre o fundo `#0D0E13`.
- `assets/compartilhar.png` (1200 × 630): imagem da prévia do link no WhatsApp/Instagram.
- `404.html`, `robots.txt`, `vercel.json` (cache das imagens + cabeçalhos de segurança), `.vercelignore`.

## Publicar na Vercel
1. Subir esta pasta (`site/`) para um repositório no GitHub.
2. Na Vercel: **Add New → Project → Import** o repositório. Framework: **Other**. Sem comando de build.
3. Depois de publicado, no `index.html`, trocar `content="assets/compartilhar.png"` (tag `og:image`) pelo endereço completo, ex.: `https://SEU-ENDERECO/assets/compartilhar.png`. Sem isso, a prévia do link no WhatsApp pode sair sem imagem.
4. Testar: abrir no celular, mandar o link para si mesmo no WhatsApp (ver a prévia), testar o formulário e o PageSpeed (https://pagespeed.web.dev/).

## Testes automáticos
Abrir com `?teste` (ex.: `index.html?teste&rolar=600`) grava medidas num `<script id="resultado-teste">`: rolagem lateral, seção ativa, estado das animações e do formulário (`&form=vazio` / `&form=cheio`). Usado pelo Claude com o Chrome em modo invisível; não muda nada para o visitante (no teste, o formulário não abre o WhatsApp).

## Etapas
1. Auditoria ✅
2. Estrutura e identidade ✅
3. Hero e animações ✅
4. Portfólio ao vivo (iframes) ✅
5. Serviços, processo e dúvidas ✅
6. Contato e rodapé ✅
7. Revisão geral ✅ · publicação na Vercel: aguardando o GitHub/Vercel do Matheus
