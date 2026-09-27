/* ===== 美文美句：双语 + 朗读 + 刷新 / AI 生成 ===== */
Views.prose = {
  extra: [],
  render(v) {
    if (!this._loaded) { this.extra = Store.get('extraProse', []); this._loaded = true; }
    const base = window.PROSE || [];
    const all = this.extra.concat(base);
    v.innerHTML = `
      <div class="section-head">
        <div><h2>✨ 美文美句</h2><div class="sub">经典名句与优美句子 · 中英对照 · 朗读 · 可不断生成新的</div></div>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <input class="search-box" id="sSearch" placeholder="搜索句子…">
          <button class="btn outline" id="sRefresh">🔀 换一批</button>
          <button class="btn" id="sGen">✨ AI 生成新句子</button>
        </div>
      </div>
      <div class="grid grid-2" id="sList"></div>`;

    const list = $('#sList');
    const draw = (kw = '') => {
      let arr = kw ? all.filter(x => (x.en + x.cn).toLowerCase().includes(kw.toLowerCase())) : shuffle(all);
      list.innerHTML = arr.map(x => `
        <div class="card sentence-card">
          <div class="q-en">${Dict.renderClickable(x.en)} <span class="speaker" data-speak="${esc(x.en)}">🔊</span></div>
          <div class="q-cn">${esc(x.cn)}</div>
        </div>`).join('') || '<div class="empty">没有匹配句子</div>';
    };
    draw();
    $('#sSearch').oninput = e => draw(e.target.value);
    $('#sRefresh').onclick = () => draw($('#sSearch').value);

    $('#sGen').onclick = async (e) => {
      const btn = e.target;
      btn.disabled = true;
      const old = btn.textContent;
      btn.innerHTML = '<span class="spin"></span> AI 生成中…';
      try {
        const sys = 'You write beautiful, inspiring lines. Output a JSON array of 8 elegant English sentences about life, time, dreams, growth, love, nature or courage, each {"en":"beautiful, grammatically perfect English","cn":"accurate, literary Chinese translation"}. Vary length and style.';
        const items = await AI.genJSON(sys, 'Write 8 fresh beautiful sentences suitable for an advanced English learner.',
          { max_tokens: 1400 });
        if (Array.isArray(items) && items.length) {
          const clean = items.filter(x => x && x.en && x.cn).map(x => ({ en: x.en, cn: x.cn }));
          this.extra = clean.concat(this.extra).slice(0, 400);
          Store.set('extraProse', this.extra);
          toast('已生成 ' + clean.length + ' 条新句子');
          this.render(v);
        } else toast('生成失败，请再试一次');
      } catch (err) {
        toast('本地 AI 未就绪（首次需下载模型或浏览器不支持），请稍后再试');
      } finally {
        btn.disabled = false;
        btn.textContent = old;
      }
    };
  }
};
