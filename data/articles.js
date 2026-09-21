// ===== Pathfinder 英语文章阅读库 =====
// 每篇：id/topic/title/difficulty/intro/paras[{en, zh}]/vocab[{w, m, e}]
const ARTICLES = [
  {
    id: "ai_future",
    topic: "科技",
    title: "How Artificial Intelligence Is Changing Our Daily Lives",
    difficulty: "中级",
    intro: "人工智能如何改变我们的日常生活",
    paras: [
      { en: "Artificial intelligence, once the stuff of science fiction, has quietly become part of our everyday lives. From the moment we unlock our phones with facial recognition to the suggestions we receive on video platforms, AI is working behind the scenes.", zh: "人工智能，曾经只存在于科幻小说中，如今已悄然成为我们日常生活的一部分。从用面部识别解锁手机，到视频平台上收到的推荐，AI 一直在幕后工作。" },
      { en: "One of the most visible uses of AI is in voice assistants. They can answer questions, set alarms, play music, and even control smart home devices. With each interaction, these systems learn more about our preferences and become more helpful.", zh: "AI 最明显的用途之一是语音助手。它们能回答问题、设置闹钟、播放音乐，甚至控制智能家居设备。每经过一次交互，这些系统就更加了解我们的偏好，变得更有帮助。" },
      { en: "In the field of healthcare, AI is helping doctors analyze medical images more quickly and accurately. It can detect early signs of diseases that might be missed by the human eye, potentially saving countless lives.", zh: "在医疗领域，AI 正在帮助医生更快、更准确地分析医学影像。它能发现人眼可能遗漏的疾病早期迹象，有潜力挽救无数生命。" },
      { en: "However, the rise of AI also brings challenges. Privacy concerns, the risk of job displacement, and questions about bias in algorithms are important issues we must address as a society.", zh: "然而，AI 的兴起也带来了挑战。隐私问题、失业风险以及算法偏见问题，都是我们作为社会必须面对的重要议题。" },
      { en: "The key is not to fear technology, but to use it wisely. By understanding both the benefits and the risks, we can ensure that AI serves humanity rather than the other way around.", zh: "关键在于不要畏惧技术，而要明智地使用它。通过理解收益与风险，我们才能确保 AI 服务人类，而不是反过来。" }
    ],
    vocab: [
      { w: "recognition", m: "识别；认可", e: "facial recognition 面部识别" },
      { w: "behind the scenes", m: "在幕后", e: "work behind the scenes 幕后工作" },
      { w: "interaction", m: "互动；交互", e: "human-computer interaction 人机交互" },
      { w: "analyze", m: "分析", e: "analyze data 分析数据" },
      { w: "displacement", m: "取代；移位", e: "job displacement 岗位流失" },
      { w: "bias", m: "偏见", e: "algorithmic bias 算法偏见" },
      { w: "address", m: "处理；解决", e: "address a problem 解决问题" },
      { w: "countless", m: "无数的", e: "countless opportunities 无数机会" },
      { w: "potential", m: "潜力；潜在的", e: "realize one's potential 发挥潜力" },
      { w: "serve", m: "服务", e: "serve the community 服务社区" }
    ]
  },
  {
    id: "reading_habit",
    topic: "文化",
    title: "The Joy of Reading: Why Books Still Matter",
    difficulty: "中级",
    intro: "阅读的乐趣：为什么书籍仍然重要",
    paras: [
      { en: "In an age of short videos and endless scrolling, picking up a book can feel almost revolutionary. Yet reading remains one of the most powerful ways to learn, think, and grow.", zh: "在短视频和无尽刷屏的时代，捧起一本书几乎成了一种反叛。然而阅读依然是学习、思考和成长最有力的方式之一。" },
      { en: "Reading exercises the mind in ways that passive media cannot. When we read, we must imagine scenes, follow complex plots, and connect ideas. This active engagement strengthens our ability to focus and think critically.", zh: "阅读以被动媒体无法做到的方式锻炼大脑。当我们阅读时，必须想象场景、跟随复杂情节、串联思想。这种主动参与强化了我们专注和批判性思考的能力。" },
      { en: "Books also offer us a window into other lives and cultures. Through stories, we can walk in someone else's shoes, understanding experiences vastly different from our own. This builds empathy, a quality our world desperately needs.", zh: "书籍也为我们打开了解他人生活与文化之窗。通过故事，我们能设身处地，理解与自身迥异的经历。这培养了同理心——我们的世界迫切需要这种品质。" },
      { en: "Perhaps the greatest gift of reading is that it never ends. There is always another book waiting, another idea to explore. The more we read, the more we realize how much there is to know.", zh: "也许阅读最大的礼物是它永不终结。总会有下一本书等待，总会有新的思想待探索。我们读得越多，就越意识到未知的浩瀚。" },
      { en: "So if you have not opened a book in a while, consider giving yourself a few minutes each day. Start small, stay curious, and let the pages turn.", zh: "所以，如果你已经很久没有打开一本书，不妨每天给自己几分钟。从小处开始，保持好奇，让书页翻动起来。" }
    ],
    vocab: [
      { w: "revolutionary", m: "革命性的", e: "a revolutionary idea 革命性想法" },
      { w: "passive", m: "被动的", e: "passive learning 被动学习" },
      { w: "engagement", m: "参与；投入", e: "active engagement 主动参与" },
      { w: "critically", m: "批判性地", e: "think critically 批判性思考" },
      { w: "empathy", m: "同理心", e: "show empathy 展现同理心" },
      { w: "desperately", m: "极度地；拼命地", e: "desperately need 迫切需要" },
      { w: "vastly", m: "极大地", e: "vastly different 截然不同" },
      { w: "explore", m: "探索", e: "explore new ideas 探索新思想" },
      { w: "curious", m: "好奇的", e: "stay curious 保持好奇" },
      { w: "window", m: "窗口；渠道", e: "a window into the world 了解世界的窗口" }
    ]
  },
  {
    id: "healthy_life",
    topic: "健康",
    title: "Small Habits, Big Changes: Building a Healthier Life",
    difficulty: "初级",
    intro: "小习惯，大改变：建立更健康的生活",
    paras: [
      { en: "Many people believe that getting healthy requires a dramatic change. In reality, the most lasting improvements come from small, consistent habits.", zh: "许多人认为变健康需要巨大改变。事实上，最持久的改善来自微小而持续的习惯。" },
      { en: "Start with your sleep. Going to bed and waking up at the same time every day helps your body build a natural rhythm. Even thirty minutes of extra sleep can improve your mood and energy.", zh: "从睡眠开始。每天在同一时间睡觉和起床，帮助身体建立自然节律。哪怕多睡三十分钟，也能改善情绪和精力。" },
      { en: "Next, think about what you drink. Replacing sugary drinks with water is one of the simplest changes you can make. Your body will thank you, and you will save money too.", zh: "其次，想想你喝的东西。用白水代替含糖饮料，是你能做出的最简单改变之一。你的身体会感谢你，你还能省钱。" },
      { en: "Movement does not have to mean going to the gym. A daily ten-minute walk after dinner, taking the stairs instead of the elevator, or stretching at your desk all count.", zh: "运动不等于去健身房。晚饭后每天散步十分钟、走楼梯代替电梯、在办公桌前拉伸，这些都算。" },
      { en: "Remember, perfection is not the goal. Progress is. One healthy choice at a time, repeated daily, will lead you further than you ever imagined.", zh: "记住，完美不是目标，进步才是。一次一个健康的选择，日复一日地重复，会带你走得更远，超乎你的想象。" }
    ],
    vocab: [
      { w: "dramatic", m: "剧烈的；戏剧性的", e: "a dramatic change 巨大变化" },
      { w: "consistent", m: "一致的；持续的", e: "consistent effort 持续努力" },
      { w: "rhythm", m: "节奏；节律", e: "body rhythm 身体节律" },
      { w: "mood", m: "情绪", e: "improve one's mood 改善情绪" },
      { w: "replace", m: "替换", e: "replace A with B 用B替换A" },
      { w: "sugary", m: "含糖的", e: "sugary drinks 含糖饮料" },
      { w: "elevator", m: "电梯", e: "take the elevator 乘电梯" },
      { w: "stretch", m: "伸展", e: "stretch your legs 伸展双腿" },
      { w: "perfection", m: "完美", e: "pursue perfection 追求完美" },
      { w: "progress", m: "进步", e: "make progress 取得进步" }
    ]
  },
  {
    id: "city_life",
    topic: "社会",
    title: "The City That Never Sleeps: Life in Modern Metropolises",
    difficulty: "中级",
    intro: "不夜城：现代大都市的生活",
    paras: [
      { en: "Cities have always been magnets for people seeking opportunity. Today, more than half of the world's population lives in urban areas, and that number keeps growing.", zh: "城市一直是寻求机遇者的磁石。如今，世界一半以上的人口居住在城市地区，而且这个数字还在增长。" },
      { en: "What makes a city truly livable? Good public transportation, affordable housing, clean air, and green spaces all matter. But perhaps most important are the connections between people.", zh: "什么让一座城市真正宜居？良好的公共交通、可负担的住房、清洁的空气和绿地都很重要。但也许最重要的是人与人之间的联系。" },
      { en: "City life offers incredible variety. In a single day, you might visit a museum, eat food from three different countries, and attend a concert in the evening. The possibilities seem endless.", zh: "城市生活提供了令人难以置信的多样性。在一天之内，你可能参观博物馆、品尝三个不同国家的美食、晚上去听音乐会。可能性似乎无穷无尽。" },
      { en: "Yet cities also face serious challenges. Traffic congestion, noise, loneliness, and the high cost of living can make urban life stressful. Finding balance is the key.", zh: "然而城市也面临严峻挑战。交通拥堵、噪音、孤独和高生活成本会让都市生活充满压力。找到平衡是关键。" },
      { en: "Despite the difficulties, the energy of a city is hard to resist. For many, the crowds and the lights are not a burden but a promise — a promise of opportunity, connection, and life.", zh: "尽管困难重重，城市的活力仍难以抗拒。对许多人来说，人群和灯火不是负担，而是一种承诺——关于机遇、联系与生活的承诺。" }
    ],
    vocab: [
      { w: "magnet", m: "磁铁；有吸引力的事物", e: "a magnet for talent 人才的磁石" },
      { w: "urban", m: "城市的", e: "urban areas 城市地区" },
      { w: "livable", m: "宜居的", e: "a livable city 宜居城市" },
      { w: "affordable", m: "负担得起的", e: "affordable housing 可负担住房" },
      { w: "variety", m: "多样性", e: "a variety of options 多种选择" },
      { w: "congestion", m: "拥堵", e: "traffic congestion 交通拥堵" },
      { w: "stressful", m: "有压力的", e: "a stressful job 有压力的工作" },
      { w: "resist", m: "抵抗；抗拒", e: "resist temptation 抵制诱惑" },
      { w: "burden", m: "负担", e: "a heavy burden 沉重的负担" },
      { w: "endless", m: "无尽的", e: "endless possibilities 无限可能" }
    ]
  },
  {
    id: "money_smart",
    topic: "经济",
    title: "Money Smart: Simple Steps to Better Financial Health",
    difficulty: "初级",
    intro: "聪明的理财：改善财务健康的小步骤",
    paras: [
      { en: "Managing money does not have to be complicated. In fact, the basics are simple enough for anyone to learn, no matter their income.", zh: "理财不一定要复杂。事实上，基础内容简单到任何人都能学会，无论收入多少。" },
      { en: "The first rule is to spend less than you earn. Track your expenses for a month, and you will quickly see where your money goes. Small expenses, like daily coffee or snacks, add up faster than you think.", zh: "第一条规则是支出少于收入。记录一个月的开销，你会很快看清钱花在哪里。小额支出，比如每天的咖啡或零食，累积起来比想象中快得多。" },
      { en: "The second rule is to save first, spend later. When you receive your income, put a portion into savings before you pay for anything else. Even ten percent makes a difference over time.", zh: "第二条规则是先储蓄、后消费。拿到收入时，先拿出一部分存起来，再去支付其他东西。即使百分之十，长期下来也会产生巨大差异。" },
      { en: "Third, build an emergency fund. Life is unpredictable, and having three to six months of expenses saved can protect you when unexpected situations arise.", zh: "第三，建立应急基金。生活充满变数，存下三到六个月的开销，能在意外情况出现时保护你。" },
      { en: "Finally, invest in yourself. Learning new skills and improving your health are investments that pay the highest returns. Money is a tool, and a wise person uses it to build a better life.", zh: "最后，投资自己。学习新技能、改善健康，是回报最高的投资。金钱是工具，智者用它来建设更好的生活。" }
    ],
    vocab: [
      { w: "complicated", m: "复杂的", e: "a complicated process 复杂的过程" },
      { w: "income", m: "收入", e: "monthly income 月收入" },
      { w: "expense", m: "支出；开销", e: "living expenses 生活开销" },
      { w: "portion", m: "一部分", e: "a portion of the money 一部分钱" },
      { w: "emergency", m: "紧急情况", e: "emergency fund 应急基金" },
      { w: "unpredictable", m: "不可预测的", e: "unpredictable weather 变化无常的天气" },
      { w: "unexpected", m: "意外的", e: "unexpected costs 意外开支" },
      { w: "investment", m: "投资", e: "a wise investment 明智的投资" },
      { w: "return", m: "回报；收益", e: "high returns 高回报" },
      { w: "wise", m: "明智的", e: "a wise decision 明智的决定" }
    ]
  },
  {
    id: "learning_english",
    topic: "教育",
    title: "How to Learn English: A Practical Guide",
    difficulty: "初级",
    intro: "如何学英语：一份实用指南",
    paras: [
      { en: "Learning a language is a journey, not a race. The most successful learners are not necessarily the most talented; they are the most consistent.", zh: "学语言是一场旅程，而不是比赛。最成功的学习者不一定最有天赋，而是最持之以恒。" },
      { en: "Start with input. Listen to English songs, watch shows with subtitles, and read things you genuinely enjoy. When the material is interesting, learning happens naturally.", zh: "从输入开始。听英文歌，看带字幕的节目，读你真正感兴趣的内容。当材料有趣时，学习就自然发生了。" },
      { en: "Do not be afraid to speak, even with mistakes. Every error is a step toward improvement. Find a language partner, or simply practice speaking to yourself in front of the mirror.", zh: "不要害怕开口，即使犯错。每一个错误都是迈向进步的一步。找一个语伴，或者干脆对着镜子自己练习。" },
      { en: "Build vocabulary in context. Instead of memorizing isolated word lists, learn words in sentences. This helps you understand how they are actually used.", zh: "在语境中积累词汇。与其背孤立的单词表，不如在句子里学单词。这能帮你理解它们的实际用法。" },
      { en: "Set small, achievable goals. Learn five new words a day, read one article a week, have one conversation a month. Before you know it, you will look back and see how far you have come.", zh: "设定小而可实现的目标。每天学五个新词，每周读一篇文章，每月进行一次对话。不知不觉间，回望时你会发现已经走了多远。" }
    ],
    vocab: [
      { w: "talented", m: "有天赋的", e: "a talented musician 有天赋的音乐家" },
      { w: "consistent", m: "坚持的；一致的", e: "consistent practice 坚持练习" },
      { w: "input", m: "输入", e: "language input 语言输入" },
      { w: "subtitle", m: "字幕", e: "watch with subtitles 带字幕观看" },
      { w: "genuinely", m: "真正地", e: "genuinely interested 真正感兴趣" },
      { w: "error", m: "错误", e: "learn from errors 从错误中学习" },
      { w: "isolated", m: "孤立的", e: "isolated words 孤立的单词" },
      { w: "context", m: "语境；上下文", e: "in context 在语境中" },
      { w: "achievable", m: "可实现的", e: "achievable goals 可实现的目标" },
      { w: "look back", m: "回顾", e: "look back on the past 回顾过去" }
    ]
  },
  {
    id: "internet_friends",
    topic: "科技",
    title: "Digital Friends: Making Connections in the Online World",
    difficulty: "中级",
    intro: "数字时代的朋友：在线世界中的连接",
    paras: [
      { en: "The internet has changed the way we make friends. Twenty years ago, your friends were likely people you met at school or work. Today, meaningful friendships can begin with a single comment on a video or a shared interest in an online community.", zh: "互联网改变了我们交朋友的方式。二十年前，你的朋友很可能是学校或工作中认识的人。如今，一段有意义的友谊可以从视频下的一条评论，或在线社区中的共同兴趣开始。" },
      { en: "Online friendships offer unique benefits. They connect us with people from different countries and cultures, expanding our view of the world. Distance is no longer a barrier to understanding.", zh: "网络友谊提供了独特的益处。它让我们与不同国家和文化的人相连，拓宽我们对世界的看法。距离不再是理解的障碍。" },
      { en: "However, digital connections come with their own challenges. Without body language and tone of voice, messages can be easily misunderstood. It takes extra care to communicate clearly and kindly online.", zh: "然而，数字连接也有自己的挑战。没有肢体语言和语调，消息很容易被误解。在线交流时，需要格外小心地清晰、友善地表达。" },
      { en: "Experts suggest balancing online and offline life. While chatting online is wonderful, meeting people in person, even for a video call, deepens the relationship in ways text cannot.", zh: "专家建议平衡线上与线下生活。虽然网上聊天很棒，但面对面见面，哪怕只是视频通话，也能以文字无法做到的方式加深关系。" },
      { en: "In the end, whether online or offline, friendship is about trust, respect, and time. Technology only provides the bridge; we build the relationship.", zh: "归根结底，无论线上还是线下，友谊关乎信任、尊重与时间。技术只是提供了桥梁，关系要靠我们自己经营。" }
    ],
    vocab: [
      { w: "meaningful", m: "有意义的", e: "a meaningful friendship 有意义的友谊" },
      { w: "community", m: "社区；社群", e: "an online community 在线社群" },
      { w: "expand", m: "扩展", e: "expand one's horizons 开阔视野" },
      { w: "barrier", m: "障碍", e: "a language barrier 语言障碍" },
      { w: "body language", m: "肢体语言", e: "read body language 解读肢体语言" },
      { w: "misunderstand", m: "误解", e: "misunderstand a message 误解消息" },
      { w: "communicate", m: "沟通", e: "communicate clearly 清晰沟通" },
      { w: "deepen", m: "加深", e: "deepen the relationship 加深关系" },
      { w: "balance", m: "平衡", e: "balance work and life 平衡工作与生活" },
      { w: "bridge", m: "桥梁", e: "build a bridge 架起桥梁" }
    ]
  },
  {
    id: "travel_benefits",
    topic: "社会",
    title: "Why Travel Broadens the Mind",
    difficulty: "初级",
    intro: "为什么旅行开阔心灵",
    paras: [
      { en: "Everyone talks about the joy of travel, but travel does more than entertain us. It teaches us lessons that classrooms cannot.", zh: "人人都谈论旅行的乐趣，但旅行的意义远不止娱乐。它教会我们课堂上学不到的东西。" },
      { en: "When you travel, you step out of your comfort zone. You must navigate unfamiliar streets, order food in a new language, and adapt to different customs. Each challenge makes you more confident and resourceful.", zh: "旅行时，你走出舒适区。你必须在陌生的街道上认路，用新的语言点餐，适应不同的风俗。每一个挑战都让你更加自信、更加机智。" },
      { en: "Travel also changes your perspective. Seeing how other people live helps you question your own assumptions and appreciate what you have. The world becomes bigger, and your problems seem smaller.", zh: "旅行也改变你的视角。看到他人的生活方式，帮你质疑自己的假设，珍惜自己所拥有的。世界变大了，你的烦恼似乎变小了。" },
      { en: "You do not need to travel far to gain these benefits. Exploring a new neighborhood in your own city, trying a new cuisine, or talking to someone from a different background can open your mind just as much.", zh: "你不需要走很远就能获得这些益处。探索自己城市里一个陌生的街区、尝试一种新美食，或与不同背景的人交谈，同样能打开你的心灵。" },
      { en: "The best souvenir you can bring back from any trip is not a postcard or a magnet, but a new way of seeing the world.", zh: "你能从任何旅行中带回的最好纪念品，不是明信片或磁贴，而是一种看待世界的新方式。" }
    ],
    vocab: [
      { w: "entertain", m: "娱乐；使快乐", e: "entertain guests 招待客人" },
      { w: "comfort zone", m: "舒适区", e: "step out of one's comfort zone 走出舒适区" },
      { w: "navigate", m: "导航；找到方向", e: "navigate the city 在城市中找路" },
      { w: "adapt", m: "适应", e: "adapt to new customs 适应新风俗" },
      { w: "resourceful", m: "足智多谋的", e: "a resourceful person 机智的人" },
      { w: "perspective", m: "视角；观点", e: "a new perspective 新视角" },
      { w: "assumption", m: "假设", e: "question assumptions 质疑假设" },
      { w: "appreciate", m: "感激；欣赏", e: "appreciate what you have 珍惜所有" },
      { w: "cuisine", m: "烹饪；菜肴", e: "local cuisine 当地美食" },
      { w: "souvenir", m: "纪念品", e: "buy souvenirs 买纪念品" }
    ]
  }
];
