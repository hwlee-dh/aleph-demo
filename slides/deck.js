(() => {
  const stage = document.getElementById('stage');
  const prog = document.getElementById('prog');
  const scRoot = document.getElementById('sc');
  const wiresRoot = document.getElementById('wires');
  const shown = Array.from(document.querySelectorAll('[data-show]'));

  // 검토 편집기가 이 화면을 안에 띄울 때:
  //   ?embed        편집기가 단계를 넘긴다 (키, 클릭, 주소를 건드리지 않는다)
  //   ?thumb=이름   그 단계의 멈춘 화면
  const params = new URLSearchParams(location.search);
  const thumb = params.get('thumb');
  const embed = thumb != null || params.has('embed');
  const still = thumb != null;

  // 장 안에서 몇째 단계인지 (주소에 쓴다)
  const nth = [];
  STEPS.forEach((s, i) => {
    nth[i] = i > 0 && STEPS[i - 1].ch === s.ch ? nth[i - 1] + 1 : 1;
  });

  let cur = -1;

  // ---- 크기 맞춤
  function fit() {
    const k = Math.min(window.innerWidth / 1600, window.innerHeight / 900);
    stage.style.setProperty('--k', k);
  }
  window.addEventListener('resize', fit);
  fit();

  // ---- 장면: 화면에 놓이는 것들. 이름이 같으면 같은 것이라서 새 자리로 옮겨 간다
  const cast = new Map();
  const AX = { l: '0%', c: '-50%', r: '-100%' };
  const AY = { t: '0%', m: '-50%', b: '-100%' };
  const ALIGN = { l: 'left', c: 'center', r: 'right' };
  const TURN = { d: 90, u: -90, l: 180 };

  function dress(el, a) {
    const al = a.al || 'cm';
    let cls = 'ac k-' + a.k;
    if (a.k === 't') cls += (a.w != null ? ' wrap' : '') + ' ta-' + ALIGN[al[0]];
    if (a.c) cls += ' ' + a.c;
    if (a.k === 'w') cls = 'k-w' + (a.c ? ' ' + a.c : '');
    if (el.dataset.cls !== cls) {
      el.dataset.cls = cls;
      el.setAttribute('class', cls + (el.classList.contains('live') ? ' live' : ''));
    }
    if (a.k !== 't' && el.dataset.key) {
      delete el.dataset.key;
      el.textContent = '';
    }
    if (a.k === 't') {
      const key = a.ht != null ? 'h:' + a.ht : 't:' + a.t;
      if (el.dataset.key !== key) {
        el.dataset.key = key;
        if (a.ht != null) el.innerHTML = a.ht; else el.textContent = a.t;
      }
    }
  }

  // 선: 경로가 바뀌면 그리로 휘어 가고, 처음 나타날 때는 시작점에서부터 그어진다
  function paintWire(el, a) {
    if (el.style.strokeDasharray && el.getAttribute('d') !== a.p) {
      // 그어지던 선이 다른 길로 옮겨 가면 길이가 달라진다
      clearTimeout(el._dash);
      el.style.strokeDasharray = '';
      el.style.strokeDashoffset = '';
    }
    el.setAttribute('d', a.p);
    el.style.setProperty('d', 'path("' + a.p + '")');
    el.style.strokeWidth = (a.sw || 3) + 'px';
    el.style.opacity = a.o != null ? a.o : 1;
  }

  function drawWire(el, a, delays) {
    const len = el.getTotalLength();
    el.style.transition = 'none';
    el.style.strokeDasharray = len;
    el.style.strokeDashoffset = len;
    el.style.opacity = 0;
    el.getBoundingClientRect();
    el.style.transition = '';
    el.style.strokeDashoffset = 0;
    el.style.opacity = a.o != null ? a.o : 1;
    clearTimeout(el._dash);
    el._dash = setTimeout(() => { el.style.strokeDasharray = ''; el.style.strokeDashoffset = ''; }, 1100 + (delays && a.d ? a.d : 0));
  }

  function paint(el, a) {
    if (a.k === 'w') { paintWire(el, a); return; }
    const al = a.al || 'cm';
    let tf = `translate(${a.x}px, ${a.y}px)`;
    if (a.k === 't' || a.k === 'i') tf += ` translate(${AX[al[0]]}, ${AY[al[1]]})`;
    if (a.k === 'a') tf += ` rotate(${TURN[a.dir] || 0}deg)`;
    el.style.transform = tf;
    el.style.width = a.k === 'a' ? a.len + 'px' : a.w != null ? a.w + 'px' : '';
    el.style.height = a.h != null ? a.h + 'px' : '';
    el.style.fontSize = a.fs ? a.fs + 'px' : '';
    el.style.fontWeight = a.fw || '';
    el.style.lineHeight = a.lh ? a.lh + 'px' : '';
    el.style.opacity = a.o != null ? a.o : 1;
  }

  function scene(sc, delays) {
    sc = sc || {};
    for (const [id, m] of cast) {
      if (id in sc || !m.live) continue;
      m.live = false;
      m.el.classList.remove('live');
      m.el.style.setProperty('--d', '0ms');
      m.el.style.opacity = 0;
    }
    for (const id in sc) {
      const a = sc[id];
      let m = cast.get(id);
      const tag = a.k === 'w' ? 'path' : a.k === 'i' ? 'img' : 'div';
      if (m && m.el.localName !== tag) {
        // 앞에서 같은 이름을 다른 종류로 썼다. 그 요소로는 그릴 수 없으니 새로 만든다
        m.el.remove();
        m = null;
      }
      if (!m) {
        const el = a.k === 'w'
          ? document.createElementNS('http://www.w3.org/2000/svg', 'path')
          : document.createElement(a.k === 'i' ? 'img' : 'div');
        el.id = id;
        if (a.k === 'i') { el.src = a.src ? encodeURI(a.src) : '../assets/aleph.png'; el.alt = ''; }
        (a.k === 'w' ? wiresRoot : scRoot).appendChild(el);
        m = { el, live: false };
        cast.set(id, m);
      }
      const el = m.el;
      const show = (a.o != null ? a.o : 1) > 0;
      dress(el, a);
      if (!m.live) {
        // 꺼져 있던 것은 출발 자리에 조용히 놓고 나서 움직인다
        el.style.transition = 'none';
        paint(el, { ...a, ...(show && !still ? a.from : null), o: 0 });
        el.getBoundingClientRect();
        el.style.transition = '';
        if (!show) continue;
      }
      el.style.setProperty('--d', (delays && a.d ? a.d : 0) + 'ms');
      paint(el, a);
      if (a.k === 'w' && !m.live && show && !still) drawWire(el, a, delays);
      m.live = show;
      el.classList.toggle('live', show);
    }
  }

  // 누르면 저절로 이어지는 장면들
  let timers = [];

  function play(s, forward) {
    timers.forEach(clearTimeout);
    timers = [];
    if (!s.seq || !forward || still) {
      scene(s.sc, forward && !still);
      return;
    }
    if (!s.slow) stage.classList.add('quick');
    for (const f of s.seq) {
      if (f.at <= 0) scene(f.sc, false);
      else timers.push(setTimeout(() => scene(f.sc, false), f.at));
    }
    timers.push(setTimeout(() => scene(s.sc, false), s.end));
  }

  // ---- 단계 적용
  function go(i, quiet) {
    i = Math.max(0, Math.min(STEPS.length - 1, i));
    if (i === cur) return;
    const forward = i === cur + 1;
    cur = i;
    const s = STEPS[i];
    const on = new Set((s.on || '').split(/\s+/).filter(Boolean));

    stage.className = 'stage' + [...on].map(t => ' s-' + t).join('') +
      (stage.dataset.ready ? ' ready' : '') + (still ? ' static' : '');
    for (const el of shown) {
      const hit = el.dataset.show.split(/\s+/).some(t => on.has(t));
      el.classList.toggle('on', hit);
    }

    play(s, forward);

    prog.style.width = (STEPS.length > 1 ? (i / (STEPS.length - 1)) * 100 : 0) + '%';

    if (!quiet && !embed) {
      history.replaceState(null, '', '#' + s.ch + '.' + nth[i]);
    }
  }

  window.DECK = {
    index: () => cur,
    go: i => go(i, true),
    hashOf: i => '#' + STEPS[i].ch + '.' + nth[i],
  };

  if (embed) {
    const i = still ? STEPS.findIndex(s => s.id === thumb) : 0;
    go(Math.max(0, i), true);
    if (!still) {
      requestAnimationFrame(() => requestAnimationFrame(() => {
        stage.dataset.ready = '1';
        stage.classList.add('ready');
      }));
    }
    return;
  }

  function fromHash() {
    const m = /^#(\d+)(?:\.(\d+))?$/.exec(location.hash);
    if (!m) return 0;
    const ch = +m[1];
    const k = +(m[2] || 1);
    let first = STEPS.findIndex(s => s.ch === ch);
    if (first < 0) return 0;
    let i = first;
    while (i + 1 < STEPS.length && STEPS[i + 1].ch === ch && nth[i] < k) i++;
    return i;
  }

  const next = () => go(cur + 1);
  const prev = () => go(cur - 1);

  // ---- 조작
  window.addEventListener('keydown', e => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    switch (e.key) {
      case 'ArrowRight': case ' ': case 'PageDown': case 'Enter':
        e.preventDefault(); next(); break;
      case 'ArrowLeft': case 'PageUp': case 'Backspace':
        e.preventDefault(); prev(); break;
      case 'Home': e.preventDefault(); go(0); break;
      case 'End': e.preventDefault(); go(STEPS.length - 1); break;
      case 'f': case 'F':
        if (document.fullscreenElement) document.exitFullscreen();
        else if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen();
        break;
    }
  });

  let touch = null;
  let touched = 0;

  window.addEventListener('touchstart', e => {
    const t = e.changedTouches[0];
    touch = { x: t.clientX, y: t.clientY };
  }, { passive: true });

  window.addEventListener('touchend', e => {
    if (!touch) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touch.x;
    const dy = t.clientY - touch.y;
    touch = null;
    touched = Date.now();
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      if (dx < 0) next(); else prev();
    } else if (Math.abs(dx) < 10 && Math.abs(dy) < 10) {
      if (e.target.closest('a')) return;
      if (t.clientX < window.innerWidth * 0.25) prev(); else next();
    }
  }, { passive: true });

  window.addEventListener('click', e => {
    if (Date.now() - touched < 600) return;   // 터치 뒤에 따라오는 클릭
    if (e.target.closest('a')) return;
    if (e.clientX < window.innerWidth * 0.2) prev(); else next();
  });

  window.addEventListener('hashchange', () => go(fromHash(), true));

  go(fromHash(), true);
  history.replaceState(null, '', '#' + STEPS[cur].ch + '.' + nth[cur]);
  requestAnimationFrame(() => requestAnimationFrame(() => {
    stage.dataset.ready = '1';
    stage.classList.add('ready');
  }));
})();
