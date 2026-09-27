/* ===== 应用主逻辑 / 路由 ===== */
const Views = {};
const TITLES = {
  home: '首页', words: '单词学习', reading: '短篇阅读', dialogue: '口语对话',
  quotes: '影视台词', books: '英文原著', prose: '美文美句', writing: '写作练习', settings: '设置'
};

const App = {
  current: 'home',
  go(name) {
    if (!Views[name]) name = 'home';
    this.current = name;
    $$('.nav-item').forEach(a => a.classList.toggle('active', a.dataset.view === name));
    $('#pageTitle').textContent = TITLES[name] || '';
    Speech.stop();
    const v = $('#view');
    try { Views[name].render(v); }
    catch (e) {
      console.error(e);
      v.innerHTML = '<div class="card empty"><span class="e-ic">😵</span>页面加载出错：' +
        esc(e.message) + '<br><button class="btn mt" onclick="App.go(\'home\')">回首页</button></div>';
    }
    window.scrollTo(0, 0);
    this.closeMenu();
  },
  toggleMenu() {
    $('#sidebar').classList.toggle('open');
    $('#scrim').classList.toggle('show');
  },
  closeMenu() {
    $('#sidebar').classList.remove('open');
    $('#scrim').classList.remove('show');
  }
};

// 导航
$$('.nav-item').forEach(a => a.onclick = () => App.go(a.dataset.view));
$('#menuBtn').onclick = () => App.toggleMenu();

// 点击空白遮罩关闭菜单
const scrim = h('div', { id: 'scrim' });
document.body.append(scrim);
scrim.onclick = () => App.closeMenu();

// 通用：所有 data-chip（章末生词/重点词）点击查义
document.addEventListener('click', e => {
  const c = e.target.closest('[data-chip]');
  if (c) {
    const r = c.getBoundingClientRect();
    Dict.show(c.getAttribute('data-chip'), r.left, r.bottom);
  }
});

// PWA Service Worker（独立部署、可离线、手机可安装）
if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  });
}

// 初始化：必须等所有视图脚本（home.js … settings.js）加载并挂到 Views 后再启动。
// 外部脚本按顺序同步执行，本文件先于视图文件，故这里用 load 事件延迟到全部就绪。
async function boot() {
  Dict.build();
  // 先探测本地 AI 能力（异步请求 WebGPU adapter），再渲染首页，保证各视图提示准确
  try { await LocalAI.checkSupport(); } catch (e) {}
  App.go(location.hash.replace('#', '') || 'home');
}
if (document.readyState === 'complete') boot();
else window.addEventListener('load', boot);

window.addEventListener('hashchange', () => {
  const n = location.hash.replace('#', '');
  if (n && n !== App.current) App.go(n);
});
