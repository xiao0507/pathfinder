/* ===== 影视台词：无视频，经典台词 + 翻译 + 朗读 + 刷新 ===== */
Views.quotes = {
  render(v) {
    const all = window.QUOTES || [];
    v.innerHTML = `
      <div class="section-head">
        <div><h2>🎬 经典台词</h2><div class="sub">精选自经典电影与剧集 · 附中文翻译 · 点🔊听原声朗读</div></div>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <select class="select" id="qFilter"><option value="">全部作品</option></select>
          <button class="btn" id="qRefresh">🔀 刷新一批</button>
        </div>
      </div>
      <div class="grid grid-2" id="qList"></div>`;

    const srcs = [...new Set(all.map(x => x.src))].sort();
    const sel = $('#qFilter', v);
    srcs.forEach(s => sel.append(h('option', { value: s }, s)));

    const draw = () => {
      const f = sel.value;
      let arr = shuffle(all.filter(x => !f || x.src === f));
      $('#qList').innerHTML = arr.map(x => `
        <div class="card sentence-card">
          <div class="q-en">“${esc(x.en)}” <span class="speaker" data-speak="${esc(x.en)}">🔊</span></div>
          <div class="q-cn">${esc(x.cn)}</div>
          <div class="q-src">— ${esc(x.src)}</div>
        </div>`).join('');
      if (!arr.length) $('#qList').innerHTML = '<div class="empty">暂无台词</div>';
    };
    sel.onchange = draw;
    $('#qRefresh', v).onclick = draw;
    draw();
  }
};
