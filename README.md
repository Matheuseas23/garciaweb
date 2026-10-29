# Site oficial da Garcia Web

Página única em HTML, CSS e JavaScript puros. Sem instalação: as bibliotecas de animação (GSAP 3.15.0 + ScrollTrigger) são carregadas da CDN jsDelivr pelo `js/main.js`. Se a CDN falhar ou demorar, a página aparece completa, só que parada.

## Como abrir
Dê dois cliques em `index.html` (abre no navegador) ou use a extensão Live Server.

## Onde editar
- **`js/config.js`**: frase do início, número do WhatsApp, logo e etiqueta de cada projeto. Os itens marcados como PENDENTE aparecem no painel "Pendências" enquanto `MODO_RASCUNHO` for `true`.
- `css/estilos.css`: visual (cores e fontes ficam nos tokens do topo do arquivo).
- `js/main.js`: comportamento (menu, configurações, animações).

## Testes automáticos
Abrir com `?teste` (ex.: `index.html?teste&rolar=600`) grava medidas num `<script id="resultado-teste">`: rolagem lateral, seção ativa, estado das animações. Usado pelo Claude com o Chrome em modo invisível; não muda nada para o visitante.

## Etapas
1. Auditoria ✅
2. Estrutura e identidade ✅
3. Hero e animações ✅
4. Portfólio ao vivo (iframes)
5. Serviços, processo e dúvidas
6. Contato e rodapé
7. Revisão geral e publicação na Vercel
