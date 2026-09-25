/* ===== 短篇阅读：文章列表 + 双语精读 ===== */
Views.reading = {
  order: null,
  render(v) {
    const arts = window.ARTICLES || [];
    if (!this.order || this.order.length !== arts.length) this.order = shuffle(arts.map((_, i) => i));
    v.innerHTML = `
      <div class="section-head">
        <div><h2>📖 短篇阅读</h2><div class="sub">双语对照 · 任意词点击查义听发音 · 可刷新排序</div></div>
        <div style="display:flex;gap:8px">
          <input class="search-box" id="rSearch" placeholder="搜索标题/分类…">
          <button class="btn outline" id="rShuffle">🔀 换一换</button>
          <button class="btn" id="rPhrases">🔖 高频名词短语</button>
        </div>
      </div>
      <div class="grid grid-2" id="rList"></div>`;

    const list = $('#rList', v);
    const draw = (kw = '') => {
      list.innerHTML = '';
      const shown = this.order.map(i => arts[i]).filter(a =>
        !kw || (a.title + a.cn + a.cat).toLowerCase().includes(kw.toLowerCase()));
      shown.forEach(a => {
        const c = h('div', { class: 'card art-item' },
          h('div', {}, h('span', { class: 'pill gray' }, a.cat)),
          h('h3', { style: 'margin:10px 0 4px;font-size:17px' }, a.title),
          h('div', { class: 'muted' }, a.cn),
          h('p', { class: 'muted mt', style: 'font-size:13.5px' }, a.paras[0].en.slice(0, 110) + '…'),
          h('div', { class: 'muted mt', style: 'font-size:12.5px' }, `${a.paras.length} 段 · ${a.words.length} 个重点词`));
        c.onclick = () => this.detail(a);
        list.append(c);
      });
      if (!shown.length) list.innerHTML = '<div class="empty">没有匹配的文章</div>';
    };
    draw();
    $('#rSearch', v).oninput = e => draw(e.target.value);
    $('#rShuffle', v).onclick = () => { this.order = shuffle(arts.map((_, i) => i)); draw($('#rSearch', v).value); };
    $('#rPhrases', v).onclick = () => this.phrases();
  },

  detail(a) {
    const v = $('#view');
    let showCn = Store.get('showCn', true);
    v.innerHTML = `
      <button class="btn outline sm mb" id="back">← 返回列表</button>
      <div class="card article-body ${showCn ? '' : 'collapsed'}">
        <span class="pill gray">${esc(a.cat)}</span>
        <h2 style="margin:12px 0 2px">${esc(a.title)}</h2>
        <div class="muted mb">${esc(a.cn)}</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <button class="btn outline sm" id="readAll">🔊 朗读全文</button>
          <button class="btn ghost sm" id="toggleCn">${showCn ? '🙈 隐藏中文' : '👀 显示中文'}</button>
        </div>
        <div class="divider"></div>
        ${a.paras.map((p, i) => `
          <div class="para">
            <div class="en">${Dict.renderClickable(p.en)} <span class="speaker" data-speak="${esc(p.en)}">🔊</span></div>
            <div class="cn">${esc(p.cn)}</div>
          </div>`).join('')}
        <div class="chapter-words">
          <h4>🔑 本文重点词</h4>
          <div>${a.words.map(w => `<span class="chip-word" data-chip="${esc(w)}">${esc(w)}</span>`).join('')}</div>
        </div>
      </div>`;
    $('#back').onclick = () => App.go('reading');
    $('#readAll').onclick = () => Speech.speak(a.paras.map(p => p.en).join(' '));
    $('#toggleCn').onclick = () => {
      showCn = !showCn; Store.set('showCn', showCn);
      $('.article-body').classList.toggle('collapsed', !showCn);
      $('#toggleCn').textContent = showCn ? '🙈 隐藏中文' : '👀 显示中文';
    };
    $$('[data-chip]').forEach(c => c.onclick = () => {
      const r = c.getBoundingClientRect();
      Dict.show(c.dataset.chip, r.left, r.bottom);
    });
    window.scrollTo(0, 0);
  },

  phrases() {
    const v = $('#view');
    let p = (window.PHRASES || []).slice();
    v.innerHTML = `
      <button class="btn outline sm mb" id="back">← 返回</button>
      <div class="section-head">
        <div><h2>🔖 高频名词 · 短语速记</h2><div class="sub">共 ${p.length} 条 · 点击刷新随机排序 · 全部可朗读</div></div>
        <div style="display:flex;gap:8px">
          <input class="search-box" id="phSearch" placeholder="搜索…">
          <button class="btn" id="phShuffle">🔀 刷新</button>
        </div>
      </div>
      <div class="grid grid-2" id="phList"></div>`;
    const list = $('#phList');
    const draw = (kw = '') => {
      let arr = kw ? p.filter(x => (x.en + x.cn).toLowerCase().includes(kw.toLowerCase())) : shuffle(p);
      list.innerHTML = arr.map(x => `
        <div class="card sentence-card">
          <div class="q-en">${esc(x.en)} <span class="speaker" data-speak="${esc(x.en)}">🔊</span></div>
          <div class="q-cn">${esc(x.cn)}</div>
        </div>`).join('') || '<div class="empty">没有匹配项</div>';
    };
    draw();
    $('#back').onclick = () => App.go('reading');
    $('#phSearch').oninput = e => draw(e.target.value);
    $('#phShuffle').onclick = () => draw($('#phSearch').value);
  }
};
