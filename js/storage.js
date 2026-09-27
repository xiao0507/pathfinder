/* ===== 本地存储 + 学习进度 / 遗忘曲线 ===== */
// 内存兜底：个别隐私模式/不透明来源下 localStorage 不可用时仍可运行
const _mem = {};
const _ls = (function () {
  try {
    localStorage.setItem('__pf_test__', '1');
    localStorage.removeItem('__pf_test__');
    return localStorage;
  } catch (e) {
    return {
      getItem: k => (k in _mem ? _mem[k] : null),
      setItem: (k, v) => { _mem[k] = String(v); },
      removeItem: k => { delete _mem[k]; },
      key: i => Object.keys(_mem)[i] || null,
      get length() { return Object.keys(_mem).length; }
    };
  }
})();

const Store = {
  get(k, d) {
    try { const v = _ls.getItem('pf_' + k); return v == null ? d : JSON.parse(v); }
    catch (e) { return d; }
  },
  set(k, v) {
    try { _ls.setItem('pf_' + k, JSON.stringify(v)); } catch (e) {}
  },
  del(k) { try { _ls.removeItem('pf_' + k); } catch (e) {} },
  // 当前存储占用字符数（近似缓存大小）
  usage() {
    let n = 0;
    try {
      for (let i = 0; i < _ls.length; i++) {
        const k = _ls.key(i);
        n += (k || '').length + (_ls.getItem(k) || '').length;
      }
    } catch (e) {}
    return n;
  },
  keys() {
    const a = [];
    try { for (let i = 0; i < _ls.length; i++) a.push(_ls.key(i)); } catch (e) {}
    return a;
  }
};

/* SRS：间隔重复（类遗忘曲线 / SM-2 简化版）
   状态：new / learn / review
   ease 难度系数，ivl 当前间隔(天)，due 到期时间戳
*/
const SRS = {
  key: 'srs',
  all() { return Store.get(this.key, {}); },
  get(word) {
    return this.all()[word.toLowerCase()] || null;
  },
  ensure(word) {
    const m = this.all();
    const k = word.toLowerCase();
    if (!m[k]) {
      m[k] = { w: word, st: 'new', ivl: 0, ease: 2.5, due: Date.now(), reps: 0, laps: 0 };
      Store.set(this.key, m);
    }
    return m[k];
  },
  // quality: 0=忘了 1=困难 2=良好 3=简单
  grade(word, quality) {
    const m = this.all();
    const k = word.toLowerCase();
    const c = m[k] || { w: word, st: 'new', ivl: 0, ease: 2.5, reps: 0, laps: 0 };
    c.reps++;
    if (quality === 0) {
      c.laps++;
      c.ivl = 0;
      c.st = 'learn';
      c.due = Date.now() + 10 * 60 * 1000; // 10分钟后
      c.ease = Math.max(1.3, c.ease - 0.2);
    } else {
      if (quality === 1) c.ease = Math.max(1.3, c.ease - 0.15);
      if (quality === 3) c.ease += 0.1;
      // 间隔：首次->1天，第二次->3天，之后按 ease 增长
      if (c.ivl === 0) c.ivl = 1;
      else if (c.ivl === 1) c.ivl = 3;
      else c.ivl = Math.round(c.ivl * c.ease);
      c.st = 'review';
      c.due = Date.now() + c.ivl * 86400000;
    }
    m[k] = c;
    Store.set(this.key, m);
    return c;
  },
  // 到期（需要复习）的词
  dueList() {
    const now = Date.now();
    return Object.values(this.all())
      .filter(c => c.st !== 'new' && c.due <= now)
      .sort((a, b) => a.due - b.due);
  },
  learnedCount() {
    return Object.values(this.all()).filter(c => c.reps > 0).length;
  },
  masteredCount() {
    return Object.values(this.all()).filter(c => c.ivl >= 21).length;
  },
  reset() { Store.set(this.key, {}); }
};

/* 连续学习天数 */
const Streak = {
  bump() {
    const t = todayStr();
    const s = Store.get('streak', { days: 0, last: '' });
    if (s.last === t) return s.days;
    const y = new Date(Date.now() - 86400000);
    const yt = y.getFullYear() + '-' + String(y.getMonth() + 1).padStart(2, '0') + '-' + String(y.getDate()).padStart(2, '0');
    s.days = s.last === yt ? s.days + 1 : 1;
    s.last = t;
    Store.set('streak', s);
    return s.days;
  },
  days() { return Store.get('streak', { days: 0 }).days; }
};
