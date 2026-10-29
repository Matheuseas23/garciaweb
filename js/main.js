/* ==========================================================
   GARCIA WEB — comportamento da página
   Etapa 2: configurações (config.js), menu com marcador
   de seção ativa e painel de pendências.
   ========================================================== */
(() => {
  'use strict';

  const cfg = window.GARCIA || {};
  const raiz = document.documentElement;
  const TESTE = /[?&]teste\b/.test(location.search);

  // No teste automático (Chrome headless dentro de iframe) o requestAnimationFrame
  // não dispara; com setTimeout as animações avançam lá. Nunca afeta o visitante.
  if (TESTE) {
    window.requestAnimationFrame = (cb) => setTimeout(() => cb(performance.now()), 16);
    window.cancelAnimationFrame = (id) => clearTimeout(id);
  }
  const $$ = (seletor, base = document) => Array.from(base.querySelectorAll(seletor));

  /* ---------- 1. Textos e dados do config.js ---------- */
  function aplicarConfig() {
    const titulo = document.querySelector('[data-config="heroFrase"]');
    if (titulo && Array.isArray(cfg.heroFrase) && cfg.heroFrase.length) {
      titulo.replaceChildren(...cfg.heroFrase.map((linha) => {
        const mascara = document.createElement('span');
        const texto = document.createElement('span');
        mascara.className = 'hero__linha';
        texto.textContent = linha;
        mascara.appendChild(texto);
        return mascara;
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

  /* ---------- 4. Animações (GSAP + ScrollTrigger, carregados da CDN) ---------- */
  const GSAP = 'https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/';

  function carregarScript(src) {
    return new Promise((ok, falha) => {
      const s = document.createElement('script');
      s.src = src;
      s.onload = ok;
      s.onerror = falha;
      document.head.appendChild(s);
    });
  }

  function iniciarAnimacoes() {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const bibliotecas = carregarScript(GSAP + 'gsap.min.js')
      .then(() => carregarScript(GSAP + 'ScrollTrigger.min.js'));

    // Se a CDN demorar mais de 1,5 s, a página aparece parada (sem abertura);
    // as animações de rolagem entram quando as bibliotecas chegarem.
    const tarde = new Promise((ok) => setTimeout(() => ok('tarde'), 1500));
    Promise.race([bibliotecas.then(() => 'ok'), tarde]).then((r) => {
      if (r === 'tarde') raiz.classList.remove('intro');
    });

    bibliotecas
      .then(() => {
        gsap.registerPlugin(ScrollTrigger);
        if (raiz.classList.contains('intro')) abertura();
        animacoesDeRolagem();
        if (document.fonts) document.fonts.ready.then(() => ScrollTrigger.refresh());
      })
      .catch((erro) => {
        raiz.classList.remove('intro');
        window.__erroAnimacao = String(erro && (erro.stack || erro.message || erro.type || erro));
      });
  }

  // Ato 1: a luz acende, o menu desce e a frase sobe linha a linha.
  // Os botões não esperam: ficam visíveis desde o primeiro instante.
  function abertura() {
    window.__introIniciada = true;
    window.__tlAbertura = gsap.timeline({
      // clearProps: ao terminar, devolve os elementos ao CSS normal (sem estilos soltos).
      defaults: { ease: 'expo.out', clearProps: 'transform,opacity' },
      onComplete: () => {
        raiz.classList.remove('intro');
        ScrollTrigger.refresh();
      },
    })
      .fromTo('.hero__fundo', { opacity: 0 }, { opacity: 1, duration: 1.6, ease: 'power2.out' }, 0)
      .fromTo('.topo', { opacity: 0, y: -16 }, { opacity: 1, y: 0, duration: 0.8 }, 0.1)
      .fromTo('.hero .etiqueta', { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.6 }, 0.15)
      .fromTo('.hero__linha > span', { yPercent: 110 }, { yPercent: 0, duration: 1.1, stagger: 0.12 }, 0.2)
      .fromTo('.hero__sub', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.8 }, 0.55);
  }

  function animacoesDeRolagem() {
    const mm = gsap.matchMedia();

    // Computador: hero preso na tela; texto sai, luz converge em halo,
    // a logo surge do desfoque e voa até o menu (Atos 2 e 3).
    mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
      raiz.classList.add('cinema');
      const logoGrande = document.querySelector('.assinatura__logo');
      const logoMenu = document.querySelector('.menu__logo [data-logo]');

      // Distância e escala do centro da tela (onde a logo grande fica) até a logo do menu.
      const voo = () => {
        const alvo = logoMenu.getBoundingClientRect();
        return {
          x: alvo.left + alvo.width / 2 - window.innerWidth / 2,
          y: alvo.top + alvo.height / 2 - window.innerHeight / 2,
          escala: alvo.height / logoGrande.offsetHeight,
        };
      };

      gsap.set(logoMenu, { opacity: 0 });
      gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: '.abertura',
          start: 'top top',
          end: '+=120%',
          scrub: 0.8,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })
        .to('.hero__conteudo', { yPercent: -18, opacity: 0, duration: 0.35, ease: 'power1.in' }, 0)
        .to('.hero__dica', { opacity: 0, duration: 0.15 }, 0)
        .to('.hero__luz', { scale: 0.55, duration: 0.5 }, 0.05)
        .to('.hero__canelado', { opacity: 0.2, duration: 0.4 }, 0.1)
        .fromTo('.assinatura__halo', { opacity: 0, scale: 0.55 }, { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out' }, 0.2)
        .fromTo(logoGrande, { opacity: 0, scale: 0.96, filter: 'blur(14px)' }, { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.35, ease: 'power2.out' }, 0.3)
        .to('.assinatura__halo', { opacity: 0, scale: 0.7, duration: 0.22 }, 0.78)
        .to(logoGrande, {
          x: () => voo().x,
          y: () => voo().y,
          scale: () => voo().escala,
          duration: 0.2,
          ease: 'power2.inOut',
        }, 0.78)
        .to(logoGrande, { opacity: 0, duration: 0.02 }, 0.98)
        .to(logoMenu, { opacity: 1, duration: 0.02 }, 0.98);

      entradaDosProjetos({ rotateX: 16, y: 90 });
      return () => raiz.classList.remove('cinema');
    });

    // Celular: nada preso na tela; a logo aparece conforme a pessoa rola.
    mm.add('(max-width: 767px) and (prefers-reduced-motion: no-preference)', () => {
      const gatilho = { trigger: '.assinatura', start: 'top 90%', end: 'center 60%', scrub: 0.6 };
      gsap.fromTo('.assinatura__halo', { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, ease: 'none', scrollTrigger: gatilho });
      gsap.fromTo('.assinatura__logo', { opacity: 0, y: 30, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, ease: 'none', scrollTrigger: { ...gatilho, start: 'top 80%' } });
      entradaDosProjetos({ rotateX: 0, y: 40 });
    });
  }

  // Ato 3: as molduras dos projetos entram inclinadas (3D leve em CSS) e se endireitam.
  function entradaDosProjetos({ rotateX, y }) {
    gsap.utils.toArray('.janela').forEach((janela) => {
      gsap.fromTo(janela,
        { rotateX, y, opacity: 0.35, transformPerspective: 1400, transformOrigin: '50% 0%' },
        { rotateX: 0, y: 0, opacity: 1, ease: 'none', scrollTrigger: { trigger: janela, start: 'top 98%', end: 'top 60%', scrub: 0.6 } });
    });
  }

  /* ---------- 5. Modo de teste (?teste): medidas para os testes automáticos ---------- */
  function modoTeste() {
    if (!TESTE) return;
    const medir = () => {
      const largura = raiz.clientWidth;
      const vazando = $$('body *')
        .filter((el) => {
          const r = el.getBoundingClientRect();
          // .hero__fundo é recortado pelo hero (overflow: hidden), então não conta.
          return r.width > 0 && (r.right > largura + 1 || r.left < -1) && !el.closest('.sr, .pular, svg[width="0"], .hero__fundo');
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
        animacao: {
          gsap: Boolean(window.gsap),
          erro: window.__erroAnimacao || null,
          gatilhos: window.ScrollTrigger ? ScrollTrigger.getAll().map((t) => [Math.round(t.start), Math.round(t.end), +t.progress.toFixed(2)]) : 0,
          abertura: window.__tlAbertura ? window.__tlAbertura.progress() : 'nao criada',
          intro: raiz.classList.contains('intro'),
          cinema: raiz.classList.contains('cinema'),
          rolagem: Math.round(window.scrollY),
          textoHero: getComputedStyle(document.querySelector('.hero__conteudo')).opacity,
          linha1: getComputedStyle(document.querySelector('.hero__linha > span')).transform,
          logoGrande: getComputedStyle(document.querySelector('.assinatura__logo')).opacity,
          logoMenu: getComputedStyle(document.querySelector('.menu__logo [data-logo]')).opacity,
        },
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
    // Espera a abertura (~2 s), rola até a âncora ou até ?rolar=N px e mede.
    const rolar = Number(new URLSearchParams(location.search).get('rolar'));
    (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => setTimeout(() => {
      const alvo = location.hash && document.querySelector(location.hash);
      if (alvo) alvo.scrollIntoView();
      else if (rolar) window.scrollTo(0, rolar);
      // O headless não dispara "scroll" sozinho (sem quadros de desenho).
      window.dispatchEvent(new Event('scroll'));
      if (window.ScrollTrigger) ScrollTrigger.update();
      setTimeout(medir, 1500); // scrub (0,8 s) e marcador assentarem
    }, 2200));
  }

  aplicarConfig();
  painelPendencias();
  iniciarMenu();
  iniciarAnimacoes();
  modoTeste();
})();
