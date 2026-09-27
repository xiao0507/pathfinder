/* ===== 本地 AI 引擎（WebLLM / WebGPU）=====
   - 模型在你的设备上直接运行，永久免费、无需 Key、无需后端服务器
   - 权重首次从国内镜像下载，浏览器缓存后可离线使用
   - 不支持 WebGPU 的设备自动降级为翻译源，不影响其他全部功能 */

const LocalAI = {
  // 主模型（中英双语，约 1.6GB 显存/缓存）
  MODEL_ID: 'Qwen2.5-1.5B-Instruct-q4f16_1-MLC',
  // 轻量备选（约 0.6GB，显存紧张时）
  LITE_ID: 'Qwen2.5-0.5B-Instruct-q4f16_1-MLC',

  engine: null,
  loading: null,
  enabled: Store.get('localAI', true),
  progress: { text: '', pct: 0 },
  listeners: [],
  _support: null,

  onProgress(fn) { this.listeners.push(fn); },
  _emit() { this.listeners.forEach(f => { try { f(this.progress); } catch (e) {} }); },

  // 异步检测：不仅要 navigator.gpu，还要能真正拿到 adapter
  async checkSupport() {
    if (this._support != null) return this._support;
    try {
      this._support = !!(window.WebLLM && navigator.gpu && await navigator.gpu.requestAdapter());
    } catch (e) { this._support = false; }
    return this._support;
  },

  // 同步读取（首次可能为 null，调用前先用 checkSupport 探测）
  supported() {
    return this._support === true;
  },

  isReady() { return !!this.engine; },

  // 构造自定义 appConfig：权重走镜像，wasm 走本地
  _appConfig(lite) {
    const id = lite ? this.LITE_ID : this.MODEL_ID;
    const wasm = lite
      ? 'Qwen2-0.5B-Instruct-q4f16_1-ctx4k_cs1k-webgpu.wasm'
      : 'Qwen2-1.5B-Instruct-q4f16_1-ctx4k_cs1k-webgpu.wasm';
    const base = window.WebLLM.prebuiltAppConfig;
    return {
      ...base,
      model_list: [
        {
          model: 'https://hf-mirror.com/mlc-ai/' + id,
          model_id: id,
          model_lib: new URL('../vendor/wasm/' + wasm, location.href).href,
          vram_required_MB: lite ? 650 : 1630,
          low_resource_required: true,
          overrides: { context_window_size: 4096 }
        }
      ]
    };
  },

  async _tryLoad(lite) {
    const id = lite ? this.LITE_ID : this.MODEL_ID;
    const engine = await window.WebLLM.CreateMLCEngine(
      id,
      {
        appConfig: this._appConfig(lite),
        initProgressCallback: (p) => {
          this.progress = {
            text: p.text || '',
            pct: Math.round((p.progress || 0) * 100)
          };
          this._emit();
        }
      },
      { temperature: 0.7, top_p: 0.9 }
    );
    this.engine = engine;
    return engine;
  },

  // 确保引擎就绪（带下载进度）。返回 engine 或抛错
  async ensure(lite) {
    if (this.engine) return this.engine;
    if (this.loading) return this.loading;
    if (!await this.checkSupport()) throw new Error('no-webgpu');
    this.progress = { text: '准备本地AI…', pct: 0 };
    this._emit();
    this.loading = (async () => {
      try {
        return await this._tryLoad(lite);
      } catch (e) {
        // 主模型失败（如显存不足）→ 尝试轻量模型
        if (!lite) {
          this.progress = { text: '改用轻量模型…', pct: 0 };
          this._emit();
          try { return await this._tryLoad(true); } catch (e2) { throw e2; }
        }
        throw e;
      } finally {
        this.loading = null;
      }
    })();
    return this.loading;
  },

  async chat(messages, opts = {}) {
    if (!this.enabled) throw new Error('disabled');
    const engine = await this.ensure(opts.lite);
    const reply = await engine.chat.completions.create({
      messages,
      temperature: opts.temperature != null ? opts.temperature : 0.7,
      max_tokens: opts.max_tokens || 600
    });
    const t = reply.choices && reply.choices[0] && reply.choices[0].message;
    if (!t) throw new Error('empty reply');
    return (t.content || '').trim();
  },

  async ask(prompt, system, opts = {}) {
    const msgs = [];
    if (system) msgs.push({ role: 'system', content: system });
    msgs.push({ role: 'user', content: prompt });
    return this.chat(msgs, opts);
  },

  setEnabled(v) {
    this.enabled = v;
    Store.set('localAI', v);
  }
};
