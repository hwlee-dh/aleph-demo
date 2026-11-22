// 발표의 단계들. 한 줄이 화면 한 번이다.
//   id    단계의 이름. 순서가 바뀌어도 그대로 둔다 (검토 기록이 이 이름에 묶인다)
//   ch    장 번호. 주소의 #장.단계 에 쓰인다
//   sc    장면. 화면에 놓이는 것들을 이름: { ... } 로 적는다. 같은 이름은 단계가 바뀌어도
//         같은 것이라서, 자리와 크기가 달라지면 그리로 옮겨 간다
//   seq   누르면 저절로 이어지는 장면들 [{ at: 밀리초, sc }]. end 에 sc 가 된다. slow 면 느리게 움직인다
//   on    무대에 붙는 .s-이름, 그리고 index.html에서 켜는 장(data-show)
//
// 장면에 놓이는 것 하나:
//   k     t 글, b 상자, r 막대, a 화살표, i 그림 (src 가 없으면 로고), w 휘는 선 (p 는 SVG 경로)
//   x y   자리. 글과 그림은 al 이 가리키는 점, 상자와 막대는 왼쪽 위, 화살표는 시작점
//   al    글이 x y 에 닿는 곳. 가로 l c r, 세로 t m b (기본 cm)
//   w h   크기. 글에 w 를 주면 그 너비에서 줄을 바꾼다
//   len   화살표 길이, dir: 'd' 아래로, 'u' 위로, 'l' 왼쪽으로
//   t     글 (ht 는 HTML), fs 글자 크기, fw 굵기, lh 줄 높이
//   c     class, o 투명도, d 늦게 나타나기(밀리초), from 처음 나타날 때 출발하는 자리

const CHAPTERS = ['', 'LLM 기반 시스템', '프롬프트', '컨텍스트', '한계와 대책', '서사 창작에서의 LLM 기반 시스템', '에이전트', 'ALEPH', ''];

const T = (x, y, t, o) => ({ k: 't', x, y, t, ...o });
const merge = (...parts) => Object.assign({}, ...parts);

// ---------------------------------------------------------------- 자리

const IOY = 450;                                  // 입력과 출력이 놓이는 높이
const BOX = { x: 520, y: 88, w: 560, h: 742 };    // 시스템 상자
const LEFT = 550;                                 // 상자 안에서 글과 막대가 시작하는 곳
const FLOOR = 636;                                // 쌓이는 것의 바닥. LLM 바로 위

const llm = (cy, w, h, fs) => ({
  mbox: { k: 'b', x: 800 - w / 2, y: cy - h / 2, w, h, c: 'solid' },
  mtx: T(800, cy, 'LLM', { fs, fw: 800 }),
});

// 상자 왼쪽 끝(edge)으로 들어가는 화살표와 오른쪽으로 나오는 화살표
const arrows = (edge, len, d) => ({
  ain: { k: 'a', x: edge - 12 - len, y: IOY, len, d: d && d[0] },
  aout: { k: 'a', x: 1600 - edge + 12, y: IOY, len, d: d && d[1] },
});

// ---------------------------------------------------------------- 0 여는 장

const head = (y, d) => ({
  logo: { k: 'i', x: 521, y, w: 150, d },
  aleph: T(898, y, 'ALEPH', { fs: 150, fw: 800, c: 'wide', d }),
});

const COURSE = '2026년 1학기 학생미래설계학기 연구인턴십';
const TOPIC = '생성형 AI를 활용한 문학창작 연구';
const WHO = '국어국문학과 2022620021 이현우 · 지도교수 유승환 · 멘토 김민경';

// 발표를 시작하기 전, 쉬는 시간에 띄워 두는 화면
const SITE = 'github.com/hwlee-dh/aleph-demo';
const scWait = {
  wt: T(150, 400, '발표 자료', { al: 'lm', fs: 120, fw: 800 }),
  wu: T(156, 520, SITE, { al: 'lm', fs: 44, fw: 600, c: 'blue' }),
  wq: { k: 'i', src: '../assets/qr-demo.png', x: 1250, y: 450, w: 380, c: 'photo' },
};

// 표지. 과목과 사람 → 주제 → 주제만 남고 그 밑에 한 줄 설명 → 영문 이름 → 두문자가 서며 ALEPH
const scCover = {
  l1: T(800, 410, COURSE, { fs: 60, fw: 800 }),
  l3: T(800, 520, WHO, { fs: 28, fw: 500, c: 'dim' }),
};
const scCover2 = {
  l1: T(800, 366, COURSE, { fs: 34, fw: 500 }),
  l2: T(800, 446, TOPIC, { fs: 68, fw: 800, d: 250 }),
  l3: T(800, 584, WHO, { fs: 26, fw: 500, c: 'dim' }),
};

// 부제. plain 은 한 가지 색, split 은 두문자만 진하게
const sub = (c, d) => ({
  sub: {
    k: 't', x: 800, y: 500, fs: 34, fw: 400, c, d,
    ht: '<b>A</b>gentic <b>L</b>iterary <b>E</b>ngine for <b>P</b>rose <b>H</b>andling',
  },
});

// "LLM 에이전트 기반 서사 창작 도구"를 낱말로 나눠 둔다. 목차로 갈 때 세 낱말이 남는다
const word = (x, t, d) => T(x, 566, t, { al: 'lm', fs: 34, fw: 500, d });
const descLine = (d, three) => ({
  mtx: word(570, 'LLM', d),
  agt: word(644, '에이전트', d),
  nar: word(837, '서사 창작', d),
  ...(three ? null : { w1: word(770, '기반', d), w2: word(971, '도구', d) }),
});

const scTitle = { l2: T(800, 446, TOPIC, { fs: 68, fw: 800 }), ...descLine(250) };
const scTitle2 = { l2: T(800, 392, TOPIC, { fs: 56, fw: 800 }), ...sub('plain', 250), ...descLine() };
const scTitle2b = { ...head(330, 250), ...sub('split'), ...descLine() };
const scTitle3 = { ...head(330), ...descLine(0, true) };

// 목차. 남은 낱말 뒤에 나머지 글이 붙는다 (TW 는 40px 굵은 글씨에서 잰 낱말 너비)
const TOCX = 500;
const TOCY = i => 250 + 100 * i;
const TW = { llm: 79, nar: 147.5, agt: 138.5 };
const tocItem = (i, t, o) => T(TOCX, TOCY(i), t, { al: 'lm', fs: 40, fw: 700, ...o });
const tocTail = (i, w, t) => tocItem(i, t, { x: TOCX + w, d: 350 });

const scToc = {
  mtx: tocItem(0, 'LLM'),
  ts1: tocTail(0, TW.llm, ' 기반 시스템의 이해'),
  nar: tocItem(1, '서사 창작'),
  ts2: tocTail(1, TW.nar, '에서의 LLM 기반 시스템'),
  agt: tocItem(2, '에이전트'),
  ts3: tocTail(2, TW.agt, '의 이해'),
  aleph: tocItem(3, 'ALEPH', { c: 'wide' }),
  tdm: tocItem(4, '프로젝트 데모', { d: 350 }),
  ...Object.fromEntries([1, 2, 3, 4, 5].map(n =>
    ['no' + n, T(TOCX - 34, TOCY(n - 1), String(n), { al: 'rm', fs: 28, fw: 500, c: 'dim', d: 350 })])),
};

// ---------------------------------------------------------------- 1 LLM 기반 시스템

const scLlm = { mtx: T(800, IOY, 'LLM', { fs: 58, fw: 800 }) };
const scLlmBox = llm(IOY, 260, 170, 58);

const scFn = {
  ...scLlmBox,
  ...arrows(670, 130, [250, 650]),
  tin: T(508, IOY, '텍스트', { al: 'rm', fs: 40 }),
  tout: T(1092, IOY, '텍스트', { al: 'lm', fs: 40, c: 'blue', d: 900 }),
};

const SVC = {
  sbox: { k: 'b', ...BOX },
  ...llm(IOY, 200, 120, 44),
  ...arrows(520, 128),
  tin: T(360, IOY, '텍스트', { al: 'rm', fs: 40 }),
  tout: T(1240, IOY, '텍스트', { al: 'lm', fs: 40, c: 'blue' }),
};

const scSvc = {
  ...SVC,
  slabel: T(520, 58, 'LLM 기반 시스템', { al: 'lm', fs: 30, d: 300 }),
};

const PRE = ['입력 검사', '프롬프트 조립', '대화 기록 붙이기', '자료 검색', '…'];
const POST = ['출력 검사', '형식 변환', '기록 저장', '화면 표시', '…'];

const lists = gathered => {
  const out = {};
  const put = (id, y, t, o) => {
    out[id] = gathered
      ? T(800, 235, t, { ...o, fs: 30, o: 0 })
      : T(800, y, t, o);
  };
  const item = (t, i) => ({ fs: 30, fw: 600, d: 120 * i, c: t === '…' ? 'dim' : '' });
  put('hpre', 122, '전처리', { fs: 24, fw: 500, c: 'dim' });
  PRE.forEach((t, i) => put('pr' + i, 174 + 44 * i, t, item(t, i)));
  put('hpost', 546, '후처리', { fs: 24, fw: 500, c: 'dim' });
  POST.forEach((t, i) => put('po' + i, 598 + 44 * i, t, item(t, i)));
  return out;
};

const scPrepost = { ...scSvc, ...lists(false) };

const scScaffold = {
  ...scSvc,
  ...lists(true),
  tint: { k: 'r', ...BOX, c: 'tint' },
  sname: T(800, 220, '스캐폴딩', { fs: 62, fw: 800, c: 'blue', d: 250 }),
  ssub: T(800, 284, 'Scaffolding; 비계', { fs: 26, fw: 500, c: 'dim', d: 250 }),
};

// ---------------------------------------------------------------- 2 프롬프트

const SHELL = {
  sbox: { k: 'b', ...BOX },
  ...llm(745, 200, 100, 44),
  ...arrows(520, 68),
};
const FEED = { afeed: { k: 'a', x: 800, y: 646, len: 42, dir: 'd' } };

const Q = (id, t, o) => ({ [id]: T(420, IOY, t, { al: 'rm', fs: 32, lh: 46, w: 380, ...o }) });
const A = (id, t, o) => ({ [id]: T(1180, IOY, t, { al: 'lm', fs: 32, lh: 46, w: 380, c: 'blue', d: 450, ...o }) });
const WAIT = A('aq', '?', { fs: 64, d: 0 });
const Q0 = Q('ask1', '1+1은 무엇인가요?');

// 프롬프트는 세 줄이다: 역할, 과업, 지침. 줄마다 슬롯머신처럼 굴러서 바뀐다
const ROLES = {
  teacher: '당신은 초등학교 교사입니다.',
  prof: '당신은 수학과 교수입니다.',
  joke: '당신은 장난기 많은 친구입니다.',
  cute: '당신은 애교 많은 아이돌입니다.',
  rude: '당신은 입이 험한 친구입니다.',
  help: '당신은 질문에 답하는 도우미입니다.',
};
const TASKS = { answer: '질문에 답하세요.', chat: '일상적으로 대화하세요.' };
const GUIDES = { brief: '간결하게 말하세요.', strict: '엄밀하게 말하세요.', latex: 'LaTeX로 말하세요.' };
const LINE = 46;

// 고른 것만 보이고, 나머지는 위로 빠져 있다. 새로 나오는 것은 아래에서 올라온다
function reel(prefix, table, pick, y) {
  const out = {};
  for (const key in table) {
    const on = key === pick;
    out[prefix + key] = T(800, on ? y : y - 30, table[key], {
      al: 'cb', fs: 26, fw: 600, lh: 38, o: on ? 1 : 0, from: { y: y + 30 },
    });
  }
  return out;
}

const promptLines = (role, task, guide) => merge(
  reel('ro-', ROLES, role, FLOOR - LINE * (guide ? 2 : 1)),
  reel('tk-', TASKS, task, FLOOR - (guide ? LINE : 0)),
  guide ? reel('gd-', GUIDES, guide, FLOOR) : null,
);
const ask = (role, task, guide, id, a, o) => merge(SHELL, FEED, Q0, promptLines(role, task, guide), A(id, a, o));

const PEANO = '페아노 공리계에서 1+1은 1의 다음 수이고, 이를 2라 부릅니다.';
const STRICT = '1은 0의 다음 수 S(0)입니다. 덧셈의 정의에 따라 1+1 = S(1+0) = S(1)이고, S(1)을 2라고 부릅니다.';
const LATEX = '\\begin{aligned}\n1 + 1 &= 1 + S(0) \\\\\n&= S(1 + 0) \\\\\n&= S(1) = 2\n\\end{aligned}';

// 자료를 넣기 전과 뒤. 역할 말고도 프롬프트가 더 있다는 것은 막대 한 줄로 보인다
const INFO_T = '「지상선을 위하여」\n염상섭, 『신생활』 1922년 7월호';
const INFO_A = '『신생활』 1922년 7월호에 실렸습니다.';
const INFO_Q = Q('ask2', '염상섭의\n「지상선을 위하여」는\n어느 잡지에 실렸나요?');
const DOC_H = 264;
const helper = up => merge(
  reel('ro-', ROLES, 'help', FLOOR - 34 - up),
  { sg1: { k: 'r', x: 635, y: FLOOR - 16 - up, w: 330, h: 12, c: 'sys', from: { x: 650, y: FLOOR - 30, w: 300, h: 22 } } },
);
// 정리해 둔 서지 목록의 한 토막
const INFO = {
  ibox: { k: 'b', x: LEFT, y: FLOOR - DOC_H, w: 500, h: DOC_H, c: 'thin em' },
  itx: {
    k: 't', x: LEFT + 20, y: FLOOR - DOC_H / 2, al: 'lm', fs: 19, fw: 500, lh: 30, c: 'doc', d: 200,
    ht: '⋮<br>김동인, 「배따라기」, 『창조』, 1921년<br>염상섭, 「표본실의 청개구리」, 『개벽』, 1921년<br>염상섭, 「묘지」, 『신생활』, 1922년<br><b>염상섭, 「지상선을 위하여」, 『신생활』, 1922년 7월</b><br>현진건, 「운수 좋은 날」, 『개벽』, 1924년<br>나도향, 「벙어리 삼룡이」, 『여명』, 1925년<br>⋮',
  },
};
const INFO_UP = DOC_H + 18;

// ---------------------------------------------------------------- 3 컨텍스트: 쌓이는 막대

const ROW = 20;
const BARH = 12;

// 문답 한 쌍의 막대 너비. 9번은 답이 길다
const QW = [0, 250, 250, 210, 190, 240, 160, 220, 180, 230, 200, 170, 240, 190, 220];
const AW = [0, [340], [330], [270], [400], [300], [440], [260], [380], [450, 470, 300], [430, 280], [320], [390], [350], [290]];
const INFW = [400, 260, 430, 350, 460, 300, 380, 440, 280, 410, 330, 450, 310, 390, 270, 420, 340];

const aid = (n, i) => 'a' + n + (i ? 'abc'[i] : '');
const pairRows = n => [
  { id: 'q' + n, w: QW[n], c: 'q' },
  ...AW[n].map((w, i) => ({ id: aid(n, i), w, c: 'ans' })),
];

// 처음 나타날 때 출발하는 자리 (글이 있던 곳, 입출력 자리)
const ioQ = n => ({ x: 420 - QW[n], y: IOY - BARH / 2, w: QW[n], h: BARH });
const ioA = (n, i) => ({ x: 1180, y: IOY - (AW[n].length * ROW - 8) / 2 + ROW * i, w: AW[n][i], h: BARH });

// 대화 기록 상자 안의 줄. n쌍이 든 상자의 k째 줄 가운데 높이
const HPAD = 14;
const HLINE = 34;
const hboxH = n => HPAD * 2 + HLINE * (1 + 2 * n);
const hline = (n, k) => FLOOR - hboxH(n) + HPAD + HLINE / 2 + HLINE * k;
const fromLine = (k, w) => ({ x: LEFT + 18, y: hline(3, k) - 10, w, h: 20 });

const FROM = {
  sp1: { x: 585, y: FLOOR - INFO_UP - 66, w: 430, h: 22 },
  sp2: { x: 585, y: FLOOR - INFO_UP - 66, w: 430, h: 22 },
  si1: { x: LEFT + 20, y: FLOOR - DOC_H + 50, w: 360, h: 20 },
  si2: { x: LEFT + 20, y: FLOOR - DOC_H + 82, w: 450, h: 20 },
  hh: fromLine(0, 300),
  q1: fromLine(1, 330), a1: fromLine(2, 350),
  q2: fromLine(3, 330), a2: fromLine(4, 340),
  q3: fromLine(5, 300), a3: fromLine(6, 260),
  q4: ioQ(4), q8: ioQ(8),
};

// 위에서 아래로 적은 묶음들을 바닥에서부터 쌓는다. gap 은 그 묶음 위의 틈
function pile(groups, floor) {
  const out = {};
  let y = floor;
  for (let g = groups.length - 1; g >= 0; g--) {
    const rows = groups[g].rows;
    for (let r = rows.length - 1; r >= 0; r--) {
      const row = rows[r];
      out[row.id] = { k: 'r', x: LEFT, y: y - BARH, w: row.w, h: BARH, c: row.c, g: groups[g].name };
      if (FROM[row.id]) out[row.id].from = FROM[row.id];
      y -= ROW;
    }
    y -= groups[g].gap != null ? groups[g].gap : 10;
  }
  return out;
}

// 컨텍스트가 쌓인 모습
//   pairs  기록에 든 문답 번호들      head   "이전 대화 기록" 줄이 있는지
//   sum    앞부분이 요약으로 바뀌었는지  info   자료 줄 수 (3 이상이면 상자를 두른다)
//   floor  바닥 높이                  faint  가운데가 흐려지는지
//   red    상자 밖으로 나간 줄을 붉게   mark   잘릴 문답 번호들, squeeze 요약될 문답 번호들
//   ask    답이 아직 없는 질문의 번호
function ctx(o) {
  o = o || {};
  const pairs = o.pairs || [];
  const info = o.info || 2;
  const wide = info > 2;
  const groups = [
    { name: 'sys', rows: [{ id: 'sp1', w: 440, c: 'sys' }, { id: 'sp2', w: 300, c: 'sys' }] },
    { name: 'sys', rows: [{ id: 'sg1', w: 330, c: 'sys' }] },
    { name: 'inf', rows: INFW.slice(0, info).map((w, i) => ({ id: 'si' + (i + 1), w, c: 'inf' })), gap: wide ? 26 : 10 },
  ];
  if (o.head || pairs.length || o.sum) groups.push({ name: 'head', rows: [{ id: 'hh', w: 280, c: 'sys' }], gap: wide ? 26 : 10 });
  if (o.sum) groups.push({ name: 'sum', rows: [{ id: 'sm1', w: 420, c: 'sum' }, { id: 'sm2', w: 300, c: 'sum' }] });
  pairs.forEach((n, i) => groups.push({ name: 'p' + n, rows: pairRows(n), gap: i || o.sum ? 8 : 10 }));
  if (o.ask) groups.push({ name: 'ask', rows: [{ id: 'q' + o.ask, w: QW[o.ask], c: 'q' }], gap: 8 });

  const out = pile(groups, o.floor || FLOOR);
  const tag = (test, cls) => {
    for (const id in out) if (test(out[id])) out[id].c += ' ' + cls;
  };

  if (o.red) tag(b => b.y < BOX.y, 'out');
  if (o.faint) {
    const keep = new Set(['sys', 'inf', ...pairs.slice(-2).map(n => 'p' + n)]);
    tag(b => !keep.has(b.g), 'faint');
  }
  if (o.mark) tag(b => o.mark.some(n => b.g === 'p' + n), 'cut');
  if (o.squeeze) tag(b => o.squeeze.some(n => b.g === 'p' + n), 'faint');

  if (wide) {
    const ys = INFW.slice(0, info).map((w, i) => out['si' + (i + 1)].y);
    out.ibox2 = { k: 'b', x: LEFT - 14, y: ys[0] - 14, w: 528, h: ys[ys.length - 1] - ys[0] + BARH + 28, c: 'thin em' };
  }
  return out;
}

// 입출력 자리에 막대로 놓인 문답
function ioBars(n, both) {
  const out = { ['q' + n]: { k: 'r', ...ioQ(n), c: 'q' } };
  if (both) AW[n].forEach((w, i) => { out[aid(n, i)] = { k: 'r', ...ioA(n, i), c: 'ans' }; });
  return out;
}

const BASE = merge(SHELL, FEED);
const scn = (o, ...more) => merge(BASE, ctx(o), ...more);

// 문답 n 이 막대로 나타났다가 기록으로 들어간다
function addPair(pairs, n, at, gap) {
  return [
    { at, sc: scn({ pairs }, ioBars(n, false)) },
    { at: at + gap, sc: scn({ pairs }, ioBars(n, true)) },
    { at: at + gap * 2 + 120, sc: scn({ pairs: [...pairs, n] }) },
  ];
}

// 여러 쌍을 이어서. 뒤로 갈수록 빨라진다
function addPairs(pairs, list, gap, faster) {
  const frames = [];
  let at = 0;
  let cur = pairs;
  for (const n of list) {
    frames.push(...addPair(cur, n, at, gap));
    cur = [...cur, n];
    at += gap * 2 + 120 + gap * 1.6;
    gap = Math.max(130, gap * (faster || 1));
  }
  const last = frames.pop();
  return { seq: frames, end: last.at, sc: last.sc };
}

// 막대들이 그 자리에서 옆으로 빠지며 사라진다
function leave(before, ns, to) {
  const out = {};
  for (const id in before) {
    const b = before[id];
    if (!b.g || !ns.some(n => b.g === 'p' + n)) continue;
    out[id] = { ...b, ...(to ? to(b) : { x: b.x - 90 }), o: 0 };
    delete out[id].from;
  }
  return out;
}

const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);

const TQ = [
  '',
  '시립대의 마스코트는 누구인가요?',
  '경희대의 마스코트는 누구인가요?',
  '둘 중에 누가 더 귀여운가요?',
];
const TA = [
  '',
  '시립대의 마스코트는 이루매입니다.',
  '경희대의 마스코트는 쿠옹입니다.',
  '‘둘’이 누구를 가리키는지 모르겠습니다.',
];
const CUTE = '당연히 루매가 더 귀엽죠!';

const SYS = ctx();

// 기억이 없는 문답. n째 문답이 보이고, 지난 것은 위로 빠져 있고, 올 것은 아래에 있다.
// dir 1 은 앞으로 넘길 때(새것이 아래에서 올라온다), -1 은 되감을 때(지난 것이 위에서 내려온다)
function talk(n, answered, dir) {
  const out = {};
  for (let p = 1; p <= 3; p++) {
    const where = p < n ? -64 : p > n ? 64 : 0;
    const from = { y: IOY + 64 * dir };
    const q = Q('tq' + p, TQ[p], { o: p === n ? 1 : 0, from, d: dir > 0 && p === n && n > 1 && !answered ? 250 : 0 })['tq' + p];
    const a = A('ta' + p, TA[p], { o: p === n && answered ? 1 : 0, from, d: 0 })['ta' + p];
    q.y += where;
    a.y += p === n && !answered ? 64 : where;
    out['tq' + p] = q;
    out['ta' + p] = a;
  }
  return merge(BASE, SYS, out);
}

const rewind = {
  seq: [
    { at: 0, sc: talk(3, false, -1) },
    { at: 280, sc: talk(2, true, -1) },
    { at: 560, sc: talk(2, false, -1) },
    { at: 840, sc: talk(1, true, -1) },
  ],
  end: 1120,
  sc: talk(1, false, -1),
};

// 대화 기록 상자. n쌍이 글로 들어 있다. fresh: 상자가 지금 생기는 중, late: 막 들어오는 쌍
const HIDS = [null, ['tq1', 'ta1'], ['tq2', 'ta2'], ['tq3', 'ta3b']];
const HTEXT = [null, [TQ[1], TA[1]], [TQ[2], TA[2]], [TQ[3], CUTE]];

function hist(n, o) {
  o = o || {};
  const top = FLOOR - hboxH(n);
  const out = merge(BASE, ctx({ floor: top - 12 }), {
    hbox: { k: 'b', x: LEFT, y: top, w: 500, h: hboxH(n), c: 'thin' },
    hht: T(LEFT + 18, hline(n, 0), '다음은 이전 대화 기록입니다.', { al: 'lm', fs: 22, fw: 500, c: 'gray', d: o.fresh ? 250 : 0 }),
  });
  for (let p = 1; p <= n; p++) {
    const d = o.fresh ? 700 : 0;
    out[HIDS[p][0]] = T(LEFT + 18, hline(n, 2 * p - 1), HTEXT[p][0], { al: 'lm', fs: 22, fw: 600, d });
    out[HIDS[p][1]] = T(LEFT + 18, hline(n, 2 * p), HTEXT[p][1], { al: 'lm', fs: 22, fw: 600, c: 'blue', d: d && d + 150 });
  }
  if (o.hl) out.hl = { k: 'r', x: LEFT + 8, y: hline(n, 1) - HLINE / 2, w: 484, h: HLINE * 2 * n, c: 'hl' };
  return out;
}

// 답을 내기 전에 먼저 적는 글. 출력 자리의 답 위에 놓인다 (6장의 AI 상자 안에서 같은 모양으로 다시 나온다)
const THINK3 = {
  thb: { k: 'b', x: 1166, y: 306, w: 392, h: 98, c: 'thin dash', d: 300 },
  thl: T(1182, 306, '추론', { al: 'lm', fs: 19, fw: 700, c: 'gray tag', d: 300 }),
  tht: T(1184, 356, '‘둘’이면 아까 그 이루매랑 쿠옹이네.\n둘 중에는 당연히 루매가 귀엽지!', { al: 'lm', fs: 21, fw: 500, lh: 34, c: 'gray', d: 500 }),
};

// 구조를 한 번 되짚는다. 대화 기록도 막대로 줄어 있다
const scRecap = (() => {
  const c = ctx({ pairs: [1, 2, 3] });
  const lab = (id, y, t, d) => ({ [id]: T(418, y, t, { al: 'rm', fs: 24, fw: 600, c: 'dim', d }) });
  return merge(BASE, c,
    lab('rc1', c.sp2.y - 4, '역할과 과업', 0),
    lab('rc2', c.sg1.y + 6, '지침', 150),
    lab('rc3', c.si2.y - 4, '참고 자료', 300),
    lab('rc4', (c.q1.y + c.a3.y + BARH) / 2, '대화 기록', 450));
})();

const FULL = range(1, 8);
const scFull = scn({ pairs: FULL });
const pileUp = addPairs([1, 2, 3], range(4, 8), 300, 0.82);

// ---------------------------------------------------------------- 4 한계와 대책

const overIn = addPairs(FULL, [9], 320);

const CITE = 'Liu, N. F., Lin, K., Hewitt, J., Paranjape, A., Bevilacqua, M., Petroni, F., & Liang, P. (2024). ' +
  'Lost in the middle: How language models use long contexts. ' +
  'Transactions of the Association for Computational Linguistics, 12, 157–173.';

// 잘라내기: 넘치면 오래된 문답부터 버린다
function cutFrames(pairs, drop, at) {
  const before = ctx({ pairs });
  const after = pairs.filter(n => !drop.includes(n));
  return {
    seq: [{ at, sc: scn({ pairs, mark: drop }) }],
    end: at + 620,
    sc: scn({ pairs: after }, leave(ctx({ pairs, mark: drop }), drop)),
    pairs: after,
    before,
  };
}

const cut1 = cutFrames(range(1, 9), [1, 2], 0);

// 넣고, 넘치고, 자르기를 두 번 더
const cutLoop = (() => {
  const frames = [];
  let at = 0;
  let cur = cut1.pairs;
  const add = n => {
    frames.push(...addPair(cur, n, at, 260));
    cur = [...cur, n];
    at += 260 * 2 + 120 + 650;
  };
  const cut = drop => {
    const c = cutFrames(cur, drop, at);
    frames.push(...c.seq, { at: c.end, sc: c.sc });
    cur = c.pairs;
    at = c.end + 750;
  };
  add(10); cut([3, 4]);
  add(11); add(12); cut([5, 6]);
  const last = frames.pop();
  return { seq: frames, end: last.at, sc: last.sc, pairs: cur };
})();

const sumIn = addPairs(cutLoop.pairs, [13, 14], 260);
const SUM_OLD = cutLoop.pairs;          // 요약으로 바뀌는 문답들
const SUM_ALL = [...SUM_OLD, 13, 14];
const scSum = (() => {
  const after = ctx({ sum: true, pairs: [13, 14] });
  const gone = leave(ctx({ pairs: SUM_ALL }), SUM_OLD, b => ({ x: LEFT, y: after.sm1.y + 10, w: b.w * 0.5 }));
  return merge(BASE, after, gone);
})();

// ---------------------------------------------------------------- 넓은 판: 상자 오른쪽에 저장소와 도구
// 4장 끝에서 서비스 상자가 옆으로 넓어진다. 왼쪽 칸에 쌓이는 것과 LLM, 오른쪽 칸에 상자 밖에 둔 것들

for (let n = 15; n <= 30; n++) {
  QW[n] = 160 + (n * 37) % 90;
  AW[n] = [260 + (n * 53) % 190];
}

const WBOX = { x: 440, y: 88, w: 720, h: 742 };
const WL = 464;        // 쌓이는 칸의 왼쪽
const K = 0.75;        // 넓은 판에서 막대 너비에 곱하는 값
const RX = 866;        // 오른쪽 칸의 왼쪽
const RW = 270;
const CALLY = 745;     // LLM이 낸 도구 호출이 보이는 높이
const TOOLY = 600;

const WSHELL = {
  sbox: { k: 'b', ...WBOX },
  mbox: { k: 'b', x: 550, y: 695, w: 180, h: 100, c: 'solid' },
  mtx: T(640, 745, 'LLM', { fs: 44, fw: 800 }),
  ...arrows(440, 56),
  afeed: { k: 'a', x: 640, y: 646, len: 42, dir: 'd' },
};

const WQ = (id, t, o) => ({ [id]: T(356, IOY, t, { al: 'rm', fs: 28, lh: 42, w: 330, ...o }) });
const WA = (id, t, o) => ({ [id]: T(1244, IOY, t, { al: 'lm', fs: 28, lh: 42, w: 330, c: 'blue', ...o }) });
const STATUS = (id, t) => ({ [id]: T(1244, IOY, t, { al: 'lm', fs: 26, fw: 500, c: 'dim' }) });

const wioQ = n => ({ ['q' + n]: { k: 'r', x: 356 - QW[n] * K, y: IOY - BARH / 2, w: QW[n] * K, h: BARH, c: 'q' } });
const wioA = n => Object.fromEntries(AW[n].map((w, i) =>
  [aid(n, i), { k: 'r', x: 1244, y: IOY - (AW[n].length * ROW - 8) / 2 + ROW * i, w: w * K, h: BARH, c: 'ans' }]));

// 묶음마다 h(막대 높이)와 pitch(줄 간격)를 따로 줄 수 있다
function wpile(groups, floor, left) {
  const out = {};
  let y = floor || FLOOR;
  for (let g = groups.length - 1; g >= 0; g--) {
    const G = groups[g];
    const h = G.h || BARH;
    const pitch = G.pitch || ROW;
    for (let r = G.rows.length - 1; r >= 0; r--) {
      const row = G.rows[r];
      out[row.id] = { k: 'r', x: left || WL, y: y - h, w: Math.round(row.w * K), h, c: row.c, g: G.name };
      if (row.from) out[row.id].from = row.from;
      y -= pitch;
    }
    y -= G.gap != null ? G.gap : 10;
  }
  return out;
}

const W = (groups, ...more) => merge(WSHELL, wpile(groups), ...more);

const RULE_FROM = { x: WL, y: FLOOR - 62, w: 330, h: 20 };
const gSys = rule => [
  { name: 'sys', rows: [{ id: 'sp1', w: 440, c: 'sys' }, { id: 'sp2', w: 300, c: 'sys' }] },
  { name: 'sys', rows: [{ id: 'sg1', w: 330, c: 'sys' }, ...(rule ? [{ id: 'sg2', w: 420, c: 'sys', from: RULE_FROM }] : [])] },
];
const gHead = { name: 'head', rows: [{ id: 'hh', w: 280, c: 'sys' }] };
const gSum = { name: 'sum', rows: [{ id: 'sm1', w: 420, c: 'sum' }, { id: 'sm2', w: 300, c: 'sum' }] };
const gPair = (n, mod) => ({ name: 'p' + n, rows: pairRows(n).map(r => (mod ? mod(r) : r)), gap: 8 });
const gInfo = ns => ({ name: 'inf', rows: ns.map(i => ({ id: 'si' + i, w: INFW[i - 1], c: 'inf' })) });

// 상자 밖에 둔 자료 (막대로 줄여 그린 것)
const STN = INFW.length;
function store() {
  const out = { stbox: { k: 'b', x: RX, y: 120, w: RW, h: 18 * STN + 26, c: 'thin' } };
  for (let i = 1; i <= STN; i++) {
    out['si' + i] = { k: 'r', x: RX + 16, y: 136 + 18 * (i - 1), w: INFW[i - 1] * 0.5, h: 8, c: 'inf' };
  }
  return out;
}

// ---- 4장: 입력이 많아지면 한 줄에 쏠리는 주의가 줄어든다 (LLM에서 나온 화살표가 줄들을 가리킨다)
function attention(o, n, sw) {
  const c = ctx(o);
  const bars = Object.keys(c).filter(id => c[id].g).sort((a, b) => c[a].y - c[b].y);
  const out = {};
  for (let i = 0; i < n; i++) {
    const b = c[bars[Math.min(bars.length - 1, Math.floor((i + 0.5) * bars.length / n))]];
    const y = b.y + BARH / 2;
    out['at' + i] = { k: 'w', x: 0, y: 0, p: `M 902 730 C 1030 690, 1070 ${y}, ${b.x + b.w + 12} ${y}`, sw, c: 'head', d: 30 * i };
  }
  return merge(BASE, c, out);
}
const FEW = { pairs: [1, 2, 3], ask: 4 };
const MANY = { pairs: range(1, 7), ask: 8 };

// ---- 4장 끝: 자료를 밖에 두고, 질문에 맞는 것만 찾아서 넣는다 (RAG)
const OLD = [gHead, gSum, gPair(13), gPair(14)];
const DOC_BOX = 64;

const scInfoOver = scn({ sum: true, pairs: [13, 14], info: STN, red: true });
const scStore = W([...gSys(), ...OLD], store());

// 저장소에 든 서지 목록. 걸린 줄(hit)만 밝다
const SHELF = [
  ['김동인, 「배따라기」', '『창조』, 1921년'],
  ['염상섭, 「지상선을 위하여」', '『신생활』, 1922년 7월'],
  ['현진건, 「운수 좋은 날」', '『개벽』, 1924년'],
  ['나도향, 「벙어리 삼룡이」', '『여명』, 1925년'],
  ['이상, 「날개」', '『조광』, 1936년'],
  ['채만식, 「치숙」', '『동아일보』, 1938년'],
];
const shelfY = i => 176 + 50 * i;
function shelf(hit) {
  const out = {
    stbox: { k: 'b', x: RX, y: 120, w: RW, h: 356, c: 'thin' },
    sdot1: T(RX + 16, 140, '⋮', { al: 'lm', fs: 15, c: 'ent' }),
    sdot2: T(RX + 16, 458, '⋮', { al: 'lm', fs: 15, c: 'ent' }),
  };
  SHELF.forEach((e, i) => {
    out['se' + i] = { k: 't', x: RX + 16, y: shelfY(i), al: 'lm', fs: 15, fw: 600, lh: 21, c: 'ent' + (hit === i ? ' on' : ''), ht: e[0] + '<br><span>' + e[1] + '</span>', d: 40 * i };
  });
  return out;
}

// 걸린 줄을 베껴 온 것이 상자에 담겨 컨텍스트로 들어온 모습
function found(i) {
  const low = wpile(OLD);
  const top = Math.min(...Object.values(low).map(b => b.y)) - 10 - DOC_BOX;
  return merge(low, wpile(gSys(), top - 10), {
    ibox3: { k: 'b', x: WL, y: top, w: 353, h: DOC_BOX, c: 'thin em' },
    ['cp' + i]: T(WL + 14, top + DOC_BOX / 2, SHELF[i][0] + '\n' + SHELF[i][1], { al: 'lm', fs: 17, fw: 600, lh: 23, c: 'em', from: { x: RX + 16, y: shelfY(i), fs: 15 } }),
  });
}

const SQ1 = WQ('ask3', '염상섭의\n「지상선을 위하여」는\n어느 잡지에 실렸나요?');
const RAG = { rag: T(RX, 490, 'RAG · 검색 증강 생성\nRetrieval-Augmented Generation', { al: 'lt', fs: 17, fw: 500, lh: 26, c: 'dim', d: 500 }) };

const scSearchQ = merge(scStore, SQ1);
const scSearchHit = merge(W([...gSys(), ...OLD]), shelf(1), SQ1);
const scSearchIn = merge(WSHELL, found(1), shelf(1), SQ1, WA('an8', INFO_A, { d: 500 }), RAG);

// ---------------------------------------------------------------- 5 서사 창작에서의 LLM 기반 시스템
// 상자를 조금 키우고, 막대로 줄여 그리던 프롬프트를 글로 펼쳐 보인다

const LB = { x: 440, y: 70, w: 720, h: 770 };
const LL = 470;            // 상자 안쪽의 왼쪽
const LIN = 660;           // 안쪽 너비
const LFLOOR = 680;        // LLM 바로 위
const LSHELL = {
  sbox: { k: 'b', ...LB },
  mbox: { k: 'b', x: 710, y: 725, w: 180, h: 90, c: 'solid' },
  mtx: T(800, 770, 'LLM', { fs: 40, fw: 800 }),
  ...arrows(440, 56),
};
const LFEED = { afeed: { k: 'a', x: 800, y: 688, len: 32, dir: 'd' } };

// 프롬프트의 네 부분이 글로 드러난다
const INFO_ROWS = [420, 300, 460, 340];
const LT = (id, y, t, o) => ({ [id]: T(LL, y, t, { al: 'lt', fs: 22, fw: 600, lh: 32, ...o }) });
const CTOP = 358;          // 이전 내용 상자의 위
const LIT_TEXT = {
  ...LT('lp', 96, '당신은 전문적인 소설 작가입니다. …'),
  ...LT('lk', 140, '주어진 내용에 따라 소설을 창작하세요.\n지나치게 추상적인 표현은 피하세요. …'),
  libox: { k: 'b', x: LL, y: 216, w: LIN, h: 128, c: 'thin em' },
  litx: { k: 't', x: LL + 18, y: 226, al: 'lt', fs: 20, fw: 600, lh: 26, c: 'em', ht: '등장인물<br>배경<br>스토리<br>특징' },
  ...Object.fromEntries(INFO_ROWS.map((w, i) => ['si' + (i + 1), { k: 'r', x: LL + 130, y: 234 + 26 * i, w, h: 10, c: 'inf', o: 0.55 }])),
  lcbox: { k: 'b', x: LL, y: CTOP, w: LIN, h: LFLOOR - CTOP, c: 'thin' },
  lch: T(LL + 18, CTOP + 10, '이전 내용', { al: 'lt', fs: 20, fw: 500, c: 'gray' }),
};
const LIT = merge(LSHELL, LFEED, LIT_TEXT);

// 소설을 이어 쓰는 예. 대답만 이전 내용에 붙는다
const NOVEL_Q = WQ('ask7n', '황해도 연백군을 배경으로 한국전쟁 당시의 혼란했던 상황을 소설로 쓰려고 합니다. 도입부를 작성해주세요.', { fs: 23, lh: 35 });
const GO_ON = WQ('ask7', '이어서 써주세요.');
const YA = [
  '',
  '삼팔선이 그어졌다는 말을 그는 장터 천막 뒤에서 들었다. 하루만 늦었어도 식구들을 영영 못 볼 뻔했다. …',
  '연백의 국민학교에는 풍금이 한 대 있었다. 떠돌며 익힌 가락은 접어 두고 그는 아이들에게 동요를 가르쳤다. …',
  '1950년 유월의 일요일 새벽, 북쪽에서 포성이 울렸다. 점심때가 되기 전에 낯선 군복이 운동장에 들어와 있었다. …',
];
const said = n => ({ ['ya' + n]: T(1244, IOY, YA[n], { al: 'lm', fs: 21, fw: 500, lh: 32, w: 330, c: 'blue', d: 500 }) });
function novel(n, ...more) {
  const out = {};
  let y = LFLOOR - 12;
  for (let i = n; i >= 1; i--) {
    out['ya' + i] = T(LL + 18, y - 26, YA[i], { al: 'lm', fs: 18, fw: 500, lh: 26, w: 624, c: 'blue' });
    y -= 62;
  }
  return merge(LIT, out, ...more);
}

// 짜장면 장면. 노랫말을 그대로 싣지 않고 줄거리만 옮겨 적었다
const JJ = '집이 가난했다. 매일 먹는 라면에 싫증이 난 아이가 투정을 부리자 어머니는 아껴둔 비상금을 꺼내어 짜장면을 시켜 주셨다. 아이는 신이 나서 먹었고, 어머니는 드시지 않았다. 짜장면이 싫다고 하셨다.';
const JJ_SUM = '어머니가 짜장면이 싫다고 하신다.';
const JJ_H = 78;

// 이전 내용 상자에 쌓인 것. 'jj' 짜장면 장면(글), 'sum' 요약된 앞부분, 숫자는 그 뒤에 생성된 장면(막대 두 줄)
const GW = [null, [600, 430], [580, 500], [610, 380], [590, 460], [600, 410]];
function story(list) {
  const out = {};
  let y = LFLOOR - 12;
  for (let i = list.length - 1; i >= 0; i--) {
    const it = list[i];
    if (it === 'jj') {
      out.jj = T(LL + 18, y - JJ_H / 2, JJ, { al: 'lm', fs: 18, fw: 500, lh: 26, w: 624, c: 'blue' });
      y -= JJ_H + 10;
    } else if (it === 'sum') {
      out.g2a = { k: 'r', x: LL + 18, y: y - 12, w: 240, h: BARH, c: 'sum' };
      out.g1a = { k: 'r', x: LL + 18, y: y - 32, w: 300, h: BARH, c: 'sum' };
      out.jjs = T(LL + 18, y - 58, JJ_SUM, { al: 'lm', fs: 18, fw: 600, lh: 26 });
      out.jj = T(LL + 18, y - 58, JJ, { al: 'lm', fs: 18, fw: 500, lh: 26, w: 624, c: 'blue', o: 0 });
      out.g1b = { k: 'r', x: LL + 18, y: y - 32, w: 200, h: BARH, c: 'ans', o: 0 };
      out.g2b = { k: 'r', x: LL + 18, y: y - 12, w: 200, h: BARH, c: 'ans', o: 0 };
      y -= 72 + 10;
    } else {
      out['g' + it + 'b'] = { k: 'r', x: LL + 18, y: y - 12, w: GW[it][1], h: BARH, c: 'ans' };
      out['g' + it + 'a'] = { k: 'r', x: LL + 18, y: y - 32, w: GW[it][0], h: BARH, c: 'ans' };
      y -= 40 + 10;
    }
  }
  return out;
}

// 방금 생성된 장면이 출력 자리에 막대로 나온 모습
const fresh = n => ({
  ['g' + n + 'a']: { k: 'r', x: 1244, y: IOY - 16, w: GW[n][0] * 0.5, h: BARH, c: 'ans' },
  ['g' + n + 'b']: { k: 'r', x: 1244, y: IOY + 4, w: GW[n][1] * 0.5, h: BARH, c: 'ans' },
});
const lit = (list, ...more) => merge(LIT, story(list), ...more);

// 생성된 장면이 차례로 이전 내용에 붙는다
function writing(list, add, q, gap) {
  const frames = [];
  let at = 0;
  let cur = list;
  for (const n of add) {
    frames.push({ at, sc: lit(cur, q, fresh(n)) });
    cur = [...cur, n];
    frames.push({ at: at + gap, sc: lit(cur, q) });
    at += gap * 2.2;
  }
  const last = frames.pop();
  return { seq: frames, end: last.at, sc: last.sc };
}

// 짜장면 벤치마크: 상자 안을 비우고 질문만 넣는다
const JJ_NAME = { jjname: T(440, 40, '짜장면 벤치마크', { al: 'lm', fs: 28, fw: 700 }) };
const JJ_Q = {
  jjin: {
    k: 't', x: 356, y: IOY, al: 'rm', w: 330, fs: 20, fw: 500, lh: 31, c: 'tl pass',
    ht: '<span>' + JJ + '</span><br><br><b>어머니는 왜 짜장면이 싫다고 하셨을까요?</b>',
  },
};
const bench = (...more) => merge(LSHELL, JJ_NAME, JJ_Q, ...more);
const PHOTO = '../assets/업스테이지 발표회_짜장면 벤치.png';

// 같은 장면이 소설을 쓰는 동안 어떻게 되는지
const FAM_Q = WQ('ask8', '가난 속에서도 드러나는 가족애를 주제로 한 장면을 써 주세요.');
const JJ_OUT = { jj: T(1244, IOY, JJ, { al: 'lm', fs: 20, fw: 500, lh: 31, w: 330, c: 'blue', d: 600 }) };
const famPush = writing(['jj'], [1, 2, 3], GO_ON, 480);
const FULL_STORY = ['jj', 1, 2, 3];

const famOut = {
  seq: [{ at: 0, sc: lit(FULL_STORY, GO_ON, fresh(4)) }],
  end: 650,
  sc: lit([1, 2, 3, 4], GO_ON, { jj: T(LL + 18, CTOP - 30, JJ, { al: 'lm', fs: 18, fw: 500, lh: 26, w: 624, c: 'blue', o: 0 }) }),
};
const famSum = {
  seq: [{ at: 0, sc: lit(FULL_STORY, GO_ON, fresh(4)) }],
  end: 650,
  sc: lit(['sum', 3, 4], GO_ON),
};

// 원본을 밖에 두고 찾아오게 했을 때. 짜장면 장면은 저장소에 있지만 걸리지 않는다.
// 저장소의 글이 읽히도록 상자를 옆으로 더 넓힌다
const FB = { x: 400, y: 88, w: 800, h: 742 };
const FRX = 820;           // 저장소의 왼쪽
const FRW = 356;
const FSHELL = {
  sbox: { k: 'b', ...FB },
  mbox: { k: 'b', x: 510, y: 695, w: 180, h: 100, c: 'solid' },
  mtx: T(600, 745, 'LLM', { fs: 44, fw: 800 }),
  ...arrows(400, 50),
  afeed: { k: 'a', x: 600, y: 646, len: 42, dir: 'd' },
};
const RAG_Q = { ask9: T(326, IOY, '초반에 나온,\n가족애가 드러나는 장면을\n참고해서 이어서 써주세요.', { al: 'rm', fs: 25, lh: 39, w: 300 }) };
const block = n => ({ name: 'g' + n, gap: 8, rows: [{ id: 'g' + n + 'a', w: GW[n][0] * 0.72, c: 'ans' }, { id: 'g' + n + 'b', w: GW[n][1] * 0.72, c: 'ans' }] });
const famRag = (asked, miss) => merge(
  FSHELL,
  wpile([...gSys(), { name: 'inf', rows: INFO_ROWS.map((w, i) => ({ id: 'si' + (i + 1), w, c: 'inf' })) }, gHead, block(3)], null, 424),
  {
    stbox: { k: 'b', x: FRX, y: 120, w: FRW, h: 252, c: 'thin' + (miss ? ' miss' : '') },
    jj: T(FRX + 16, 134, JJ, { al: 'lt', fs: 17, fw: 500, lh: 25, w: 324, c: 'blue' }),
    g1a: { k: 'r', x: FRX + 16, y: 296, w: 300, h: 8, c: 'ans' },
    g1b: { k: 'r', x: FRX + 16, y: 310, w: 215, h: 8, c: 'ans' },
    g2a: { k: 'r', x: FRX + 16, y: 332, w: 290, h: 8, c: 'ans' },
    g2b: { k: 'r', x: FRX + 16, y: 346, w: 250, h: 8, c: 'ans' },
  },
  asked ? RAG_Q : null,
  miss ? { smiss: T(FRX + FRW / 2, 400, '검색 결과 없음', { fs: 22, fw: 700, c: 'warn' }) } : null,
);

// ---------------------------------------------------------------- 6 에이전트의 이해
// 시스템 상자가 `AI` 상자 하나로 줄어들고, 그 상자가 사용자와 도구에 선으로 이어진다.
// 선은 k: 'w' (p 는 SVG 경로). 곧은 선도 둥근 선과 같은 꼴(M C C)로 적어 두어서, 단계가 바뀌면 서로 휘어 간다

const r1 = v => Math.round(v * 10) / 10;
const pt = (x, y) => r1(x) + ' ' + r1(y);
const wire = (p, o) => ({ k: 'w', x: 0, y: 0, p, c: 'head', ...o });

function straight(x0, y0, x1, y1) {
  const at = t => pt(x0 + (x1 - x0) * t, y0 + (y1 - y0) * t);
  return `M ${at(0)} C ${at(1 / 6)}, ${at(2 / 6)}, ${at(3 / 6)} C ${at(4 / 6)}, ${at(5 / 6)}, ${at(1)}`;
}

// 원의 한 토막. 가운데 (cx, cy), 반지름 r, 각 a0 에서 a1 까지 (각이 커지는 쪽이 화면에서 시계 방향)
function arc(cx, cy, r, a0, a1) {
  const p = a => [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  const seg = (b0, b1) => {
    const k = 4 / 3 * Math.tan((b1 - b0) / 4) * r;
    const [x0, y0] = p(b0);
    const [x1, y1] = p(b1);
    return `C ${pt(x0 - k * Math.sin(b0), y0 + k * Math.cos(b0))}, ${pt(x1 + k * Math.sin(b1), y1 - k * Math.cos(b1))}, ${pt(x1, y1)}`;
  };
  const am = (a0 + a1) / 2;
  return `M ${pt(...p(a0))} ${seg(a0, am)} ${seg(am, a1)}`;
}

// ---- 시스템 상자가 줄어든다: 절반 → 처음의 LLM 상자만 한 크기 → 안의 것이 사라지고 `AI`
const scBars = scn({ pairs: [1, 2, 3] });

function shrink(sc, k) {
  const out = {};
  for (const id in sc) {
    if (id === 'ain' || id === 'aout') continue;
    const a = { ...sc[id] };
    delete a.from;
    delete a.d;
    a.x = 800 + (a.x - 800) * k;
    a.y = IOY + (a.y - 459) * k;
    if (a.w != null) a.w *= k;
    if (a.h != null) a.h = Math.max(3, a.h * k);
    if (a.fs) a.fs *= k;
    if (a.len) a.len *= k;
    out[id] = a;
  }
  return out;
}

const HW = 260;            // 처음의 LLM 상자 크기
const HH = 170;
const hub = (bid, tid, cy, t) => ({
  [bid]: { k: 'b', x: 800 - HW / 2, y: cy - HH / 2, w: HW, h: HH, c: 'solid' },
  [tid]: T(800, cy, t, { fs: 58, fw: 800 }),
});
const AI = hub('sbox', 'ait', IOY, 'AI');

const scSmall = (() => {
  const tiny = (y, w, c) => ({ k: 'r', x: 690, y, w, h: 6, c });
  return {
    sbox: AI.sbox,
    sp1: tiny(381, 170, 'sys'),
    sp2: tiny(393, 118, 'sys'),
    sg1: tiny(407, 132, 'sys'),
    si1: tiny(421, 150, 'inf'),
    si2: tiny(433, 110, 'inf'),
    q1: tiny(447, 90, 'q'),
    a1: tiny(459, 140, 'ans'),
    mbox: { k: 'b', x: 755, y: 483, w: 90, h: 36, c: 'solid thin' },
    mtx: T(800, 501, 'LLM', { fs: 17, fw: 800 }),
  };
})();

// 상자 양옆의 `텍스트`와 화살표. 1장의 LLM 상자 컷과 같은 자리다
const io = (y, a, b) => ({
  tin: T(508, y, '텍스트', { al: 'rm', fs: 40 }),
  tout: T(1092, y, '텍스트', { al: 'lm', fs: 40, c: 'blue', d: 900 }),
  [a]: wire(straight(528, y, 658, y), { d: 250 }),
  [b]: wire(straight(942, y, 1072, y), { d: 650 }),
});
// `?` 상자는 AI 가 낸 글을 오른쪽에서 받고 왼쪽으로 돌려준다. 다음 컷에서 이 두 화살표가 휘어 AI 상자와 이어진다
const ioBack = (y, a, b) => ({
  tin: T(1092, y, '텍스트', { al: 'lm', fs: 40 }),
  tout: T(508, y, '텍스트', { al: 'rm', fs: 40, c: 'blue', d: 900 }),
  [a]: wire(straight(1072, y, 942, y), { d: 250 }),
  [b]: wire(straight(658, y, 528, y), { d: 650 }),
});

// ---- 고리. AI 상자와 dy 만큼 떨어진 상자가 한 원 위에 있다. 나가는 선은 AI 의 오른쪽에서, 들어오는 선은 왼쪽으로
const RD = 320;
function ring(id, dy) {
  const hx = HW / 2 + 12;
  const cy = IOY + dy / 2;
  const r = Math.hypot(hx, dy / 2);
  const b = Math.atan2(dy / 2, hx);
  return {
    [id + 'o']: wire(arc(800, cy, r, -b, b)),
    [id + 'i']: wire(arc(800, cy, r, Math.PI - b, Math.PI + b)),
  };
}
const USER = hub('ubox', 'utx', IOY + RD, '사용자');
const QBOX = hub('qbox', 'qtx', IOY - RD, '?');
const scUser = merge(AI, USER, ring('w', RD));

// ---- 그림. 위에서부터 바깥의 것들, 도구들, AI, 사용자. 에이전트 상자가 AI 를 두르고, 도구는 그 윗변에 걸친다
//   cols   { l c r: { tool 도구 이름, out 바깥의 것 이름, kind 'agent' 면 작은 에이전트 } }
//   direct 사용자와 파일을 바로 잇는 선     agent  에이전트 상자, name 이면 이름을 붙이는 컷
//   view   그림을 놓는 자리와 배율          lit    { 선: 색 } 밝은 선, idle 나머지 선의 색
//   on     { 상자: 색 }                   share  파일과 가운데 바깥 것을 잇는 선, self 파일에서 AI 로 바로 가는 선 (글이면 그 선의 이름)
const DW = 220;
const DH = 110;
const COLX = { l: 500, c: 800, r: 1100 };
const ROWY = { out: 92, tool: 292, ai: 545, user: 790 };
const WHOLE = { s: 1, cx: 800, cy: 450 };
const ASIDE = { s: 0.74, cx: 440, cy: 450 };
const ABOX = { x: 350, y: 292, w: 900, h: 373 };

// 상자 안에 들어가는 글자 크기. 한글은 한 칸, 나머지는 반 칸 남짓으로 센다
const fit = t => Math.min(34, 196 / [...t].reduce((n, ch) => n + (ch > '\u2e7f' ? 1 : ch === ' ' || ch === '·' ? 0.35 : 0.6), 0));

const LID = {};
const lid = t => LID[t] || (LID[t] = Object.keys(LID).length + 1);

function dia(o) {
  o = o || {};
  const v = o.view || WHOLE;
  const X = x => v.cx + (x - 800) * v.s;
  const Y = y => v.cy + (y - 450) * v.s;
  const S = n => n * v.s;
  const lit = o.lit || {};
  const on = o.on || {};
  const out = {};

  const box = (id, cx, cy) => {
    out[id] = { k: 'b', x: X(cx - DW / 2), y: Y(cy - DH / 2), w: S(DW), h: S(DH), c: 'solid' + (on[id] ? ' ' + on[id] : '') };
  };
  const label = (id, cx, cy, t, more) => {
    out[id] = T(X(cx), Y(cy), t, { fs: S(fit(t)), fw: 700, from: { y: Y(cy) + S(26) }, ...more });
  };
  const cls = (id, more) => 'head' + (more ? ' ' + more : '') + (lit[id] || o.idle ? ' ' + (lit[id] || o.idle) : '');
  const line = (id, x0, y0, x1, y1) => {
    out[id] = wire(straight(X(x0), Y(y0), X(x1), Y(y1)), { c: cls(id), sw: lit[id] ? 4 : 3 });
  };
  // 두 점을 오가는 한 쌍. side 는 나가는 선이 놓이는 쪽
  const pair = (id, ax, ay, bx, by, side) => {
    const len = Math.hypot(bx - ax, by - ay);
    const ux = (bx - ax) / len;
    const uy = (by - ay) / len;
    const nx = -uy * 12 * side;
    const ny = ux * 12 * side;
    const g = 12;
    line(id + 'o', ax + ux * g + nx, ay + uy * g + ny, bx - ux * g + nx, by - uy * g + ny);
    line(id + 'i', bx - ux * g - nx, by - uy * g - ny, ax + ux * g - nx, ay + uy * g - ny);
  };

  box('sbox', 800, ROWY.ai);
  out.ait = T(X(800), Y(ROWY.ai), 'AI', { fs: S(42), fw: 800 });
  box('ubox', 800, ROWY.user);
  out.utx = T(X(800), Y(ROWY.user), '사용자', { fs: S(34), fw: 700 });
  pair('w', 800, ROWY.ai + DH / 2, 800, ROWY.user - DH / 2, 1);

  const cols = o.cols || {};
  const LINK = { l: ['w1', -64], c: ['w2', 0], r: ['w3', 64] };
  const BOXID = { l: 'tbl', c: 'qbox', r: 'tbr' };
  for (const k of ['l', 'c', 'r']) {
    const col = cols[k];
    if (!col) continue;
    const x = COLX[k];
    box(BOXID[k], x, ROWY.tool);
    if (col.tool === '?') out.qtx = T(X(x), Y(ROWY.tool), '?', { fs: S(46), fw: 800 });
    else label('tt' + k + lid(col.tool), x, ROWY.tool, col.tool);
    pair(LINK[k][0], 800 + LINK[k][1], ROWY.ai - DH / 2, x, ROWY.tool + DH / 2, 1);
    if (!col.out) continue;
    box('ob' + k, x, ROWY.out);
    pair('x' + k, x, ROWY.tool - DH / 2, x, ROWY.out + DH / 2, 1);
    if (col.kind === 'agent') {
      if (!on['ob' + k]) out['ob' + k].c += ' blue';
      label('ot' + k + lid(col.out), x, ROWY.out - 31, col.out, { fs: S(24), fw: 800, c: 'blue' });
      [-56, 0, 56].forEach((dx, i) => {
        out['mg' + k + i] = { k: 'b', x: X(x + dx - 21), y: Y(ROWY.out - 9), w: S(42), h: S(18), c: 'thin' };
      });
      out['mg' + k + 'a'] = { k: 'b', x: X(x - 30), y: Y(ROWY.out + 20), w: S(60), h: S(24), c: 'thin' };
    } else {
      label('ot' + k + lid(col.out), x, ROWY.out, col.out, col.out === 'AI' ? { fs: S(42), fw: 800 } : null);
    }
  }

  const fx = COLX.l - DW / 2 - 12;       // 파일 상자의 왼쪽
  if (o.direct) {
    out.wuf = wire(
      `M ${pt(X(800 - DW / 2 - 12), Y(ROWY.user))} C ${pt(X(250), Y(ROWY.user))}, ${pt(X(180), Y(ROWY.out))}, ${pt(X(fx), Y(ROWY.out))}`,
      { c: cls('wuf', 'both'), sw: lit.wuf ? 4 : 3 });
  }
  if (o.self) {
    out.wself = wire(
      `M ${pt(X(fx), Y(ROWY.out))} C ${pt(X(200), Y(ROWY.out))}, ${pt(X(200), Y(ROWY.ai))}, ${pt(X(800 - DW / 2 - 12), Y(ROWY.ai))}`,
      { c: 'head em', sw: 4 });
    if (o.self !== true) out.tself = T(X(256), Y(318), o.self, { al: 'rm', fs: S(28), fw: 700, c: 'em' });
  }
  if (o.share) {
    out.wsh = wire(straight(X(COLX.l + DW / 2 + 14), Y(ROWY.out), X(COLX.c - DW / 2 - 14), Y(ROWY.out)), { c: cls('wsh', 'both'), sw: lit.wsh ? 4 : 3 });
  }

  if (o.agent) {
    out.abox = { k: 'b', x: X(ABOX.x), y: Y(ABOX.y), w: S(ABOX.w), h: S(ABOX.h), c: 'blue under' };
    out[o.agentName ? 'aname2' : 'aname'] = T(X(ABOX.x + 24), Y(ABOX.y + ABOX.h - 44), o.agentName || '에이전트', { al: 'lm', fs: S(40), fw: 800, c: 'blue' + (o.agentName ? ' wide' : '') });
    if (o.agent === 'name') out.atint = { k: 'r', x: X(ABOX.x), y: Y(ABOX.y), w: S(ABOX.w), h: S(ABOX.h), c: 'tint' };
  }
  return out;
}

const T_SEARCH = { tool: '검색 도구', out: '인터넷' };

// ---------------------------------------------------------------- 6-2 AI 의 안을 펼친다
// 그림은 왼쪽으로 물러나고(기둥이 CX1 에), 오른쪽에 AI 상자의 안이 펼쳐진다.
// 안에서는 LLM 위로 LLM 이 받는 글이 바닥에서부터 쌓이고, LLM 아래로 LLM 이 낸 글(추론, 그다음 출력)이 놓인다
const CX1 = 460;
const V1 = { s: 1, cx: CX1, cy: 450 };
const GAP = { out: (ROWY.out + ROWY.tool) / 2, tool: (ROWY.tool + ROWY.ai) / 2, user: (ROWY.ai + ROWY.user) / 2 };
const TOOL1 = { x: CX1, y: ROWY.tool };

const HB = { x: 940, y: 70, w: 620, h: 790 };
const HL = 968;            // 안쪽의 왼쪽
const HIN = 564;           // 안쪽 너비
const HMX = HB.x + HB.w / 2;
const HFLOOR = 548;        // LLM 바로 위
const HOUT = 692;          // LLM 바로 아래
const HBT = { x: HB.x, y: 30, w: HB.w, h: 840 };   // 7장의 키 큰 판

const SAY = {
  gS: { ht: '<b>검색 도구</b>  검색(검색어): 인터넷에서 찾아 준다' },
  gF: { ht: '<b>파일 도구</b>  읽기(이름), 쓰기(이름, 내용), 수정(이름, …)' },
  gC: { ht: '<b>코드 실행 도구</b>  실행(명령어): 터미널에서 돌려 준다' },
  hq: { t: '오늘 동대문구 날씨는 어때?' },
  hr1: { t: '지금 날씨는 내가 알 수가 없네. 검색해 봐야겠다.', c: 'gray' },
  hcall: { ht: '<b>검색 도구</b>  검색(동대문구 오늘 날씨)', c: 'blue' },
  hres: { t: '동대문구 현재 날씨: 3.2℃, 맑음, 미세먼지 보통', c: 'em' },
  hr2: { t: '3.2℃에 맑음이구나. 쌀쌀하다고 알려 줘야지.', c: 'gray' },
  hans: { t: '지금 3.2℃이고 맑아요. 겉옷을 챙기세요.', c: 'blue' },
  hkt1: { t: '기록이 꽤 쌓인 것 같은데, 얼마나 찼는지 볼까?', c: 'gray' },
  hk1: { ht: '<b>컨텍스트 도구</b>  상태()', c: 'blue' },
  hs1: { t: '87% 사용 중 · 도구 결과 4건이 61%', c: 'em' },
  hkt2: { t: '도구 결과가 너무 많네. 오래된 건 지워도 되겠다.', c: 'gray' },
  hk2: { ht: '<b>컨텍스트 도구</b>  지우기(도구 결과 1~3)', c: 'blue' },
  hs2: { t: '3건을 지웠음 · 41% 사용 중', c: 'em' },
  hkt3: { t: '앞의 대화도 요약으로 줄여 두는 게 좋겠다.', c: 'gray' },
  hk3: { ht: '<b>컨텍스트 도구</b>  요약(앞의 대화)', c: 'blue' },
  hs3: { t: '요약으로 바꿨음 · 18% 사용 중', c: 'em' },
  aq0: { t: '유치장에서 부역 혐의로 조사받는 장면을 써 줘.' },
  thk1: { t: '학교에서 노래 가르친 게 2장 끝이었지.\n무슨 노래였는지는 요약에 없네. 읽어 봐야겠다.', c: 'gray' },
  ac1: { ht: '<b>읽기</b>  2장 4번째 장면', c: 'blue' },
  ar1: { t: '… 교실 뒤에는 군관이 서 있었다. 그는 풍금 앞에 앉아\n그들이 가져온 악보를 펼쳤다. 아이들이 따라 불렀다. …', c: 'em' },
  thk2: { t: '조사관이 왜 안 떠났냐고 물을 텐데…\n다시는 안 떠돈다고 다짐하는 데가 어디였더라?', c: 'gray' },
  ac2: { ht: '<b>찾기</b>  “떠돌”', c: 'blue' },
  ar2: { t: '1장 1번째 장면 3째 줄 · 1장 3번째 장면 22째 줄', c: 'em' },
  thk3: { t: '1장 3번째, 학교에 자리 잡는 장면이구나.\n그 언저리만 읽으면 되겠다.', c: 'gray' },
  ac3: { ht: '<b>읽기</b>  1장 3번째 장면, 18~26째 줄', c: 'blue' },
  ar3: { t: '… 풍금 뚜껑을 닫으며 그는 생각했다. 다시는 떠돌지\n않겠다고. 식구들 얼굴을 매일 보는 데서 살겠다고. …', c: 'em' },
  thk4: { t: '조사관은 누구로 하지? 앞에 스쳐 간 사람이 있으면\n좋겠는데, 다 읽기는 많으니까 대신 읽어 달라고 하자.', c: 'gray' },
  ac4: { ht: '<b>읽기 에이전트</b>  조사관으로 쓸 만한, 앞에 나온 사람', c: 'blue' },
  ar4: { t: '3장 2번째 장면에 완장을 찬 옛 학부형이 나옵니다.', c: 'em' },
  thk5: { t: '새 인물로 할지 그 학부형으로 할지는\n내가 정할 게 아니지. 물어봐야겠다.', c: 'gray' },
  ac5: { ht: '<b>사용자에게 묻기</b>  조사관은 새 인물? 3장의 그 학부형?', c: 'blue' },
  ar5: { t: '학부형으로 하자. 서로 알아보게 해 줘.' },
  thk6: { t: '좋아, 재료는 다 모였네.\n집필에 넘길 지시서를 입력에 써 둬야지.', c: 'gray' },
  ac6: { ht: '<b>쓰기</b>  입력', c: 'blue' },
  ar6: { t: '입력에 썼습니다.', c: 'em' },
  thk7: { t: '이대로 보내도 되는지 먼저 보여 드려야겠다.', c: 'gray' },
  ac7: { ht: '<b>집필</b>', c: 'blue' },
  ar7: { t: '승인 · 입력에 한 줄을 보탬' },
  ar7b: { t: '출력에 썼습니다.', c: 'em' },
  thk8: { t: '읽어 보니 괜찮네.\n3장 끝에 넣고 요약도 붙여 둬야지.', c: 'gray' },
  ac8: { ht: '<b>원고에 넣기</b>  출력을 3장 끝에', c: 'blue' },
  ar8: { t: '3장 4번째 장면으로 넣었습니다.', c: 'em' },
  ac9: { t: '3장 끝에 넣었어요. 앞의 두 장면에서 가져다 썼어요.', c: 'blue' },
};
const GUIDE_BARS = [0, 380, 440, 330];

//   guide  도구 사용법: 줄 이름들, 수면 그만큼의 막대      hl    밝힐 사용법 줄
//   past   이전 기록 상자에 든 줄들      input 지금 들어온 줄들      think 추론 줄      out 낸 글
//   bars   막대로 줄인 기록 [{ id, w, c }]      outBar LLM 이 막 낸 막대
//   rule   지침 막대를 고친 모습 { w, c }       mod   { 이름: 덧붙일 것 }
//   tall   키 큰 판      note  노트의 줄들 (noteName 은 그 머리말)      index 원고의 장면 목록(막대 둘)      mini  지난 걸음들 (가는 막대)
function inside(o) {
  o = o || {};
  const seed = { x: CX1 - 20, y: ROWY.ai, w: 40, h: 4 };
  const out = {
    pbox: { k: 'b', ...(o.tall ? HBT : HB), c: 'blue thin', from: { x: CX1 - DW / 2, y: ROWY.ai - DH / 2, w: DW, h: DH } },
    mbox: { k: 'b', x: HMX - 85, y: HFLOOR + 42, w: 170, h: 64, c: 'solid', from: { x: CX1 - 20, y: ROWY.ai - 10, w: 40, h: 20 } },
    mtx: T(HMX, HFLOOR + 74, 'LLM', { fs: 34, fw: 800, from: { x: CX1, y: ROWY.ai, fs: 10 } }),
    afeed: { k: 'a', x: HMX, y: HFLOOR + 8, len: 28, dir: 'd' },
    hfo: { k: 'a', x: HMX, y: HFLOOR + 112, len: 26, dir: 'd' },
  };
  const say = (id, y, fs, lh) => {
    const s = SAY[id];
    out[id] = { k: 't', x: HL, y, al: 'lm', fs, fw: 500, c: s.c || '', ...(s.ht ? { ht: s.ht } : { t: s.t }), ...(lh ? { lh } : null) };
  };
  const rows = id => (SAY[id].t || '').split('\n').length;

  let y = HFLOOR;
  const input = o.input || [];
  for (let i = input.length - 1; i >= 0; i--) {
    const n = rows(input[i]);
    const h = 38 + 32 * (n - 1);
    say(input[i], y - h / 2, n > 1 ? 22 : 25, n > 1 ? 32 : 0);
    y -= h;
  }
  if (input.length) y -= 12;

  const past = o.past || [];
  if (past.length) {
    const h = 24 + 32 * (past.length + 1);
    out.hpb = { k: 'b', x: HL - 14, y: y - h, w: HIN + 28, h, c: 'thin' };
    let ly = y - 12 - 16;
    for (let i = past.length - 1; i >= 0; i--) { say(past[i], ly, 22); ly -= 32; }
    out.hph = T(HL, ly, '다음은 이전 대화 기록입니다.', { al: 'lm', fs: 22, fw: 500, c: 'gray' });
    y -= h + 14;
  }

  const bars = o.bars || [];
  for (let i = bars.length - 1; i >= 0; i--) {
    const b = bars[i];
    out[b.id] = { k: 'r', x: HL, y: y - BARH, w: b.w, h: BARH, c: b.c };
    if (b.from) out[b.id].from = b.from;
    y -= ROW;
  }
  if (bars.length) y -= 10;

  const mini = o.mini || [];
  for (let i = mini.length - 1; i >= 0; i--) {
    out[mini[i].id] = { k: 'r', x: HL, y: y - 7, w: mini[i].w, h: 7, c: mini[i].c, from: mini[i].from };
    y -= 12;
  }
  if (mini.length) y -= 10;

  if (o.index) {
    for (let i = 2; i >= 1; i--) {
      out['hx' + i] = { k: 'r', x: HL, y: y - 10, w: [0, 440, 380][i], h: 10, c: 'inf' };
      y -= 16;
    }
    out.hxh = T(HL, y - 16, '원고의 장면 목록', { al: 'lm', fs: 20, fw: 500, c: 'gray' });
    y -= 42;
  }
  if (o.note) {
    for (let i = o.note.length - 1; i >= 0; i--) {
      out['hn' + i] = T(HL, y - 12, o.note[i], { al: 'lm', fs: 18, fw: 500, c: 'em' });
      y -= 24;
    }
    y -= 4;
    out.hnh = T(HL, y - 14, o.noteName || '노트', { al: 'lm', fs: 20, fw: 500, c: 'gray' });
    y -= 40;
  }

  if (Array.isArray(o.guide)) {
    for (let i = o.guide.length - 1; i >= 0; i--) {
      say(o.guide[i], y - 18, 24);
      if (o.hl === o.guide[i]) out.hhl = { k: 'r', x: HL - 10, y: y - 35, w: HIN + 20, h: 34, c: 'hl' };
      y -= 36;
    }
    out.hg0 = T(HL, y - 16, '쓸 수 있는 도구', { al: 'lm', fs: 22, fw: 500, c: 'gray' });
    y -= 44;
  } else if (o.guide) {
    for (let i = o.guide; i >= 1; i--) {
      out['hgb' + i] = { k: 'r', x: HL, y: y - BARH, w: GUIDE_BARS[i], h: BARH, c: 'sys' };
      y -= ROW;
    }
    y -= 10;
  }

  const rule = o.rule || { w: 330, c: 'sys' };
  out.sg1 = { k: 'r', x: HL, y: y - BARH, w: rule.w, h: BARH, c: rule.c, from: seed };
  y -= ROW + 10;
  out.sp2 = { k: 'r', x: HL, y: y - BARH, w: 300, h: BARH, c: 'sys', from: seed };
  y -= ROW;
  out.sp1 = { k: 'r', x: HL, y: y - BARH, w: 440, h: BARH, c: 'sys', from: seed };

  const tn = o.think ? rows(o.think) : 1;
  const th = 60 + 32 * (tn - 1);
  if (o.think) {
    out.hrb = { k: 'b', x: HL - 14, y: HOUT, w: HIN + 28, h: th, c: 'thin dash' };
    out.hrl = T(HL + 2, HOUT, '추론', { al: 'lm', fs: 20, fw: 700, c: 'gray tag' });
    say(o.think, HOUT + th / 2 + 2, tn > 1 ? 23 : 25, tn > 1 ? 32 : 0);
  }
  if (o.out) {
    const on = rows(o.out);
    say(o.out, HOUT + th + 35 + 16 * (on - 1), on > 1 ? 22 : 25, on > 1 ? 32 : 0);
  }
  if (o.outBar) out[o.outBar.id] = { k: 'r', x: HL, y: HOUT + 20, w: o.outBar.w, h: BARH, c: o.outBar.c };

  for (const id in (o.mod || {})) if (out[id]) Object.assign(out[id], o.mod[id]);
  return out;
}

// AI 상자에서 그 안으로 벌어지는 두 줄
const zoom = x => ({
  z1: wire(straight(x + DW / 2, ROWY.ai - DH / 2, HB.x, HB.y), { c: 'dim', sw: 2 }),
  z2: wire(straight(x + DW / 2, ROWY.ai + DH / 2, HB.x, HB.y + HB.h), { c: 'dim', sw: 2 }),
});
const ZOOM = zoom(CX1);

// 화살표 옆에 놓이는, 그 화살표로 오가는 글
const side = (id, y, t, more) => ({ [id]: T(CX1 - 36, y, t, { al: 'rm', fs: 25, fw: 600, lh: 35, ...more }) });
const one = (col, o) => dia({ cols: { c: col }, view: V1, ...o, on: { sbox: 'blue', ...(o && o.on) } });

// ---- 검색 한 바퀴. lit 은 지금 글이 지나가는 화살표, h 는 그때 AI 의 안
const web = (lit, h, ...more) => merge(one(T_SEARCH, { lit, idle: 'dim' }), ZOOM, inside({ guide: ['gS'], ...h }), ...more);
const RAW = '<title>동대문구 날씨</title> …\n<b class="t">3.2</b>℃ <i>맑음</i> …';
const W2 = { input: ['hq'], think: 'hr1', hl: 'gS', out: 'hcall' };
const W6 = { past: ['hq', 'hr1', 'hcall'], input: ['hres'], think: 'hr2' };

const scOpen = merge(one(T_SEARCH), ZOOM, inside());
const scGuide = merge(one(T_SEARCH), ZOOM, inside({ guide: ['gS'], mod: { hg0: { from: TOOL1 }, gS: { from: TOOL1, d: 120 } } }));
const scW1 = web({ wi: 'fg' }, { input: ['hq'], mod: { hq: { from: { x: 110, y: GAP.user }, d: 450 } } },
  side('xq', GAP.user, '오늘 동대문구 날씨는 어때?'));
const scW2 = {
  slow: true,
  seq: [
    { at: 0, sc: web({}, { input: ['hq'], think: 'hr1' }) },
    { at: 1000, sc: web({}, { input: ['hq'], think: 'hr1', hl: 'gS' }) },
  ],
  end: 1900,
  sc: web({ w2o: 'blue' }, W2, side('xcall', GAP.tool, '검색(동대문구 오늘 날씨)', { c: 'blue' })),
};
const scW3 = web({ xco: 'blue' }, W2, side('xreq', GAP.out, 'search?q=동대문구+오늘+날씨', { c: 'blue mono', fs: 21 }));
const scW4 = web({ xci: 'em' }, W2, side('xraw', GAP.out, RAW, { c: 'em mono', fs: 18, lh: 28 }));
const scW5 = web({ w2i: 'em' }, W2, side('xres', GAP.tool, '동대문구 현재 날씨\n3.2℃, 맑음, 미세먼지 보통', { c: 'em' }));
const scW6 = web({}, { ...W6, mod: { hres: { from: { x: 150, y: GAP.tool }, d: 300 }, hr2: { d: 1400 } } });
const scW7 = web({ wo: 'blue' }, { ...W6, out: 'hans' },
  side('xans', GAP.user, '지금 3.2℃이고 맑아요.\n겉옷을 챙기세요.', { c: 'blue' }));

// ---- 도구가 바뀌고, 셋으로 갈라진다. 이제 상자에는 `도구`라고만 적는다
const swapped = (col, g) => merge(one(col), ZOOM, inside({ guide: [g], mod: { [g]: { from: TOOL1 } } }));
const scToolFile = swapped({ tool: '파일 도구', out: '파일' }, 'gF');
const scToolCode = swapped({ tool: '코드 실행 도구', out: '터미널' }, 'gC');

const C3 = { l: { tool: '도구', out: '인터넷' }, c: { tool: '도구', out: '터미널' }, r: { tool: '도구', out: '파일' } };
function three(o) {
  const sc = dia({ cols: C3, view: V1, ...o, on: { sbox: 'blue', ...(o && o.on) } });
  // 양옆의 것은 가운데 것에서 갈라져 나온다
  for (const [a, b] of [['tbl', 'qbox'], ['tbr', 'qbox'], ['obl', 'obc'], ['obr', 'obc']]) sc[a].from = { x: sc[b].x, y: sc[b].y };
  for (const k of ['l', 'r']) {
    sc['tt' + k + lid('도구')].from = { x: CX1 };
    sc['ot' + k + lid(C3[k].out)].from = { x: CX1 };
  }
  return sc;
}
const GUIDE3 = { guide: 3, mod: Object.fromEntries([1, 2, 3].map(i => ['hgb' + i, { from: { y: scToolCode.gC.y } }])) };
const scThree = merge(three(), inside(GUIDE3));

// ---- 루프. AI 가 그때그때 도구를 골라 쓰고, 오간 글이 막대로 쌓인다
const LOOPW = { q: 240, c: [0, 300, 260, 330, 280], r: [0, 380, 420, 300, 360], a: 350 };
const TURNS = ['l', 'r', 'r', 'c'];
const LINK = { l: 'w1', c: 'w2', r: 'w3' };
const WORD_AT = { l: { x: 284, y: 442, al: 'rm' }, c: { x: 498, y: GAP.tool, al: 'lm' }, r: { x: 636, y: 442, al: 'lm' }, u: { x: CX1 - 36, y: GAP.user, al: 'rm' } };
const wordAt = (k, c) => ({ ['lt' + k]: T(WORD_AT[k].x, WORD_AT[k].y, '텍스트', { al: WORD_AT[k].al, fs: 24, fw: 700, c }) });
function loopBars(n) {
  const list = [{ id: 'lq', w: LOOPW.q, c: 'q', from: { x: 300, y: GAP.user } }];
  for (let r = 1; r <= n; r++) {
    list.push({ id: 'lc' + r, w: LOOPW.c[r], c: 'ans' });
    list.push({ id: 'lr' + r, w: LOOPW.r[r], c: 'inf', from: { x: CX1 + COLX[TURNS[r - 1]] - 800, y: ROWY.tool } });
  }
  return list;
}
const scLoop = (() => {
  const f = (lit, h, w) => merge(three({ lit, idle: 'dim' }), inside({ guide: 3, ...h }), w);
  const frames = [{ at: 0, sc: f({ wi: 'fg' }, { bars: loopBars(0) }, wordAt('u', '')) }];
  let at = 900;
  TURNS.forEach((k, i) => {
    const r = i + 1;
    const w = LINK[k];
    frames.push({ at, sc: f({ [w + 'o']: 'blue', ['x' + k + 'o']: 'blue' }, { bars: loopBars(r - 1), outBar: { id: 'lc' + r, w: LOOPW.c[r], c: 'ans' } }, wordAt(k, 'blue')) });
    frames.push({ at: at + 650, sc: f({ ['x' + k + 'i']: 'em', [w + 'i']: 'em' }, { bars: loopBars(r) }, wordAt(k, 'em')) });
    at += 1300;
  });
  return { seq: frames, end: at, sc: f({ wo: 'blue' }, { bars: loopBars(TURNS.length), outBar: { id: 'la', w: LOOPW.a, c: 'ans' } }, wordAt('u', 'blue')) };
})();
const L0 = [...loopBars(TURNS.length).map(b => ({ id: b.id, w: b.w, c: b.c })), { id: 'la', w: LOOPW.a, c: 'ans' }];
const scAgent = merge(three({ agent: 'name' }), inside({ guide: 3, bars: L0 }));

// ---------------------------------------------------------------- 6-3 에이전트 상자 하나
// 에이전트가 상자 하나로 줄어든다. 도구는 따로 그리지 않고, 상자에서 바로 나가고 들어오는 화살표가 이것저것에 꽂힌다
//   x      기둥의 자리            to    위에 놓인 것 'ai' | 'agent', plug 그것에 꽂혔는지
//   self   두 화살표가 휘어 하나로 이어지며 자기에게 꽂힘
//   files  왼쪽의 파일 상자에 꽂힘, userFiles 사용자와 파일 상자를 잇는 선      other  오른쪽의 다른 에이전트
//   name   상자에 적는 이름 (없으면 `에이전트`)      exr  파일 상자의 오른쪽 끝
//   to: 'sub' 는 위에 놓인 읽기 에이전트. 그 에이전트가 왼쪽 상자를 읽는 선이 같이 나온다
//   to: 'tool' 은 위에 놓인 도구(toolName). 왼쪽 상자의 입력을 읽는 선과 출력에 쓰는 선이 같이 나온다
//   ty     위에 놓이는 것의 높이      mats  오른쪽 자료 상자의 왼쪽 끝 (ALEPH 와 사용자가 그리로 이어진다)
const CX2 = 750;
const EX = { x: 40, y: 60, w: 380, h: 785 };
const OX = 1300;
const OAY = ROWY.tool;     // 다른 에이전트의 높이
const TGY = 250;           // 위에 놓이는 것의 높이

function packed(o) {
  o = o || {};
  const x = o.x || CX1;
  const lit = o.lit || {};
  const out = {};
  const look = (id, head) => ({ c: (head ? 'head' : '') + (lit[id] || o.idle ? ' ' + (lit[id] || o.idle) : ''), sw: lit[id] ? 4 : 3 });
  const line = (id, x0, y0, x1, y1) => { out[id] = wire(straight(x0, y0, x1, y1), look(id, true)); };
  // a 에서 b 로 가는 줄(o)과 돌아오는 줄(i)
  const pair = (id, ax, ay, bx, by) => {
    const len = Math.hypot(bx - ax, by - ay);
    const ux = (bx - ax) / len;
    const uy = (by - ay) / len;
    const nx = -uy * 12;
    const ny = ux * 12;
    line(id + 'o', ax + ux * 12 + nx, ay + uy * 12 + ny, bx - ux * 12 + nx, by - uy * 12 + ny);
    line(id + 'i', bx - ux * 12 - nx, by - uy * 12 - ny, ax + ux * 12 - nx, ay + uy * 12 - ny);
  };
  const box = (id, cx, cy, c) => {
    out[id] = { k: 'b', x: cx - DW / 2, y: cy - DH / 2, w: DW, h: DH, c: 'solid' + (c ? ' ' + c : '') };
  };
  const name = (id, cx, cy, more) => { out[id] = T(cx, cy, '에이전트', { fs: 34, fw: 800, c: 'blue', ...more }); };
  const top = ROWY.ai - DH / 2;

  const exr = o.exr || EX.x + EX.w;
  box('abox', x, ROWY.ai, 'blue');
  if (o.name) out.aname2 = T(x, ROWY.ai, o.name, { fs: 34, fw: 800, c: 'blue wide' });
  else name('aname', x, ROWY.ai);
  box('ubox', x, ROWY.user);
  out.utx = T(x, ROWY.user, '사용자', { fs: 34, fw: 700 });
  pair('w', x, ROWY.ai + DH / 2, x, ROWY.user - DH / 2);

  if (o.to) {
    const ty = o.ty || TGY;
    if (o.to === 'ai') {
      box('tgb', x, ty);
      out.tga = T(x, ty, 'AI', { fs: 42, fw: 800 });
    } else if (o.to === 'sub') {
      box('tg3', x, ty, 'blue');
      out.tg3t = T(x, ty, '읽기 에이전트', { fs: 28, fw: 800, c: 'blue' });
      pair('ys', x - DW / 2, ty, exr, ty);
    } else if (o.to === 'tool') {
      box('tgt', x, ty);
      out['tgtt' + lid(o.toolName)] = T(x, ty, o.toolName, { fs: fit(o.toolName), fw: 700, from: { y: ty + 20 } });
      line('tli', exr + 12, ty - 12, x - DW / 2 - 12, ty - 12);
      line('tlo', x - DW / 2 - 12, ty + 12, exr + 12, ty + 12);
    } else {
      // 에이전트 상자가 베껴져 위로 올라간다
      box('tg2', x, ty, 'blue');
      out.tg2.from = { y: top };
      name('tg2t', x, ty, { from: { y: ROWY.ai } });
    }
    const w = o.to === 'ai' ? 'xa' : 'xc';   // AI 에 꽂힌 줄은 AI 와 같이 사라진다
    if (o.plug) pair(w, x, top, x, ty + DH / 2);
    else {
      // 오른쪽에서 글을 받고 왼쪽으로 글을 낸다. 꽂힐 때 이 두 줄이 에이전트 쪽으로 휜다
      line(w + 'o', x + DW / 2 + 84, ty, x + DW / 2 + 12, ty);
      line(w + 'i', x - DW / 2 - 12, ty, x - DW / 2 - 84, ty);
      out.xin = T(x + DW / 2 + 98, ty, '텍스트', { al: 'lm', fs: 30, d: 150 });
      out.xout = T(x - DW / 2 - 98, ty, '텍스트', { al: 'rm', fs: 30, c: 'blue', d: 700 });
      out[w + 'o'].d = 300;
      out[w + 'i'].d = 550;
    }
  }
  if (o.self) {
    // 나가는 줄이 위로 돌아 들어오는 줄과 이어진다. 한 바퀴의 오른쪽 반이 나가는 길, 왼쪽 반이 돌아오는 길
    const r = 76;
    const dl = Math.asin(12 / r);
    const cy = top - 12 - r * Math.cos(dl);
    out.xco = wire(arc(x, cy, r, Math.PI / 2 - dl, -Math.PI / 2), look('xco', false));
    out.xci = wire(arc(x, cy, r, -Math.PI / 2, -1.5 * Math.PI + dl), look('xci', true));
  }
  if (o.files) pair('xf', x - DW / 2, ROWY.ai, exr, ROWY.ai);
  if (o.userFiles) pair('uf', x - DW / 2, ROWY.user, exr, ROWY.user);
  if (o.mats) {
    pair('xm', x + DW / 2, ROWY.ai, o.mats, ROWY.ai);
    pair('um', x + DW / 2, ROWY.user, o.mats, ROWY.user);
  }
  if (o.other) {
    box('a2b', OX, OAY, 'blue');
    name('a2t', OX, OAY);
    pair('yf', OX - DW / 2, OAY, EX.x + EX.w, OAY);
  }
  return out;
}

// 상자 하나로 줄어들 때, 안에 있던 것들이 그 자리로 모이며 사라진다
function gather(sc, keep, to) {
  const out = {};
  const k = 0.3;
  for (const id in sc) {
    const a = sc[id];
    if (id in keep || a.k === 'w') continue;
    const g = { ...a, o: 0 };
    delete g.from;
    delete g.d;
    if (a.k === 't') {
      g.x = to.x + (a.x - to.x) * k;
      g.y = to.y + (a.y - to.y) * k;
      g.fs = a.fs * 0.5;
    } else {
      g.w = a.w * k;
      g.h = a.h * k;
      g.x = to.x + (a.x + a.w / 2 - to.x) * k - g.w / 2;
      g.y = to.y + (a.y + a.h / 2 - to.y) * k - g.h / 2;
    }
    out[id] = g;
  }
  return out;
}

const HEAD_C = { guide: 3, bars: L0 };
const scPack = merge(gather(three({ agent: true }), packed(), { x: CX1, y: ROWY.ai }), packed(), ZOOM, inside(HEAD_C));
const plugTo = o => merge(packed(o), ZOOM, inside(HEAD_C));

// ---- 자기 머릿속을 손본다: 얼마나 찼는지 묻고, 오래된 도구 결과를 지우고, 앞의 대화를 요약으로 줄인다.
// 한 바퀴마다 추론 → 명령이 나감 → 결과가 돌아옴. 지난 바퀴의 명령과 결과는 막대가 되어 기록에 쌓인다
const tagged = (list, ids, c) => list.map(b => (ids.includes(b.id) ? { ...b, c: b.c + ' ' + c } : b));
const plain = list => list.map(b => ({ id: b.id, w: b.w, c: b.c }));
const away = (sc, ids) => Object.fromEntries(ids.map(id => {
  const a = { ...sc[id], x: sc[id].x - 90, o: 0 };
  delete a.from;
  return [id, a];
}));
const SELF_AT = { x: CX1 - 104, y: 403 };
const selfSide = (id, t, c) => ({ [id]: T(SELF_AT.x, SELF_AT.y, t, { al: 'rm', fs: 25, fw: 600, c }) });
const OUT_AT = { x: HL, y: HOUT + 95 };
const IN_AT = { x: HL, y: HFLOOR - 19 };
const HB1 = [{ id: 'hb1', w: 250, c: 'ans', from: OUT_AT }, { id: 'hb2', w: 400, c: 'inf', from: IN_AT }];
const HB2 = [{ id: 'hb3', w: 330, c: 'ans', from: OUT_AT }, { id: 'hb4', w: 280, c: 'inf', from: IN_AT }];
const OLD3 = ['lr1', 'lr2', 'lr3'];
const TALK = ['lq', 'lc1', 'lc2', 'lc3', 'lc4', 'lr4', 'la'];
const CTX_A = [...L0, ...HB1];
const CTX_B = plain(CTX_A).filter(b => !OLD3.includes(b.id));
const CTX_C = [...CTX_B, ...HB2];
const CTX_S = [{ id: 'sm1', w: 420, c: 'sum' }, { id: 'sm2', w: 300, c: 'sum' }, ...plain(HB1), ...plain(HB2)];
const selfAt = (lit, h, more) => merge(packed({ self: true, lit, idle: 'dim' }), ZOOM, inside({ guide: 3, ...h }), more);

// 한 바퀴. before 는 명령을 낼 때의 기록, marked 는 결과가 돌아온 때, after 는 그 결과대로 바뀐 뒤
function selfTurn(n, before, marked, after, call, back, gone) {
  const think = 'hkt' + n;
  const out = 'hk' + n;
  const res = 'hs' + n;
  const got = { input: [res], think, out, mod: { [res]: { from: { x: 120, y: SELF_AT.y } } } };
  const seq = [
    { at: 0, sc: selfAt({}, { bars: before, think }) },
    { at: 1000, sc: selfAt({ xco: 'blue' }, { bars: before, think, out }, selfSide('xs' + n, call, 'blue')) },
  ];
  const last = selfAt({ xci: 'em' }, { bars: after, ...got },
    merge(selfSide('xr' + n, back, 'em'), gone ? away(inside({ guide: 3, bars: marked, input: [res] }), gone) : null));
  if (!marked) return { slow: true, seq, end: 2500, sc: last };
  seq.push({ at: 2500, sc: selfAt({ xci: 'em' }, { bars: marked, ...got }, selfSide('xr' + n, back, 'em')) });
  return { slow: true, seq, end: 3500, sc: last };
}
const scSelfCheck = selfTurn(1, L0, null, L0, '상태()', '87% 사용 중');
const scSelfCut = selfTurn(2, CTX_A, tagged(CTX_A, OLD3, 'cut'), CTX_B, '지우기(도구 결과 1~3)', '3건을 지웠음', OLD3);
const scSelfSum = selfTurn(3, CTX_C, tagged(CTX_C, TALK, 'faint'), CTX_S, '요약(앞의 대화)', '요약으로 바꿨음');
const HEAD_D = { guide: 3, bars: CTX_S };

// ---------------------------------------------------------------- 6-4 파일
// 왼쪽에 파일 상자. 에이전트도 사용자도 다른 에이전트도 같은 파일을 읽고 쓴다.
// 파일 하나는 종이 한 장과 막대 몇 줄. 막대의 색은 그 줄을 쓴 쪽이다
const fileY = i => EX.y + 136 + 124 * i;

function folder(files) {
  const out = {
    fbox: { k: 'b', ...EX, c: 'solid', from: { x: EX.x - 50 } },
    ftit: T(EX.x + 28, EX.y + 38, '파일', { al: 'lm', fs: 28, fw: 800 }),
    frule: { k: 'r', x: EX.x, y: EX.y + 74, w: EX.w, h: 3, c: '' },
  };
  files.forEach((f, i) => {
    out['fi' + f.id] = { k: 't', x: EX.x + 28, y: fileY(i) - 14, al: 'lm', fs: 20, ht: '<i class="fi"></i>' };
    f.rows.forEach(([c, w], k) => {
      out['f' + f.id + k] = { k: 'r', x: EX.x + 68, y: fileY(i) - 26 + 20 * k, w, h: BARH, c, ...f.more };
    });
  });
  return out;
}

const FILE_A = { id: 'a', rows: [['ans', 260], ['ans', 220], ['ans', 280]] };
const FILE_A2 = { id: 'a', rows: [['ans', 260], ['q', 170], ['ans', 280]] };
const FILE_A3 = { id: 'a', rows: [['ans', 260], ['q', 170], ['ans', 150]] };
const FILE_B = { id: 'b', rows: [['ans', 250], ['inf', 200]] };
const IN_FILE = i => ({ from: { x: EX.x + 68, y: fileY(i) } });
const HEAD_F1 = { guide: 3, bars: [...CTX_S, { id: 'hf1', w: 170, c: 'q', ...IN_FILE(0) }] };
const HEAD_F2 = { guide: 3, bars: [...plain(HEAD_F1.bars), { id: 'hf2', w: 250, c: 'inf', ...IN_FILE(1) }, { id: 'hf3', w: 200, c: 'inf', ...IN_FILE(1) }] };
const desk = (o, files, h) => merge(
  packed({ x: CX2, files: true, userFiles: true, idle: o.lit ? 'dim' : '', ...o }), zoom(CX2), folder(files), inside(h || HEAD_D));

const scFiles = desk({ userFiles: false }, []);
const scWrite = desk({ userFiles: false, lit: { xfo: 'blue' } }, [{ ...FILE_A, more: { from: { x: EX.x + EX.w + 30 } } }]);
const scRead = desk({ lit: { ufi: 'blue' } }, [FILE_A]);
const scEdit = desk({ lit: { ufo: 'fg' } }, [FILE_A2]);
const scTake = desk({ lit: { xfi: 'em' } }, [FILE_A2], HEAD_F1);
const scSave = desk({ lit: { xfo: 'blue' } }, [FILE_A2, { ...FILE_B, more: { from: { x: HL, y: HFLOOR - 40 } } }], HEAD_F1);
const scLoad = desk({ lit: { xfi: 'em' } }, [FILE_A2, FILE_B], HEAD_F2);

// AI 의 안이 접히고, 그 자리에 다른 에이전트가 온다
const shared = (lit, files) => merge(
  packed({ x: CX2, files: true, userFiles: true, other: true, lit, idle: lit ? 'dim' : '' }), folder(files));
const scFold = merge(shared(null, [FILE_A2, FILE_B]), { pbox: { k: 'b', x: CX2 - DW / 2, y: ROWY.ai - DH / 2, w: DW, h: DH, c: 'blue thin', o: 0 } });
const scShare = {
  slow: true,
  seq: [{ at: 0, sc: shared({ yfo: 'blue' }, [FILE_A3, FILE_B]) }],
  end: 1500,
  sc: shared({ xfi: 'em' }, [FILE_A3, FILE_B]),
};

// ---------------------------------------------------------------- 7 ALEPH
// 6장 끝의 그림이 그대로 ALEPH 가 된다. 왼쪽 상자는 작업 공간: 도구에 넘길 글(입력), 도구가 낸 글(출력), 원고.
// 원고는 장 아래 장면으로 나뉘고 장면에는 제목이 없다. 접힌 장면에서 보이는 것은 그 장면의 요약이다.
// 도구는 입력을 읽고 출력에 쓴다. ALEPH 도 사용자도 입력을 고치고 출력을 읽는다
const CX3 = 730;
const WS = { x: 40, y: 30, w: 480, h: 840 };
const WSR = WS.x + WS.w;
const CARD_I = { x: WS.x + 16, y: WS.y + 16, w: WS.w - 32, h: 120 };
const CARD_O = { ...CARD_I, y: CARD_I.y + 134 };
const TOOL_Y = CARD_I.y + 127;     // 입력 칸과 출력 칸의 사이
const SUBY = 360;
const SUMS = [
  '',
  '떠돌이 악단에서 삼팔선 소식을 듣는다',
  '하루 차이로 식구들과 갈라질 뻔한다',
  '연백 학교의 음악 선생이 된다',
  '포성이 울리고 낯선 군복이 들어온다',
  '학교가 인민군의 집합소가 된다',
  '새 노래를 가르치라는 지시를 받는다',
  '시키는 대로 아이들에게 노래를 가르친다',
  '국군이 들어오고 읍내가 뒤집힌다',
  '치안대가 부역자를 찾아다닌다',
  '한밤에 끌려간다',
  '옛 학부형에게 조사를 받는다',
];
const CHAPTER = { 1: '1장', 4: '2장', 8: '3장' };
const BODY = {
  3: '… 풍금 뚜껑을 닫으며 그는 생각했다. 다시는 떠돌지 않겠다고. 식구들 얼굴을 매일 보는 데서 살겠다고. …',
  7: '… 교실 뒤에는 군관이 서 있었다. 그는 풍금 앞에 앉아 그들이 가져온 악보를 펼쳤다. 아이들이 따라 불렀다. …',
};
// 나누기 전의 글. 막대 스무 줄이고, 줄의 색은 쓴 쪽이다: 사용자가 직접(6), ALEPH 가(6), 집필 도구가(8)
const RAW_FROM = [{ x: WSR + 40, y: ROWY.user }, { x: WSR + 40, y: ROWY.ai }, { x: CARD_O.x + 18, y: CARD_O.y + 50 }];

//   n     장면이 몇 개인지 (기본 10)      raw  'block' 나누기 전의 글, 'cut' 장면으로 갈라진 모습. rawN 은 그때까지 쓰인 줄 수
//   fold  본문 막대가 요약 밑으로 접혀 들어가는 컷      open 펼친 장면, body 는 그 본문(없으면 BODY)
//   hl    밝힐 장면들      tag  { 장면: 오른쪽에 붙는 말 | { t, c } }
//   io    입력·출력 칸. inp, outp 는 그 안의 글줄 [{ t, c }], inBars, outBars 는 막대 [[색, 너비]], card 는 밝힐 칸
function work(o) {
  o = o || {};
  const out = { fbox: { k: 'b', ...WS, c: '' } };
  let y = WS.y + 14;
  if (o.io) {
    const card = (id, B, name, lines, bars) => {
      out[id + 'b'] = { k: 'b', ...B, c: 'thin' + (o.card === id ? ' em' : '') };
      out[id + 'l'] = T(B.x + 14, B.y, name, { al: 'lm', fs: 18, fw: 700, c: 'gray tag' });
      (lines || []).forEach((l, i) => { out[id + 't' + i] = T(B.x + 16, B.y + 28 + 25 * i, l.t, { al: 'lm', fs: 17, fw: 500, c: l.c }); });
      (bars || []).forEach(([c, w], i) => { out[id + 'r' + i] = { k: 'r', x: B.x + 18, y: B.y + 30 + 24 * i, w, h: BARH, c }; });
    };
    card('ci', CARD_I, '입력', o.inp, o.inBars);
    card('co', CARD_O, '출력', o.outp, o.outBars);
    y = CARD_O.y + CARD_O.h + 14;
  }
  out.mlab = T(WS.x + 24, y + 22, '원고', { al: 'lm', fs: 24, fw: 800 });
  y += 62;

  const raw = (n, k) => 'sb' + n + 'ab'[k];
  if (o.raw) {
    for (let i = 0; i < (o.rawN || 20); i++) {
      const n = (i >> 1) + 1;
      const src = i < 6 ? 0 : i < 12 ? 1 : 2;
      out[raw(n, i & 1)] = {
        k: 'r', x: WS.x + 28, y: y - 8 + 15 * i + (o.raw === 'cut' ? 12 * (n - 1) : 0),
        w: 300 + (n * 37 + (i & 1) * 53) % 130, h: 9, c: src ? 'ans' : '', from: RAW_FROM[src],
      };
    }
    return out;
  }

  const N = o.n == null ? 10 : o.n;
  let no = 0;
  for (let n = 1; n <= N; n++) {
    if (CHAPTER[n]) {
      out['mc' + n] = T(WS.x + 24, y, CHAPTER[n], { al: 'lm', fs: 17, fw: 600, c: 'gray' });
      y += 28;
      no = 0;
    }
    no++;
    out['ms' + n] = { k: 't', x: WS.x + 24, y, al: 'lm', fs: 20, fw: 600, ht: '<b class="no">' + no + '</b>' + SUMS[n], from: { x: WS.x + 44 } };
    if (o.fold) for (let k = 0; k < 2; k++) out[raw(n, k)] = { k: 'r', x: WS.x + 60, y: y - 5, w: 220, h: 9, c: n > 3 ? 'ans' : '', o: 0 };
    if ((o.hl || []).includes(n)) out['mh' + n] = { k: 'r', x: WS.x + 10, y: y - 16, w: WS.w - 20, h: 32, c: 'hl' };
    const tag = (o.tag || {})[n];
    if (tag) out['mt' + n] = T(WSR - 20, y, tag.t || tag, { al: 'rm', fs: 17, fw: 700, c: tag.c != null ? tag.c : 'em' });
    y += 33;
    if (o.open === n) {
      out['mb' + n] = { k: 't', x: WS.x + 60, y: y - 10, al: 'lt', fs: 18, fw: 500, lh: 27, w: 410, c: 'wrap gray', ht: o.body || BODY[n] };
      y += o.body ? 116 : 86;
    }
  }
  return out;
}

// ---- 자료. 원고 밖의 문서들. ALEPH 도 사용자도 쓰고, 몇몇은 노트로 걸어 두면 매 요청마다 ALEPH 의 머릿속에 들어간다.
// 계획은 둘이다. 장기 계획은 작품 전체의 순서, 단기 계획은 지금 하는 일. 노트로 걸리는 것은 단기 계획이다
const MB = { x: 900, y: 40, w: 660, h: 820 };
const PLAN_LONG = [
  '☑ 주제 선정', '☑ 주요 등장인물 및 스토리 구상', '☑ 플롯 배치', '☑ 1장 작성', '☑ 2장 작성',
  '☐ 3장 작성', '☐ 4장 작성', '☐ 전체 구조와 흐름 퇴고', '☐ 교열', '☐ 교정',
];
const PLAN = [
  '☑ 3장 내러티브 설계', '☑ 신규 조연 설정 시트 작성', '☑ 3장 1~3번째 장면 작성',
  '☐ 3장 4번째 장면 작성', '☐ 3장 퇴고', '☐ (신규) 2장 4번째 장면 재설계',
];
const PLAN_AT = { x: MB.x + 336, y: MB.y + 340 };
const planY = i => PLAN_AT.y + 46 + 34 * i;
//   plan  두 계획 문서가 있는지, added 사용자가 단기 계획에 한 줄을 보탰는지, pin 단기 계획을 노트로 걸었는지
function mats(o) {
  o = o || {};
  const out = {
    xbox: { k: 'b', ...MB, c: '' },
    xlab: T(MB.x + 24, MB.y + 36, '자료', { al: 'lm', fs: 24, fw: 800 }),
  };
  const doc = (id, x, y, t) => { out[id] = { k: 't', x, y, al: 'lm', fs: 21, fw: 700, ht: '<i class="fi"></i>' + t }; };
  [['인물', [220, 170]], ['연표', [200, 230]]].forEach(([t, ws], i) => {
    const x = i ? PLAN_AT.x : MB.x + 28;
    doc('xd' + i, x, MB.y + 130, t);
    ws.forEach((w, k) => { out['xr' + i + k] = { k: 'r', x: x + 30, y: MB.y + 154 + 20 * k, w, h: BARH, c: 'sys' }; });
  });
  if (o.plan) {
    const line = (id, x, i, t, mine) => {
      out[id] = T(x, planY(i), t, { al: 'lm', fs: 19, fw: 500, c: mine ? '' : 'blue', from: { x: MB.x - 20, y: mine ? ROWY.user : ROWY.ai } });
    };
    doc('xd2', MB.x + 28, PLAN_AT.y, '장기 계획');
    PLAN_LONG.forEach((t, i) => line('xl' + i, MB.x + 28, i, t));
    doc('xd3', PLAN_AT.x, PLAN_AT.y, '단기 계획');
    PLAN.forEach((t, i) => { if (i < 5 || o.added) line('xp' + i, PLAN_AT.x, i, t, i === 5); });
    if (o.pin) {
      const B = { x: PLAN_AT.x - 18, y: PLAN_AT.y - 32, w: 324, h: planY(5) + 26 - (PLAN_AT.y - 32) };
      out.xpin = { k: 'b', ...B, c: 'thin em' };
      out.xpt = T(B.x + B.w - 22, B.y, '노트', { al: 'rm', fs: 18, fw: 700, c: 'em tag' });
    }
  }
  return out;
}

const ZOOM3 = {
  z1: wire(straight(CX3 + DW / 2, ROWY.ai - DH / 2, HBT.x, HBT.y), { c: 'dim', sw: 2 }),
  z2: wire(straight(CX3 + DW / 2, ROWY.ai + DH / 2, HBT.x, HBT.y + HBT.h), { c: 'dim', sw: 2 }),
};
const alBody = o => packed({ x: CX3, name: 'ALEPH', exr: WSR, files: true, userFiles: true, idle: o && o.lit ? 'dim' : '', ...o });
const TOOL = { to: 'tool', ty: TOOL_Y, toolName: '집필', plug: true };

// ---- 원고에 글이 쓰이는 세 가지 길: 사용자가 직접, ALEPH 에게 말해서, 입력을 같이 써서 도구로
const IN_BARS = [['ans', 300], ['ans', 360], ['q', 240]];
const scAlOpen = merge(alBody(), work({ n: 0 }));
const scAlMe = merge(alBody({ lit: { ufo: 'fg' } }), work({ raw: 'block', rawN: 6 }));
const scAlTalk = {
  slow: true,
  seq: [{ at: 0, sc: merge(alBody({ lit: { wi: 'fg' } }), work({ raw: 'block', rawN: 6 })) }],
  end: 1100,
  sc: merge(alBody({ lit: { xfo: 'blue' } }), work({ raw: 'block', rawN: 12 })),
};
const scAlIo = merge(alBody(TOOL), work({ io: true, raw: 'block', rawN: 12 }));
const scAlIn = merge(alBody({ ...TOOL, lit: { xfo: 'blue', ufo: 'fg' } }), work({ io: true, card: 'ci', inBars: IN_BARS, raw: 'block', rawN: 12 }));
const scAlOut = {
  slow: true,
  seq: [{
    at: 0,
    sc: merge(alBody({ ...TOOL, lit: { tli: 'fg', tlo: 'blue' } }),
      work({ io: true, card: 'co', inBars: IN_BARS, outBars: [['ans', 380], ['ans', 330], ['ans', 260]], raw: 'block', rawN: 12 })),
  }],
  end: 1700,
  sc: merge(alBody({ ...TOOL, lit: { xfo: 'blue' } }), work({ io: true, inBars: IN_BARS, raw: 'block', rawN: 20 })),
};

// ---- 쓰인 글을 ALEPH 가 장면으로 가르고, 장면마다 요약을 머리로 붙인다
const scAlCut = merge(alBody({ ...TOOL, lit: { xfo: 'blue' } }), work({ io: true, raw: 'cut' }));
const scAlSum = merge(alBody({ ...TOOL, lit: { xfo: 'blue' } }), work({ io: true, fold: true }));
const scAlPeek = merge(alBody(TOOL), work({ io: true, open: 7 }));
const scAlPeek2 = merge(alBody(TOOL), work({ io: true, open: 3 }));

// ---- 도구는 사용자가 만든다: 이름, 에이전트가 읽는 설명, 도구가 따르는 지시문, 모델
const DEFS = {
  write: ['집필', '장면 하나를 쓴다.\n입력에 지시서를 준비해 두고 부른다.', '당신은 소설가입니다. 입력의 지시서를 읽고\n장면 하나를 씁니다. 설명하지 말고 보여 주세요. …'],
  proof: ['교정', '맞춤법과 띄어쓰기를 바로잡는다.\n입력에 고칠 글을 넣고 부른다.', '입력에 든 글의 맞춤법과 띄어쓰기를 바로잡습니다.\n문장과 내용은 건드리지 않습니다. …'],
};
function sheet(key) {
  const B = { x: 900, y: 60, w: 640, h: 330 };
  const out = {
    dbox: { k: 'b', ...B, c: 'thin' },
    dlink: wire(straight(CX3 + DW / 2, TOOL_Y, B.x, TOOL_Y), { c: 'dim', sw: 2 }),
  };
  [['이름', 30], ['설명', 88], ['지시문', 172], ['모델', 268]].forEach(([t, dy], i) => {
    out['dl' + i] = T(B.x + 28, B.y + dy, t, { al: 'lt', fs: 20, fw: 600, c: 'gray' });
    const v = i < 3 ? DEFS[key][i] : '보조 모델';
    out['dv' + (i < 3 ? key : '') + i] = T(B.x + 130, B.y + dy - 3, v, { al: 'lt', fs: i ? 21 : 24, fw: i ? 500 : 800, lh: 31, from: { y: B.y + dy + 12 } });
  });
  return out;
}
const scAlDef = merge(alBody(TOOL), work({ io: true }), sheet('write'));
const scAlDef2 = merge(alBody({ ...TOOL, toolName: '교정' }), work({ io: true }), sheet('proof'));

// ---- 자료와 노트
const MATS = { mats: MB.x };
const scAlMat = merge(alBody(MATS), work({ io: true }), mats());
const scAlPlan = merge(alBody({ ...MATS, lit: { xmo: 'blue' } }), work({ io: true }), mats({ plan: true }));
const scAlPin = merge(alBody({ ...MATS, lit: { umo: 'fg' } }), work({ io: true }), mats({ plan: true, added: true, pin: true }));

// ---- 장면 하나를 쓰는 동안
const aleph = (o, m, h, more) => merge(alBody(o), ZOOM3, work({ io: true, ...m }), inside({ tall: true, note: PLAN, noteName: '노트 · 단기 계획', index: true, ...h }), more);
const FROM_MATS = { from: { x: PLAN_AT.x, y: planY(2) } };
const FROM_WORK = { from: { x: WSR - 200, y: 420 } };
const scAlHead = aleph(null, null, {
  mod: { hn0: FROM_MATS, hn1: FROM_MATS, hn2: FROM_MATS, hn3: FROM_MATS, hn4: FROM_MATS, hn5: FROM_MATS, hnh: FROM_MATS, hxh: FROM_WORK, hx1: FROM_WORK, hx2: FROM_WORK },
});
const scAlAsk = aleph({ lit: { wi: 'fg' } }, null, { input: ['aq0'], mod: { aq0: { from: { x: CX3 - 60, y: GAP.user } } } });

// 지난 걸음은 가는 막대 하나로 줄어 기록에 남는다
const MINI = [
  ['q', 300], ['inf', 400], ['inf', 260], ['inf', 420], ['inf', 330], ['q', 280], ['inf', 200], ['inf', 440], ['inf', 240], ['ans', 320],
].map(([c, w], i) => ({ id: 'pb' + i, w, c, from: { x: HL, y: HFLOOR - 19 } }));

// 한 걸음: 추론 → 명령이 나감(go) → 결과가 돌아옴(back).
//   to  위에 놓이는 것(읽기 에이전트)      before, m0, m1  걸음 전, 명령이 나갈 때, 결과가 돌아온 때의 작업 공간
//   mk  화면을 짓는 것 (없으면 aleph), mini 는 그때까지의 기록
function alStep(n, s) {
  const mk = s.mk || aleph;
  const mini = s.mini || MINI.slice(0, n);
  const think = 'thk' + n;
  const out = 'ac' + n;
  return {
    slow: true,
    seq: [
      { at: 0, sc: mk(null, s.before, { mini, think }) },
      { at: 1300, sc: mk({ lit: s.go, ...s.to }, s.m0, { mini, think, out }) },
    ],
    end: 2800,
    sc: mk({ lit: s.back, ...s.to }, s.m1 || s.m0, { mini, think, out, input: ['ar' + n] }),
  };
}
const READ = { go: { xfo: 'blue' }, back: { xfi: 'em' } };
const INP3 = [
  { t: '유치장에서 조사받는 장면. 조사관은 3장의 옛 학부형.', c: 'blue' },
  { t: '서로 알아본다. 왜 떠나지 않았는지를 묻는다.', c: 'blue' },
  { t: '@include:원고/s7  @include:원고/s3', c: 'blue mono' },
];
const INP4 = [...INP3, { t: '노래 이름은 끝까지 말하지 않는다.', c: '' }];
const OUTP = [
  { t: '“선생, 왜 안 떠났소.” 완장을 찬 사내가 물었다.', c: 'blue' },
  { t: '그는 풍금 뚜껑을 닫던 날을 생각했다.', c: 'blue' },
  { t: '…', c: 'blue' },
];
const DOCS = { inp: INP4, outp: OUTP };
const AL_STEPS = [
  null,
  { ...READ, m0: { hl: [7] } },
  { ...READ, m0: null, m1: { tag: { 1: '3째 줄', 3: '22째 줄' } } },
  { ...READ, m0: { hl: [3], tag: { 3: '18~26줄' } } },
  { go: { xco: 'blue', ysi: 'em' }, back: { xci: 'em' }, to: { to: 'sub', ty: SUBY, plug: true }, m0: { hl: [8, 9, 10] }, m1: { hl: [9] } },
  { go: { wo: 'blue' }, back: { wi: 'fg' }, m0: null },
  { ...READ, m0: { card: 'ci', inp: INP3 } },
  null,
  { ...READ, before: DOCS, m0: { ...DOCS, n: 11, hl: [11] } },
].map((s, n) => s && alStep(n, s));

// 집필을 돌리기 전에 입력을 사용자에게 보인다. 사용자가 한 줄을 보태고 승인하면, 도구가 입력을 읽고 출력에 쓴다
const scAlCheck = (() => {
  const h = { mini: MINI.slice(0, 7), think: 'thk7' };
  return {
    slow: true,
    seq: [
      { at: 0, sc: aleph(null, { inp: INP3 }, h) },
      { at: 1300, sc: aleph({ lit: { wo: 'blue' }, ...TOOL }, { inp: INP3, card: 'ci' }, { ...h, out: 'ac7' }) },
    ],
    end: 2800,
    sc: aleph({ lit: { ufo: 'fg', wi: 'fg' }, ...TOOL }, { inp: INP4, card: 'ci' }, { ...h, out: 'ac7', input: ['ar7'] }),
  };
})();
const scAlRun = (() => {
  const h = { mini: MINI.slice(0, 7), think: 'thk7', out: 'ac7' };
  return {
    slow: true,
    seq: [
      { at: 0, sc: aleph({ lit: { xco: 'blue', tli: 'fg' }, ...TOOL }, { inp: INP4 }, { ...h, input: ['ar7'] }) },
      { at: 1300, sc: aleph({ lit: { tlo: 'blue' }, ...TOOL }, { ...DOCS, card: 'co' }, { ...h, input: ['ar7'] }) },
    ],
    end: 2600,
    sc: aleph({ lit: { xci: 'em' }, ...TOOL }, DOCS, { ...h, input: ['ar7b'] }),
  };
})();
const scAlAnswer = aleph({ lit: { wo: 'blue' } }, { ...DOCS, n: 11 }, { mini: MINI.slice(0, 9), out: 'ac9' });

// ---- 원고를 직접 쓰는 화면. 요약도 입력·출력 칸도 없이 원고의 글만 보이고, 밑에 사용자가 있다.
// 사용자가 써 나가다가 한 대목을 짚고 ALEPH 를 불러 묻는다
const PG = { x: 260, y: 30, w: 1080, h: 530 };
const PGX = PG.x + 80;
const UX7 = 400;
const AX7 = 1200;
const BY7 = 740;
const ASKED = '그는 풍금 뚜껑을 닫던 날을 생각했다.';
const PICKED = '닫힌 풍금 뚜껑 위에 얹었던 손을, 그는 기억했다.';
const SENT = { plain: ASKED, mark: '<mark>' + ASKED + '</mark>', fixed: '<span class="me">' + PICKED + '</span>' };
// [높이, 글]. 앞의 넷은 이미 쓰여 있던 줄(둘째 줄 뒤에서 장면이 바뀐다), 뒤의 셋은 사용자가 지금 쓰는 줄
const PAGE = [
  [130, '… 대문 밖에 트럭이 서 있었다. 그는 고무신을 꿰어 신을 틈도 없이 짐칸에'],
  [176, '올랐다. 읍내 쪽 하늘이 아직 어두웠다.'],
  [262, '“선생, 왜 안 떠났소.”'],
  [320, '완장을 찬 사내가 물었다. '],
  [378, '대답 대신 손가락이 무릎 위에서 건반을 짚었다. 사내는 그 손을 한참'],
  [424, '내려다보았다. 삼 년 전 학예회 날, 맨 앞줄에서 손뼉을 치던 사람이었다.'],
  [482, '“우리 애가 선생한테 그 노래를 배웠소.”'],
];

//   bare   글이 놓이기 전의 빈 화면      typed  사용자가 쓴 줄 수 (기본은 셋 다)
//   sent   짚은 문장의 모습: 'mark' 짚음, 'fixed' 고쳐 씀      aleph  ALEPH 를 불렀는지      ask  물은 말
//   read   ALEPH 가 원고를 읽는다. true 면 읽은 언저리가 밝혀진다      answer 낸 표현들. 'picked' 면 고른 것만 밝게
function editor(o) {
  o = o || {};
  const lit = o.lit || {};
  const idle = Object.keys(lit).length ? ' dim' : '';
  const top = BY7 - DH / 2;
  const floor = PG.y + PG.h;
  const out = {
    fbox: { k: 'b', ...PG, c: '' },
    mlab: T(PG.x + 28, PG.y + 38, '원고', { al: 'lm', fs: 24, fw: 800 }),
    ubox: { k: 'b', x: UX7 - DW / 2, y: top, w: DW, h: DH, c: 'solid' },
    utx: T(UX7, BY7, '사용자', { fs: 34, fw: 700 }),
  };
  const line = (id, x0, y0, x1, y1) => {
    out[id] = wire(straight(x0, y0, x1, y1), { c: 'head' + (lit[id] ? ' ' + lit[id] : idle), sw: lit[id] ? 4 : 3 });
  };
  line('ufo', UX7, top - 12, UX7, floor + 12);

  if (!o.bare) {
    const typed = o.typed == null ? 3 : o.typed;
    PAGE.forEach(([y, t], i) => {
      if (i >= 4 + typed) return;
      const mine = i >= 4;
      out['ed' + i] = {
        k: 't', x: PGX, y, al: 'lm', fs: 26, fw: 500, w: 940, c: 'type' + (mine ? '' : ' gray'),
        ht: i === 3 ? t + SENT[o.sent || 'plain'] : t, ...(mine ? { from: { w: 0 } } : null),
      };
    });
  }
  if (o.read === true) out.edh = { k: 'r', x: PGX - 16, y: 236, w: 972, h: 170, c: 'hl' };

  if (o.aleph) {
    out.abox = { k: 'b', x: AX7 - DW / 2, y: top, w: DW, h: DH, c: 'solid blue' };
    out.aname2 = T(AX7, BY7, 'ALEPH', { fs: 34, fw: 800, c: 'blue wide' });
    line('wi', UX7 + DW / 2 + 12, BY7 - 12, AX7 - DW / 2 - 12, BY7 - 12);
    line('wo', AX7 - DW / 2 - 12, BY7 + 12, UX7 + DW / 2 + 12, BY7 + 12);
    line('xfi', AX7 - 12, floor + 12, AX7 - 12, top - 12);
    line('xfo', AX7 + 12, top - 12, AX7 + 12, floor + 12);
  }
  if (o.ask) {
    out.eq0 = { k: 't', x: 800, y: 626, fs: 20, fw: 700, ht: '<mark> 3장 4번째 장면 · 21자 </mark>', from: { x: PGX + 470, y: 320 } };
    out.eq1 = T(800, 674, '이 부분을 좀 더 다듬을 만한 표현은 없을까?', { fs: 25, fw: 500, from: { x: UX7 + 80, y: BY7 - 40 } });
  }
  if (o.read) out.erd = { k: 't', x: AX7 + 36, y: 626, al: 'lm', fs: 21, fw: 500, c: 'blue', ht: '<b>읽기</b>  3장 4번째 장면', from: { y: 660 } };
  if (o.answer) {
    const pick = o.answer === 'picked';
    out.ean = {
      k: 't', x: 566, y: 826, al: 'lm', fs: 22, fw: 500, lh: 36, c: pick ? 'dim' : 'blue',
      ht: '① 풍금 뚜껑을 닫던 날의 손끝이 다시 저려 왔다.\n' + (pick ? '<b>② ' + PICKED + '</b>' : '② ' + PICKED),
      from: { x: AX7 - DW / 2 - 60 },
    };
  }
  return out;
}

const WRITING = { lit: { ufo: 'fg' } };
const scAlType = {
  slow: true,
  seq: [
    { at: 0, sc: editor({ ...WRITING, bare: true }) },
    { at: 500, sc: editor({ ...WRITING, typed: 0 }) },
    { at: 1200, sc: editor({ ...WRITING, typed: 1 }) },
    { at: 2500, sc: editor({ ...WRITING, typed: 2 }) },
  ],
  end: 3800,
  sc: editor(WRITING),
};
const CALLED = { sent: 'mark', aleph: true, ask: true };
const scAlQuote = {
  slow: true,
  seq: [{ at: 0, sc: editor({ sent: 'mark' }) }],
  end: 900,
  sc: editor({ ...CALLED, lit: { wi: 'fg' } }),
};
const scAlLook = {
  slow: true,
  seq: [{ at: 0, sc: editor({ ...CALLED, read: 'go', lit: { xfo: 'blue' } }) }],
  end: 1300,
  sc: editor({ ...CALLED, read: true, lit: { xfi: 'em' } }),
};
const scAlOffer = editor({ ...CALLED, answer: true, lit: { wo: 'blue' } });
const scAlFix = editor({ sent: 'fixed', aleph: true, answer: 'picked', lit: { ufo: 'fg' } });

const STEPS = [
  // 0 여는 장
  { id: 'wait', ch: 0, sc: scWait },
  { id: 'cover', ch: 0, sc: scCover },
  { id: 'cover2', ch: 0, sc: scCover2 },
  { id: 'title', ch: 0, sc: scTitle },
  { id: 'title2', ch: 0, sc: scTitle2 },
  { id: 'title2b', ch: 0, sc: scTitle2b },
  { id: 'title3', ch: 0, sc: scTitle3 },
  { id: 'toc', ch: 0, sc: scToc },

  // 1 LLM 기반 시스템
  { id: 'llm', ch: 1, sc: scLlm },
  { id: 'llm-box', ch: 1, sc: scLlmBox },
  { id: 'fn', ch: 1, sc: scFn },
  { id: 'svc', ch: 1, sc: scSvc },
  { id: 'prepost', ch: 1, sc: scPrepost },
  { id: 'scaffold', ch: 1, sc: scScaffold },

  // 2 프롬프트
  { id: 'ask', ch: 2, sc: SHELL },
  { id: 'ask-q', ch: 2, sc: merge(SHELL, Q0, WAIT) },
  { id: 'p-teacher', ch: 2, sc: ask('teacher', 'answer', null, 'an1', '사과 하나를 가지고 있었는데 하나를 더 받으면, 사과는 모두 두 개가 돼요.') },
  { id: 'p-prof', ch: 2, sc: ask('prof', 'answer', null, 'an2', PEANO) },
  { id: 'p-joke', ch: 2, sc: ask('joke', 'chat', null, 'an3', '창문!') },
  { id: 'p-rude', ch: 2, sc: ask('rude', 'chat', null, 'an5', '뭐라는 거야, 너 머리 다쳤냐?') },
  { id: 'g-prof', ch: 2, sc: ask('prof', 'answer', null, 'an2', PEANO) },
  { id: 'g-tone', ch: 2, sc: ask('prof', 'answer', 'brief', 'ag1', '2입니다.') },
  { id: 'g-strict', ch: 2, sc: ask('prof', 'answer', 'strict', 'ag2', STRICT, { fs: 27, lh: 41 }) },
  { id: 'g-latex', ch: 2, sc: ask('prof', 'answer', 'latex', 'ag3', LATEX, { c: 'blue mono', fs: 22, lh: 34 }) },
  { id: 'info-q', ch: 2, sc: merge(SHELL, FEED, INFO_Q, helper(0), WAIT) },
  { id: 'info-no', ch: 2, sc: merge(SHELL, FEED, INFO_Q, helper(0), A('an6', '죄송합니다.\n그 정보는 알지 못합니다.', { d: 0 })) },
  { id: 'info-in', ch: 2, sc: merge(SHELL, FEED, INFO_Q, helper(INFO_UP), INFO, WAIT) },
  { id: 'info-yes', ch: 2, sc: merge(SHELL, FEED, INFO_Q, helper(INFO_UP), INFO, A('an7', INFO_A, { d: 0 })) },

  // 3 컨텍스트
  { id: 'ctx', ch: 3, sc: merge(BASE, SYS) },
  { id: 'm-q1', ch: 3, sc: talk(1, false, 1) },
  { id: 'm-a1', ch: 3, sc: talk(1, true, 1) },
  { id: 'm-q2', ch: 3, sc: talk(2, false, 1) },
  { id: 'm-a2', ch: 3, sc: talk(2, true, 1) },
  { id: 'm-q3', ch: 3, sc: talk(3, false, 1) },
  { id: 'm-a3', ch: 3, sc: talk(3, true, 1) },
  { id: 'rewind', ch: 3, ...rewind },
  { id: 'h-a1', ch: 3, sc: talk(1, true, 1) },
  { id: 'h-box', ch: 3, sc: hist(1, { fresh: true }) },
  { id: 'h-q2', ch: 3, sc: merge(hist(1), Q('tq2', TQ[2])) },
  { id: 'h-a2', ch: 3, sc: merge(hist(1), Q('tq2', TQ[2]), A('ta2', TA[2], { d: 0 })) },
  { id: 'h-rec2', ch: 3, sc: hist(2) },
  { id: 'h-q3', ch: 3, sc: merge(hist(2), Q('tq3', TQ[3])) },
  { id: 'h-think', ch: 3, sc: merge(hist(2, { hl: true }), Q('tq3', TQ[3]), THINK3) },
  { id: 'h-a3', ch: 3, sc: merge(hist(2, { hl: true }), Q('tq3', TQ[3]), THINK3, A('ta3b', CUTE, { d: 150 })) },
  { id: 'h-rec3', ch: 3, sc: hist(3) },
  { id: 'recap', ch: 3, sc: scRecap },
  { id: 'pile-up', ch: 3, ...pileUp },

  // 4 한계와 대책
  { id: 'over-in', ch: 4, ...overIn },
  {
    id: 'over-err', ch: 4, on: 'shake',
    sc: scn({ pairs: range(1, 9), red: true }, ioBars(10, false), {
      terr: T(1180, IOY, '에러: 입력된 텍스트가 너무 큽니다', { al: 'lm', fs: 30, lh: 44, w: 380, c: 'warn', d: 350 }),
    }),
  },
  { id: 'att-0', ch: 4, sc: scn({ pairs: [1, 2, 3] }) },
  { id: 'att-few', ch: 4, sc: attention(FEW, 6, 5) },
  { id: 'att-full', ch: 4, sc: attention(MANY, 18, 1.6) },
  { id: 'litm', ch: 4, sc: scn({ pairs: FULL, faint: true }, { cite: T(800, 866, CITE, { fs: 17, fw: 400, lh: 24, w: 1240, c: 'dim', d: 300 }) }) },
  { id: 'cut-in', ch: 4, ...overIn },
  { id: 'cut-1', ch: 4, seq: cut1.seq, end: cut1.end, sc: cut1.sc },
  { id: 'cut-loop', ch: 4, seq: cutLoop.seq, end: cutLoop.end, sc: cutLoop.sc },
  { id: 'sum-in', ch: 4, ...sumIn },
  {
    id: 'sum-1', ch: 4,
    seq: [{ at: 0, sc: scn({ pairs: SUM_ALL, squeeze: SUM_OLD }) }],
    end: 700, sc: scSum,
  },
  { id: 'info-big', ch: 4, sc: scn({ sum: true, pairs: [13, 14], info: 7 }) },
  { id: 'info-over', ch: 4, sc: scInfoOver },
  { id: 'store', ch: 4, sc: scStore },
  { id: 'search-q', ch: 4, sc: scSearchQ },
  { id: 'search-hit', ch: 4, sc: scSearchHit },
  { id: 'search-in', ch: 4, sc: scSearchIn },

  // 5 서사 창작에서의 LLM 기반 시스템
  { id: 'lit', ch: 5, sc: scn({ pairs: [1, 2, 3] }) },
  { id: 'lit-text', ch: 5, sc: LIT },
  { id: 'lit-g1', ch: 5, sc: merge(LIT, NOVEL_Q, said(1)) },
  { id: 'lit-r1', ch: 5, sc: novel(1) },
  { id: 'lit-g2', ch: 5, sc: novel(1, GO_ON, said(2)) },
  { id: 'lit-r2', ch: 5, sc: novel(2) },
  { id: 'lit-g3', ch: 5, sc: novel(2, GO_ON, said(3)) },
  { id: 'lit-r3', ch: 5, sc: novel(3) },
  { id: 'jj-q', ch: 5, sc: bench(WA('aq2', '?', { fs: 64 })) },
  { id: 'jj-a1', ch: 5, sc: bench(WA('ja1', '배가 부르셨던 것 같습니다.')) },
  { id: 'jj-a2', ch: 5, sc: bench(WA('ja2', '짜장면보다 짬뽕을 더 좋아하시는 것 같습니다.')) },
  { id: 'jj-photo', ch: 5, sc: { photo: { k: 'i', src: PHOTO, x: 800, y: 450, w: 1360, c: 'photo' } } },
  { id: 'fam-q', ch: 5, sc: merge(LIT, FAM_Q) },
  { id: 'fam-a', ch: 5, sc: merge(LIT, FAM_Q, JJ_OUT) },
  { id: 'fam-in', ch: 5, sc: lit(['jj'], FAM_Q) },
  { id: 'fam-push', ch: 5, ...famPush },
  { id: 'fam-out', ch: 5, ...famOut },
  { id: 'fam-back', ch: 5, sc: lit(FULL_STORY, GO_ON) },
  { id: 'fam-sum', ch: 5, ...famSum },
  { id: 'fam-back2', ch: 5, sc: lit(FULL_STORY) },
  { id: 'fam-rag', ch: 5, sc: famRag(false, false) },
  { id: 'fam-rag-q', ch: 5, sc: famRag(true, false) },
  { id: 'fam-miss', ch: 5, sc: famRag(true, true) },
  { id: 'lit-bars', ch: 5, sc: scBars },

  // 6 에이전트의 이해
  { id: 'ag-half', ch: 6, sc: shrink(scBars, 0.5) },
  { id: 'ag-small', ch: 6, sc: scSmall },
  { id: 'ag-ai', ch: 6, sc: AI },
  { id: 'ag-io', ch: 6, sc: merge(AI, io(IOY, 'wi', 'wo')) },
  { id: 'ag-user', ch: 6, sc: scUser },
  { id: 'ag-q', ch: 6, sc: merge(scUser, QBOX) },
  { id: 'ag-q-io', ch: 6, sc: merge(scUser, QBOX, ioBack(IOY - RD, 'w2o', 'w2i')) },
  { id: 'ag-q-ring', ch: 6, sc: merge(scUser, QBOX, ring('w2', -RD)) },
  { id: 'ag-stack', ch: 6, sc: dia({ cols: { c: { tool: '?' } } }) },
  { id: 'ag-search', ch: 6, sc: dia({ cols: { c: T_SEARCH } }) },
  { id: 'ag-open', ch: 6, sc: scOpen },
  { id: 'ag-guide', ch: 6, sc: scGuide },
  { id: 'ag-w1', ch: 6, sc: scW1 },
  { id: 'ag-w2', ch: 6, ...scW2 },
  { id: 'ag-w3', ch: 6, sc: scW3 },
  { id: 'ag-w4', ch: 6, sc: scW4 },
  { id: 'ag-w5', ch: 6, sc: scW5 },
  { id: 'ag-w6', ch: 6, sc: scW6 },
  { id: 'ag-w7', ch: 6, sc: scW7 },
  { id: 'ag-t-file', ch: 6, sc: scToolFile },
  { id: 'ag-t-code', ch: 6, sc: scToolCode },
  { id: 'ag-three', ch: 6, sc: scThree },
  { id: 'ag-loop', ch: 6, ...scLoop },
  { id: 'ag-name', ch: 6, sc: scAgent },
  { id: 'ag-pack', ch: 6, sc: scPack },
  { id: 'ag-x-ai-io', ch: 6, sc: plugTo({ to: 'ai' }) },
  { id: 'ag-x-ai', ch: 6, sc: plugTo({ to: 'ai', plug: true }) },
  { id: 'ag-x-ag-io', ch: 6, sc: plugTo({ to: 'agent' }) },
  { id: 'ag-x-ag', ch: 6, sc: plugTo({ to: 'agent', plug: true }) },
  { id: 'ag-x-head', ch: 6, sc: plugTo({ self: true }) },
  { id: 'ag-x-check', ch: 6, ...scSelfCheck },
  { id: 'ag-x-cut', ch: 6, ...scSelfCut },
  { id: 'ag-x-sum', ch: 6, ...scSelfSum },
  { id: 'ag-f-open', ch: 6, sc: scFiles },
  { id: 'ag-f-write', ch: 6, sc: scWrite },
  { id: 'ag-f-read', ch: 6, sc: scRead },
  { id: 'ag-f-edit', ch: 6, sc: scEdit },
  { id: 'ag-f-take', ch: 6, sc: scTake },
  { id: 'ag-f-save', ch: 6, sc: scSave },
  { id: 'ag-f-load', ch: 6, sc: scLoad },
  { id: 'ag-f-fold', ch: 6, sc: scFold },
  { id: 'ag-f-share', ch: 6, ...scShare },

  // 7 ALEPH
  { id: 'al-open', ch: 7, sc: scAlOpen },
  { id: 'al-me', ch: 7, sc: scAlMe },
  { id: 'al-talk', ch: 7, ...scAlTalk },
  { id: 'al-io', ch: 7, sc: scAlIo },
  { id: 'al-in', ch: 7, sc: scAlIn },
  { id: 'al-out', ch: 7, ...scAlOut },
  { id: 'al-cut', ch: 7, sc: scAlCut },
  { id: 'al-sum', ch: 7, sc: scAlSum },
  { id: 'al-peek', ch: 7, sc: scAlPeek },
  { id: 'al-peek2', ch: 7, sc: scAlPeek2 },
  { id: 'al-def', ch: 7, sc: scAlDef },
  { id: 'al-def2', ch: 7, sc: scAlDef2 },
  { id: 'al-mat', ch: 7, sc: scAlMat },
  { id: 'al-plan', ch: 7, sc: scAlPlan },
  { id: 'al-pin', ch: 7, sc: scAlPin },
  { id: 'al-head', ch: 7, sc: scAlHead },
  { id: 'al-ask', ch: 7, sc: scAlAsk },
  { id: 'al-read', ch: 7, ...AL_STEPS[1] },
  { id: 'al-find', ch: 7, ...AL_STEPS[2] },
  { id: 'al-read2', ch: 7, ...AL_STEPS[3] },
  { id: 'al-sub', ch: 7, ...AL_STEPS[4] },
  { id: 'al-user', ch: 7, ...AL_STEPS[5] },
  { id: 'al-brief', ch: 7, ...AL_STEPS[6] },
  { id: 'al-check', ch: 7, ...scAlCheck },
  { id: 'al-run', ch: 7, ...scAlRun },
  { id: 'al-insert', ch: 7, ...AL_STEPS[8] },
  { id: 'al-answer', ch: 7, sc: scAlAnswer },
  { id: 'al-type', ch: 7, ...scAlType },
  { id: 'al-quote', ch: 7, ...scAlQuote },
  { id: 'al-look', ch: 7, ...scAlLook },
  { id: 'al-offer', ch: 7, sc: scAlOffer },
  { id: 'al-fix', ch: 7, sc: scAlFix },

  // 8 닫는 장
  { id: 'close', ch: 8, on: 'L-close' },
];
