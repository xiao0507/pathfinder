/* ===== 设置：语音、缓存清理、学习数据（AI 已内置免费，无需配置）===== */
Views.settings = {
  render(v) {
    const size = this.cacheSize();
    v.innerHTML = `
      <div class="section-head"><div><h2>⚙️ 设置</h2><div class="sub">所有数据仅保存在本设备，不上传任何服务器</div></div></div>

      <div class="card mb">
        <h3 style="font-size:16px;margin-bottom:8px">🔮 本地 AI（永久免费 · 无需 Key · 可离线）</h3>
        <div class="set-row">
          <label>启用本地 AI 对话与生成
            <div class="desc" id="aiEnv">正在检测设备能力…</div></label>
          <label class="switch"><input type="checkbox" id="aiOn" ${LocalAI.enabled ? 'checked' : ''}><span class="slider-sw"></span></label>
        </div>
        <div id="aiProgress" style="margin-top:8px"></div>
        <button class="btn sm mt" id="activateAI">立即激活本地 AI</button>
        <p class="muted" style="font-size:12.5px;margin:10px 0 0">
          AI 模型直接在你的设备（显卡）上运行，首次需从国内镜像下载约 1–1.6GB，下载后浏览器缓存、可离线使用，对话内容不经过任何服务器。需要 Chrome / Edge 桌面版并开启硬件加速；不支持时，点词翻译、朗读与全部内置内容仍可正常使用。</p>
      </div>

      <div class="card mb">
        <h3 style="font-size:16px;margin-bottom:10px">🎤 麦克风 / 录音自检</h3>
        <div class="set-row"><label>录音功能需要：用 Chrome / Edge / Safari，并允许麦克风权限；部署到 https 网址后最稳定（本地双击打开时部分浏览器会限制）</label>
          <button class="btn sm" id="micTest">测试麦克风</button></div>
        <div id="micResult" class="muted" style="font-size:13px"></div>
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
        <div class="set-row"><label>对话记录与在线翻译缓存<div class="desc">清空后不影响内置词库与书籍</div></label>
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

      <p class="muted center mt">Pathfinder · 一个可以装进口袋的英语探索工具</p>`;

    const micRes = $('#micResult');
    $('#micTest').onclick = async () => {
      if (!window.navigator.mediaDevices || !window.navigator.mediaDevices.getUserMedia) {
        micRes.innerHTML = '⚠️ 当前环境不支持录音接口。请用 Chrome / Edge / Safari，并通过 https 网址打开。';
        return;
      }
      micRes.innerHTML = '<span class="spin"></span> 正在请求麦克风权限…';
      try {
        const stream = await window.navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(t => t.stop());
        const canSR = !!(window.SpeechRecognition || window.webkitSpeechRecognition);
        micRes.innerHTML = '✅ 麦克风可用！' +
          (canSR ? '语音识别也已就绪，可以去口语对话里录音了。'
                 : '麦克风正常，但此浏览器没有语音识别引擎，请换 Chrome / Edge。');
      } catch (e) {
        micRes.innerHTML = '⚠️ ' + (e.name === 'NotAllowedError'
          ? '麦克风权限被拒绝，请点地址栏左侧的锁形图标，允许麦克风后刷新页面。'
          : '无法访问麦克风：' + e.message);
      }
    };

    // —— 本地 AI 状态 ——
    const aiEnv = $('#aiEnv'), aiProg = $('#aiProgress');
    if (LocalAI.supported()) {
      aiEnv.textContent = LocalAI.isReady() ? '✅ 本地 AI 已就绪，可离线使用' : '✅ 设备支持本地 AI（尚未下载模型）';
      aiEnv.style.color = '#27ae60';
    } else {
      aiEnv.textContent = '⚠️ 此浏览器不支持本地 AI（建议电脑端最新 Chrome / Edge）；不影响其他功能';
      aiEnv.style.color = '#b9770e';
    }
    const renderAIProg = (p) => {
      aiProg.innerHTML = `<div class="ai-status-text">${esc(p.text || '准备中…')} ${p.pct || 0}%</div>
        <div class="ai-bar"><div class="ai-bar-fill" style="width:${p.pct || 0}%"></div></div>`;
    };
    LocalAI.onProgress(renderAIProg);
    $('#aiOn').onchange = (e) => {
      LocalAI.setEnabled(e.target.checked);
      toast(e.target.checked ? '本地 AI 已启用' : '本地 AI 已关闭');
    };
    $('#activateAI').onclick = async () => {
      if (!LocalAI.supported()) { toast('此浏览器不支持，请在电脑端 Chrome / Edge 使用'); return; }
      try {
        await LocalAI.ensure();
        aiEnv.textContent = '✅ 本地 AI 已就绪，可离线使用'; aiEnv.style.color = '#27ae60';
        aiProg.innerHTML = ''; toast('本地 AI 激活成功');
      } catch (e) {
        aiProg.innerHTML = '<span style="color:#c0392b;font-size:13px">加载失败：' +
          esc(String(e.message || e)) + '（可尝试更新显卡驱动或用电脑端 Chrome）</span>';
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
