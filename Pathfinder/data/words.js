// ===== Pathfinder 每日学习词库 =====
// 由内置词典生成学习用词表（含音标/词性/释义/例句/翻译），供遗忘曲线使用。
(function(){
  const WORDS = DICTIONARY.map(function(d, i){
    return {
      id: i,
      word: d[0],
      phonetic: d[1],
      pos: d[2],
      def: d[3],
      example: d[4],
      exampleTr: d[5]
    };
  });

  // 遗忘曲线复习间隔（天）：学完第1天、第2天、第4天、第7天、第15天、第30天复习
  window.SPACING_INTERVALS = [1, 2, 4, 7, 15, 30];
  window.LEARNING_WORDS = WORDS;
  window.WORD_POOL_SIZE = WORDS.length;
})();
