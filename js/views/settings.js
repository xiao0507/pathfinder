/* ===== 设置：大模型 Key、语音、缓存清理、学习数据 ===== */
Views.settings = {
  render(v) {
    const size = this.cacheSize();
    v.innerHTML = `
      <div class="section-head"><div><h2>⚙️ 设置</h2><div class="sub">所有数据仅保存在本设备，不上传任何服务器</div></div></div>

      <div class="card mb">
        <h3 style="font-size:16px;margin-bottom:6px">🔮 大模型接入（可选，但强烈推荐）</h3>
        <p class="muted" style="font-size:13px;margin-bottom:14px">
          填入 OpenAI 兼容接口的 Key 后，可解锁：<b>无限刷新新词/文章/写作题/台词美文、自由对话与 AI 回复、中文转英文、整段整章翻译</b>。
          不填也能使用全部内置内容。Key 只存在你本机浏览器里。</p>
        <div class="set-row"><label>接口地址</label><input type="text" id="base" value="${esc(Store.get('apiBase', 'https://api.openai.com/v1'))}"></div>
        <div class="set-row"><label>API Key</label><input type="password" id="key" placeholder="sk-..." value="${esc(Store.get('apiKey', ''))}"></div>
        <div class="set-row"><label>模型名称</label><input type="text" id="model" value="${esc(Store.get('model', 'gpt-4o-mini'))}"></div>
        <button class="btn mt" id="saveLLM">保存并测试</button>
        <span id="testRes" class="ml"></span>
      </div>

      <div class="card mb">
        <h3 style="font-size:16px;margin-bottom:10px">🔊 语音</h3>
        <div class="set-row">
          <label>朗读语速<div class="desc">美式英语发音</div></label>
          <div style="display:flex;align-items:center;gap:10px">
            <input type="range" id="rate" min="0.6" max="1.3" step="0.05" value="${Store.get('rate', '0.95')}" style="width:160px">
            <span id="rateV">${Store.get('rate', '0.95')}</span>
          </div>
        </div>
        <div class="set-row"><label>阅读时默认显示中文翻译</label>
          <label class="switch"><input type="checkbox" id="showCn" ${Store.get('showCn', true) ? 'checked' : ''}><span class="slider-sw"></span></label>
        </div>
      </div>

      <div class="card mb">
        <h3 style="font-size:16px;margin-bottom:10px">🗄️ 缓存与数据（约 ${size}）</h3>
        <div class="set-row"><label>对话记录与翻译缓存<div class="desc">清空后不影响内置词库与书籍</div></label>
          <button class="btn outline sm" id="clearCache">清理缓存</button></div>
        <div class="set-row"><label>重置全部学习进度<div class="desc">包括背词记录、遗忘曲线、连续天数</div></label>
          <button class="btn amber sm" id="resetAll">重置进度</button></div>
      </div>

      <div class="card">
        <h3 style="font-size:16px;margin-bottom:10px">📊 学习概览</h3>
        <div class="grid grid-3">
          <div class="center"><b style="font-size:24px;color:var(--green)">${SRS.learnedCount()}</b><div class="muted">已学单词</div></div>
          <div class="center"><b style="font-size:24px;color:var(--green)">${SRS.masteredCount()}</b><div class="muted">扎实掌握</div></div>
          <div class="center"><b style="font-size:24px;color:var(--green)">${Streak.days()}</b><div class="muted">连续天数</div></div>
        </div>
      </div>

      <p class="muted center mt">Pathfinder · 一个可以装进口袋、也能装进口袋的英语探索工具</p>`;

    $('#saveLLM').onclick = async () => {
      Store.set('apiBase', $('#base').value.trim());
      Store.set('apiKey', $('#key').value.trim());
      Store.set('model', $('#model').value.trim());
      if (!$('#key').value.trim()) { $('#testRes').textContent = '已保存（当前为纯离线模式）'; return; }
      $('#testRes').textContent = '测试中…';
      try {
        await LLM.chat([{ role: 'user', content: 'Reply with one word: ok' }], { max_tokens: 5 });
        $('#testRes').innerHTML = '<span style="color:var(--green)">✅ 连接成功，已解锁全部在线能力</span>';
      } catch (e) {
        $('#testRes').innerHTML = '<span style="color:#d05a3a">❌ ' + esc(e.message.slice(0, 80)) + '</span>';
      }
    };
    $('#rate').oninput = e => { $('#rateV').textContent = e.target.value; Store.set('rate', e.target.value); };
    $('#rate').onchange = () => Speech.speak('Hello, this is a test.');
    $('#showCn').onchange = e => Store.set('showCn', e.target.checked);
    $('#clearCache').onclick = () => {
      Store.del('chatHistory'); Trans.clear();
      toast('缓存已清理'); this.render(v);
    };
    $('#resetAll').onclick = () => {
      if (confirm('确定重置全部学习进度吗？此操作不可恢复。')) {
        SRS.reset(); Store.del('streak'); Store.del('chatHistory'); Trans.clear();
        toast('已重置'); this.render(v);
      }
    };
  },
  cacheSize() {
    const n = Store.usage();
    return n > 1048576 ? (n / 1048576).toFixed(1) + ' MB' : Math.round(n / 1024) + ' KB';
  }
};
