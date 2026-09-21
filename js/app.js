// ===== Pathfinder 核心逻辑 =====
(function () {
  'use strict';

  /* ---------- 工具函数 ---------- */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function todayStr() {
    var d = new Date();
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  }
  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function addDays(dateStr, days) {
    var parts = dateStr.split('-');
    var d = new Date(+parts[0], +parts[1] - 1, +parts[2]);
    d.setDate(d.getDate() + days);
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  }
  function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  /* ---------- 全局数据 ---------- */
  var DATA = {
    words: window.LEARNING_WORDS || [],
    dictionary: (typeof DICTIONARY !== 'undefined') ? DICTIONARY : [],
    dialogues: (typeof DIALOGUE_SCENES !== 'undefined') ? DIALOGUE_SCENES : [],
    movies: (typeof MOVIE_QUOTES !== 'undefined') ? MOVIE_QUOTES : [],
    books: (typeof BOOKS !== 'undefined') ? BOOKS : [],
    articles: (typeof ARTICLES !== 'undefined') ? ARTICLES : [],
    beauty: (typeof BEAUTY !== 'undefined') ? BEAUTY : [],
    writing: (typeof WRITING !== 'undefined') ? WRITING : []
  };
  var SPACING = window.SPACING_INTERVALS || [1, 2, 4, 7, 15, 30];

  /* ---------- 本地存储 ---------- */
  var STORE_KEY = 'pathfinder_word_state_v1';
  var state = null;
  function loadState() {
    try {
      state = JSON.parse(localStorage.getItem(STORE_KEY)) || {};
    } catch (e) { state = {}; }
  }
  function saveState() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) {}
  }

  /* 单词状态：
     state[wordId] = {
       status: 'learning' | 'mastered',
       stage: 0..SPACING.length,  // 已完成复习轮数
       learnedAt: 'YYYY-MM-DD',
       nextReview: 'YYYY-MM-DD'
     }
  */
  function wordStatus(id) {
    if (!state[id]) return 'new';
    return state[id].status;
  }
  function dueCount() {
    var t = todayStr(), n = 0;
    Object.keys(state).forEach(function (id) {
      var s = state[id];
      if (s.status === 'learning' && s.nextReview <= t) n++;
    });
    return n;
  }
  function learningCount() {
    var n = 0;
    Object.keys(state).forEach(function (id) {
      if (state[id].status === 'learning') n++;
    });
    return n;
  }
  function masteredCount() {
    var n = 0;
    Object.keys(state).forEach(function (id) {
      if (state[id].status === 'mastered') n++;
    });
    return n;
  }
  function newCount() {
    var known = Object.keys(state).length;
    return Math.max(0, DATA.words.length - known);
  }

  /* ---------- 导航 ---------- */
  var sidebar = $('#sidebar'), mask = $('#mask'), main = $('#main');
  function switchView(view) {
    $$('.view').forEach(function (v) { v.classList.remove('active'); });
    $$('.nav-item').forEach(function (b) { b.classList.toggle('active', b.dataset.view === view); });
    var target = $('#view-' + view);
    if (target) target.classList.add('active');
    closeSidebar();
    window.scrollTo(0, 0);
    if (view === 'daily') renderDaily();
    if (view === 'dialogue') renderDialogueScenes();
    if (view === 'lookup') $('#lookupInput').focus();
    if (view === 'movie') renderMovies();
    if (view === 'book') renderBookSelect();
    if (view === 'article') renderArticleList();
    if (view === 'beauty') renderBeauty();
    if (view === 'writing') renderWritingList();
  }
  function openSidebar() { sidebar.classList.add('open'); mask.classList.add('show'); }
  function closeSidebar() { sidebar.classList.remove('open'); mask.classList.remove('show'); }
  function initNav() {
    $('#menuBtn').addEventListener('click', function () {
      sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
    });
    mask.addEventListener('click', closeSidebar);
    $$('.nav-item').forEach(function (btn) {
      btn.addEventListener('click', function () { switchView(btn.dataset.view); });
    });
  }

  /* ---------- 每日学习 ---------- */
  var todayLearnedIds = [];  // 当天已学/已复习的单词 id（避免重复出现）
  var newWordsGiven = 0;
  var NEW_PER_DAY = 8;       // 每天新词目标

  function resetTodayIfNeeded() {
    var today = todayStr();
    var last = localStorage.getItem('pathfinder_today');
    if (last !== today) {
      localStorage.setItem('pathfinder_today', today);
      todayLearnedIds = [];
      newWordsGiven = 0;
    } else {
      todayLearnedIds = JSON.parse(localStorage.getItem('pathfinder_today_ids') || '[]');
      newWordsGiven = +(localStorage.getItem('pathfinder_today_new') || 0);
    }
  }
  function saveToday() {
    localStorage.setItem('pathfinder_today_ids', JSON.stringify(todayLearnedIds));
    localStorage.setItem('pathfinder_today_new', String(newWordsGiven));
  }

  function renderDaily() {
    resetTodayIfNeeded();
    updateStats();
    var card = $('#dailyCard'), actions = $('#dailyActions');
    var t = todayStr();

    // 1) 待复习单词（优先）
    var due = DATA.words.filter(function (w) {
      return state[w.id] && state[w.id].status === 'learning' && state[w.id].nextReview <= t &&
             todayLearnedIds.indexOf(w.id) === -1;
    });
    if (due.length > 0) {
      var w = due[0];
      renderWordCard(w, 'review');
      return;
    }
    // 2) 新单词（每天最多 NEW_PER_DAY 个）
    if (newWordsGiven < NEW_PER_DAY) {
      var pool = DATA.words.filter(function (w) { return !state[w.id]; });
      if (pool.length > 0) {
        var nw = pool[randInt(0, pool.length - 1)];
        renderWordCard(nw, 'new');
        return;
      }
    }
    // 3) 全部完成
    card.innerHTML = '<div class="done-box">' +
      '<div class="done-icon">🎉</div>' +
      '<h3>今日任务完成！</h3>' +
      '<p>今天学习了 <b>' + newWordsGiven + '</b> 个新词，复习了 <b>' + todayLearnedIds.length + '</b> 个单词。</p>' +
      '<p class="muted">按遗忘曲线，明天会有新的复习任务，记得回来哦。</p></div>';
    actions.innerHTML = '';
  }

  function renderWordCard(w, mode) {
    var card = $('#dailyCard'), actions = $('#dailyActions');
    var isReview = mode === 'review';
    card.innerHTML =
      '<div class="word-card">' +
        '<div class="word-tag ' + (isReview ? 'tag-review' : 'tag-new') + '">' + (isReview ? '复习' : '新词') + '</div>' +
        '<div class="word-main">' + esc(w.word) + '</div>' +
        '<div class="word-phonetic">' + esc(w.phonetic) + ' · ' + esc(w.pos) + '</div>' +
        '<div class="word-def">' + esc(w.def) + '</div>' +
        '<div class="word-example">' + esc(w.example) + '</div>' +
        '<div class="word-example-tr">' + esc(w.exampleTr) + '</div>' +
      '</div>';
    actions.innerHTML = isReview
      ? '<button class="btn success" id="btnKnown">✅ 记住了</button>' +
        '<button class="btn danger" id="btnForgot">🔄 忘了</button>'
      : '<button class="btn success" id="btnKnown">✅ 学会了</button>' +
        '<button class="btn ghost" id="btnSkip">⏭ 跳过</button>';

    $('#btnKnown').addEventListener('click', function () {
      if (isReview) reviewWord(w.id, true);
      else learnWord(w.id);
    });
    if ($('#btnForgot')) $('#btnForgot').addEventListener('click', function () { reviewWord(w.id, false); });
    if ($('#btnSkip')) $('#btnSkip').addEventListener('click', function () {
      if (newWordsGiven < NEW_PER_DAY) {
        // 跳过也计入当天新词额度，避免刷词
        newWordsGiven++;
        saveToday();
      }
      renderDaily();
    });
  }

  function learnWord(id) {
    state[id] = {
      status: 'learning',
      stage: 0,
      learnedAt: todayStr(),
      nextReview: addDays(todayStr(), SPACING[0] || 1)
    };
    saveState();
    newWordsGiven++;
    todayLearnedIds.push(id);
    saveToday();
    renderDaily();
  }

  function reviewWord(id, remembered) {
    var s = state[id];
    if (!s) return;
    var t = todayStr();
    if (remembered) {
      s.stage = (s.stage || 0) + 1;
      if (s.stage >= SPACING.length) {
        s.status = 'mastered';
        s.nextReview = '';
      } else {
        s.nextReview = addDays(t, SPACING[s.stage]);
      }
    } else {
      s.stage = 0;
      s.nextReview = addDays(t, 1);
    }
    saveState();
    if (todayLearnedIds.indexOf(id) === -1) todayLearnedIds.push(id);
    saveToday();
    renderDaily();
  }

  function updateStats() {
    $('#statNew').textContent = newCount();
    $('#statLearning').textContent = learningCount();
    $('#statMastered').textContent = masteredCount();
    $('#statDue').textContent = dueCount();
  }

  /* ---------- 对话练习 ---------- */
  var curDialogue = null, curStep = 0;
  function renderDialogueScenes() {
    $('#dialogueBox').style.display = 'none';
    var grid = $('#sceneGrid');
    grid.innerHTML = DATA.dialogues.map(function (sc) {
      return '<button class="scene-card" data-id="' + sc.id + '">' +
        '<div class="scene-icon">' + sc.icon + '</div>' +
        '<div class="scene-name">' + esc(sc.name) + '</div>' +
        '<div class="scene-desc">' + esc(sc.desc) + '</div>' +
      '</button>';
    }).join('');
    $$('.scene-card', grid).forEach(function (btn) {
      btn.addEventListener('click', function () { startDialogue(btn.dataset.id); });
    });
  }

  function startDialogue(id) {
    var sc = DATA.dialogues.filter(function (d) { return d.id === id; })[0];
    if (!sc) return;
    curDialogue = sc; curStep = 0;
    $('#sceneGrid').style.display = 'none';
    var box = $('#dialogueBox');
    box.style.display = 'block';
    $('#dialogueHead').innerHTML = '<span class="dialogue-title">' + sc.icon + ' ' + esc(sc.name) + '</span>' +
      '<button class="btn ghost btn-back" id="btnBack">← 返回场景</button>';
    $('#btnBack').addEventListener('click', function () {
      curDialogue = null;
      box.style.display = 'none';
      $('#sceneGrid').style.display = 'grid';
    });
    renderDialogueStep();
  }

  function renderDialogueStep() {
    var body = $('#dialogueBody'), input = $('#dialogueInput');
    var step = curDialogue.steps[curStep];
    if (!step) {
      // 对话结束
      body.innerHTML = '<div class="dialogue-end">🎉 对话完成！</div>' +
        '<div class="bubble npc">' + esc(curDialogue.intro) + '</div>' +
        '<div class="bubble-tr">' + esc(curDialogue.introTr) + '</div>';
      input.innerHTML = '<button class="btn primary" id="btnRestart">🔁 再练一次</button>' +
        '<button class="btn ghost" id="btnExit">完成</button>';
      $('#btnRestart').addEventListener('click', function () { curStep = 0; renderDialogueStep(); });
      $('#btnExit').addEventListener('click', function () {
        curDialogue = null;
        $('#dialogueBox').style.display = 'none';
        $('#sceneGrid').style.display = 'grid';
      });
      return;
    }
    body.innerHTML = '<div class="bubble npc">' + esc(step.npc) + '</div>' +
      '<div class="bubble-tr">' + esc(step.npcTr) + '</div>' +
      '<div class="step-hint">' + (curStep + 1) + ' / ' + curDialogue.steps.length + ' · 选择一个回复</div>';
    input.innerHTML = step.choices.map(function (c, i) {
      return '<button class="choice-btn" data-i="' + i + '">' +
        '<span class="choice-en">' + esc(c.reply) + '</span>' +
        '<span class="choice-tr">' + esc(c.replyTr) + '</span>' +
      '</button>';
    }).join('');
    $$('.choice-btn', input).forEach(function (btn) {
      btn.addEventListener('click', function () {
        var i = +btn.dataset.i;
        var c = step.choices[i];
        var extra = '';
        if (c.npcNext) {
          extra = '<div class="bubble user">' + esc(c.reply) + '</div>' +
            '<div class="bubble-tr">' + esc(c.replyTr) + '</div>' +
            '<div class="bubble npc">' + esc(c.npcNext) + '</div>' +
            '<div class="bubble-tr">' + esc(c.npcNextTr) + '</div>';
        }
        body.innerHTML = body.innerHTML + extra;
        input.innerHTML = '<button class="btn primary" id="btnNext">下一步 →</button>';
        $('#btnNext').addEventListener('click', function () {
          curStep++;
          renderDialogueStep();
          body.scrollTop = body.scrollHeight;
        });
        body.scrollTop = body.scrollHeight;
      });
    });
  }

  /* ---------- 点击查词 ---------- */
  function initLookup() {
    function doLookup() {
      var q = $('#lookupInput').value.trim().toLowerCase();
      var box = $('#lookupResult');
      if (!q) { box.innerHTML = '<p class="muted">请输入要查询的英文单词。</p>'; return; }
      var found = DATA.dictionary.filter(function (d) { return d[0].toLowerCase() === q; });
      if (found.length === 0) {
        // 模糊匹配
        found = DATA.dictionary.filter(function (d) { return d[0].toLowerCase().indexOf(q) !== -1; }).slice(0, 5);
      }
      if (found.length === 0) {
        box.innerHTML = '<p class="lookup-empty">😕 词典中没有找到 “' + esc(q) + '”。试试其他单词。</p>';
        return;
      }
      box.innerHTML = found.map(function (d) {
        var syn = (d[6] && d[6].length) ? d[6].map(esc).join('、') : '—';
        return '<div class="lookup-item">' +
          '<div class="lookup-word">' + esc(d[0]) + ' <span class="lookup-phone">' + esc(d[1]) + '</span></div>' +
          '<div class="lookup-pos">' + esc(d[2]) + ' ' + esc(d[3]) + '</div>' +
          '<div class="lookup-ex">' + esc(d[4]) + '</div>' +
          '<div class="lookup-ex-tr">' + esc(d[5]) + '</div>' +
          '<div class="lookup-syn"><b>同义词：</b>' + syn + '</div>' +
        '</div>';
      }).join('');
    }
    $('#lookupBtn').addEventListener('click', doLookup);
    $('#lookupInput').addEventListener('keydown', function (e) { if (e.key === 'Enter') doLookup(); });
  }

  /* ---------- 电影台词 ---------- */
  function renderMovies() {
    var n = randInt(5, Math.min(10, DATA.movies.length));
    var list = shuffle(DATA.movies).slice(0, n);
    $('#movieCard').innerHTML = list.map(function (m) {
      return '<div class="quote-item">' +
        '<div class="quote-en">“' + esc(m.en) + '”</div>' +
        '<div class="quote-zh">' + esc(m.zh) + '</div>' +
        '<div class="quote-src">— ' + esc(m.movie) + (m.year ? ' (' + m.year + ')' : '') + '</div>' +
      '</div>';
    }).join('');
  }
  function initMovie() {
    renderMovies();
    $('#movieRefresh').addEventListener('click', renderMovies);
  }

  /* ---------- 书籍阅读 ---------- */
  var curBookId = null, curChapter = 0;
  function renderBookSelect() {
    var sel = $('#bookSelect'), bar = $('#bookChapterBar'), content = $('#bookContent');
    bar.innerHTML = '';
    content.innerHTML = '';
    sel.innerHTML = DATA.books.map(function (b) {
      return '<button class="book-btn" data-id="' + b.id + '">' +
        '<span class="book-name">' + esc(b.name) + '</span>' +
        '<span class="book-author">' + esc(b.author) + '</span>' +
        '<span class="book-intro">' + esc(b.intro) + '</span>' +
      '</button>';
    }).join('');
    $$('.book-btn', sel).forEach(function (btn) {
      btn.addEventListener('click', function () { openBook(btn.dataset.id); });
    });
  }

  function openBook(id) {
    var b = DATA.books.filter(function (x) { return x.id === id; })[0];
    if (!b) return;
    curBookId = id; curChapter = 0;
    var bar = $('#bookChapterBar');
    bar.innerHTML = '<div class="chapter-title">' + esc(b.name) + '</div>' +
      '<div class="chapter-tabs">' + b.chapters.map(function (c, i) {
        return '<button class="chapter-tab' + (i === 0 ? ' active' : '') + '" data-i="' + i + '">' +
          '第' + (i + 1) + '章</button>';
      }).join('') + '</div>';
    $$('.chapter-tab', bar).forEach(function (tab) {
      tab.addEventListener('click', function () {
        curChapter = +tab.dataset.i;
        $$('.chapter-tab', bar).forEach(function (t) { t.classList.toggle('active', t === tab); });
        renderChapter();
      });
    });
    renderChapter();
    $('#bookContent').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function renderChapter() {
    var b = DATA.books.filter(function (x) { return x.id === curBookId; })[0];
    if (!b) return;
    var c = b.chapters[curChapter];
    var content = $('#bookContent');
    content.innerHTML =
      '<div class="chapter-heading">' + esc(c.title) + '</div>' +
      '<div class="chapter-paras">' + c.paras.map(function (p, i) {
        return '<div class="para">' +
          '<div class="para-en">' + esc(p.en) + '</div>' +
          '<button class="para-toggle" data-i="' + i + '">🔽 显示翻译</button>' +
          '<div class="para-zh" data-i="' + i + '" style="display:none;">' + esc(p.zh) + '</div>' +
        '</div>';
      }).join('') + '</div>' +
      '<div class="chapter-vocab"><h3>📌 本章生词</h3>' +
      '<div class="vocab-list">' + c.vocab.map(function (v) {
        return '<div class="vocab-item">' +
          '<div class="vocab-w">' + esc(v.w) + ' <span class="vocab-p">' + esc(v.p || '') + '</span></div>' +
          '<div class="vocab-m">' + esc(v.m) + '</div>' +
          '<div class="vocab-e">' + esc(v.e) + '</div>' +
        '</div>';
      }).join('') + '</div></div>';

    $$('.para-toggle', content).forEach(function (btn) {
      btn.addEventListener('click', function () {
        var i = btn.dataset.i;
        var zh = content.querySelector('.para-zh[data-i="' + i + '"]');
        if (zh.style.display === 'none') {
          zh.style.display = 'block';
          btn.textContent = '🔼 隐藏翻译';
        } else {
          zh.style.display = 'none';
          btn.textContent = '🔽 显示翻译';
        }
      });
    });
  }

  /* ---------- 英语文章 ---------- */
  var curArticleId = null;
  function renderArticleList() {
    var list = $('#articleList'), content = $('#articleContent');
    content.style.display = 'none';
    var topics = {};
    DATA.articles.forEach(function (a) {
      if (!topics[a.topic]) topics[a.topic] = [];
      topics[a.topic].push(a);
    });
    list.innerHTML = Object.keys(topics).map(function (t) {
      return '<div class="article-group"><div class="article-topic">' + esc(t) + '</div>' +
        topics[t].map(function (a) {
          return '<button class="article-item" data-id="' + a.id + '">' +
            '<div class="article-title">' + esc(a.title) + '</div>' +
            '<div class="article-meta">' + esc(a.topic) + ' · ' + esc(a.difficulty) + ' · ' + esc(a.intro) + '</div>' +
          '</button>';
        }).join('') + '</div>';
    }).join('');
    $$('.article-item', list).forEach(function (btn) {
      btn.addEventListener('click', function () { openArticle(btn.dataset.id); });
    });
  }

  function openArticle(id) {
    var a = DATA.articles.filter(function (x) { return x.id === id; })[0];
    if (!a) return;
    curArticleId = id;
    var list = $('#articleList'), content = $('#articleContent');
    list.style.display = 'none';
    content.style.display = 'block';
    content.innerHTML =
      '<div class="article-head">' +
        '<button class="btn ghost" id="btnArticleBack">← 返回列表</button>' +
        '<h2>' + esc(a.title) + '</h2>' +
        '<div class="article-meta">' + esc(a.topic) + ' · ' + esc(a.difficulty) + '</div>' +
      '</div>' +
      '<div class="article-paras">' + a.paras.map(function (p, i) {
        return '<div class="para">' +
          '<div class="para-en">' + esc(p.en) + '</div>' +
          '<button class="para-toggle" data-i="' + i + '">🔽 显示翻译</button>' +
          '<div class="para-zh" data-i="' + i + '" style="display:none;">' + esc(p.zh) + '</div>' +
        '</div>';
      }).join('') + '</div>' +
      '<div class="chapter-vocab"><h3>📌 重点词汇</h3>' +
      '<div class="vocab-list">' + a.vocab.map(function (v) {
        return '<div class="vocab-item">' +
          '<div class="vocab-w">' + esc(v.w) + '</div>' +
          '<div class="vocab-m">' + esc(v.m) + '</div>' +
          '<div class="vocab-e">' + esc(v.e) + '</div>' +
        '</div>';
      }).join('') + '</div></div>';

    $('#btnArticleBack').addEventListener('click', function () {
      content.style.display = 'none';
      list.style.display = 'block';
      curArticleId = null;
    });
    $$('.para-toggle', content).forEach(function (btn) {
      btn.addEventListener('click', function () {
        var i = btn.dataset.i;
        var zh = content.querySelector('.para-zh[data-i="' + i + '"]');
        if (zh.style.display === 'none') {
          zh.style.display = 'block';
          btn.textContent = '🔼 隐藏翻译';
        } else {
          zh.style.display = 'none';
          btn.textContent = '🔽 显示翻译';
        }
      });
    });
  }

  /* ---------- 美文美句 ---------- */
  function renderBeauty() {
    if (DATA.beauty.length === 0) return;
    var b = DATA.beauty[randInt(0, DATA.beauty.length - 1)];
    $('#beautyCard').innerHTML =
      '<div class="beauty-tag">' + esc(b.category) + '</div>' +
      '<div class="beauty-title">' + esc(b.title) + '</div>' +
      '<div class="beauty-en">' + esc(b.en) + '</div>' +
      '<div class="beauty-zh">' + esc(b.zh) + '</div>' +
      '<div class="beauty-appr"><b>💡 赏析：</b>' + esc(b.appreciation) + '</div>';
  }
  function initBeauty() {
    renderBeauty();
    $('#beautyRefresh').addEventListener('click', renderBeauty);
  }

  /* ---------- 写作练习 ---------- */
  var curWritingId = null;
  function renderWritingList() {
    var gen = $('#writingGen'), content = $('#writingContent');
    content.style.display = 'none';
    var types = {};
    DATA.writing.forEach(function (w) {
      if (!types[w.type]) types[w.type] = [];
      types[w.type].push(w);
    });
    gen.innerHTML = Object.keys(types).map(function (t) {
      return '<div class="article-group"><div class="article-topic">' + esc(t) + '</div>' +
        types[t].map(function (w) {
          return '<button class="article-item" data-id="' + w.id + '">' +
            '<div class="article-title">' + esc(w.title) + '</div>' +
            '<div class="article-meta">' + esc(w.level) + ' · ' + esc(w.topic) + '</div>' +
          '</button>';
        }).join('') + '</div>';
    }).join('');
    $$('.article-item', gen).forEach(function (btn) {
      btn.addEventListener('click', function () { openWriting(btn.dataset.id); });
    });
  }

  function openWriting(id) {
    var w = DATA.writing.filter(function (x) { return x.id === id; })[0];
    if (!w) return;
    curWritingId = id;
    var gen = $('#writingGen'), content = $('#writingContent');
    gen.style.display = 'none';
    content.style.display = 'block';
    content.innerHTML =
      '<div class="article-head">' +
        '<button class="btn ghost" id="btnWritingBack">← 返回列表</button>' +
        '<div class="writing-type">' + esc(w.type) + ' · ' + esc(w.level) + '</div>' +
        '<h2>' + esc(w.title) + '</h2>' +
        '<div class="writing-topic">' + esc(w.topic) + '</div>' +
        '<div class="writing-topic-zh">' + esc(w.prompt) + '</div>' +
      '</div>' +
      '<div class="writing-block"><h3>💭 写作思路</h3><ul>' + w.ideas.map(function (i) { return '<li>' + esc(i) + '</li>'; }).join('') + '</ul></div>' +
      '<div class="writing-block"><h3>🧩 常用句型</h3><ul>' + w.patterns.map(function (p) { return '<li>' + esc(p) + '</li>'; }).join('') + '</ul></div>' +
      '<div class="writing-block"><h3>✍️ 范文</h3><div class="writing-sample">' + esc(w.sample) + '</div>' +
      '<button class="para-toggle" id="btnSampleZh">🔽 显示范文翻译</button>' +
      '<div class="para-zh" id="sampleZh" style="display:none;">' + esc(w.sampleZh) + '</div></div>' +
      '<div class="writing-block"><h3>🔑 关键词</h3><div class="keyword-list">' + w.keywords.map(function (k) { return '<span class="keyword">' + esc(k) + '</span>'; }).join('') + '</div></div>';

    $('#btnWritingBack').addEventListener('click', function () {
      content.style.display = 'none';
      gen.style.display = 'block';
      curWritingId = null;
    });
    $('#btnSampleZh').addEventListener('click', function () {
      var zh = $('#sampleZh');
      if (zh.style.display === 'none') { zh.style.display = 'block'; this.textContent = '🔼 隐藏范文翻译'; }
      else { zh.style.display = 'none'; this.textContent = '🔽 显示范文翻译'; }
    });
  }

  /* ---------- 初始化 ---------- */
  function init() {
    loadState();
    resetTodayIfNeeded();
    initNav();
    renderDaily();
    renderDialogueScenes();
    initLookup();
    initMovie();
    renderBookSelect();
    renderArticleList();
    initBeauty();
    renderWritingList();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
