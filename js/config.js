/* =========================================================
   CONFIGURAÇÃO DO SITE DA GARCIA WEB
   ---------------------------------------------------------
   Edite SÓ este arquivo para trocar a frase do início, o
   número do WhatsApp, a logo e as etiquetas dos projetos.
   Se algum valor virar null, ele aparece no painel
   "Pendências" (com MODO_RASCUNHO: true).
   ========================================================= */
window.GARCIA = {
  // Mostra o painel "Pendências" no canto da tela.
  // Deixe false no site publicado (desligado em 29/10: nada pendente).
  MODO_RASCUNHO: false,

  // Rolagem suave (Lenis). Desligada: a rolagem normal do
  // navegador funciona melhor com os iframes e no celular.
  USAR_LENIS: false,

  // Frase do início (confirmada em 29/10). Cada item é uma linha, que sobe
  // sozinha na abertura. tom: 'apagado' = cinza; *entre asteriscos* = laranja.
  heroFrase: [
    { texto: 'Não criamos sites.', tom: 'apagado' },
    { texto: 'Criamos *presença digital*.' },
  ],
  heroFraseConfirmada: true,

  heroSubtitulo:
    'Sites personalizados para negócios de São Paulo, do primeiro rascunho à publicação, com contato direto com quem faz o seu site.',

  // Número do WhatsApp com DDI e DDD, só números (confirmado em 29/10).
  // Se virar null, os botões do WhatsApp levam para a seção de contato.
  whatsapp: '5511978854658',

  // Mensagem que já aparece escrita quando a pessoa abre o WhatsApp.
  mensagemPadrao:
    'Olá! Vim pelo site da Garcia Web e quero conversar sobre um site para o meu negócio.',

  // Logo com fundo transparente: arquivo original do Matheus, sem alteração.
  logo: 'assets/logo-garcia-web-transparente-HD.png',
  // Largura e altura do arquivo, em px (reserva o espaço e a página não "pula").
  logoTamanho: [2454, 1328],

  // Etiqueta de cada projeto do portfólio:
  // 'demonstracao', 'academico' ou 'cliente'. null = pendente.
  projetos: {
    acai: { status: 'cliente' },      // confirmado em 29/10
    benedita: { status: 'cliente' },  // confirmado em 29/10
    paris6: { status: 'cliente' },    // confirmado em 29/10
    inovatech: { status: 'academico' }, // projeto acadêmico (TCC)
  },
};
