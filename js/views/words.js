/* ===== 单词学习：句子记忆 + 段落记忆 + 遗忘曲线复习 ===== */
Views.words = {
  batch: 10,
  st: null,

  render(v) {
    v.innerHTML = `
      <div class="tabs">
        <button class="tab active" data-tab="card">🃏 卡片背词（句子记忆）</button>
        <button class="tab" data-tab="para">📄 段落记词</button>
      </div>
      <div id="wBody"></div>`;
    $$('.tab', v).forEach(t => t.onclick = () => {
      $$('.tab', v).forEach(x => x.classList.remove('active'));
      t.classList.add('active');
      this.openTab(t.dataset.tab);
    });
    this.openTab('card');
  },

  /* ---------- 卡片 ---------- */
  newSession() {
    // 到期复习优先
    const due = SRS.dueList().map(c => c.w);
    const dueSet = new Set(due.map(x => x.toLowerCase()));
    // 新词：取还没学过的
    const fresh = [];
    for (const x of window.WORDS) {
      if (fresh.length >= this.batch) break;
      const rec = SRS.get(x.w);
      if ((!rec || rec.reps === 0) && !dueSet.has(x.w.toLowerCase())) fresh.push(x);
    }
    const find = w => window.WORDS.find(x => x.w.toLowerCase() === w.toLowerCase());
    const q = [];
    due.forEach(w => { const e = find(w); if (e) q.push(e); });
    fresh.forEach(e => q.push(e));
    this.st = { queue: q, idx: 0, total: q.length, again: [], done: 0, isDue: dueSet };
  },

  openTab(tab) {
    const body = $('#wBody');
    if (tab === 'card') this.cardTab(body);
    else this.paraTab(body);
  },

  cardTab(body) {
    if (!this.st || this.st.queue.length === 0) this.newSession();
    if (this.st.queue.length === 0) {
      body.innerHTML = `<div class="card empty"><span class="e-ic">🎉</span><b>今天没有到期单词，词库也已学完！</b>
        <p class="muted mt">可在“设置”接入大模型生成更多新词，或去原著/阅读中继续积累。</p>
        <button class="btn mt" id="wReload">重新检查复习任务</button></div>`;
      $('#wReload').onclick = () => { this.st = null; this.cardTab(body); };
      return;
    }
    this.renderCard(body);
  },

  currentEntry() {
    const cur = this.st.queue[this.st.idx];
    return cur || null;
  },

  renderCard(body) {
    const e = this.currentEntry();
    if (!e) { this.finished(body); return; }
    SRS.ensure(e.w);
    const rec = SRS.get(e.w);
    const isReview = rec && rec.reps > 0;
    const ex = (e.s && e.s[0]) || null;
    const ex2 = e.s && e.s[1];
    const pct = Math.round(this.st.done / Math.max(1, this.st.total) * 100);

    body.innerHTML = `
      <div class="word-progress">
        <span class="pill ${isReview ? 'amber' : ''}">${isReview ? '复习中 · 间隔' + rec.ivl + '天' : '新词'}</span>
        <div class="prog-bar"><i style="width:${pct}%"></i></div>
        <span class="muted">${this.st.done}/${this.st.total}</span>
      </div>
      <div class="flash">
        <div class="w-head">
          <span class="w-word">${esc(e.w)}</span>
          <span class="speaker" data-speak="${esc(e.w)}" style="font-size:20px">🔊</span>
          ${e.p ? '<span class="w-phone">/ ' + esc(e.p) + ' /</span>' : ''}
        </div>
        <div class="mean-list">
          ${e.t.slice(0, 3).map(t => `
            <div class="mean">
              ${t.p ? '<span class="w-pos">' + esc(t.p) + '</span>' : ''}
              <div class="m-cn">${esc(t.cn)}</div>
              ${t.en ? '<div class="m-en">' + esc(t.en) + '</div>' : ''}
            </div>`).join('')}
        </div>
        ${ex ? `
          <div class="ex-box">
            <div class="ex-en">📝 ${Dict.renderClickable(ex.en)} <span class="speaker" data-speak="${esc(ex.en)}">🔊</span></div>
            <div class="ex-cn">${esc(ex.cn || '')}</div>
          </div>` : ''}
        ${ex2 ? `<div class="muted mt">${esc(ex2.en)}<br>${esc(ex2.cn || '')}</div>` : ''}
        <div class="flash-actions">
          <button class="btn outline" data-q="0">😵 还不会</button>
          <button class="btn ghost" data-q="1">😐 困难</button>
          <button class="btn" data-q="2">✅ 学会了，下一个</button>
          <button class="btn amber" data-q="3">😎 很简单</button>
        </div>
      </div>`;

    $$('[data-q]', body).forEach(b => b.onclick = () => this.grade(parseInt(b.dataset.q), body));
  },

  grade(q, body) {
    const e = this.currentEntry();
    SRS.grade(e.w, q);
    this.st.done++;
    if (q === 0) this.st.again.push(e); // 忘了的词排到队尾再来
    this.st.idx++;
    if (this.st.idx >= this.st.queue.length) {
      if (this.st.again.length) {
        this.st.queue = this.st.again;
        this.st.again = [];
        this.st.idx = 0;
        toast('把刚忘记的词再过一遍');
      }
    }
    this.renderCard(body);
  },

  finished(body) {
    this.st = { queue: [], idx: 0, total: 0, done: 0, again: [] };
    body.innerHTML = `
      <div class="card empty">
        <span class="e-ic">🏆</span>
        <h3>这一组完成！</h3>
        <p class="muted mt">已按遗忘曲线安排好复习时间，到期会在首页提醒你。</p>
        <div class="mt" style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
          <button class="btn" id="wNext">继续学下一组新词</button>
          <button class="btn outline" id="wHome">回首页</button>
        </div>
      </div>`;
    $('#wNext').onclick = () => { this.st = null; this.cardTab(body); };
    $('#wHome').onclick = () => App.go('home');
  },

  /* ---------- 段落记词 ---------- */
  paraIdx: 0,
  paraTab(body) {
    const arts = window.ARTICLES || [];
    if (!arts.length) { body.innerHTML = '<div class="empty">内容加载中…</div>'; return; }
    if (!this._paraOrder) this._paraOrder = shuffle(arts.map((_, i) => i));
    const art = arts[this._paraOrder[this.paraIdx % this._paraOrder.length]];
    // 收集段落中命中的核心词作为重点
    const keySet = new Set((art.words || []).map(x => x.toLowerCase()));
    body.innerHTML = `
      <div class="card">
        <div class="section-head">
          <div><h2>${esc(art.title)}</h2><div class="sub">${esc(art.cn)} · ${esc(art.cat)}</div></div>
          <div style="display:flex;gap:8px">
            <button class="btn outline sm" id="pRead">🔊 朗读全文</button>
            <button class="btn sm" id="pNext">换一段 ⟳</button>
          </div>
        </div>
        <div class="article-body">
          ${art.paras.map(p => `
            <div class="para">
              <div class="en">${Dict.renderClickable(p.en)}</div>
              <div class="cn">${esc(p.cn)}</div>
            </div>`).join('')}
        </div>
        <div class="chapter-words">
          <h4>🔑 本段重点词（点击查义 · 全部可朗读）</h4>
          <div>${[...keySet].map(w => `<span class="chip-word" data-chip="${esc(w)}">${esc(w)}</span>`).join('')}</div>
        </div>
      </div>`;
    $('#pNext').onclick = () => { this.paraIdx++; this.paraTab(body); };
    $('#pRead').onclick = () => Speech.speak(art.paras.map(p => p.en).join(' '));
    $$('[data-chip]', body).forEach(c => c.onclick = () => {
      const r = c.getBoundingClientRect();
      Dict.show(c.dataset.chip, r.left, r.bottom);
    });
  }
};
