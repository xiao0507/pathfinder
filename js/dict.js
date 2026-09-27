/* ===== 点词词典：任意模块、任意英文词点击即释义 + 发音 =====
   查找顺序：核心词库(带例句) → 精选大词典 → 词形变化/规则还原 → 在线翻译 */
const Dict = {
  map: {},     // 核心详细词（WORDS + extra/supp）
  big: {},     // 精选大词典（音标+中文）
  forms: null,  // 变形 -> 原形

  build() {
    // 核心详细词库
    (window.WORDS || []).forEach(x => { this.map[x.w.toLowerCase()] = x; });
    const addExtra = x => {
      if (!this.map[x.w.toLowerCase()]) {
        this.map[x.w.toLowerCase()] = { w: x.w, p: x.p, t: [{ cn: x.cn }], s: [], _extra: true };
      }
    };
    (window.DICT_EXTRA || []).forEach(addExtra);
    (window.DICT_SUPP || []).forEach(addExtra);

    // 精选大词典
    (window.DICT_BIG || []).forEach(x => { this.big[x.w.toLowerCase()] = x; });

    this.forms = window.FORMS || {};
  },

  // 常见专有名词（人名/书名角色/地名）的正确释义，优先于词典里可能出现的缩写/技术义
  proper: {
    'alice': '艾丽斯（女子名）',
    'bob': '鲍勃（男子名）',
    'tom': '汤姆（男子名）',
    'huck': '哈克（男子名，Huckleberry 的昵称）',
    'huckleberry': '哈克贝利（男子名）',
    'jim': '吉姆（男子名）',
    'peter': '彼得（男子名）',
    'wendy': '温迪（女子名）',
    'dorian': '道林（男子名）',
    'watson': '沃森（姓氏）',
    'sherlock': '舍洛克（男子名）',
    'holmes': '霍姆斯（姓氏）',
    'mowgli': '毛格利（《丛林之书》主角名）',
    'gutenberg': '古登堡（人名 / 公版书库名）',
    'london': '伦敦（英国城市）',
    'paris': '巴黎（法国城市）',
    'england': '英格兰（英国）',
    'america': '美洲；美国',
    'france': '法国',
    'christmas': '圣诞节',
    'god': '上帝；神',
    'mr': '先生（尊称）',
    'mrs': '太太；夫人（尊称）',
    'ms': '女士（尊称）'
  },

  // 高频功能词：给最常用、最干净的释义，避免大词典里的冷门技术义
  common: {
    'for': 'prep. 为了；给；因为；对于；前往 conj. 因为',
    'and': 'conj. 和；与；而且；然后',
    'the': 'art. 这；那；这些；那些（定冠词）',
    'a': 'art. 一个；任一（不定冠词）',
    'an': 'art. 一个（用于元音前）',
    'of': 'prep. …的；属于；关于；由…组成',
    'to': 'prep. 向；到；对 infin. 用于动词原形前',
    'in': 'prep. 在…里；在…期间；用… adv. 进入；在家',
    'is': 'v. 是（be 的第三人称单数现在式）',
    'it': 'pron. 它；这；那',
    'at': 'prep. 在；于；向；以（价格/速度）',
    'by': 'prep. 在…旁边；由；通过；不迟于；乘',
    'as': 'prep. 作为 conj. 当…时；因为；像',
    'be': 'v. 是；在；成为（原形）',
    'do': 'v. 做；干；进行 aux. 构成疑问/否定',
    'go': 'v. 去；走；离开；变得',
    'he': 'pron. 他',
    'she': 'pron. 她',
    'if': 'conj. 如果；假如；是否',
    'me': 'pron. 我（宾格）',
    'my': 'det. 我的',
    'no': 'adv. 不；没有 det. 没有；无',
    'on': 'prep. 在…上；关于 adv. 进行中',
    'or': 'conj. 或；或者；否则',
    'so': 'adv. 如此；那么 conj. 所以；因此',
    'up': 'adv. 向上；起来 prep. 沿…向上',
    'us': 'pron. 我们（宾格）',
    'we': 'pron. 我们',
    'you': 'pron. 你；你们',
    'your': 'det. 你的；你们的',
    'have': 'v. 有；进行；吃；使 aux. 已经',
    'has': 'v. 有（have 的第三人称单数）',
    'had': 'v. 有（过去式/过去分词）',
    'not': 'adv. 不；没有',
    'but': 'conj. 但是；然而 prep. 除…之外',
    'with': 'prep. 和…一起；用；具有；关于',
    'this': 'det./pron. 这；这个；今…',
    'that': 'det./pron. 那；那个 conj. 引导从句',
    'from': 'prep. 从；来自；由于；离',
    'they': 'pron. 他们；她们；它们',
    'were': 'v. 是（are 的过去式）',
    'been': 'v. 是（be 的过去分词）',
    'are': 'v. 是（be 的复数/第二人称现在式）',
    'was': 'v. 是（am/is 的过去式）',
    'will': 'aux. 将；会；愿意 n. 意志；遗嘱',
    'would': 'aux. 将；愿意；会（will 的过去式）',
    'can': 'aux. 能；会；可以 n. 罐头',
    'could': 'aux. 能；可以（can 的过去式）',
    'there': 'adv. 在那里；那里 pron. 存在句引导词',
    'their': 'det. 他们的；她们的；它们的',
    'what': 'pron. 什么；多么 adj. 什么',
    'which': 'pron./det. 哪一个；哪些',
    'when': 'adv./conj. 什么时候；当…时',
    'how': 'adv. 怎样；如何；多么',
    'all': 'det./pron. 全部；所有 adv. 完全',
    'one': 'num. 一 pron. 一个；某人'
  },

  // 归一化候选原形
  lemmas(rawWord) {
    const w = rawWord.toLowerCase().replace(/[’']s$/, '');
    const cands = [];
    const push = c => { if (c && !cands.includes(c)) cands.push(c); };
    push(w);
    // 变形表
    if (this.forms[w]) push(this.forms[w]);
    // 规则后缀
    const rules = [
      [/ies$/, 'y'], [/ses$/, 's'], [/ches$/, 'ch'], [/shes$/, 'sh'], [/xes$/, 'x'], [/zes$/, 'z'],
      [/ied$/, 'y'], [/ed$/, ''], [/ing$/, ''],
      [/er$/, ''], [/est$/, ''], [/ly$/, ''], [/s$/, '']
    ];
    for (const [re, suf] of rules) {
      if (re.test(w)) {
        const base = w.replace(re, suf);
        push(base);
        if (this.forms[base]) push(this.forms[base]);
        // 双写辅音还原：stopped -> stop
        if (suf === '' && /(.)\1$/.test(base)) {
          const b2 = base.slice(0, -1);
          push(b2);
          if (this.forms[b2]) push(this.forms[b2]);
        }
      }
    }
    return cands;
  },

  // 同步查找（别名，返回结果条目本身 {w,p,t/c,...}）
  lookup(rawWord, isCap) {
    const f = this.lookupLocal(rawWord, isCap);
    if (!f) return null;
    return f.type === 'big'
      ? { w: f.entry.w, p: f.entry.p, cn: f.entry.c, t: [{ cn: f.entry.c }] }
      : f.entry;
  },

  // 同步查找本地词库，返回 {type, entry}
  lookupLocal(rawWord, isCapitalized) {
    const w = rawWord.toLowerCase();
    // 大写专名（句中/书名中首字母大写）优先用专名表，避开错误缩写义
    if (isCapitalized && this.proper[w]) {
      const p = (this.big[w] && this.big[w].p) || '';
      return { type: 'big', entry: { w: rawWord, p: p, c: this.proper[w] } };
    }
    if (this.common[w]) {
      const p = (this.big[w] && this.big[w].p) || '';
      return { type: 'big', entry: { w: rawWord, p: p, c: this.common[w] } };
    }
    if (this.map[w]) {
      return { type: 'core', entry: this.map[w] };
    }
    if (this.big[w]) return { type: 'big', entry: this.big[w] };
    for (const c of this.lemmas(rawWord)) {
      if (this.map[c]) return { type: 'core', entry: this.map[c] };
      if (this.big[c]) return { type: 'big', entry: this.big[c] };
    }
    return null;
  },

  // 渲染可点击英文（保留已有用法）
  renderClickable(text) {
    return splitTokens(esc(text)).map(seg => {
      if (/^[A-Za-z]/.test(seg)) {
        const cap = /^[A-Z]/.test(seg) ? '1' : '0';
        return '<span class="clickword" data-w="' + seg + '" data-cap="' + cap + '">' + seg + '</span>';
      }
      return seg;
    }).join('');
  },

  _renderLoading(word) {
    return '<button class="dp-close">✕</button>' +
      '<div class="dp-word">' + esc(word) + ' <span class="speaker" data-speak="' + esc(word) + '">🔊</span></div>' +
      '<div class="dp-mean"><span class="spin"></span> 正在查询释义…</div>';
  },

  show(word, x, y, isCap) {
    const pop = $('#dictPop');
    pop.innerHTML = this._renderLoading(word);
    pop.classList.remove('hidden');
    this._position(pop, x, y);
    this._wireClose(pop);

    if (isCap == null) isCap = /^[A-Z]/.test(word);
    const local = this.lookupLocal(word, isCap);
    if (local) {
      pop.innerHTML = this._renderEntry(word, local);
      this._position(pop, x, y);
      this._wireClose(pop);
      return;
    }

    // 本地未收录 -> 在线翻译兜底（仍可立即朗读）
    Trans.toZh(word)
      .then(zh => {
        if (pop.classList.contains('hidden')) return;
        pop.innerHTML = this._renderOnline(word, zh);
        this._position(pop, x, y);
        this._wireClose(pop);
      })
      .catch(() => {});
  },

  _renderEntry(word, found) {
    const t = found.type;
    const e = found.entry;
    let means = '', phone = '', example = '';

    if (t === 'core') {
      if (e.t && e.t.length) {
        means = e.t.slice(0, 4).map(m =>
          '<div class="dp-mean">' + (m.p ? '<span class="pill gray">' + esc(m.p) + '</span> ' : '') +
          esc(m.cn) + (m.en ? '<div class="dp-en">' + esc(m.en) + '</div>' : '') + '</div>').join('');
      }
      if (e.p) phone = '/ ' + esc(e.p) + ' /';
      if (e.s && e.s[0]) {
        example = '<div class="divider"></div><div class="muted">' + esc(e.s[0].en) +
          '<br>' + esc(e.s[0].cn || '') + '</div>';
      }
    } else {
      means = '<div class="dp-mean">' + esc(e.c) + '</div>';
      if (e.p) phone = '/ ' + esc(e.p) + ' /';
    }

    return '<button class="dp-close">✕</button>' +
      '<div class="dp-word">' + esc(word) + ' <span class="speaker" data-speak="' + esc(word) + '">🔊</span></div>' +
      (phone ? '<div class="dp-phone">' + phone + '</div>' : '') +
      means + example;
  },

  _renderOnline(word, zh) {
    const body = zh
      ? '<div class="dp-mean">' + esc(zh) + '</div>'
      : '<div class="dp-mean muted">未找到该词释义，点击 🔊 可听发音。</div>';
    return '<button class="dp-close">✕</button>' +
      '<div class="dp-word">' + esc(word) + ' <span class="speaker" data-speak="' + esc(word) + '">🔊</span></div>' +
      body;
  },

  _position(pop, x, y) {
    const rw = pop.offsetWidth || 320, rh = pop.offsetHeight || 200;
    let left = Math.min(x + 12, window.innerWidth - rw - 12);
    let top = y + 18;
    if (top + rh > window.innerHeight) top = y - rh - 10;
    pop.style.left = Math.max(12, left) + 'px';
    pop.style.top = Math.max(12, top) + 'px';
  },

  _wireClose(pop) {
    const c = pop.querySelector('.dp-close');
    if (c) c.onclick = () => pop.classList.add('hidden');
  },

  hide() { $('#dictPop').classList.add('hidden'); }
};

// 全局事件委托：朗读 / 点词
document.addEventListener('click', e => {
  const sp = e.target.closest('[data-speak]');
  if (sp) { e.stopPropagation(); Speech.speak(sp.getAttribute('data-speak')); return; }
  const cw = e.target.closest('.clickword');
  if (cw) {
    e.stopPropagation();
    const w = cw.getAttribute('data-w');
    const cap = cw.getAttribute('data-cap') === '1';
    const r = cw.getBoundingClientRect();
    Dict.show(w, r.left, r.top, cap);
    return;
  }
  if (!e.target.closest('#dictPop')) Dict.hide();
});
