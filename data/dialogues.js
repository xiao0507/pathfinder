// ===== Pathfinder 英语对话场景库 =====
// 结构：id/name/icon/desc/steps[]；每个 step：npc(英文), npcTr(中文), choices[]：reply(用户可选回复), replyTr, npcNext(对方下一句), npcNextTr
const DIALOGUE_SCENES = [
  {
    id: "shopping",
    name: "日常购物",
    icon: "🛒",
    desc: "在超市和商店购物",
    intro: "你在超市购物，店员走过来问候你。",
    introTr: "You are shopping at a supermarket, and the clerk comes over to greet you.",
    steps: [
      {
        npc: "Hello! Can I help you find anything today?",
        npcTr: "你好！今天需要我帮你找点什么吗？",
        choices: [
          { reply: "Yes, I'm looking for some fresh fruit.", replyTr: "是的，我在找一些新鲜水果。", npcNext: "Sure! The fruit section is right over there. The apples and oranges are on sale today.", npcNextTr: "没问题！水果区就在那边。今天的苹果和橙子在打折。" },
          { reply: "I'm just browsing, thanks.", replyTr: "我只是随便看看，谢谢。", npcNext: "No problem! Take your time. Let me know if you need anything.", npcNextTr: "没问题！慢慢逛，需要什么随时告诉我。" }
        ]
      },
      {
        npc: "Would you like a shopping basket or a cart?",
        npcTr: "您需要购物篮还是购物车？",
        choices: [
          { reply: "A basket is fine. I only need a few things.", replyTr: "篮子就好，我只买几样东西。", npcNext: "Here you go. The baskets are by the entrance.", npcNextTr: "给您，篮子放在入口处。" },
          { reply: "I'll take a cart. I have a long list.", replyTr: "我要购物车，我有一长串清单。", npcNext: "Good choice. There are carts available near the entrance.", npcNextTr: "好选择，入口处有购物车。" }
        ]
      },
      {
        npc: "Are you finding everything okay?",
        npcTr: "您找东西还顺利吗？",
        choices: [
          { reply: "Almost! Could you tell me where the dairy products are?", replyTr: "差不多了！你能告诉我乳制品在哪里吗？", npcNext: "They're in aisle 5, next to the bread section.", npcNextTr: "在5号通道，面包区旁边。" },
          { reply: "Yes, everything is going well, thank you.", replyTr: "是的，一切顺利，谢谢你。", npcNext: "Great! Enjoy your shopping.", npcNextTr: "太好了！祝您购物愉快。" }
        ]
      },
      {
        npc: "This register is open. Would you like to check out here?",
        npcTr: "这个收银台开着，您要在这里结账吗？",
        choices: [
          { reply: "Yes, please. Here is my stuff.", replyTr: "好的，这是我的东西。", npcNext: "That will be 35 dollars. Would you like a bag?", npcNextTr: "一共35美元，您需要袋子吗？" },
          { reply: "Sure. Do you accept credit cards?", replyTr: "好的，你们接受信用卡吗？", npcNext: "Of course, we accept all major credit cards.", npcNextTr: "当然，我们接受所有主要信用卡。" }
        ]
      },
      {
        npc: "That will be 35 dollars. Would you like a bag?",
        npcTr: "一共35美元，您需要袋子吗？",
        choices: [
          { reply: "Yes, one bag please. Here's the cash.", replyTr: "要一个袋子，这是现金。", npcNext: "Here's your change and your receipt. Have a nice day!", npcNextTr: "这是找零和收据，祝您今天愉快！" },
          { reply: "No bag, thanks. I'll pay by card.", replyTr: "不用袋子，谢谢，我刷卡。", npcNext: "Please swipe your card here. Done! Have a great day!", npcNextTr: "请在这里刷卡。好了！祝您愉快！" }
        ]
      }
    ]
  },
  {
    id: "restaurant",
    name: "餐厅点餐",
    icon: "🍽️",
    desc: "在餐厅点餐和买单",
    intro: "你走进一家餐厅，服务员过来招呼你。",
    introTr: "You walk into a restaurant, and the waiter comes to greet you.",
    steps: [
      {
        npc: "Good evening! A table for one?",
        npcTr: "晚上好！一个人用餐吗？",
        choices: [
          { reply: "Yes, a table for one, please.", replyTr: "是的，一个人的桌子。", npcNext: "Right this way. Here's the menu. Can I get you something to drink?", npcNextTr: "这边请。这是菜单，先来点喝的吗？" },
          { reply: "Actually, a table for two. My friend is coming.", replyTr: "其实是要两个人的桌子，我朋友马上到。", npcNext: "Of course. Follow me, please. Here's your menu.", npcNextTr: "当然，请跟我来。这是您的菜单。" }
        ]
      },
      {
        npc: "Can I get you something to drink?",
        npcTr: "先来点喝的吗？",
        choices: [
          { reply: "I'll have a glass of orange juice, please.", replyTr: "我要一杯橙汁。", npcNext: "Orange juice, coming right up. Would you like to order now?", npcNextTr: "橙汁马上来。现在要点餐吗？" },
          { reply: "Just water, please. I'm ready to order.", replyTr: "水就好，我准备好点餐了。", npcNext: "Great! What would you like for your main course?", npcNextTr: "好的！主菜想点什么呢？" }
        ]
      },
      {
        npc: "What would you like for your main course?",
        npcTr: "主菜想点什么呢？",
        choices: [
          { reply: "I'd like the grilled salmon, please.", replyTr: "我要香煎三文鱼。", npcNext: "Excellent choice! Would you like any sides with that?", npcNextTr: "好选择！需要配菜吗？" },
          { reply: "Could I have the steak, medium well?", replyTr: "我要牛排，七分熟。", npcNext: "Sure. The steak comes with fries and salad. Would you like that?", npcNextTr: "好的。牛排配有薯条和沙拉，这样可以吗？" }
        ]
      },
      {
        npc: "Would you like anything for dessert?",
        npcTr: "需要甜点吗？",
        choices: [
          { reply: "Yes, the chocolate cake looks delicious.", replyTr: "是的，巧克力蛋糕看起来很好吃。", npcNext: "One chocolate cake, coming up. I'll bring it with your coffee.", npcNextTr: "一份巧克力蛋糕，马上来，和您的咖啡一起上。" },
          { reply: "No dessert for me, thank you. Just the bill, please.", replyTr: "我不要甜点，谢谢，买单吧。", npcNext: "Sure, here's your bill. Would you like to pay by card or cash?", npcNextTr: "好的，这是账单。刷卡还是现金？" }
        ]
      },
      {
        npc: "How was your meal? Would you like the bill?",
        npcTr: "用餐还满意吗？需要买单吗？",
        choices: [
          { reply: "Everything was delicious! Could I have the bill, please?", replyTr: "都很好吃！请给我账单。", npcNext: "Glad you enjoyed it! That will be 28 dollars. Have a nice evening!", npcNextTr: "很高兴您喜欢！一共28美元，祝您晚上愉快！" },
          { reply: "It was great, thanks. Can I pay by card?", replyTr: "很棒，谢谢。可以刷卡吗？", npcNext: "Of course. I'll bring the card machine right away.", npcNextTr: "当然，我马上把刷卡机拿过来。" }
        ]
      }
    ]
  },
  {
    id: "airport",
    name: "机场问路",
    icon: "✈️",
    desc: "机场找登机口、值机",
    intro: "你在机场，找不到值机柜台，向工作人员询问。",
    introTr: "You are at the airport, can't find the check-in counter, and ask a staff member.",
    steps: [
      {
        npc: "Good morning! How can I help you today?",
        npcTr: "早上好！今天需要什么帮助吗？",
        choices: [
          { reply: "Hi! Where is the check-in counter for Air China?", replyTr: "你好！中国国际航空的值机柜台在哪里？", npcNext: "It's on the second floor, near gate A. You can see the signs upstairs.", npcNextTr: "在二楼A区附近，上楼就能看到指示牌。" },
          { reply: "I'm a bit lost. Could you help me find Terminal 2?", replyTr: "我有点迷路了，你能帮我找到2号航站楼吗？", npcNext: "Terminal 2 is to the left. Take the shuttle bus over there.", npcNextTr: "2号航站楼在左边，坐那边的摆渡车。" }
        ]
      },
      {
        npc: "May I see your passport and ticket, please?",
        npcTr: "请出示您的护照和机票。",
        choices: [
          { reply: "Here you go. I have one piece of luggage to check in.", replyTr: "给您。我有一件行李要托运。", npcNext: "Thank you. Your luggage is 23 kilograms, that's fine. Here's your boarding pass.", npcNextTr: "谢谢，您的行李23公斤，没问题。这是您的登机牌。" },
          { reply: "Sure, here they are. I have a window seat preference if possible.", replyTr: "好的，给您。如果可以的话，我偏好靠窗座位。", npcNext: "Let me check... Yes, I can give you a window seat. Here's your boarding pass.", npcNextTr: "让我查一下……可以，我给您安排了靠窗座位。这是您的登机牌。" }
        ]
      },
      {
        npc: "Your flight boards at gate 15. Do you know where to go?",
        npcTr: "您的航班在15号登机口登机，您知道怎么走吗？",
        choices: [
          { reply: "Could you point me in the right direction?", replyTr: "你能给我指个方向吗？", npcNext: "Go straight, turn right at the coffee shop, and gate 15 is at the end of the hall.", npcNextTr: "直走，在咖啡店右转，15号登机口就在大厅尽头。" },
          { reply: "Yes, I saw the sign. Thanks for your help!", replyTr: "是的，我看到指示牌了，谢谢你的帮助！", npcNext: "You're welcome! Have a safe flight!", npcNextTr: "不客气！祝您旅途愉快！" }
        ]
      },
      {
        npc: "Boarding will start in 30 minutes. Anything else?",
        npcTr: "登机30分钟后开始，还有其他需要吗？",
        choices: [
          { reply: "Where can I get some coffee nearby?", replyTr: "附近哪里能买到咖啡？", npcNext: "There's a café right next to gate 15. Enjoy your coffee!", npcNextTr: "15号登机口旁边就有一家咖啡馆，享用你的咖啡吧！" },
          { reply: "No, that's all. Thank you very much!", replyTr: "没有了，非常感谢！", npcNext: "My pleasure. Have a wonderful journey!", npcNextTr: "不客气，祝您旅途愉快！" }
        ]
      }
    ]
  },
  {
    id: "interview",
    name: "面试求职",
    icon: "💼",
    desc: "求职面试常见问答",
    intro: "你在参加一场英文求职面试。",
    introTr: "You are attending an English job interview.",
    steps: [
      {
        npc: "Welcome! Please introduce yourself briefly.",
        npcTr: "欢迎！请简单介绍一下自己。",
        choices: [
          { reply: "I'm a recent graduate with a degree in computer science. I'm passionate about software development.", replyTr: "我是计算机科学专业应届毕业生，对软件开发充满热情。", npcNext: "Great! What attracted you to our company?", npcNextTr: "很好！我们公司吸引你的地方是什么？" },
          { reply: "I have five years of experience in marketing. I love creating campaigns that connect with people.", replyTr: "我有五年市场营销经验，喜欢做打动人的营销活动。", npcNext: "Impressive. Why do you want to join us?", npcNextTr: "很不错。你为什么想加入我们？" }
        ]
      },
      {
        npc: "What are your greatest strengths?",
        npcTr: "你最大的优势是什么？",
        choices: [
          { reply: "I'm a quick learner and I work well in teams. I always try to improve my skills.", replyTr: "我学习能力强，善于团队合作，总是努力提升自己。", npcNext: "Can you give me an example of working in a team?", npcNextTr: "你能举个例子说明团队合作吗？" },
          { reply: "I'm very organized and detail-oriented. I always meet my deadlines.", replyTr: "我非常有条理、注重细节，总能按时完成任务。", npcNext: "That's important. How do you handle pressure?", npcNextTr: "这很重要。你如何应对压力？" }
        ]
      },
      {
        npc: "How do you handle pressure at work?",
        npcTr: "你如何应对工作中的压力？",
        choices: [
          { reply: "I make a to-do list and prioritize tasks. Taking short breaks also helps me stay focused.", replyTr: "我会列待办清单，分清主次。适当休息也有助于保持专注。", npcNext: "Good strategy. Where do you see yourself in five years?", npcNextTr: "不错的策略。你五年后的规划是什么？" },
          { reply: "I stay calm and break big problems into small steps. Exercise helps me release stress.", replyTr: "我保持冷静，把大问题拆成小步骤。运动帮我释放压力。", npcNext: "Very mature. Where do you see yourself in five years?", npcNextTr: "很成熟。你五年后的规划是什么？" }
        ]
      },
      {
        npc: "Where do you see yourself in five years?",
        npcTr: "你五年后有什么规划？",
        choices: [
          { reply: "I hope to grow into a senior role and take on more responsibility in projects.", replyTr: "我希望成长为高级职位，在项目中承担更多责任。", npcNext: "That sounds ambitious. Do you have any questions for us?", npcNextTr: "听起来很有抱负。你有什么问题要问我们吗？" },
          { reply: "I'd like to become an expert in my field and help mentor junior colleagues.", replyTr: "我想成为所在领域的专家，并帮助指导新同事。", npcNext: "We value that mindset. Any questions for us?", npcNextTr: "我们很看重这种心态。你有什么问题要问吗？" }
        ]
      },
      {
        npc: "Do you have any questions for us?",
        npcTr: "你有什么问题要问我们吗？",
        choices: [
          { reply: "Yes, what does a typical day look like in this role?", replyTr: "有的，这个职位一天通常是怎么样的？", npcNext: "Great question. You'd be collaborating with the product team and writing clean, testable code.", npcNextTr: "好问题。你会与产品团队协作，编写整洁、可测试的代码。" },
          { reply: "What is the team culture like here?", replyTr: "这里的团队文化是什么样的？", npcNext: "We're collaborative and supportive. We have weekly knowledge-sharing sessions.", npcNextTr: "我们很协作、相互支持，每周有知识分享会。" }
        ]
      }
    ]
  },
  {
    id: "academic",
    name: "学术交流",
    icon: "🎓",
    desc: "学术会议与论文交流",
    intro: "你在学术会议休息区与一位研究者交谈。",
    introTr: "You are chatting with a researcher at an academic conference break.",
    steps: [
      {
        npc: "Hi! I saw your presentation earlier. It was very interesting.",
        npcTr: "你好！我刚才看了你的报告，非常有意思。",
        choices: [
          { reply: "Thank you! I'm glad you enjoyed it. What did you find most interesting?", replyTr: "谢谢！很高兴你喜欢。你觉得最有趣的部分是什么？", npcNext: "I was fascinated by your data analysis method. Could you share more about it?", npcNextTr: "我对你的数据分析方法很着迷，能多讲讲吗？" },
          { reply: "Thanks! Are you also working in this field?", replyTr: "谢谢！你也做这个领域的研究吗？", npcNext: "Yes, I focus on machine learning applications in education.", npcNextTr: "是的，我研究机器学习在教育中的应用。" }
        ]
      },
      {
        npc: "What's the main contribution of your research?",
        npcTr: "你的研究主要贡献是什么？",
        choices: [
          { reply: "We proposed a new framework that improves model accuracy by 15% while reducing computation.", replyTr: "我们提出了一个新框架，在降低计算量的同时将模型准确率提高了15%。", npcNext: "That's impressive! How did you validate the results?", npcNextTr: "太厉害了！你们是如何验证结果的？" },
          { reply: "Our work focuses on making AI more interpretable for real-world decision making.", replyTr: "我们的工作重点是让AI在现实决策中更可解释。", npcNext: "Interpretability is a hot topic. What challenges did you face?", npcNextTr: "可解释性是个热门话题，你们遇到了什么挑战？" }
        ]
      },
      {
        npc: "How did you validate your results?",
        npcTr: "你们是如何验证结果的？",
        choices: [
          { reply: "We ran experiments on three benchmark datasets and did extensive cross-validation.", replyTr: "我们在三个基准数据集上做了实验，并进行了充分的交叉验证。", npcNext: "Very thorough. Would you consider collaborating on a joint project?", npcNextTr: "非常严谨。你考虑过合作开展一个联合项目吗？" },
          { reply: "We compared our approach with five state-of-the-art baselines and did ablation studies.", replyTr: "我们与五个最先进的基线方法做了对比，并做了消融研究。", npcNext: "Solid methodology. Let's exchange contact details!", npcNextTr: "方法论很扎实，我们交换一下联系方式吧！" }
        ]
      },
      {
        npc: "Would you like to grab a coffee and continue our discussion?",
        npcTr: "要不要喝杯咖啡继续聊聊？",
        choices: [
          { reply: "Sure! That would be great. Let's go to the café.", replyTr: "当然！太好了，我们去咖啡馆吧。", npcNext: "Perfect. The coffee here is excellent, by the way.", npcNextTr: "太好了，顺便说一句，这里的咖啡很棒。" },
          { reply: "I'd love to, but I have a workshop in 15 minutes. Maybe later?", replyTr: "我很想，但15分钟后有个工作坊，晚点可以吗？", npcNext: "No problem! Let's catch up during the poster session later.", npcNextTr: "没问题！我们晚点在海报展示环节再聊。" }
        ]
      }
    ]
  },
  {
    id: "travel",
    name: "旅行出游",
    icon: "🗺️",
    desc: "问路、订票、景点咨询",
    intro: "你在旅行中，向当地人询问景点和交通。",
    introTr: "You are traveling and asking a local about attractions and transportation.",
    steps: [
      {
        npc: "Hello! Are you looking for something?",
        npcTr: "你好！你在找什么吗？",
        choices: [
          { reply: "Hi! How do I get to the city museum from here?", replyTr: "你好！从这里怎么去市博物馆？", npcNext: "You can take Bus 12 and get off at the third stop. It's a five-minute walk from there.", npcNextTr: "你可以坐12路公交，第三站下车，再走五分钟就到。" },
          { reply: "What's the best way to see the old town?", replyTr: "游览老城区最好的方式是什么？", npcNext: "I'd recommend walking. All the sights are close together, and there's a free walking tour at 10 AM.", npcNextTr: "我建议步行，所有景点都很近，上午10点还有免费徒步游。" }
        ]
      },
      {
        npc: "Where are you visiting from?",
        npcTr: "你从哪里来旅游？",
        choices: [
          { reply: "I'm from China. This is my first time in your city.", replyTr: "我来自中国，这是我第一次来你们城市。", npcNext: "Welcome! You'll love it here. Make sure to try the local food.", npcNextTr: "欢迎！你会爱上这里的，一定要尝尝当地美食。" },
          { reply: "I'm from Shanghai. I heard your city is beautiful in autumn.", replyTr: "我来自上海，听说你们城市秋天很美。", npcNext: "It definitely is! The leaves turn golden in October.", npcNextTr: "确实很美！十月树叶就变金黄了。" }
        ]
      },
      {
        npc: "Are you staying long in the city?",
        npcTr: "你会在城里待很久吗？",
        choices: [
          { reply: "Just three days. What would you recommend I not miss?", replyTr: "只待三天，有什么推荐必看的吗？", npcNext: "Definitely the sunset at the harbor and the night market. Both are amazing!", npcNextTr: "一定要看海港日落和夜市，两个都很棒！" },
          { reply: "About a week. I want to explore slowly.", replyTr: "大约一周，我想慢慢逛。", npcNext: "That's a good pace. The old town has many hidden cafés and galleries.", npcNextTr: "这个节奏很好，老城区有很多隐藏的咖啡馆和画廊。" }
        ]
      },
      {
        npc: "Is there anything else I can help you with?",
        npcTr: "还有什么我能帮你的吗？",
        choices: [
          { reply: "Where can I buy tickets for the boat tour?", replyTr: "在哪里能买到游船票？", npcNext: "At the tourist center by the harbor. They're open until 6 PM.", npcNextTr: "在海港旁边的游客中心，营业到下午6点。" },
          { reply: "No, that's all. Thank you so much for your help!", replyTr: "没有了，非常感谢你的帮助！", npcNext: "You're welcome! Have a wonderful trip!", npcNextTr: "不客气！祝你旅途愉快！" }
        ]
      }
    ]
  },
  {
    id: "hotel",
    name: "酒店入住",
    icon: "🏨",
    desc: "办理入住、客房服务",
    intro: "你到酒店前台办理入住。",
    introTr: "You arrive at the hotel front desk to check in.",
    steps: [
      {
        npc: "Good afternoon! Welcome to our hotel. How can I assist you?",
        npcTr: "下午好！欢迎光临我们酒店，有什么可以帮您？",
        choices: [
          { reply: "I have a reservation under the name Li Wei.", replyTr: "我用李伟的名字预订了房间。", npcNext: "Let me check... Yes, I found it. A standard room for three nights. May I see your passport?", npcNextTr: "让我查一下……找到了，标准间三晚。请出示护照。" },
          { reply: "Do you have any rooms available for tonight?", replyTr: "今晚还有空房吗？", npcNext: "Let me check our availability... Yes, we have a deluxe room available.", npcNextTr: "让我查一下空房……有的，还有一间豪华房。" }
        ]
      },
      {
        npc: "How would you like to pay, by card or cash?",
        npcTr: "您刷卡还是付现金？",
        choices: [
          { reply: "I'll pay by card, please.", replyTr: "我刷卡。", npcNext: "Certainly. Here's your key card. Your room is 802 on the eighth floor.", npcNextTr: "好的，这是您的房卡，房间在8楼802。" },
          { reply: "Cash, please. Can I pay for all nights now?", replyTr: "现金，我能把几晚都付了吗？", npcNext: "Of course. That will be 450 dollars in total. Here's your key card, room 802.", npcNextTr: "当然，一共450美元。这是您的房卡，802房间。" }
        ]
      },
      {
        npc: "What time is breakfast served?",
        npcTr: "早餐几点供应？",
        choices: [
          { reply: "Breakfast is served from 6:30 to 10:00 on the second floor.", replyTr: "早餐6点半到10点在二楼供应。", npcNext: "Also, the gym is open 24 hours on the third floor.", npcNextTr: "另外，健身房在三楼，24小时开放。" },
          { reply: "Is the pool available during the day?", replyTr: "游泳池白天开放吗？", npcNext: "Yes, the pool is open from 7 AM to 9 PM.", npcNextTr: "是的，游泳池早上7点到晚上9点开放。" }
        ]
      },
      {
        npc: "Would you like a wake-up call in the morning?",
        npcTr: "早上需要叫醒服务吗？",
        choices: [
          { reply: "Yes, please. Could you call me at 7 AM?", replyTr: "需要，请在早上7点叫我。", npcNext: "Certainly, 7 AM it is. Anything else I can do for you?", npcNextTr: "好的，7点叫醒。还有其他需要吗？" },
          { reply: "No, thank you. I'll set my own alarm.", replyTr: "不用了，谢谢，我自己设闹钟。", npcNext: "Understood. Enjoy your stay!", npcNextTr: "好的，祝您入住愉快！" }
        ]
      },
      {
        npc: "Is everything satisfactory with your room?",
        npcTr: "房间还满意吗？",
        choices: [
          { reply: "The room is lovely! But could I have an extra pillow?", replyTr: "房间很好！能再加一个枕头吗？", npcNext: "Of course, I'll send one up right away.", npcNextTr: "当然，我马上让人送上去。" },
          { reply: "Yes, everything is perfect. Thank you!", replyTr: "是的，一切都很完美，谢谢！", npcNext: "Great to hear! Please call us if you need anything at all.", npcNextTr: "很高兴听到！有任何需要请随时打电话。" }
        ]
      }
    ]
  },
  {
    id: "hospital",
    name: "医院就诊",
    icon: "🏥",
    desc: "挂号、看诊、取药",
    intro: "你不舒服，去医院看医生。",
    introTr: "You don't feel well and go to see a doctor at the hospital.",
    steps: [
      {
        npc: "Good morning. What seems to be the problem?",
        npcTr: "早上好，你哪里不舒服？",
        choices: [
          { reply: "I've had a headache and a fever since last night.", replyTr: "我从昨晚开始头疼、发烧。", npcNext: "I see. Let me check your temperature and have a look at your throat.", npcNextTr: "明白了，我来量一下体温，再看看你的喉咙。" },
          { reply: "My stomach hurts and I feel like throwing up.", replyTr: "我胃疼，还觉得想吐。", npcNext: "I'm sorry to hear that. When did it start?", npcNextTr: "很遗憾听到这些，什么时候开始的？" }
        ]
      },
      {
        npc: "When did these symptoms start?",
        npcTr: "这些症状什么时候开始的？",
        choices: [
          { reply: "It started yesterday evening after dinner.", replyTr: "昨晚吃完晚饭后开始的。", npcNext: "Do you have any allergies to medication?", npcNextTr: "你对药物有过敏史吗？" },
          { reply: "About two days ago. It's getting worse.", replyTr: "大约两天前，而且越来越严重。", npcNext: "Have you taken any medicine for it?", npcNextTr: "你吃过什么药吗？" }
        ]
      },
      {
        npc: "Do you have any allergies to medication?",
        npcTr: "你对药物过敏吗？",
        choices: [
          { reply: "No, I don't have any known allergies.", replyTr: "没有，我没有已知的过敏史。", npcNext: "Good. I'll prescribe some medicine for you. Take it twice a day after meals.", npcNextTr: "好的，我给你开些药，每天两次，饭后服用。" },
          { reply: "Yes, I'm allergic to penicillin.", replyTr: "是的，我对青霉素过敏。", npcNext: "Thank you for telling me. I'll make sure to avoid that in your prescription.", npcNextTr: "谢谢你告诉我，开药时我会避开青霉素。" }
        ]
      },
      {
        npc: "Here's your prescription. You can get the medicine at the pharmacy.",
        npcTr: "这是你的处方，可以去药房取药了。",
        choices: [
          { reply: "Thank you, doctor. How many days should I rest?", replyTr: "谢谢医生，我需要休息几天？", npcNext: "Take it easy for two or three days and drink plenty of water.", npcNextTr: "休息两三天，多喝水。" },
          { reply: "Should I come back for a check-up?", replyTr: "我需要回来复查吗？", npcNext: "Yes, come back in three days if you don't feel better.", npcNextTr: "如果三天后还不见好转，就回来复查。" }
        ]
      }
    ]
  },
  {
    id: "social",
    name: "社交聚会",
    icon: "🥂",
    desc: "聚会闲聊、自我介绍",
    intro: "你在朋友的聚会上认识新朋友。",
    introTr: "You meet new friends at a party.",
    steps: [
      {
        npc: "Hi! I don't think we've met. I'm Tom.",
        npcTr: "你好！我们好像没见过面，我是汤姆。",
        choices: [
          { reply: "Nice to meet you, Tom! I'm Lily. How do you know the host?", replyTr: "很高兴认识你，汤姆！我是莉莉，你怎么认识主人的？", npcNext: "We used to work together. What about you?", npcNextTr: "我们以前一起工作，你呢？" },
          { reply: "Hi Tom! I'm Lily. Great party, isn't it?", replyTr: "你好汤姆！我是莉莉，这聚会真棒，是吧？", npcNext: "Absolutely! Great music and great people.", npcNextTr: "没错！音乐好，人也很好。" }
        ]
      },
      {
        npc: "What do you do for a living?",
        npcTr: "你是做什么工作的？",
        choices: [
          { reply: "I'm a graphic designer. I love turning ideas into visuals.", replyTr: "我是平面设计师，喜欢把想法变成视觉作品。", npcNext: "That sounds creative! What kind of projects do you work on?", npcNextTr: "听起来很有创意！你做什么类型的项目？" },
          { reply: "I work in education. I teach English to middle school students.", replyTr: "我从事教育行业，教中学生英语。", npcNext: "Teaching is such an important job! Do you enjoy it?", npcNextTr: "教书是很重要的工作！你喜欢吗？" }
        ]
      },
      {
        npc: "What do you like to do in your free time?",
        npcTr: "你空闲时间喜欢做什么？",
        choices: [
          { reply: "I love hiking and photography. Nature is my escape.", replyTr: "我喜欢远足和摄影，大自然是我的避风港。", npcNext: "Me too! There are some great trails near the city. We should go sometime.", npcNextTr: "我也是！城郊有一些很棒的徒步路线，改天可以一起去。" },
          { reply: "I enjoy reading and cooking. I'm always trying new recipes.", replyTr: "我喜欢阅读和烹饪，总是在尝试新菜谱。", npcNext: "That's wonderful! What's your specialty dish?", npcNextTr: "太棒了！你的拿手菜是什么？" }
        ]
      },
      {
        npc: "Would you like to join us for dinner next Friday?",
        npcTr: "下周五想和我们一起吃晚饭吗？",
        choices: [
          { reply: "I'd love to! Thanks for the invitation. Where should we meet?", replyTr: "我很乐意！谢谢邀请，我们在哪里见面？", npcNext: "We're meeting at the Italian place on Main Street at 7 PM.", npcNextTr: "我们7点在主街的意大利餐厅见面。" },
          { reply: "That sounds great! Can I bring a friend along?", replyTr: "听起来很棒！我能带个朋友吗？", npcNext: "Of course, the more the merrier!", npcNextTr: "当然，人越多越热闹！" }
        ]
      },
      {
        npc: "It was really nice talking to you. Let's keep in touch!",
        npcTr: "和你聊天很开心，我们保持联系吧！",
        choices: [
          { reply: "Same here! Let me add you on social media.", replyTr: "我也是！让我加你社交媒体。", npcNext: "Great! I'll send you a message later. See you at dinner!", npcNextTr: "太好了！晚点给你发消息，晚餐见！" },
          { reply: "Definitely! It's been a pleasure. Enjoy the rest of the party!", replyTr: "一定！认识你很高兴，玩得开心！", npcNext: "You too! Talk to you soon!", npcNextTr: "你也是！回头聊！" }
        ]
      }
    ]
  },
  {
    id: "coffee",
    name: "咖啡馆闲聊",
    icon: "☕",
    desc: "点单与轻松闲聊",
    intro: "你在咖啡馆点单，和咖啡师闲聊。",
    introTr: "You are ordering at a coffee shop and chatting with the barista.",
    steps: [
      {
        npc: "Welcome! What can I get you today?",
        npcTr: "欢迎光临！今天想喝点什么？",
        choices: [
          { reply: "I'd like a medium latte with oat milk, please.", replyTr: "我要一杯中杯燕麦奶拿铁。", npcNext: "One oat milk latte coming up! Anything to eat?", npcNextTr: "一杯燕麦奶拿铁马上好！要来点吃的吗？" },
          { reply: "Could I have a caramel macchiato, hot?", replyTr: "我要一杯焦糖玛奇朵，热的。", npcNext: "Sure! Would you like a pastry with that?", npcNextTr: "好的！需要配个点心吗？" }
        ]
      },
      {
        npc: "What kind of pastry would you like?",
        npcTr: "你想要哪种点心？",
        choices: [
          { reply: "The blueberry muffin looks great. I'll take that.", replyTr: "蓝莓松饼看起来不错，来一个。", npcNext: "Good choice, it's fresh from this morning!", npcNextTr: "好选择，是今天早上现做的！" },
          { reply: "Just the coffee, thanks. I'm watching my calories.", replyTr: "只要咖啡就好，谢谢，我在控制热量。", npcNext: "Understood! Your order will be ready in a moment.", npcNextTr: "明白！您的订单马上就好。" }
        ]
      },
      {
        npc: "Here's your coffee. Enjoy!",
        npcTr: "您的咖啡好了，请慢用！",
        choices: [
          { reply: "Thank you! This café has a lovely atmosphere.", replyTr: "谢谢！这家咖啡馆氛围真好。", npcNext: "Thanks! We try to make it cozy. Do you come here often?", npcNextTr: "谢谢！我们努力营造舒适感，你常来吗？" },
          { reply: "Thanks! Can I sit by the window?", replyTr: "谢谢！我能坐窗边吗？", npcNext: "Of course, the window seats are all available right now.", npcNextTr: "当然，窗边的位子现在都是空的。" }
        ]
      },
      {
        npc: "Is there anything else you need?",
        npcTr: "还需要别的吗？",
        choices: [
          { reply: "Could I have some water, please?", replyTr: "请给我一杯水。", npcNext: "Sure, here you go. Let me know if you need a refill on your coffee too.", npcNextTr: "好的，给您。咖啡需要续杯也随时说。" },
          { reply: "No, that's all. Thank you so much!", replyTr: "不用了，非常感谢！", npcNext: "You're welcome! Enjoy your coffee and have a great day!", npcNextTr: "不客气！请享用咖啡，祝您有美好的一天！" }
        ]
      }
    ]
  }
];
