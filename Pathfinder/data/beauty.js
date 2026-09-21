// ===== Pathfinder 美文美句库 =====
// 每则：id/category/title/en/zh/appreciation(赏析)
const BEAUTY = [
  {
    id: "time",
    category: "时间",
    title: "Time is a River",
    en: "Time is like a river. You cannot touch the same water twice, because the flow that has passed will never pass again. Enjoy every moment you have, for the one you are living right now will soon be a memory.",
    zh: "时间像一条河。你无法两次触摸同样的水，因为流过的水永远不会再流回来。享受你拥有的每一个瞬间，因为你正经历的这一刻，很快就会成为回忆。",
    appreciation: "比喻手法（river）形象表达时间的不可逆性；'the flow that has passed will never pass again' 用重复的 pass 增强节奏感，适合背诵仿写。"
  },
  {
    id: "morning",
    category: "生活",
    title: "A New Morning",
    en: "Every morning is a new beginning. The sun rises not because yesterday was good or bad, but because today deserves a chance. Open your window, take a deep breath, and tell yourself: today, I will do my best.",
    zh: "每个清晨都是新的开始。太阳升起，不是因为昨天好或坏，而是因为今天值得一次机会。打开窗户，深吸一口气，告诉自己：今天，我会尽力而为。",
    appreciation: "用 'not because...but because' 结构强调转折；'deserves a chance' 拟人化太阳，温暖励志，适合口语模仿。"
  },
  {
    id: "slow",
    category: "生活",
    title: "The Beauty of Slowing Down",
    en: "We rush through life as if speed were a virtue. But the flowers do not bloom faster for our hurry, and the stars do not shine brighter for our worry. Sometimes, the greatest wisdom is to slow down and simply be.",
    zh: "我们匆匆走过人生，仿佛速度是一种美德。但花不会因为我们的匆忙而开得更快，星星不会因为我们的焦虑而更亮。有时候，最大的智慧就是慢下来，简单地存在。",
    appreciation: "排比结构（the flowers...the stars...）形成韵律；'simply be' 呼应存在主义哲思，语言简洁深刻。"
  },
  {
    id: "courage",
    category: "成长",
    title: "Courage to Begin",
    en: "Courage is not the absence of fear. It is the decision that something else is more important than fear. Every great journey begins with one small step taken in the face of uncertainty. Begin today.",
    zh: "勇气不是没有恐惧，而是认定有比恐惧更重要的东西。每一段伟大的旅程，都始于在不确定面前迈出的一小步。今天就开始吧。",
    appreciation: "经典定义句（Courage is not...It is...）简洁有力；'one small step' 呼应登月名言，激励行动。"
  },
  {
    id: "friendship",
    category: "情感",
    title: "What Friendship Really Means",
    en: "A true friend is not someone who is always by your side, but someone who is always in your heart. Distance cannot separate souls that are connected. A friend is a hand that holds yours when the road gets rough.",
    zh: "真正的朋友不是总在你身边的人，而是总在你心里的人。距离无法分开相连的灵魂。朋友是在道路崎岖时握住你的那只手。",
    appreciation: "对比结构（not...but...）清晰有力；'a hand that holds yours' 意象温暖具体，适合写作引用。"
  },
  {
    id: "failure",
    category: "成长",
    title: "The Gift of Failure",
    en: "Failure is not the opposite of success; it is part of success. Every mistake is a teacher, and every fall is a lesson. The people who achieve great things are not those who never fail, but those who never give up.",
    zh: "失败不是成功的对立面，而是成功的一部分。每一个错误都是一位老师，每一次跌倒都是一课。取得伟大成就的人，不是从不失败的人，而是从不放弃的人。",
    appreciation: "'Failure is not...it is...' 破立结合；'every mistake is a teacher' 比喻生动，是考试作文的经典好句。"
  },
  {
    id: "nature",
    category: "自然",
    title: "Listen to Nature",
    en: "When the world becomes too loud, go outside and listen. The wind has its own music, the rain its own rhythm, and the birds their own songs. Nature does not shout, but those who listen carefully will always hear.",
    zh: "当世界变得太吵时，走出去倾听。风有它自己的音乐，雨有它自己的节奏，鸟儿有它们自己的歌。大自然不喧哗，但用心聆听的人总能听见。",
    appreciation: "拟人（wind/rain/birds 都有 own）营造宁静意境；'Nature does not shout' 反衬手法，意蕴深远。"
  },
  {
    id: "kindness",
    category: "情感",
    title: "The Ripple of Kindness",
    en: "Kindness is like a stone dropped into still water. It creates ripples that spread far beyond where you can see. One small act of kindness today may change someone's life tomorrow, and theirs may change another's.",
    zh: "善良像投入静水的石子，激起的涟漪远远扩散到你看不见的地方。今天一个微小的善举，也许明天就会改变某个人的一生，而那个人又会改变另一个人的。",
    appreciation: "涟漪（ripple）比喻链条式传递善意的力量；'may change...may change' 的递进结构自然流畅。"
  },
  {
    id: "dream",
    category: "励志",
    title: "Keep Your Dreams Alive",
    en: "Dreams are the seeds of the future. They may seem small now, but with patience, water, and sunlight, they can grow into something extraordinary. Do not let anyone convince you that your dreams are too big. The world needs people who dream boldly.",
    zh: "梦想是未来的种子。它们现在看起来也许渺小，但只要耐心、水分和阳光，就能长成非凡之物。不要让任何人说服你梦想太大。世界需要大胆梦想的人。",
    appreciation: "'Dreams are the seeds' 隐喻贯穿全篇；'dream boldly' 尾句押韵且铿锵有力，极具感染力。"
  },
  {
    id: "thankful",
    category: "生活",
    title: "Count What You Have",
    en: "It is easy to count what we lack and forget what we have. But gratitude is a mirror that shows us the richness of our lives. Look around you: the people who love you, the roof above your head, the air in your lungs. You are richer than you think.",
    zh: "我们很容易数着缺少的东西，忘记已有的。但感恩是一面镜子，映照出生活的富足。看看你周围：爱你的人、头顶的屋檐、肺里的空气。你比自己想象的富有。",
    appreciation: "'gratitude is a mirror' 比喻新颖；三段列举（people/roof/air）由近及远，让人瞬间共情。"
  },
  {
    id: "book",
    category: "阅读",
    title: "A Book Is a Door",
    en: "A book is a door to another world. Open it, and you can walk through centuries, cross oceans, and live a thousand lives. The reader who travels within pages is never really alone, and never really bored.",
    zh: "书是通往另一个世界的大门。打开它，你可以穿越几个世纪，跨越大洋，活上一千种人生。在书页间旅行的人，永远不会真正孤独，也永远不会真正无聊。",
    appreciation: "'A book is a door' 开门见山；'live a thousand lives' 夸张手法凸显阅读的魔力。"
  },
  {
    id: "today",
    category: "励志",
    title: "The Power of Today",
    en: "Yesterday is a memory, tomorrow is a mystery, and today is a gift. That is why we call it the present. Do not waste the present worrying about the past or the future. Act today. Love today. Live today.",
    zh: "昨天是记忆，明天是谜团，今天是一份礼物——所以我们叫它“现在”（the present）。不要浪费现在去忧虑过去或未来。今天行动，今天去爱，今天去生活。",
    appreciation: "文字游戏（present 双关“礼物”和“现在”）是全篇点睛之笔；三组排比（Act/Love/Live today）朗朗上口。"
  },
  {
    id: "silence",
    category: "哲思",
    title: "The Value of Silence",
    en: "Not every question needs an answer, and not every silence needs to be filled. In silence, we hear our own thoughts. In stillness, we find our own direction. Learn to be comfortable with quiet moments; they are often when we grow the most.",
    zh: "不是每个问题都需要答案，不是每段沉默都需要填补。在沉默中，我们听见自己的心声；在静止中，我们找到自己的方向。学会享受安静的时刻，那往往是我们成长最多的时候。",
    appreciation: "对偶结构（In silence...In stillness...）工整优美；'not every...needs' 双重否定让步，哲理深远。"
  },
  {
    id: "home",
    category: "情感",
    title: "Home Is Where the Heart Is",
    en: "Home is not a place on a map. It is the smell of your mother's cooking, the sound of your family's laughter, and the feeling of safety when you close the door. You can travel to the ends of the earth, but home will always be waiting in your heart.",
    zh: "家不是地图上的一个地点，而是母亲做饭的香味、家人的笑声，以及关上门时的安全感。你可以走到天涯海角，但家永远在你的心里等待。",
    appreciation: "'Home is not...It is...' 定义式开头；从嗅觉、听觉到感觉的感官描写，画面感极强。"
  },
  {
    id: "hope",
    category: "励志",
    title: "Hold On to Hope",
    en: "Hope is the small flame that keeps burning even when the night is long. It does not promise an easy road, but it promises a light at the end of it. As long as you keep hope alive, no storm can truly defeat you.",
    zh: "希望是长夜里依然燃烧的小火焰。它不承诺道路平坦，但承诺路尽头有光。只要希望不灭，就没有风暴能真正击败你。",
    appreciation: "'hope is the small flame' 隐喻温暖有力；'a light at the end' 与结尾 'no storm can defeat you' 呼应，形成闭环。"
  }
];
