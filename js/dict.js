/* ===== 点词词典：任意英文词点击即出现释义与发音 ===== */
const Dict = {
  map: {},
  build() {
    // 主词库
    (window.WORDS || []).forEach(x => { this.map[x.w.toLowerCase()] = x; });
    // 补充库
    const addExtra = x => {
      if (!this.map[x.w]) this.map[x.w] = { w: x.w, p: x.p, t: [{ cn: x.cn }], s: [], _extra: true };
    };
    (window.DICT_EXTRA || []).forEach(addExtra);
    (window.DICT_SUPP || []).forEach(addExtra);
  },
  lookup(rawWord) {
    const w = rawWord.toLowerCase();
    if (this.map[w]) return this.map[w];
    for (const cand of lemma(rawWord)) {
      if (this.map[cand]) return this.map[cand];
    }
    return null;
  },
  // 把一段英文渲染成可点词 HTML
  renderClickable(text) {
    return splitTokens(esc(text)).map(seg => {
      if (/^[A-Za-z]/.test(seg)) {
        return '<span class="clickword" data-w="' + seg + '">' + seg + '</span>';
      }
      return seg;
    }).join('');
  },
  show(word, x, y) {
    const pop = $('#dictPop');
    const entry = this.lookup(word);
    let means;
    if (entry && entry.t && entry.t.length) {
      means = entry.t.slice(0, 3).map(t =>
        '<div class="dp-mean">' + (t.p ? '<span class="pill gray">' + esc(t.p) + '</span> ' : '') + esc(t.cn) +
        (t.en ? '<div class="dp-en">' + esc(t.en) + '</div>' : '') + '</div>').join('');
    } else {
      means = '<div class="dp-mean muted">内置词库暂未收录，点击可朗读；可在“设置”里接入大模型获得释义。</div>';
    }
    pop.innerHTML =
      '<button class="dp-close" onclick="document.getElementById(\'dictPop\').classList.add(\'hidden\')">✕</button>' +
      '<div class="dp-word">' + esc(word) +
      ' <span class="speaker" data-speak="' + esc(word) + '">🔊</span></div>' +
      (entry && entry.p ? '<div class="dp-phone">/ ' + esc(entry.p) + ' /</div>' : '') +
      means +
      (entry && entry.s && entry.s[0] ? '<div class="divider"></div><div class="muted">' + esc(entry.s[0].en) + '<br>' + esc(entry.s[0].cn || '') + '</div>' : '');
    pop.classList.remove('hidden');
    // 定位，避免超出屏幕
    const rw = pop.offsetWidth || 320, rh = pop.offsetHeight || 180;
    let left = Math.min(x + 12, window.innerWidth - rw - 12);
    let top = y + 18;
    if (top + rh > window.innerHeight) top = y - rh - 10;
    pop.style.left = Math.max(12, left) + 'px';
    pop.style.top = Math.max(12, top) + 'px';
  },
  hide() { $('#dictPop').classList.add('hidden'); }
};

// 全局事件委托：点词 / 朗读
document.addEventListener('click', e => {
  const sp = e.target.closest('[data-speak]');
  if (sp) { e.stopPropagation(); Speech.speak(sp.getAttribute('data-speak')); return; }
  const cw = e.target.closest('.clickword');
  if (cw) {
    e.stopPropagation();
    const w = cw.getAttribute('data-w');
    const r = cw.getBoundingClientRect();
    Dict.show(w, r.left, r.top);
    return;
  }
  if (!e.target.closest('#dictPop')) Dict.hide();
});
