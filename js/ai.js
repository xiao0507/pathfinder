/* ===== 统一 AI 入口 + 翻译容灾 =====
   AI.ask / AI.chat / AI.genJSON → 本地 WebGPU 模型（永久免费、无需 Key）
   Trans.toZh                     → 多翻译源兜底（结果缓存）
   设计：单词释义不触发重型模型，本地词典 + 翻译源保证秒回。 */

const AI = {
  // 是否具备真正的对话/生成能力（异步，真实探测 adapter）
  async capable() {
    return LocalAI.enabled && await LocalAI.checkSupport();
  },

  async chat(messages, opts = {}) {
    if (!LocalAI.enabled) throw new Error('AI 已在设置中关闭');
    if (!await LocalAI.checkSupport()) throw new Error('no-webgpu');
    return LocalAI.chat(messages, opts);
  },

  ask(prompt, system, opts = {}) {
    const msgs = [];
    if (system) msgs.push({ role: 'system', content: system });
    msgs.push({ role: 'user', content: prompt });
    return this.chat(msgs, opts);
  },

  async genJSON(system, user, opts = {}) {
    const raw = await this.ask(
      user,
      system + ' 只输出严格 JSON，不要解释、不要 markdown 代码块。',
      opts
    );
    let t = raw.trim().replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();
    const a = t.indexOf('[') >= 0 ? t.indexOf('[') : t.indexOf('{');
    const b = t.lastIndexOf(']') >= 0 ? t.lastIndexOf(']') : t.lastIndexOf('}');
    if (a >= 0 && b > a) t = t.slice(a, b + 1);
    return JSON.parse(t);
  }
};

/* ================= 翻译：英 → 中（多源容灾 + 缓存）================= */
const Trans = {
  cache: Store.get('transCache', {}),

  sources: [
    async function (text) {
      const u = new URL('https://api.mymemory.translated.net/get');
      u.searchParams.set('q', text.slice(0, 490));
      u.searchParams.set('langpair', 'en|zh-CN');
      const r = await fetch(u);
      const d = await r.json();
      const t = d.responseData && d.responseData.translatedText;
      return (t && !/MYMEMORY WARNING|INVALID|QUERY LENGTH/i.test(t)) ? t : '';
    },
    async function (text) {
      const u = new URL('https://translate.googleapis.com/translate_a/single');
      u.searchParams.set('client', 'gtx');
      u.searchParams.set('sl', 'en');
      u.searchParams.set('tl', 'zh-CN');
      u.searchParams.set('dt', 't');
      u.searchParams.set('q', text.slice(0, 1500));
      const r = await fetch(u);
      const d = await r.json();
      if (Array.isArray(d) && Array.isArray(d[0])) return d[0].map(s => (s && s[0]) || '').join('');
      return '';
    },
    async function (text) {
      const r = await fetch('https://lingva.ml/api/v1/en/zh/' + encodeURIComponent(text.slice(0, 1000)));
      if (!r.ok) return '';
      const d = await r.json();
      return d.translation || '';
    }
  ],

  _chunks(text) {
    if (text.length <= 480) return [text];
    const chunks = [], sents = text.match(/[^.!?]+[.!?]*/g) || [text];
    let cur = '';
    for (const st of sents) {
      if ((cur + st).length > 480) {
        if (cur) chunks.push(cur);
        if (st.length > 480) {
          for (let i = 0; i < st.length; i += 470) chunks.push(st.slice(i, i + 470));
          cur = '';
        } else cur = st;
      } else cur += st;
    }
    if (cur) chunks.push(cur);
    return chunks;
  },

  async toZh(text) {
    text = (text || '').trim();
    if (!text) return '';
    const key = text.slice(0, 200);
    if (this.cache[key]) return this.cache[key];

    const isWord = !/\s/.test(text);
    let result = '';

    // 句子/短段落：优先本地模型翻译，质量最好
    if (!isWord && text.length <= 600 && await AI.capable()) {
      try {
        result = await AI.ask(text,
          '你是专业翻译，只输出简体中文译文，不加解释、引号或备注。',
          { max_tokens: 700 });
      } catch (e) { result = ''; }
    }

    // 单词 / 模型不可用 / 长文：翻译源（长文自动按句拆块）
    if (!result) {
      const chunks = this._chunks(text);
      const parts = [];
      for (const c of chunks) {
        let tr = '';
        for (const src of this.sources) {
          try { tr = await src(c); if (tr) break; } catch (e) {}
        }
        parts.push(tr);
      }
      result = parts.join('');
    }

    if (result) {
      this.cache[key] = result;
      const ks = Object.keys(this.cache);
      if (ks.length > 1200) ks.slice(0, ks.length - 1200).forEach(k => delete this.cache[k]);
      Store.set('transCache', this.cache);
    }
    return result || '';
  },

  clear() { this.cache = {}; Store.set('transCache', {}); }
};
