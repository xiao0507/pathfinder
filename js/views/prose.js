/* ===== 美文美句：双语 + 朗读 + 刷新 ===== */
Views.prose = {
  render(v) {
    const all = window.PROSE || [];
    v.innerHTML = `
      <div class="section-head">
        <div><h2>✨ 美文美句</h2><div class="sub">经典名句与优美句子 · 中英对照 · 朗读 · 不断刷新</div></div>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <input class="search-box" id="sSearch" placeholder="搜索句子…">
          <button class="btn" id="sRefresh">🔀 刷新一批</button>
        </div>
      </div>
      <div class="grid grid-2" id="sList"></div>`;

    const list = $('#sList');
    const draw = (kw = '') => {
      let arr = kw ? all.filter(x => (x.en + x.cn).toLowerCase().includes(kw.toLowerCase())) : shuffle(all);
      list.innerHTML = arr.map(x => `
        <div class="card sentence-card">
          <div class="q-en">${esc(x.en)} <span class="speaker" data-speak="${esc(x.en)}">🔊</span></div>
          <div class="q-cn">${esc(x.cn)}</div>
        </div>`).join('') || '<div class="empty">没有匹配句子</div>';
    };
    draw();
    $('#sSearch', v).oninput = e => draw(e.target.value);
    $('#sRefresh', v).onclick = () => draw($('#sSearch', v).value);
  }
};
