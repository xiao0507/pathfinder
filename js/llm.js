/* ===== 可选大模型接入（自带 Key）+ 在线翻译兜底 =====
   无 Key 时所有内置内容仍可离线使用；
   接入 OpenAI 兼容接口后，可无限生成新内容、自由对话、整段翻译。 */

const LLM = {
  cfg() {
    return {
      base: Store.get('apiBase', 'https://api.openai.com/v1'),
      key: Store.get('apiKey', ''),
      model: Store.get('model', 'gpt-4o-mini')
    };
  },
  ready() { return !!this.cfg().key; },
  async chat(messages, opts = {}) {
    const c = this.cfg();
    if (!c.key) throw new Error('no-key');
    const res = await fetch(c.base.replace(/\/$/, '') + '/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + c.key },
      body: JSON.stringify({
        model: opts.model || c.model,
        messages,
        temperature: opts.temperature != null ? opts.temperature : 0.8,
        max_tokens: opts.max_tokens || 1200
      })
    });
    if (!res.ok) {
      const t = await res.text();
      throw new Error('接口返回 ' + res.status + ' ' + t.slice(0, 120));
    }
    const data = await res.json();
    return data.choices[0].message.content.trim();
  },
  async json(messages) {
    const out = await this.chat(messages, { temperature: 0.7 });
    const m = out.match(/[\[{][\s\S]*[\]}]/);
    return JSON.parse(m ? m[0] : out);
  }
};

/* 翻译：优先大模型；无 Key 时多源免费翻译自动容灾，结果缓存 */
const Trans = {
  cache: Store.get('transCache', {}),

  // —— 免费翻译源（按顺序尝试，任一成功即用）——
  sources: [
    // 1) MyMemory
    async function (text) {
      const u = new URL('https://api.mymemory.translated.net/get');
      u.searchParams.set('q', text.slice(0, 480));
      u.searchParams.set('langpair', 'en|zh-CN');
      const r = await fetch(u);
      const d = await r.json();
      const t = d.responseData && d.responseData.translatedText;
      return t && !/MYMEMORY WARNING|INVALID/i.test(t) ? t : '';
    },
    // 2) Google 客户端接口（浏览器端通常可达）
    async function (text) {
      const u = new URL('https://translate.googleapis.com/translate_a/single');
      u.searchParams.set('client', 'gtx');
      u.searchParams.set('sl', 'en');
      u.searchParams.set('tl', 'zh-CN');
      u.searchParams.set('dt', 't');
      u.searchParams.set('q', text.slice(0, 1800));
      const r = await fetch(u);
      const d = await r.json();
      if (Array.isArray(d) && Array.isArray(d[0])) {
        return d[0].map(seg => (seg && seg[0]) || '').join('');
      }
      return '';
    },
    // 3) Lingva 公共镜像（Google 的 CORS 代理）
    async function (text) {
      const u = new URL('https://lingva.ml/api/v1/en/zh/' + encodeURIComponent(text.slice(0, 1200)));
      const r = await fetch(u);
      if (!r.ok) return '';
      const d = await r.json();
      return d.translation || '';
    }
  ],

  async toZh(text) {
    text = (text || '').trim();
    if (!text) return '';
    const key = text.slice(0, 200);
    if (this.cache[key]) return this.cache[key];

    let result = '';
    try {
      if (LLM.ready()) {
        result = await LLM.chat([
          { role: 'system', content: '你是专业翻译，只输出简体中文译文，不加任何解释。' },
          { role: 'user', content: text }
        ], { temperature: 0.2, max_tokens: 900 });
      } else {
        for (const src of this.sources) {
          try {
            result = await src(text);
            if (result) break;
          } catch (e) { /* 尝试下一个源 */ }
        }
      }
    } catch (e) { result = ''; }

    if (result) {
      this.cache[key] = result;
      const keys = Object.keys(this.cache);
      if (keys.length > 1500) keys.slice(0, keys.length - 1500).forEach(k => delete this.cache[k]);
      Store.set('transCache', this.cache);
    }
    return result || '';
  },
  clear() { this.cache = {}; Store.set('transCache', {}); }
};
