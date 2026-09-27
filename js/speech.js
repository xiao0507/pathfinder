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

/* 语音识别：点开始 → 持续听 → 点"停止"才结束 */
const Recog = {
  recog: null,
  listening: false,
  finalText: '',
  onResult: null,
  onEnd: null,
  onError: null,
  onState: null,
  supported: (() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    return !!SR;
  })(),

  _new(lang) {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const r = new SR();
    r.lang = lang || Store.get('recogLang', 'en-US');
    r.continuous = true;          // 持续录音，直到手动停止
    r.interimResults = true;      // 实时结果
    r.maxAlternatives = 1;
    return r;
  },

  _setState(s) { this.listening = s; this.onState && this.onState(s); },

  // 友好的错误提示
  _errMsg(code) {
    return {
      'not-allowed': '麦克风权限被拒绝，请在浏览器地址栏允许麦克风后重试',
      'service-not-allowed': '浏览器不允许使用语音识别服务',
      'network': '语音识别需要联网，请检查网络后重试',
      'audio-capture': '没有检测到麦克风设备，请确认麦克风已连接',
      'no-speech': '没有听到声音，请再试一次',
      'aborted': '录音已取消',
      'language-not-supported': '当前识别语言不被支持'
    }[code] || ('录音出错：' + code);
  },

  start(lang) {
    if (!this.supported) {
      this.onError && this.onError('unsupported');
      toast('当前浏览器不支持录音，请用 Chrome / Edge / Safari');
      return false;
    }
    if (location.protocol === 'file:') {
      toast('本地直接打开录音可能受限，请把应用部署到网址后使用（见README）');
    }
    this._hardStop();
    this.finalText = '';

    const r = this._new(lang);
    let wantStop = false;
    let restartAt = 0;

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
      // no-speech / aborted 属于可恢复情况，交由 onend 处理重连
      if (e.error === 'not-allowed' || e.error === 'service-not-allowed' ||
          e.error === 'audio-capture' || e.error === 'language-not-supported') {
        wantStop = true;
        toast(this._errMsg(e.error), 3500);
        this._setState(false);
      }
      this.onError && this.onError(e.error);
    };

    r.onend = () => {
      // 用户没主动停止且未发生致命错误 → 自动重连续录
      if (!wantStop && this.listening && Date.now() > restartAt) {
        restartAt = Date.now() + 350;
        setTimeout(() => {
          if (wantStop || !this.listening) return;
          try { r.start(); } catch (e) {
            // 重建一个识别实例再试一次
            try {
              const r2 = this._new(lang);
              r2.onresult = r.onresult; r2.onerror = r.onerror; r2.onend = r.onend;
              r2.start();
              this.recog = r2;
            } catch (e2) {
              this._finish(wantStop);
            }
          }
        }, 300);
        return;
      }
      this._finish(wantStop);
    };

    try {
      r.start();
      this.recog = r;
      this._setState(true);
    } catch (e) {
      toast('录音启动失败，请再点一次');
      return false;
    }
    return true;
  },

  _finish(wantStop) {
    this._setState(false);
    this.onEnd && this.onEnd(this.finalText.trim());
  },

  stopRec() {
    // 用户主动停止
    const r = this.recog;
    this._setState(false);
    if (r) {
      try { r.stop(); } catch (e) {}
    }
  },

  _hardStop() {
    const r = this.recog;
    this._setState(false);
    if (r) { try { r.abort(); } catch (e) {} }
  }
};

Speech.init();
