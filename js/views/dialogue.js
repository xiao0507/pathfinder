/* ===== 口语对话：场景模板 + 自由畅聊 + 点停止录音 + 中译英 ===== */
Views.dialogue = {
  render(v) {
    v.innerHTML = `
      <div class="section-head">
        <div><h2>🎙️ 口语对话</h2><div class="sub">美式发音 · 选场景跟读 / 自由对话 · 支持中文说出口自动转英文</div></div>
        <button class="btn outline" id="clearChat">🗑️ 清空对话缓存</button>
      </div>
      <div class="grid grid-3 scene-grid" id="sceneGrid"></div>
      <div class="card mt">
        <h3 style="font-size:16px">💬 自由对话（随时可聊）</h3>
        <p class="muted" style="font-size:13px;margin:6px 0 14px">
          ${LLM.ready() ? '已接入大模型，可无限畅聊。' : '未接入大模型：可录音练习发音、跟读模板；接入 Key 后可与 AI 真实对话（见设置）。'}</p>
        <button class="btn" id="openFree">开始自由对话 →</button>
      </div>`;

    const grid = $('#sceneGrid');
    (window.SCENES || []).forEach((s, i) => {
      const c = h('div', { class: 'card' },
        h('div', { style: 'font-size:23px' }, '🗣️'),
        h('b', { style: 'display:block;margin:8px 0 2px;font-size:15px' }, s.title),
        h('div', { class: 'muted', style: 'font-size:13px' }, s.cn),
        h('div', { class: 'muted mt', style: 'font-size:12.5px' }, `${s.lines.length} 组对话 · ${s.useful.length} 个实用句`));
      c.onclick = () => this.scene(s);
      grid.append(c);
    });
    $('#clearChat').onclick = () => {
      Store.del('chatHistory');
      toast('对话缓存已清空');
    };
    $('#openFree').onclick = () => this.freeChat();
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
          <h4>🔑 场景实用句（点击句子可朗读）</h4>
          ${s.useful.map(u => `<div style="display:flex;justify-content:space-between;gap:8px;padding:5px 0">
            <span class="en" style="font-size:14.5px">${esc(u.en)}</span>
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
    v.innerHTML = `
      <button class="btn outline sm mb" id="back">← 返回</button>
      <div class="card chat-wrap">
        <div id="chatMsgs" class="chat-msgs"></div>
        <div class="chat-input">
          <button class="rec-btn" id="recBtn" title="按住说话，再点一次停止">🎤</button>
          <input id="chatText" placeholder="输入英文，或点麦克风说话（中文也会自动翻译）…">
          <button class="btn" id="sendBtn">发送</button>
        </div>
        <p class="muted center" style="font-size:12px;margin-top:8px">点 🎤 开始录音，再点一次才会停止；默认英文识别，可切换中文。
          <button class="btn outline sm" id="langToggle">识别语言：英文</button></p>
      </div>`;
    const msgs = $('#chatMsgs');
    let history = Store.get('chatHistory', []);
    if (scene && !history.length) {
      history.push({ role: 'system', content: `You are a friendly American English tutor. Role-play this situation: ${scene.title}. ${scene.desc}. Keep replies short (1-3 sentences), natural spoken American English, and gently help the learner.` });
      history.push({ role: 'assistant', content: `Hey! Let's practice "${scene.title}". I'll start: ${scene.lines[0].en}` });
    }

    const addBubble = (role, text, cn) => {
      const b = h('div', { class: 'bubble ' + role });
      b.append(h('span', {}, text + ' '), h('span', { class: 'speaker' }, '🔊'));
      b.querySelector('.speaker').onclick = () => Speech.speak(text);
      if (cn) b.append(h('div', { class: 'b-cn' }, cn));
      msgs.append(b);
      msgs.scrollTop = msgs.scrollHeight;
    };
    const renderHistory = () => {
      msgs.innerHTML = '';
      history.filter(x => x.role !== 'system').forEach(x => addBubble(x.role === 'user' ? 'me' : 'ai', x.content, x.cn));
    };
    renderHistory();

    const save = () => {
      // 仅保留最近 30 条，控制缓存
      history = history.slice(-30);
      Store.set('chatHistory', history);
    };

    const send = async (raw) => {
      let text = (raw || '').trim();
      if (!text) return;
      let asEn = text, cn = '';
      // 含中文 -> 视为"中译英"
      if (/[\u4e00-\u9fa5]/.test(text)) {
        addBubble('me', text, '（中文输入）');
        const en = await LLM.ready()
          ? await LLM.chat([{ role: 'system', content: '把用户的中文翻译成自然地道的美式英语口语，只输出英文。' }, { role: 'user', content: text }])
          : '';
        if (!en) { toast('中译英需要在设置接入大模型'); return; }
        asEn = en; cn = text;
        addBubble('me', asEn, cn);
        history.push({ role: 'user', content: asEn, cn });
      } else {
        addBubble('me', text);
        history.push({ role: 'user', content: text });
      }
      save();
      if (!LLM.ready()) {
        addBubble('sys', '（练习模式：已记录你的句子，点🔊可听发音。接入大模型后 AI 会回复你。）');
        return;
      }
      const placeholder = h('div', { class: 'bubble ai' }, 'AI 正在思考…');
      msgs.append(placeholder);
      try {
        const reply = await LLM.chat(history.map(x => ({ role: x.role, content: x.content })), { max_tokens: 300 });
        placeholder.remove();
        addBubble('ai', reply);
        history.push({ role: 'assistant', content: reply });
        save();
        Speech.speak(reply);
      } catch (e) {
        placeholder.remove();
        addBubble('sys', '出错了：' + e.message);
      }
    };

    $('#sendBtn').onclick = () => { send($('#chatText').value); $('#chatText').value = ''; };
    $('#chatText').onkeydown = e => { if (e.key === 'Enter') { send(e.target.value); e.target.value = ''; } };
    $('#back').onclick = () => { Recog.stopRec(); App.go('dialogue'); };

    // 录音：点一次开始，再点一次停止
    const recBtn = $('#recBtn');
    let recogLang = 'en-US';
    $('#langToggle').onclick = () => {
      recogLang = recogLang === 'en-US' ? 'zh-CN' : 'en-US';
      Store.set('recogLang', recogLang);
      $('#langToggle').textContent = '识别语言：' + (recogLang === 'en-US' ? '英文' : '中文');
    };
    recogLang = Store.get('recogLang', 'en-US');
    $('#langToggle').textContent = '识别语言：' + (recogLang === 'en-US' ? '英文' : '中文');

    recBtn.onclick = () => {
      if (Recog.listening) { Recog.stopRec(); return; }
      const ok = Recog.start(recogLang);
      if (ok) {
        recBtn.classList.add('recording');
        $('#chatText').value = '';
        Recog.onResult = (fin, interim) => { $('#chatText').value = (fin + interim).trim(); };
        Recog.onEnd = (text) => {
          recBtn.classList.remove('recording');
          if (text) { send(text); $('#chatText').value = ''; }
        };
      }
    };
  }
};
