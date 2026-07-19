document.addEventListener('DOMContentLoaded', () => {
  // 1. Scroll-Driven Reveal Animations
  const revealItems = document.querySelectorAll('.reveal-item, .reveal-scale-item');

  const revealObserverOptions = {
    root: null,
    rootMargin: '0px 0px -80px 0px', // Trigger when element is 80px above the bottom of viewport
    threshold: 0.08
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, revealObserverOptions);

  revealItems.forEach(item => {
    revealObserver.observe(item);
  });

  // 2. FAQ Accordion Logic
  const faqTriggers = document.querySelectorAll('.faq-trigger');
  
  faqTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const targetId = trigger.getAttribute('aria-controls');
      const panel = document.getElementById(targetId);
      const chevron = trigger.querySelector('.faq-chevron');
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';

      // Auto-collapse other accordion panels
      faqTriggers.forEach(otherTrigger => {
        if (otherTrigger !== trigger) {
          otherTrigger.setAttribute('aria-expanded', 'false');
          const otherPanelId = otherTrigger.getAttribute('aria-controls');
          const otherPanel = document.getElementById(otherPanelId);
          const otherChevron = otherTrigger.querySelector('.faq-chevron');
          
          if (otherPanel) {
            otherPanel.style.maxHeight = '0px';
            otherPanel.classList.remove('active');
          }
          if (otherChevron) {
            otherChevron.classList.remove('rotate-180');
          }
        }
      });

      // Toggle current panel
      if (isExpanded) {
        trigger.setAttribute('aria-expanded', 'false');
        panel.style.maxHeight = '0px';
        panel.classList.remove('active');
        chevron.classList.remove('rotate-180');
      } else {
        trigger.setAttribute('aria-expanded', 'true');
        panel.classList.add('active');
        panel.style.maxHeight = panel.scrollHeight + 'px';
        chevron.classList.add('rotate-180');
      }
    });
  });

  // Re-calculate open panel height on window resize
  window.addEventListener('resize', () => {
    faqTriggers.forEach(trigger => {
      if (trigger.getAttribute('aria-expanded') === 'true') {
        const targetId = trigger.getAttribute('aria-controls');
        const panel = document.getElementById(targetId);
        if (panel) {
          panel.style.maxHeight = panel.scrollHeight + 'px';
        }
      }
    });
  });

  // 3. SVG Dashboard Interactive Hover States
  const dashNodes = document.querySelectorAll('.dashboard-node');
  const detailsBox = document.getElementById('dash-details');

  const nodeInfo = {
    'node-ingest': 'Neural Pipeline: Processing 12,450 raw documents/sec across webhooks & databases.',
    'node-llm': 'Multi-LLM Orchestrator: Smart routing between Gemini Pro, Claude 3.5, and Llama 3.',
    'node-db': 'Vector Embeddings: Latency 8.4ms for semantic search indexed across 5.2M vectors.',
    'node-agent': 'Autonomous Agent Core: Resolving workflow steps, uptime 99.98% under peak loads.'
  };

  dashNodes.forEach(node => {
    node.addEventListener('mouseenter', (e) => {
      const nodeId = node.id;
      const text = nodeInfo[nodeId];
      if (text && detailsBox) {
        detailsBox.textContent = text;
        detailsBox.classList.remove('opacity-50');
        detailsBox.classList.add('text-blue-500', 'dark:text-blue-400', 'font-medium');
      }
      
      // Highlight active node link paths
      const connectionId = node.getAttribute('data-connects');
      if (connectionId) {
        const line = document.getElementById(connectionId);
        if (line) {
          line.classList.add('stroke-blue-500');
          line.setAttribute('stroke-width', '2');
        }
      }
    });

    node.addEventListener('mouseleave', () => {
      if (detailsBox) {
        detailsBox.textContent = 'Hover over dashboard system nodes to inspect live telemetry...';
        detailsBox.classList.add('opacity-50');
        detailsBox.classList.remove('text-blue-500', 'dark:text-blue-400', 'font-medium');
      }
      
      const connectionId = node.getAttribute('data-connects');
      if (connectionId) {
        const line = document.getElementById(connectionId);
        if (line) {
          line.classList.remove('stroke-blue-500');
          line.setAttribute('stroke-width', '1.5');
        }
      }
    });
  });

  // 4. Interactive Reactive Lines (Originkit) Adaptation
  const initHeroCanvas = () => {
    const container = document.getElementById('hero-canvas-container');
    const canvas = document.getElementById('hero-canvas');
    if (!container || !canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    // Vector math helpers
    const vec = (x, y) => ({ x, y });
    const vecAdd = (a, b) => ({ x: a.x + b.x, y: a.y + b.y });
    const vecSub = (a, b) => ({ x: a.x - b.x, y: a.y - b.y });
    const vecMult = (a, s) => ({ x: a.x * s, y: a.y * s });
    const vecLerp = (a, b, t) => ({
      x: a.x + (b.x - a.x) * t,
      y: a.y + (b.y - a.y) * t
    });
    const lerp = (a, b, t) => a + (b - a) * t;
    const clamp = (v, mn, mx) => Math.max(mn, Math.min(mx, v));
    const map = (v, a, b, c, d) => ((v - a) / (b - a)) * (d - c) + c;

    // State Variables
    let width = 0;
    let height = 0;
    let dpr = 1;
    let isVisible = true;
    let isPageVisible = true;
    let animationId = 0;

    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const cfg = { linesNum: 40, bias: 0.5 };

    const setup = () => {
      dpr = window.devicePixelRatio || 1;
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Default mouse positions to center
      if (mouse.x === 0 && mouse.y === 0) {
        mouse.targetX = width / 2;
        mouse.targetY = height / 2;
        mouse.x = width / 2;
        mouse.y = height / 2;
      }
    };

    const drawCurve = (ctx, t, r, n, l, a) => {
      const o = vecLerp(t, r, 0.5);
      const s = vecSub(n, o);

      ctx.beginPath();
      for (let n = 0; n <= 50; n++) {
        const o = n / 50;
        const u = vecLerp(t, r, o);
        const d_val = 2 * Math.pow(o, a * (1 - l) * 2) * Math.pow(1 - o, a * l * 2);
        const cv = vecAdd(u, vecMult(s, d_val));
        n === 0 ? ctx.moveTo(cv.x, cv.y) : ctx.lineTo(cv.x, cv.y);
      }
      ctx.stroke();
    };

    const draw = () => {
      // Smooth lerp coordinates
      mouse.x = mouse.x + (mouse.targetX - mouse.x) * 0.05;
      mouse.y = mouse.y + (mouse.targetY - mouse.y) * 0.1;

      // Theme-dependent colors (Matte colors matching Apple style)
      const isLight = document.documentElement.classList.contains('light');
      // Somewhat darker light mode canvas background to make blue lines look premium
      const backgroundColor = isLight ? '#E5E7EB' : '#000000';
      const lineColor = isLight ? 'rgba(0, 113, 227, 0.18)' : 'rgba(41, 151, 255, 0.18)';
      const lineWidth = 1;

      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, width, height);

      ctx.save();
      ctx.translate(width / 2, height / 2);

      const isMobile = width < 500;
      const u = isMobile ? 0.8 * height : 0;
      const d = isMobile ? 1.5 : 0.7;

      const c = vec(width, -(1.1 * height) + u);
      const f = vec(0, 2 * height);
      const g = vec(-width, -height + u);

      const minLines = 2;
      const maxLines = 45;
      const h = clamp(map(mouse.y, 0, height, minLines, maxLines), minLines, maxLines);
      cfg.linesNum = lerp(cfg.linesNum, h, 0.1);

      const b = clamp(map(mouse.x, 0, width, 0.6, 0.4), 0.4, 0.6);
      cfg.bias = lerp(cfg.bias, b, 0.05);

      ctx.strokeStyle = lineColor;
      ctx.lineWidth = lineWidth;

      for (let t = 0; t < cfg.linesNum; t++) {
        const r = t / (cfg.linesNum - 1);
        const lineEnd = vec(
          lerp(f.x, g.x, 1 - r * r),
          lerp(f.y, g.y, 1 - r * r)
        );
        const l = vecAdd(vecMult(c, 0.5), vecMult(lineEnd, 0.5));
        const dispTarget = vecMult(vecAdd(f, l), 0.5);

        drawCurve(ctx, c, lineEnd, dispTarget, cfg.bias, d);
      }

      ctx.restore();

      // Seamless gradient overlay to blend the canvas with the next section
      const fadeHeight = 220;
      const bottomGrad = ctx.createLinearGradient(0, height - fadeHeight, 0, height);
      if (isLight) {
        bottomGrad.addColorStop(0, 'rgba(229, 231, 235, 0)');
        bottomGrad.addColorStop(1, '#FFFFFF'); // blends into light body background color
      } else {
        bottomGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
        bottomGrad.addColorStop(1, '#000000'); // blends into dark body background color
      }
      ctx.fillStyle = bottomGrad;
      ctx.fillRect(0, height - fadeHeight, width, fadeHeight);
    };

    const loop = () => {
      draw();
      animationId = requestAnimationFrame(loop);
    };

    const start = () => {
      if (!animationId && isVisible && isPageVisible) {
        animationId = requestAnimationFrame(loop);
      }
    };

    const stop = () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = 0;
      }
    };

    setup();

    // Mouse events inside client viewport relative to container
    let rect = container.getBoundingClientRect();
    const updateMouse = (ev) => {
      mouse.targetX = ev.clientX - rect.left;
      mouse.targetY = ev.clientY - rect.top;
    };

    const updateRect = () => {
      rect = container.getBoundingClientRect();
    };

    document.addEventListener('mousemove', updateMouse, { passive: true });
    window.addEventListener('scroll', updateRect, { passive: true });
    window.addEventListener('resize', () => {
      stop();
      setup();
      updateRect();
      start();
    }, { passive: true });

    // Page Visibility check
    const onPageVis = () => {
      isPageVisible = document.visibilityState === 'visible';
      isPageVisible ? start() : stop();
    };
    document.addEventListener('visibilitychange', onPageVis);

    // IntersectionObserver to pause loop off-screen
    const io = new IntersectionObserver((entries) => {
      isVisible = entries[0]?.isIntersecting ?? true;
      isVisible && isPageVisible ? start() : stop();
    }, { threshold: 0 });
    io.observe(container);

    // Initial loop startup
    start();
  };

  initHeroCanvas();

  // 5. Random Letter Swap Text Animation
  const initRandomLetterSwap = () => {
    const elements = document.querySelectorAll('.random-letter-swap');
    console.log('[DEBUG] initRandomLetterSwap found elements:', elements.length);
    elements.forEach((el) => {
      const text = el.textContent.trim();
      console.log('[DEBUG] Processing element text:', text);
      if (!text) return;
      
      // Clear contents
      el.innerHTML = '';
      el.style.display = 'inline-flex';
      el.style.alignItems = 'center';
      el.style.position = 'relative';
      el.style.overflow = 'hidden';
      
      // Add accessibility hidden label
      const srOnly = document.createElement('span');
      srOnly.style.position = 'absolute';
      srOnly.style.width = '1px';
      srOnly.style.height = '1px';
      srOnly.style.padding = '0';
      srOnly.style.margin = '-1px';
      srOnly.style.overflow = 'hidden';
      srOnly.style.clip = 'rect(0,0,0,0)';
      srOnly.style.whiteSpace = 'nowrap';
      srOnly.style.borderWidth = '0';
      srOnly.textContent = text;
      el.appendChild(srOnly);
      
      const letters = text.split('');
      const letterSpans = [];
      const secondarySpans = [];
      const letterIdxs = [];
      
      letters.forEach((char, idx) => {
        const container = document.createElement('span');
        container.setAttribute('aria-hidden', 'true');
        container.style.whiteSpace = 'pre';
        container.style.position = 'relative';
        container.style.display = 'inline-flex';
        
        const primary = document.createElement('span');
        primary.textContent = char;
        primary.style.position = 'relative';
        primary.style.display = 'inline-block';
        primary.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
        primary.style.transform = 'translateY(0)';
        primary.style.paddingBottom = '0.15em';
        
        const secondary = document.createElement('span');
        secondary.textContent = char;
        secondary.style.position = 'absolute';
        secondary.style.left = '0';
        secondary.style.right = '0';
        secondary.style.top = '100%';
        secondary.style.display = 'inline-block';
        secondary.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
        secondary.style.transform = 'translateY(0)';
        secondary.style.paddingBottom = '0.15em';
        
        container.appendChild(primary);
        container.appendChild(secondary);
        el.appendChild(container);
        
        if (char !== ' ') {
          letterIdxs.push(idx);
          letterSpans[idx] = primary;
          secondarySpans[idx] = secondary;
        }
      });
      
      let hoverStartTimer = null;
      let hoverEndTimer = null;
      let startTrailing = false;
      let endTrailing = false;
      const wait = 100;
      
      const runPingStart = () => {
        if (letterIdxs.length === 0) return;
        const shuffled = [...letterIdxs].sort(() => Math.random() - 0.5);
        shuffled.forEach((originalIdx, staggerIdx) => {
          const primary = letterSpans[originalIdx];
          const secondary = secondarySpans[originalIdx];
          const delay = staggerIdx * 0.04;
          
          primary.style.transitionDelay = `${delay}s`;
          secondary.style.transitionDelay = `${delay}s`;
          primary.style.transform = 'translateY(-100%)';
          secondary.style.transform = 'translateY(-100%)';
        });
      };
      
      const runPingEnd = () => {
        if (letterIdxs.length === 0) return;
        const shuffled = [...letterIdxs].sort(() => Math.random() - 0.5);
        shuffled.forEach((originalIdx, staggerIdx) => {
          const primary = letterSpans[originalIdx];
          const secondary = secondarySpans[originalIdx];
          const delay = staggerIdx * 0.04;
          
          primary.style.transitionDelay = `${delay}s`;
          secondary.style.transitionDelay = `${delay}s`;
          primary.style.transform = 'translateY(0)';
          secondary.style.transform = 'translateY(0)';
        });
      };
      
      el.addEventListener('mouseenter', () => {
        if (hoverEndTimer) {
          clearTimeout(hoverEndTimer);
          hoverEndTimer = null;
          endTrailing = false;
        }
        
        if (!hoverStartTimer) {
          runPingStart();
          hoverStartTimer = setTimeout(() => {
            if (startTrailing) runPingStart();
            startTrailing = false;
            hoverStartTimer = null;
          }, wait);
        } else {
          startTrailing = true;
        }
      });
      
      el.addEventListener('mouseleave', () => {
        if (hoverStartTimer) {
          clearTimeout(hoverStartTimer);
          hoverStartTimer = null;
          startTrailing = false;
        }
        
        if (!hoverEndTimer) {
          runPingEnd();
          hoverEndTimer = setTimeout(() => {
            if (endTrailing) runPingEnd();
            endTrailing = false;
            hoverEndTimer = null;
          }, wait);
        } else {
          endTrailing = true;
        }
      });
    });
  };

  initRandomLetterSwap();
});
