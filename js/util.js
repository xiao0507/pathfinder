/* ===== 通用工具 ===== */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));

function h(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v == null) continue;
    if (k === 'class') el.className = v;
    else if (k === 'html') el.innerHTML = v;
    else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v);
    else if (k === 'dataset') Object.assign(el.dataset, v);
    else el.setAttribute(k, v);
  }
  for (const c of children.flat()) {
    if (c == null || c === false) continue;
    el.append(c.nodeType ? c : document.createTextNode(c));
  }
  return el;
}

function esc(s = '') {
  return String(s).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function todayStr() {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

let toastTimer;
function toast(msg, ms = 2000) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), ms);
}

// 把英文文本切分成"词 / 非词"片段
const TOKEN_RE = /([A-Za-z][A-Za-z'’\-]*)/g;
function splitTokens(text) { return text.split(TOKEN_RE); }

// 词形归一（简单还原复数/时态，查词兜底用）
function lemma(w) {
  w = w.toLowerCase().replace(/[’']s$/, '');
  const rules = [
    [/ies$/, 'y'], [/ses$/, 's'], [/ches$/, 'ch'], [/shes$/, 'sh'], [/xes$/, 'x'], [/zzes$/, 'z'],
    [/ed$/, ''], [/ing$/, ''], [/s$/, ''], [/er$/, ''], [/est$/, ''], [/ly$/, '']
  ];
  const cands = [w];
  for (const [re, suf] of rules) {
    if (re.test(w)) {
      let base = w.replace(re, suf);
      cands.push(base);
      // 双写辅音还原：stopped -> stop
      if (suf === '' && /(.)\1$/.test(base)) cands.push(base.slice(0, -1));
    }
  }
  return cands;
}

window.addEventListener('error', e => {
  // 静默兜底，避免个别错误导致白屏
  console.error(e.error || e.message);
});
