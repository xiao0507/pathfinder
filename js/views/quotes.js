/* ===== 影视台词：无视频，经典台词 + 翻译 + 朗读 + 刷新 / AI 生成 ===== */
Views.quotes = {
  extra: [],   // AI 生成并保留的新台词
  render(v) {
    if (!this._loaded) {
      this.extra = Store.get('extraQuotes', []);
      this._loaded = true;
    }
    const base = window.QUOTES || [];
    v.innerHTML = `
      <div class="section-head">
        <div><h2>🎬 经典台词</h2><div class="sub">精选自经典电影与剧集 · 附中文翻译 · 点🔊听朗读</div></div>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <select class="select" id="qFilter"><option value="">全部作品</option></select>
          <button class="btn outline" id="qRefresh">🔀 换一批</button>
          <button class="btn" id="qGen">✨ AI 生成新台词</button>
        </div>
      </div>
      <div class="grid grid-2" id="qList"></div>`;

    const all = this.extra.concat(base);
    const srcs = [...new Set(all.map(x => x.src))].sort();
    const sel = $('#qFilter', v);
    srcs.forEach(s => sel.append(h('option', { value: s }, s)));

    const draw = () => {
      const f = sel.value;
      let arr = shuffle(all.filter(x => !f || x.src === f));
      $('#qList').innerHTML = arr.map(x => `
        <div class="card sentence-card">
          <div class="q-en">“${Dict.renderClickable(x.en)}” <span class="speaker" data-speak="${esc(x.en)}">🔊</span></div>
          <div class="q-cn">${esc(x.cn)}</div>
          <div class="q-src">— ${esc(x.src)}</div>
        </div>`).join('');
      if (!arr.length) $('#qList').innerHTML = '<div class="empty">暂无台词</div>';
    };
    sel.onchange = draw;
    $('#qRefresh').onclick = draw;

    $('#qGen').onclick = async (e) => {
      const btn = e.target;
      btn.disabled = true;
      const old = btn.textContent;
      btn.innerHTML = '<span class="spin"></span> AI 生成中…';
      try {
        const sys = 'You are a film expert. Output a JSON array of 6 famous, study-worthy short movie/TV quotes (1-2 sentences each), each {"en":"exact English quote","cn":"accurate Chinese translation","src":"movie/series English title"}. Use varied, well-known works; make every English sentence grammatically perfect.';
        const items = await AI.genJSON(sys, 'Generate 6 fresh classic movie/TV lines I have not seen.',
          { max_tokens: 1200 });
        if (Array.isArray(items) && items.length) {
          const clean = items.filter(x => x && x.en && x.cn).map(x => ({
            en: x.en, cn: x.cn, src: x.src || 'Classic Film'
          }));
          this.extra = clean.concat(this.extra).slice(0, 300);
          Store.set('extraQuotes', this.extra);
          toast('已生成 ' + clean.length + ' 条新台词');
          this.render(v);
        } else {
          toast('生成失败，请再试一次');
        }
      } catch (err) {
        toast('本地 AI 未就绪（首次需下载模型或浏览器不支持），请稍后再试');
      } finally {
        btn.disabled = false;
        btn.textContent = old;
      }
    };
    draw();
  }
};
