/* ===== 口语对话：场景模板 + 自由畅聊 + 点停止录音 + 中译英 ===== */
Views.dialogue = {
  render(v) {
    v.innerHTML = `
      <div class="section-head">
        <div><h2>🎙️ 口语对话</h2><div class="sub">美式发音 · 选场景跟读 / 与 AI 真实对话 · 支持中文说出口自动转英文</div></div>
        <button class="btn outline" id="clearChat">🗑️ 清空对话缓存</button>
      </div>
      <div class="grid grid-3 scene-grid" id="sceneGrid"></div>
      <div class="card mt">
        <h3 style="font-size:16px">💬 自由对话（随时可聊）</h3>
        <p class="muted" style="font-size:13px;margin:6px 0 14px" id="freeHint">
          AI 在你的设备上本地运行，永久免费、无需 Key，可与你英文对话、纠正表达；点麦克风说话即可。</p>
        <button class="btn" id="openFree">开始自由对话 →</button>
      </div>`;

    const grid = $('#sceneGrid');
    (window.SCENES || []).forEach(s => {
      const c = h('div', { class: 'card' },
        h('div', { style: 'font-size:23px' }, '🗣️'),
        h('b', { style: 'display:block;margin:8px 0 2px;font-size:15px' }, s.title),
        h('div', { class: 'muted', style: 'font-size:13px' }, s.cn),
        h('div', { class: 'muted mt', style: 'font-size:12.5px' }, `${s.lines.length} 组对话 · ${s.useful.length} 个实用句`));
      c.onclick = () => this.scene(s);
      grid.append(c);
    });
    $('#clearChat').onclick = () => { Store.del('chatHistory'); toast('对话缓存已清空'); };
    $('#openFree').onclick = () => this.freeChat();

    if (!LocalAI.supported()) {
      $('#freeHint').innerHTML = '⚠️ 当前浏览器不支持本地 AI（需要 <b>Chrome / Edge 桌面版</b>且开启硬件加速）。场景跟读、点词翻译与朗读仍可正常使用。';
      $('#freeHint').style.color = '#b9770e';
    }
  },

  scene(s) {
    const v = $('#view');
    v.innerHTML = `
      <button class="btn outline sm mb" id="back">← 返回场景</button>
      <div class="card">
        <h2 style="font-size:20px">${esc(s.title)}</h2>
        <div class="muted mb">${esc(s.cn)} · ${esc(s.desc)}</div>
        <div class="template-lines" id="tLines">
          ${s.lines.map(l => `
            <div class="tline">
              <span class="sp">${esc(l.sp)}</span>
              <div style="flex:1">
                <div class="en" style="font-size:15px">${Dict.renderClickable(l.en)}</div>
                <div class="cn" style="font-size:13px">${esc(l.cn)}</div>
              </div>
              <button class="speaker" data-speak="${esc(l.en)}" style="font-size:17px">🔊</button>
            </div>`).join('')}
        </div>
        <div class="chapter-words">
          <h4>🔑 场景实用句（点击单词可查义，点 🔊 朗读）</h4>
          ${s.useful.map(u => `<div style="display:flex;justify-content:space-between;gap:8px;padding:5px 0">
            <span class="en" style="font-size:14.5px">${Dict.renderClickable(u.en)}</span>
            <span><span class="muted" style="font-size:12.5px">${esc(u.cn)}</span> <span class="speaker" data-speak="${esc(u.en)}">🔊</span></span>
          </div>`).join('')}
        </div>
        <button class="btn mt block" id="practice">🎤 在此场景中与 AI 实战对话</button>
      </div>`;
    $('#back').onclick = () => App.go('dialogue');
    $('#practice').onclick = () => this.freeChat(s);
    window.scrollTo(0, 0);
  },

  freeChat(scene) {
    const v = $('#view');
    const canRec = Recog.supported;
    v.innerHTML = `
      <button class="btn outline sm mb" id="back">← 返回</button>
      <div class="card chat-wrap">
        <div id="aiStatus" class="ai-status" style="display:none">
          <div class="ai-status-text" id="aiStatusText">准备本地AI…</div>
          <div class="ai-bar"><div class="ai-bar-fill" id="aiBarFill" style="width:0%"></div></div>
        </div>
        <div id="chatMsgs" class="chat-msgs"></div>
        <div class="chat-input">
          <button class="rec-btn" id="recBtn" title="点击开始/停止录音">${canRec ? '🎤' : '🚫'}</button>
          <input id="chatText" placeholder="输入英文，或点麦克风说话（中文会自动转英文）…">
          <button class="btn" id="sendBtn">发送</button>
        </div>
        <p class="muted center" style="font-size:12px;margin-top:8px">
          点 🎤 开始录音，<b>再点一次才会停止</b>，停止后自动发送；可切换中英文识别。
          <button class="btn outline sm" id="langToggle">识别语言：英文</button>
          ${canRec ? '' : '<br><span style="color:#c0392b">当前浏览器不支持录音，请换 Chrome / Edge / Safari，或直接打字。</span>'}
        </p>
      </div>`;

    const msgs = $('#chatMsgs');
    let history = Store.get('chatHistory', []);
    // 切换场景时重置对话上下文
    if (scene) {
      history = [
        { role: 'system', content: `You are a warm, encouraging American English tutor. Role-play this situation: ${scene.title}. ${scene.desc}. Keep replies short (1-3 sentences) in natural spoken American English. If the learner makes a small mistake, first answer naturally, then gently show the better way in one short line.` },
        { role: 'assistant', content: `Hey! Let's practice "${scene.title}". I'll start: ${scene.lines[0].en}` }
      ];
    }

    const addBubble = (role, text, cn) => {
      const b = h('div', { class: 'bubble ' + role });
      b.append(h('span', {}, text + ' '), h('span', { class: 'speaker' }, '🔊'));
      b.querySelector('.speaker').onclick = (e) => { e.stopPropagation(); Speech.speak(text); };
      if (cn) b.append(h('div', { class: 'b-cn' }, cn));
      msgs.append(b);
      msgs.scrollTop = msgs.scrollHeight;
    };
    const renderHistory = () => {
      msgs.innerHTML = '';
      history.filter(x => x.role !== 'system').forEach(x =>
        addBubble(x.role === 'user' ? 'me' : 'ai', x.content, x.cn));
    };
    renderHistory();

    // —— 本地模型加载/下载进度 ——
    const aiStatus = $('#aiStatus');
    const showAIStatus = (on) => { aiStatus.style.display = on ? 'block' : 'none'; };
    LocalAI.onProgress((p) => {
      if (LocalAI.isReady()) { showAIStatus(false); return; }
      showAIStatus(true);
      $('#aiStatusText').textContent = p.text || '准备本地AI…';
      $('#aiBarFill').style.width = (p.pct || 0) + '%';
    });
    if (!LocalAI.isReady() && LocalAI.loading) showAIStatus(true);

    const save = () => {
      history = history.slice(-30);
      Store.set('chatHistory', history);
    };

    const send = async (raw) => {
      let text = (raw || '').trim();
      if (!text) return;

      // 含中文 → 中译英
      if (/[\u4e00-\u9fa5]/.test(text)) {
        addBubble('me', text, '（中文）');
        let en = '';
        const wait = h('div', { class: 'bubble sys' }, '正在翻译成英文…');
        msgs.append(wait);
        try {
          en = await AI.ask(text, '把用户的中文翻译成自然地道的美式英语口语，只输出英文，不加解释。',
            { temperature: 0.3, max_tokens: 300 });
        } catch (e) {}
        wait.remove();
        if (!en) { addBubble('sys', '本地 AI 暂不可用（首次需下载模型，或浏览器不支持）。可直接输入英文，点词翻译与朗读照常。'); return; }
        addBubble('me', en, text);
        history.push({ role: 'user', content: en, cn: text });
      } else {
        addBubble('me', text);
        history.push({ role: 'user', content: text });
      }
      save();

      const placeholder = h('div', { class: 'bubble ai' }, 'AI 正在思考…');
      msgs.append(placeholder);
      try {
        const reply = await AI.chat(
          history.map(x => ({ role: x.role, content: x.content })),
          { max_tokens: 320, temperature: 0.8 });
        placeholder.remove();
        addBubble('ai', reply);
        history.push({ role: 'assistant', content: reply });
        save();
        Speech.speak(reply);
      } catch (e) {
        placeholder.remove();
        const msg = String(e && e.message) === 'no-webgpu'
          ? '当前浏览器不支持本地 AI 对话，请在电脑上使用最新版 Chrome / Edge；场景跟读与朗读仍可用。'
          : '本地 AI 正在下载或忙，请稍后再发一次（句子已保存，点🔊可听发音）。';
        addBubble('sys', msg);
      }
    };

    $('#sendBtn').onclick = () => { send($('#chatText').value); $('#chatText').value = ''; };
    $('#chatText').onkeydown = e => {
      if (e.key === 'Enter') { send(e.target.value); e.target.value = ''; }
    };
    $('#back').onclick = () => { Recog.stopRec(); App.go('dialogue'); };

    // —— 录音 ——
    const recBtn = $('#recBtn');
    let recogLang = Store.get('recogLang', 'en-US');
    const syncLang = () => {
      $('#langToggle').textContent = '识别语言：' + (recogLang === 'en-US' ? '英文' : '中文');
    };
    syncLang();
    $('#langToggle').onclick = () => {
      if (Recog.listening) Recog.stopRec();
      recogLang = recogLang === 'en-US' ? 'zh-CN' : 'en-US';
      Store.set('recogLang', recogLang);
      syncLang();
    };

    Recog.onState = (on) => {
      recBtn.classList.toggle('recording', on);
      recBtn.textContent = on ? '⏹️' : '🎤';
    };
    Recog.onResult = (fin, interim) => { $('#chatText').value = (fin + interim).trim(); };
    Recog.onEnd = (text) => {
      recBtn.classList.remove('recording');
      recBtn.textContent = '🎤';
      if (text) { send(text); $('#chatText').value = ''; }
    };

    recBtn.onclick = () => {
      if (!canRec) { toast('请换 Chrome / Edge / Safari 录音，或直接打字'); return; }
      if (Recog.listening) { Recog.stopRec(); return; }
      $('#chatText').value = '';
      Recog.start(recogLang);
    };
  }
};
