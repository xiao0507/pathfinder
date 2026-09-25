/* ===== 写作练习：主题多 · 思路 · 表达 · 范文(译文+朗读) · 刷新 ===== */
Views.writing = {
  order: null,
  render(v) {
    const all = window.WRITING || [];
    if (!this.order || this.order.length !== all.length) this.order = shuffle(all.map((_, i) => i));
    v.innerHTML = `
      <div class="section-head">
        <div><h2>✍️ 写作练习</h2><div class="sub">${all.length} 个主题 · 思路点拨 + 高分表达 + 范文译文 · 可刷新</div></div>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <input class="search-box" id="wSearch" placeholder="搜索题目/题型…">
          <button class="btn outline" id="wShuffle">🔀 换一换</button>
        </div>
      </div>
      <div class="grid grid-2" id="wList"></div>`;

    const list = $('#wList');
    const draw = (kw = '') => {
      list.innerHTML = '';
      this.order.map(i => all[i])
        .filter(x => !kw || (x.title + x.cn + x.type).toLowerCase().includes(kw.toLowerCase()))
        .forEach((x, n) => {
          const c = h('div', { class: 'card art-item' },
            h('span', { class: 'pill amber' }, x.type),
            h('h3', { style: 'margin:10px 0 4px;font-size:16px;line-height:1.5' }, x.title.slice(0, 130)),
            h('div', { class: 'muted', style: 'font-size:13px' }, x.cn.slice(0, 90)),
            h('div', { class: 'muted mt', style: 'font-size:12.5px' }, `范文约 ${x.essay.split(/\s+/).length} 词 · ${x.phrases.length} 条高分表达`));
          c.onclick = () => this.detail(x);
          list.append(c);
        });
      if (!list.children.length) list.innerHTML = '<div class="empty">没有匹配题目</div>';
    };
    draw();
    $('#wSearch', v).oninput = e => draw(e.target.value);
    $('#wShuffle', v).onclick = () => { this.order = shuffle(all.map((_, i) => i)); draw($('#wSearch', v).value); };
  },

  detail(x) {
    const v = $('#view');
    let showEssay = false, showCn = false;
    const esc_paras = t => esc(t).split('\n').filter(s => s.trim()).map(s => `<p>${s}</p>`).join('');
    v.innerHTML = `
      <button class="btn outline sm mb" id="back">← 返回题目</button>
      <div class="card">
        <span class="pill amber">${esc(x.type)}</span>
        <h2 style="margin:12px 0 4px;font-size:19px;line-height:1.5">${esc(x.title)}</h2>
        <div class="muted mb">${esc(x.cn)}</div>

        <h3 style="font-size:16px;margin:18px 0 8px">🧠 写作思路</h3>
        <ol style="padding-left:22px">${x.tips.map(t => `<li class="cn">${esc(t)}</li>`).join('')}</ol>

        <h3 style="font-size:16px;margin:18px 0 8px">💎 本题高分表达</h3>
        <div>${x.phrases.map(p => `<span class="chip-word">${esc(p.en)} · <small>${esc(p.cn)}</small></span>`).join('')}</div>

        <h3 style="font-size:16px;margin:18px 0 8px">🔧 可套用句型</h3>
        ${x.sents.map(s => `<div class="tline"><span class="en" style="font-size:14.5px">${Dict.renderClickable(s)}</span><span class="speaker" data-speak="${esc(s)}">🔊</span></div>`).join('')}

        <div class="divider"></div>
        <div style="display:flex;gap:10px;flex-wrap:wrap">
          <button class="btn" id="showEssay">📄 查看范文</button>
          <button class="btn outline" id="readEssay">🔊 朗读范文</button>
        </div>
        <div id="essayBox" class="hidden mt">
          <div class="seg-context">${esc_paras(x.essay)}</div>
          <button class="btn ghost sm mt" id="toggleCn">显示范文翻译</button>
          <div id="essayCn" class="cn mt hidden" style="background:#f7faf9;padding:14px 16px;border-radius:10px">${esc_paras(x.essayCn)}</div>
        </div>
      </div>`;
    $('#back').onclick = () => App.go('writing');
    $('#showEssay').onclick = () => { showEssay = !showEssay; $('#essayBox').classList.toggle('hidden'); };
    $('#readEssay').onclick = () => Speech.speak(x.essay);
    $('#toggleCn').onclick = () => { showCn = !showCn; $('#essayCn').classList.toggle('hidden'); $('#toggleCn').textContent = showCn ? '隐藏范文翻译' : '显示范文翻译'; };
    window.scrollTo(0, 0);
  }
};
