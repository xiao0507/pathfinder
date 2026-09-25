/* ===== 英文原著：整本阅读 · 章末生词 · 朗读 · 段落翻译可折叠 ===== */
Views.books = {
  render(v) {
    const books = window.BOOKS || [];
    v.innerHTML = `
      <div class="section-head">
        <div><h2>📚 英文原著</h2><div class="sub">${books.length} 本完整作品 · 点任意词查义 · 段落中文翻译可展开 · 英文朗读</div></div>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <input class="search-box" id="bSearch" placeholder="搜索书名/作者…">
        </div>
      </div>
      <div class="grid grid-3" id="bList"></div>`;
    const list = $('#bList');
    const draw = (kw = '') => {
      list.innerHTML = '';
      books.filter(b => !kw || (b.title + b.author).toLowerCase().includes(kw.toLowerCase())).forEach(b => {
        const words = sumWords(b);
        const c = h('div', { class: 'card book-item' },
          h('span', { class: 'pill' }, b.level),
          h('h3', { style: 'margin:10px 0 3px;font-size:17px;line-height:1.4' }, b.title),
          h('div', { class: 'muted', style: 'font-size:13px' }, b.author),
          h('div', { class: 'muted mt', style: 'font-size:12.5px' }, `${b.chapters.length} 章 · 约 ${words} 词`));
        c.onclick = () => this.toc(b);
        list.append(c);
      });
      if (!list.children.length) list.innerHTML = '<div class="empty">没有匹配的书</div>';
    };
    draw();
    $('#bSearch').oninput = e => draw(e.target.value);
  },

  toc(b) {
    const v = $('#view');
    v.innerHTML = `
      <button class="btn outline sm mb" id="back">← 书架</button>
      <div class="card">
        <span class="pill">${esc(b.level)}</span>
        <h2 style="margin:12px 0 2px">${esc(b.title)}</h2>
        <div class="muted mb">${esc(b.author)} · 共 ${b.chapters.length} 章</div>
        <div class="book-chapters">
          ${b.chapters.map((c, i) => `<button class="chap-link" data-i="${i}"><span>${esc(c.title)}</span><span class="muted">${c.paras.length} 段</span></button>`).join('')}
        </div>
      </div>`;
    $('#back').onclick = () => App.go('books');
    $$('[data-i]').forEach(btn => btn.onclick = () => this.chapter(b, parseInt(btn.dataset.i)));
  },

  chapter(b, ci) {
    const v = $('#view');
    const ch = b.chapters[ci];
    let autoTr = Store.get('bookAutoTr', false);
    v.innerHTML = `
      <div class="book-toolbar">
        <button class="btn outline sm" id="back">← 目录</button>
        <button class="btn outline sm" id="prev">上一章</button>
        <button class="btn outline sm" id="next">下一章</button>
        <span style="flex:1"></span>
        <button class="btn ghost sm" id="autoTr">${autoTr ? '✅ 自动翻译' : '一键翻译本章'}</button>
        <button class="btn sm" id="readCh">🔊 朗读本章</button>
      </div>
      <div class="card">
        <h2 style="font-size:22px;margin-bottom:18px">${esc(ch.title)}</h2>
        <div id="paras">
          ${ch.paras.map((p, i) => `
            <div class="para" data-i="${i}" style="margin-bottom:14px">
              <div class="en">${Dict.renderClickable(p)} <span class="speaker" data-speak="${esc(p)}">🔊</span> <span class="tr-btn muted" style="font-size:13px;cursor:pointer">译</span></div>
              <div class="cn tr-cn hidden" style="margin-top:4px"></div>
            </div>`).join('')}
        </div>
        ${this.wordBoxHtml(ch)}
      </div>`;

    $('#back').onclick = () => this.toc(b);
    $('#prev').onclick = () => ci > 0 && this.chapter(b, ci - 1);
    $('#next').onclick = () => ci < b.chapters.length - 1 && this.chapter(b, ci + 1);
    $('#readCh').onclick = () => Speech.speak(ch.paras.join(' '));

    const translateOne = async (paraEl) => {
      const cnEl = $('.tr-cn', paraEl);
      if (!cnEl.classList.contains('hidden') && cnEl.textContent) return;
      const i = parseInt(paraEl.dataset.i);
      cnEl.textContent = '翻译中…';
      cnEl.classList.remove('hidden');
      const zh = await Trans.toZh(ch.paras[i]);
      cnEl.textContent = zh || '（翻译服务暂不可用，可点单个词查义）';
    };
    $$('.tr-btn').forEach(b2 => b2.onclick = e => {
      e.stopPropagation();
      translateOne(b2.closest('.para'));
    });
    $('#autoTr').onclick = async () => {
      autoTr = !autoTr; Store.set('bookAutoTr', autoTr);
      $('#autoTr').textContent = autoTr ? '✅ 翻译中…' : '一键翻译本章';
      if (autoTr) {
        for (const pe of $$('#paras .para')) {
          await translateOne(pe);
        }
        $('#autoTr').textContent = '✅ 已翻译';
      } else {
        $$('.tr-cn').forEach(c => c.classList.add('hidden'));
      }
    };
    if (autoTr) $$('#paras .para').forEach(pe => translateOne(pe));
    window.scrollTo(0, 0);
  },

  wordBoxHtml(ch) {
    // 章末生词：从段落里挑词库内、难度偏高的词
    const set = new Set();
    ch.paras.forEach(p => {
      (p.match(/[A-Za-z][A-Za-z'\-]*/g) || []).forEach(w => set.add(w.toLowerCase()));
    });
    const hits = [];
    set.forEach(w => {
      const e = Dict.map[w];
      if (e && e.t && e.t[0]) hits.push({ w, cn: e.t[0].cn, p: e.p });
    });
    // 取前 24 个（更可能“不会”的，按长度/词库位置粗排）
    hits.sort((a, b) => b.w.length - a.w.length);
    const list = hits.slice(0, 24);
    if (!list.length) return '';
    return `<div class="chapter-words"><h4>📝 本章生词（点击查义 · 可朗读）</h4>
      <div>${list.map(x => `<span class="chip-word" data-chip="${esc(x.w)}">${esc(x.w)}</span>`).join('')}</div></div>`;
  }
};

function sumWords(b) {
  const n = b.chapters.reduce((s, c) => s + c.paras.reduce((a, p) => a + p.split(/\s+/).length, 0), 0);
  return n >= 1000 ? (n / 1000).toFixed(1) + 'k' : n;
}
