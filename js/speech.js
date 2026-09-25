/* ===== 语音：朗读（美音）+ 语音识别 ===== */
const Speech = {
  voice: null,
  supported: 'speechSynthesis' in window,
  init() {
    if (!this.supported) return;
    const pick = () => {
      const vs = speechSynthesis.getVoices();
      // 优先美式英语
      this.voice = vs.find(v => /en-US/i.test(v.lang) && /female|samantha|zira|google/i.test(v.name))
        || vs.find(v => /en-US/i.test(v.lang))
        || vs.find(v => /^en/i.test(v.lang))
        || null;
    };
    pick();
    speechSynthesis.onvoiceschanged = pick;
  },
  speak(text, opts = {}) {
    if (!this.supported) { toast('当前浏览器不支持朗读'); return; }
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US';
    if (this.voice) u.voice = this.voice;
    u.rate = opts.rate || parseFloat(Store.get('rate', '0.95'));
    u.pitch = 1;
    speechSynthesis.speak(u);
  },
  stop() { if (this.supported) speechSynthesis.cancel(); }
};

/* 语音识别：点开始→持续听→点"停止"才结束 */
const Recog = {
  recog: null,
  listening: false,
  finalText: '',
  onResult: null,
  onEnd: null,
  onError: null,
  supported: (() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    return !!SR;
  })(),
  _new(lang) {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const r = new SR();
    r.lang = lang || (Store.get('recogLang', 'en-US'));
    r.continuous = true;          // 持续录音，直到手动停止
    r.interimResults = true;      // 实时结果
    return r;
  },
  start(lang) {
    if (!this.supported) { toast('当前浏览器不支持语音识别，请用 Chrome/Edge'); return false; }
    this.stop();
    this.finalText = '';
    const r = this._new(lang);
    let wantStop = false;
    this._wantStop = () => { wantStop = true; r.stop(); };

    r.onresult = (e) => {
      let interim = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) this.finalText += t;
        else interim += t;
      }
      this.onResult && this.onResult(this.finalText, interim);
    };
    r.onerror = (e) => {
      if (e.error === 'not-allowed') toast('请允许麦克风权限');
      this.listening = false;
      this.onError && this.onError(e.error);
    };
    r.onend = () => {
      // 浏览器可能自动断开；若用户没主动停止且不是错误，自动重连续录
      if (!wantStop && this.listening) {
        try { r.start(); return; } catch (e) {}
      }
      this.listening = false;
      this.onEnd && this.onEnd(this.finalText.trim());
    };
    try { r.start(); this.listening = true; } catch (e) { return false; }
    this.recog = r;
    return true;
  },
  stopRec() {
    this.listening = false;
    if (this._wantStop) this._wantStop();
    else if (this.recog) this.recog.stop();
  }
};

Speech.init();
