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

  // PENDENTE: número do WhatsApp com DDI e DDD, só números.
  // Exemplo: '5511999999999'. Enquanto for null, os botões
  // do WhatsApp levam para a seção de contato.
  whatsapp: null,

  // Mensagem que já aparece escrita quando a pessoa abre o WhatsApp.
  mensagemPadrao:
    'Olá! Vim pelo site da Garcia Web e quero conversar sobre um site para o meu negócio.',

  // PENDENTE: logo PNG com fundo transparente (ou SVG).
  // Coloque o arquivo em assets/ e escreva o caminho aqui,
  // por exemplo: 'assets/logo-garcia-web.png'.
  logo: null,

  // PENDENTE: etiqueta de cada projeto do portfólio.
  // Use 'demonstracao', 'academico' ou 'cliente'. null = pendente.
  projetos: {
    acai: { status: null },
    benedita: { status: null },
    paris6: { status: null },
    inovatech: { status: 'academico' }, // confirmado: projeto acadêmico (TCC)
  },
};
