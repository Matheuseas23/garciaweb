/* ==========================================================
   GARCIA WEB — comportamento da página
   Etapa 2: configurações (config.js), menu com marcador
   de seção ativa e painel de pendências.
   ========================================================== */
(() => {
  'use strict';

  const cfg = window.GARCIA || {};
  const raiz = document.documentElement;
  const $$ = (seletor, base = document) => Array.from(base.querySelectorAll(seletor));

  /* ---------- 1. Textos e dados do config.js ---------- */
  function aplicarConfig() {
    const titulo = document.querySelector('[data-config="heroFrase"]');
    if (titulo && Array.isArray(cfg.heroFrase) && cfg.heroFrase.length) {
      titulo.replaceChildren(...cfg.heroFrase.map((linha) => {
        const span = document.createElement('span');
        span.className = 'hero__linha';
        span.textContent = linha;
        return span;
      }));
    }

    const sub = document.querySelector('[data-config="heroSubtitulo"]');
    if (sub && cfg.heroSubtitulo) sub.textContent = cfg.heroSubtitulo;

    if (cfg.logo) {
      $$('[data-logo]').forEach((el) => {
        const img = new Image();
        img.src = cfg.logo;
        img.alt = 'Garcia Web';
        img.decoding = 'async';
        el.replaceChildren(img);
        el.classList.remove('logo-pendente');
      });
    }

    // WhatsApp: sem número configurado, o botão leva para a seção de contato
    // (nunca um link quebrado).
    const numero = String(cfg.whatsapp || '').replace(/\D/g, '');
    $$('[data-whatsapp]').forEach((link) => {
      if (numero) {
        const texto = cfg.mensagemPadrao ? '?text=' + encodeURIComponent(cfg.mensagemPadrao) : '';
        link.href = 'https://wa.me/' + numero + texto;
        link.target = '_blank';
        link.rel = 'noopener';
        link.removeAttribute('data-pendente');
      } else {
        link.href = '#contato';
        link.setAttribute('data-pendente', 'whatsapp');
      }
    });

    const nomes = { demonstracao: 'Demonstração', academico: 'Projeto acadêmico', cliente: 'Cliente' };
    $$('[data-projeto]').forEach((card) => {
      const etiqueta = card.querySelector('[data-status]');
      const projeto = (cfg.projetos || {})[card.dataset.projeto] || {};
      if (!etiqueta) return;
      if (nomes[projeto.status]) {
        etiqueta.textContent = '[ ' + nomes[projeto.status] + ' ]';
        etiqueta.removeAttribute('data-pendente');
      } else {
        etiqueta.textContent = '[ Status pendente ]';
        etiqueta.setAttribute('data-pendente', 'status');
      }
    });
  }

  /* ---------- 2. Painel de pendências (MODO_RASCUNHO) ---------- */
  function painelPendencias() {
    if (!cfg.MODO_RASCUNHO) return;
    raiz.classList.add('modo-rascunho');

    const itens = [];
    if (!cfg.heroFraseConfirmada) itens.push('Frase do início (provisória)');
    if (!cfg.logo) itens.push('Logo PNG com fundo transparente');
    if (!String(cfg.whatsapp || '').replace(/\D/g, '')) itens.push('Número do WhatsApp');
    const semStatus = Object.keys(cfg.projetos || {}).filter((k) => !cfg.projetos[k].status);
    if (semStatus.length) itens.push('Etiqueta dos projetos: ' + semStatus.join(', '));
    if (!itens.length) return;

    const painel = document.createElement('details');
    painel.className = 'rascunho vidro';
    const resumo = document.createElement('summary');
    resumo.textContent = 'Pendências (' + itens.length + ')';
    const lista = document.createElement('ul');
    itens.forEach((t) => {
      const li = document.createElement('li');
      li.textContent = t;
      lista.appendChild(li);
    });
    painel.append(resumo, lista);
    document.body.appendChild(painel);
  }

  /* ---------- 3. Menu: marcador de vidro na seção ativa ---------- */
  function iniciarMenu() {
    const navs = $$('[data-nav]').map((nav) => ({
      trilho: nav.querySelector('[data-trilho]'),
      marcador: nav.querySelector('[data-marcador]'),
      links: $$('a[data-secao]', nav),
    }));
    let secaoAtiva = null;

    function posicionar() {
      navs.forEach(({ trilho, marcador, links }) => {
        const ativo = links.find((a) => a.dataset.secao === secaoAtiva);
        links.forEach((a) => {
          if (a === ativo) a.setAttribute('aria-current', 'true');
          else a.removeAttribute('aria-current');
        });
        if (!marcador || !trilho) return;
        if (!ativo || !trilho.offsetParent) {
          marcador.style.opacity = '0';
          return;
        }
        const t = trilho.getBoundingClientRect();
        const r = ativo.getBoundingClientRect();
        marcador.style.width = r.width + 'px';
        marcador.style.transform = 'translateX(' + (r.left - t.left) + 'px)';
        marcador.style.opacity = '1';
      });
    }

    // A seção que cruza o meio da tela é a ativa.
    const secoes = $$('main section[id]');
    const observador = new IntersectionObserver((entradas) => {
      entradas.forEach((e) => {
        if (e.isIntersecting) {
          secaoAtiva = e.target.id;
          posicionar();
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    secoes.forEach((s) => observador.observe(s));

    let pedido = 0;
    window.addEventListener('resize', () => {
      cancelAnimationFrame(pedido);
      pedido = requestAnimationFrame(posicionar);
    });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(posicionar);

    // Vidro do menu fica um pouco mais opaco depois que a página rola.
    let rolou = false;
    const aoRolar = () => {
      const agora = window.scrollY > 24;
      if (agora !== rolou) {
        rolou = agora;
        raiz.classList.toggle('rolou', agora);
      }
    };
    window.addEventListener('scroll', aoRolar, { passive: true });
    aoRolar();
  }

  /* ---------- 4. Modo de teste (?teste): medidas para os testes automáticos ---------- */
  function modoTeste() {
    if (!/[?&]teste\b/.test(location.search)) return;
    const medir = () => {
      const largura = raiz.clientWidth;
      const vazando = $$('body *')
        .filter((el) => {
          const r = el.getBoundingClientRect();
          return r.width > 0 && (r.right > largura + 1 || r.left < -1) && !el.closest('.sr, .pular, svg[width="0"]');
        })
        .slice(0, 8)
        .map((el) => el.tagName.toLowerCase() + '.' + String(el.className.baseVal ?? el.className).split(' ')[0]);
      const botao = document.querySelector('.hero .botao--principal');
      const rb = botao ? botao.getBoundingClientRect() : null;
      const texto = botao ? (() => {
        const faixa = document.createRange();
        faixa.selectNodeContents(botao);
        const icone = botao.querySelector('.botao__icone').getBoundingClientRect();
        const r = faixa.getBoundingClientRect();
        return { x: Math.round(icone.right + 4), y: Math.round(r.top), w: Math.round(rb.right - icone.right - 8), h: Math.round(r.height) };
      })() : null;
      const resultado = {
        larguraJanela: largura,
        larguraPagina: raiz.scrollWidth,
        rolagemHorizontal: raiz.scrollWidth > largura,
        vazando,
        botaoHero: rb && { x: Math.round(rb.x), y: Math.round(rb.y), w: Math.round(rb.width), h: Math.round(rb.height) },
        areaTextoBotao: texto,
        secaoAtiva: (document.querySelector('[aria-current="true"]') || {}).textContent || null,
        // O marcador visível terminou em cima do link ativo? (diferença em px)
        marcador: $$('[data-nav]').map((nav) => {
          const m = nav.querySelector('[data-marcador]');
          const a = nav.querySelector('[aria-current="true"]');
          if (!m || !a || !m.offsetParent) return null;
          const rm = m.getBoundingClientRect();
          const ra = a.getBoundingClientRect();
          return { dx: Math.round(rm.left - ra.left), dw: Math.round(rm.width - ra.width) };
        }).filter(Boolean),
        fontes: document.fonts ? [...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family + ' ' + f.weight) : [],
      };
      const saida = document.createElement('script');
      saida.type = 'application/json';
      saida.id = 'resultado-teste';
      saida.textContent = JSON.stringify(resultado);
      document.body.appendChild(saida);
    };
    // Pula direto para a âncora (sem rolagem suave) e sem a transição do marcador:
    // o Chrome headless às vezes não avança transições, e o teste mede o estado final.
    raiz.style.scrollBehavior = 'auto';
    const semTransicao = document.createElement('style');
    semTransicao.textContent = '.marcador{transition:none!important}';
    document.head.appendChild(semTransicao);
    (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => {
      const alvo = location.hash && document.querySelector(location.hash);
      if (alvo) alvo.scrollIntoView();
      setTimeout(medir, 900); // depois da transição do marcador (450 ms)
    });
  }

  aplicarConfig();
  painelPendencias();
  iniciarMenu();
  modoTeste();
})();
