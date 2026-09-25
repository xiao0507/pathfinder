/* ===== 首页 ===== */
Views.home = {
  render(v) {
    Streak.bump();
    const days = Streak.days();
    const due = SRS.dueList().length;
    const learned = SRS.learnedCount();
    const total = (window.WORDS || []).length;

    v.innerHTML = `
      <div class="hero">
        <h2>你好，探索者 👋</h2>
        <p>每天进步一点点，从背词、阅读到开口说，坚持到能畅快阅读英文原著、无字幕看剧。</p>
        <div class="hero-stats">
          <div class="hero-stat"><b>${days}</b><span>连续学习天数</span></div>
          <div class="hero-stat"><b>${learned}<small>/${total}</small></b><span>已学单词</span></div>
          <div class="hero-stat"><b>${SRS.masteredCount()}</b><span>已扎实掌握</span></div>
          <div class="hero-stat"><b>${due}</b><span>待复习单词</span></div>
        </div>
      </div>

      <div class="quick-grid">
        <button class="quick-card" data-go="words"><span class="qc-ic">🔤</span><b>${due ? '复习 ' + due + ' 个单词' : '今日背词'}</b><span>句子 + 段落记忆 · 遗忘曲线复习</span></button>
        <button class="quick-card" data-go="reading"><span class="qc-ic">📖</span><b>短篇阅读</b><span>双语对照 · 点词查义 · 可刷新</span></button>
        <button class="quick-card" data-go="dialogue"><span class="qc-ic">🎙️</span><b>口语对话</b><span>美式发音 · 场景 & 自由畅聊</span></button>
        <button class="quick-card" data-go="books"><span class="qc-ic">📚</span><b>英文原著</b><span>整本阅读 · 段落翻译 · 朗读</span></button>
      </div>

      <div class="card mt">
        <div class="section-head"><h2>🧭 今日学习路线</h2></div>
        <div class="plan-list">
          <div class="plan-item"><span class="pi-ic">①</span><div><b>${due ? '先复习到期的 ' + due + ' 个单词' : '学习一组新词（约10个）'}</b><p>在「单词学习」中完成，点“学会了”自动安排复习。</p></div></div>
          <div class="plan-item"><span class="pi-ic">②</span><div><b>精读一篇短篇 + 泛读一章原著</b><p>看不懂的词点一下即可查义、听发音。</p></div></div>
          <div class="plan-item"><span class="pi-ic">③</span><div><b>开口说 5 分钟</b><p>在「口语对话」选一个场景跟读，或自由对话。</p></div></div>
          <div class="plan-item"><span class="pi-ic">④</span><div><b>写一段 + 积累几句台词/美文</b><p>写作练结构，台词美句练语感。</p></div></div>
        </div>
      </div>`;

    $$('[data-go]', v).forEach(b => b.onclick = () => App.go(b.dataset.go));
    $('#streakDays').textContent = days + ' 天';
  }
};
