/* =========================================================
   CONFIGURAÇÃO DO SITE DA GARCIA WEB
   ---------------------------------------------------------
   Edite SÓ este arquivo para trocar a frase do início, o
   número do WhatsApp, a logo e as etiquetas dos projetos.
   Tudo o que está marcado como PENDENTE ainda precisa de
   resposta do Matheus antes de publicar.
   ========================================================= */
window.GARCIA = {
  // Mostra o painel "Pendências" no canto da tela.
  // Deixe false antes de publicar.
  MODO_RASCUNHO: true,

  // Rolagem suave (Lenis). Desligada: a rolagem normal do
  // navegador funciona melhor com os iframes e no celular.
  USAR_LENIS: false,

  // PENDENTE: frase do início. Cada item é uma linha;
  // cada linha fica um tom mais apagada que a anterior.
  heroFrase: ['Seu negócio', 'merece um site', 'à altura.'],
  // Troque para true quando a frase for a definitiva.
  heroFraseConfirmada: false,

  heroSubtitulo:
    'Sites personalizados para negócios de São Paulo, do primeiro rascunho à publicação, com contato direto comigo.',

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
