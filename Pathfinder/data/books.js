// ===== Pathfinder 英文书籍阅读库 =====
// 采用公版(Public Domain)经典文本片段，适合英语学习者分章阅读。
// 每本书记录：id/name/author/intro/chapters[]；每章：title/paras[{en, zh}]/vocab[{w, p, m, e}]
const BOOKS = [
  {
    id: "little_prince",
    name: "The Little Prince",
    author: "Antoine de Saint-Exupéry",
    intro: "《小王子》讲述了一位飞行员在撒哈拉沙漠遇见来自小星球的小王子的故事。关于友谊、爱与责任的温暖寓言。",
    chapters: [
      {
        title: "Chapter 1: The Pilot and the Drawing",
        paras: [
          { en: "Once when I was six years old I saw a magnificent picture in a book, called True Stories from Nature, about the primeval forest.", zh: "六岁那年，我在一本叫《真实的大自然故事》的书里看到一幅壮丽的画，画的是原始森林。" },
          { en: "It was a picture of a boa constrictor in the act of swallowing an animal. Here is a copy of the drawing.", zh: "画的是一条蟒蛇正在吞食一只动物。这是那幅画的复制品。" },
          { en: "In the book it said: \"Boa constrictors swallow their prey whole, without chewing it. After that they are not able to move, and they sleep through the six months that they need for digestion.\"", zh: "书上写道：“蟒蛇把猎物整个吞下，不咀嚼。之后它们无法动弹，在消化所需的六个月里一直睡觉。”" },
          { en: "I pondered deeply, then, over the adventures of the jungle. And after some work with a colored pencil I succeeded in making my first drawing. My Drawing Number One.", zh: "于是我深深思考丛林的冒险。用彩色铅笔工作一番后，我成功画出了我的第一幅画——第一号作品。" },
          { en: "I showed my masterpiece to the grown-ups, and asked them whether the drawing frightened them. But they answered: \"Frighten? Why should any one be frightened by a hat?\"", zh: "我把杰作拿给大人们看，问他们这幅画会不会吓到他们。可他们回答：“吓到？为什么会有人被一顶帽子吓到？”" },
          { en: "My drawing was not a picture of a hat. It was a picture of a boa constrictor digesting an elephant. But since the grown-ups were not able to understand it, I made another drawing.", zh: "我的画不是帽子，是一条在消化大象的蟒蛇。但既然大人们看不懂，我又画了另一幅。" },
          { en: "My Drawing Number Two looked like this: The grown-ups' response, this time, was to advise me to lay aside my drawings of boa constrictors, whether from the inside or the outside, and devote myself instead to geography, history, arithmetic and grammar.", zh: "第二号作品是这样的：这一次大人们的反应是劝我放下蟒蛇画——不管是从里面看还是从外面看——专心去学地理、历史、算术和语法。" },
          { en: "That is why, at the age of six, I gave up what might have been a magnificent career as a painter. I had been disheartened by the failure of my Drawing Number One and my Drawing Number Two.", zh: "这就是为什么我在六岁时放弃了本可能辉煌的画家生涯。第一号和第二号作品的失败让我灰心。" },
          { en: "Grown-ups never understand anything by themselves, and it is tiresome for children to be always and forever explaining things to them.", zh: "大人们从不会自己理解任何事情，孩子们总是要一遍又一遍向他们解释，真叫人疲惫。" }
        ],
        vocab: [
          { w: "magnificent", p: "/mæɡˈnɪfɪsnt/", m: "壮丽的；极好的", e: "a magnificent view 壮丽的景色" },
          { w: "primeval", p: "/praɪˈmiːvl/", m: "原始的；远古的", e: "primeval forest 原始森林" },
          { w: "constrictor", p: "/kənˈstrɪktər/", m: "蟒蛇（绞杀性蛇类）", e: "boa constrictor 巨蟒" },
          { w: "swallow", p: "/ˈswɑːloʊ/", m: "吞下", e: "swallow one's food 吞下食物" },
          { w: "digestion", p: "/daɪˈdʒestʃən/", m: "消化", e: "digestion process 消化过程" },
          { w: "ponder", p: "/ˈpɑːndər/", m: "沉思；考虑", e: "ponder deeply 深深思考" },
          { w: "masterpiece", p: "/ˈmæstərpiːs/", m: "杰作", e: "a literary masterpiece 文学杰作" },
          { w: "frighten", p: "/ˈfraɪtn/", m: "使害怕", e: "frighten someone 吓到某人" },
          { w: "devote", p: "/dɪˈvoʊt/", m: "致力于；把……用于", e: "devote oneself to study 专心学习" },
          { w: "dishearten", p: "/dɪsˈhɑːrtn/", m: "使灰心", e: "be disheartened by failure 因失败而灰心" }
        ]
      },
      {
        title: "Chapter 2: The Pilot Meets the Little Prince",
        paras: [
          { en: "So I lived my life alone, without anyone that I could really talk to, until I had an accident with my plane in the Desert of Sahara, six years ago.", zh: "就这样，我独自生活，没有可以真正交谈的人，直到六年前我的飞机在撒哈拉沙漠出了事故。" },
          { en: "Something was broken in my engine. And as I had with me neither a mechanic nor any passengers, I set myself to attempt the difficult repairs all alone.", zh: "发动机出了故障。我身边既没有机械师也没有乘客，只好独自尝试艰难地修理。" },
          { en: "I had, thus, to work alone. It was a question of life or death for me: I had scarcely enough drinking water to last a week.", zh: "因此我只能独自工作。这对我来说是生死攸关的问题：我仅存的饮用水几乎撑不过一个星期。" },
          { en: "The first night, then, I went to sleep on the sand, a thousand miles from any human habitation. I was more isolated than a shipwrecked sailor on a raft in the middle of the ocean.", zh: "第一天夜里，我睡在沙地上，离任何人类居住地都有一千英里。我比大洋中央木筏上的遇难水手还要孤立。" },
          { en: "When suddenly, at daybreak, I was wakened by an odd little voice. It said: \"If you please—draw me a sheep!\"", zh: "然而黎明时分，我突然被一个奇怪的小声音唤醒。它说：“请你——给我画一只绵羊！”" },
          { en: "\"What!\" I said. \"Draw me a sheep!\" the voice repeated.", zh: "“什么！”我说。“给我画一只绵羊！”那个声音重复道。" },
          { en: "I looked, therefore, at the sky and saw this little prince coming towards me, jumping over the sand dunes.", zh: "于是我抬头看去，看见这位小王子正越过沙丘朝我走来。" },
          { en: "When he encountered me, he fell into my arms, and I asked him: \"But what are you doing here?\" And in answer he repeated, very softly, as if it were a matter of great consequence: \"If you please—draw me a sheep...\"", zh: "他遇见我时，扑进我的怀里，我问他：“你在这里做什么？”他轻声重复，仿佛这是件至关重要的事：“请你——给我画一只绵羊……”" },
          { en: "When a mystery is too overpowering, one dare not disobey. Absurd as it might seem to me, a thousand miles from any human habitation and in danger of death, I took out of my pocket a sheet of paper and my pen.", zh: "当一个谜团太过强烈，人就不敢违抗。尽管这看起来荒谬——身处离人类居住地一千英里的地方、面临死亡危险——我还是从口袋里掏出一张纸和一支笔。" }
        ],
        vocab: [
          { w: "accident", p: "/ˈæksɪdənt/", m: "事故", e: "a traffic accident 交通事故" },
          { w: "mechanic", p: "/məˈkænɪk/", m: "机械师", e: "an auto mechanic 汽车修理工" },
          { w: "scarcely", p: "/ˈskersli/", m: "几乎不；勉强", e: "scarcely enough 勉强够" },
          { w: "habitation", p: "/ˌhæbɪˈteɪʃn/", m: "居住地；住所", e: "human habitation 人类居住地" },
          { w: "isolated", p: "/ˈaɪsəleɪtɪd/", m: "孤立的", e: "an isolated village 与世隔绝的村庄" },
          { w: "shipwrecked", p: "/ˈʃɪprekt/", m: "遭遇海难的", e: "a shipwrecked sailor 遇难水手" },
          { w: "daybreak", p: "/ˈdeɪbreɪk/", m: "黎明", e: "at daybreak 黎明时分" },
          { w: "dune", p: "/duːn/", m: "沙丘", e: "sand dune 沙丘" },
          { w: "consequence", p: "/ˈkɑːnsɪkwens/", m: "结果；重要性", e: "a matter of great consequence 至关重要的事" },
          { w: "overpowering", p: "/ˌoʊvərˈpaʊərɪŋ/", m: "压倒性的；强烈的", e: "an overpowering desire 强烈的欲望" }
        ]
      },
      {
        title: "Chapter 3: The Sheep, the Box, and the Little Prince's Planet",
        paras: [
          { en: "So then I made my drawing Number Three. And the little prince said: \"That is exactly the way I wanted it! Do you think that this sheep will have to have a great deal of grass?\"", zh: "于是我又画了我的第三号作品。小王子说：“这正是我想要的样子！你觉得这只绵羊需要吃很多草吗？”" },
          { en: "\"Why?\" \"Because where I live everything is very small...\"", zh: "“为什么？”“因为我住的地方一切都非常小……”" },
          { en: "\"There will surely be enough grass for him,\" I said. \"It is a very small sheep that I have given you.\"", zh: "“草肯定够它吃，”我说，“我给你的是一只很小的绵羊。”" },
          { en: "He bent his head over the drawing. \"Not so small that—Look! He has gone to sleep...\"", zh: "他低头看画。“还没有小到——你看！它已经睡着了……”" },
          { en: "And that is how I made the acquaintance of the little prince.", zh: "就这样，我认识了小王子。" },
          { en: "It took me a long time to learn where he came from. The little prince, who asked me so many questions, never seemed to hear the ones I asked him.", zh: "我花了很长时间才弄清楚他从哪里来。小王子问我那么多问题，却似乎从没听到我问他的话。" },
          { en: "It was from words dropped by chance that, little by little, everything was revealed to me.", zh: "正是从他不经意间说出的话语里，一切才一点点向我揭示。" },
          { en: "On the fifth day, thanks to the sheep, the secret of his life was revealed to me. Abruptly, without anything to lead up to it, and as if the question had been born of long and silent meditation on his problem, he demanded: \"A sheep—if it eats little bushes, does it eat flowers, too?\"", zh: "第五天，多亏了绵羊，他生命的秘密向我揭开了。他突然发问，毫无铺垫，仿佛这个问题来自他长久而沉默的思考：“绵羊——如果它吃小灌木，它也吃花吗？”" },
          { en: "I said: \"A sheep eats anything it finds in its reach.\" \"Even flowers that have thorns?\" \"Yes, even flowers that have thorns.\"", zh: "我说：“绵羊会吃掉它够得着的一切。”“带刺的花也吃？”“是的，带刺的花也吃。”" }
        ],
        vocab: [
          { w: "acquaintance", p: "/əˈkweɪntəns/", m: "相识；熟人", e: "make the acquaintance of 与……结识" },
          { w: "reveal", p: "/rɪˈviːl/", m: "揭示；透露", e: "reveal a secret 揭示秘密" },
          { w: "abruptly", p: "/əˈbrʌptli/", m: "突然地", e: "stop abruptly 突然停下" },
          { w: "meditation", p: "/ˌmedɪˈteɪʃn/", m: "冥想；沉思", e: "deep meditation 深度冥想" },
          { w: "demand", p: "/dɪˈmænd/", m: "要求；质问", e: "demand an answer 要求答复" },
          { w: "bush", p: "/bʊʃ/", m: "灌木", e: "a rose bush 玫瑰丛" },
          { w: "thorn", p: "/θɔːrn/", m: "刺", e: "the thorns of a rose 玫瑰的刺" },
          { w: "chance", p: "/tʃæns/", m: "偶然；机会", e: "by chance 偶然地" },
          { w: "little by little", p: "/ˈlɪtl baɪ ˈlɪtl/", m: "渐渐地", e: "little by little, he improved 他渐渐进步" },
          { w: "in one's reach", p: "/ɪn wʌnz riːtʃ/", m: "够得着", e: "within reach 在伸手可及处" }
        ]
      }
    ]
  },
  {
    id: "alice",
    name: "Alice's Adventures in Wonderland",
    author: "Lewis Carroll",
    intro: "《爱丽丝梦游仙境》讲述小女孩爱丽丝掉进兔子洞，进入奇幻世界的冒险故事。充满奇思妙想，语言优美。",
    chapters: [
      {
        title: "Chapter 1: Down the Rabbit-Hole",
        paras: [
          { en: "Alice was beginning to get very tired of sitting by her sister on the bank, and of having nothing to do: once or twice she had peeped into the book her sister was reading, but it had no pictures or conversations in it.", zh: "爱丽丝坐在姐姐身旁的河岸上，开始觉得非常无聊：有一两次她偷偷看了看姐姐正在读的书，可那本书里既没有图画也没有对话。" },
          { en: "\"And what is the use of a book,\" thought Alice, \"without pictures or conversations?\"", zh: "“一本书，”爱丽丝想，“没有图画也没有对话，那有什么用呢？”" },
          { en: "So she was considering in her own mind (as well as she could, for the hot day made her feel very sleepy and stupid), whether the pleasure of making a daisy-chain would be worth the trouble of getting up and picking the daisies.", zh: "于是她心里盘算着（在炎热的天气里她昏昏欲睡、头脑迟钝，只能尽量思考），编一条雏菊花环的乐趣，是否值得她费劲站起来去摘雏菊。" },
          { en: "Suddenly a White Rabbit with pink eyes ran close by her. There was nothing so very remarkable in that; nor did Alice think it so very much out of the way to hear the Rabbit say to itself, \"Oh dear! Oh dear! I shall be late!\"", zh: "忽然，一只粉红眼睛的白兔跑过她身边。这本身并不稀奇；听到兔子自言自语“哦天哪！哦天哪！我要迟到了！”爱丽丝也不觉得特别奇怪。" },
          { en: "But when the Rabbit actually took a watch out of its waistcoat-pocket, and looked at it, and then hurried on, Alice started to her feet, for it flashed across her mind that she had never before seen a rabbit with either a waistcoat-pocket, or a watch to take out of it.", zh: "可当兔子真的从背心口袋里掏出一块怀表，看了看，又匆匆赶路时，爱丽丝跳了起来，因为她猛然想到，自己从未见过穿着背心、还能从口袋里掏表的兔子。" },
          { en: "Burning with curiosity, she ran across the field after it, and fortunately was just in time to see it pop down a large rabbit-hole under the hedge.", zh: "她怀着强烈的好奇心跑过田野去追它，幸好及时看见它钻进了篱笆下一个大兔子洞。" },
          { en: "In another moment down went Alice after it, never once considering how in the world she was to get out again.", zh: "转眼间爱丽丝也跟着跳了下去，压根没想过自己到底要怎么再出来。" },
          { en: "The rabbit-hole went straight on like a tunnel for some way, and then dipped suddenly down, so suddenly that Alice had not a moment to think about stopping herself before she found herself falling down a very deep well.", zh: "兔子洞起初像隧道一样直直向前，然后突然向下倾斜，快得让爱丽丝来不及想停下来，就已经发现自己掉进了一口很深的井里。" },
          { en: "Either the well was very deep, or she fell very slowly, for she had plenty of time as she went down to look about her and to wonder what was going to happen next.", zh: "要么是井很深，要么是她下落得很慢，因为下落途中有充足的时间环顾四周，猜想接下来会发生什么。" }
        ],
        vocab: [
          { w: "bank", p: "/bæŋk/", m: "河岸", e: "sit on the bank 坐在河岸上" },
          { w: "peep", p: "/piːp/", m: "偷看", e: "peep into the room 偷看房间" },
          { w: "daisy", p: "/ˈdeɪzi/", m: "雏菊", e: "a daisy-chain 雏菊花环" },
          { w: "remarkable", p: "/rɪˈmɑːrkəbl/", m: "非凡的；值得注意的", e: "a remarkable achievement 非凡成就" },
          { w: "waistcoat", p: "/ˈweɪskoʊt/", m: "背心；马甲", e: "a waistcoat pocket 背心口袋" },
          { w: "curiosity", p: "/ˌkjʊriˈɑːsəti/", m: "好奇心", e: "burn with curiosity 充满好奇" },
          { w: "hedge", p: "/hedʒ/", m: "树篱", e: "a hedge of roses 玫瑰树篱" },
          { w: "tunnel", p: "/ˈtʌnl/", m: "隧道", e: "a railway tunnel 铁路隧道" },
          { w: "dip", p: "/dɪp/", m: "倾斜；下降", e: "the road dips suddenly 道路突然下坡" },
          { w: "plenty", p: "/ˈplenti/", m: "大量；充足", e: "plenty of time 充足的时间" }
        ]
      },
      {
        title: "Chapter 2: The Pool of Tears",
        paras: [
          { en: "Curiouser and curiouser!\" cried Alice (she was so much surprised, that for the moment she quite forgot how to speak good English). \"Now I'm opening out like the largest telescope that ever was! Good-bye, feet!\"", zh: "“越来越奇怪了！”爱丽丝喊道（她惊讶得一时忘记了怎样好好说英语），“我现在正像一架最大的望远镜那样伸展开来！再见了，双脚！”" },
          { en: "For when she looked down at her feet, they seemed to be almost out of sight, they were getting so far off.", zh: "因为当她低头看自己的脚时，双脚似乎快要看不见了，它们离得那么远。" },
          { en: "She generally gave herself very good advice, (though she very seldom followed it), and sometimes she scolded herself so severely as to bring tears into her eyes.", zh: "她通常会给自己非常好的建议（尽管她很少照做），有时她责备自己责备得那么严厉，连眼泪都出来了。" },
          { en: "After a while, finding that nothing more happened, she decided on going into the garden at once; but, alas for poor Alice! when she got to the door, she found she had forgotten the little golden key.", zh: "过了一会儿，发现没有别的事情发生，她决定立刻去花园；可是，可怜的愛丽丝！当她走到门口时，发现自己忘了那把小金钥匙。" },
          { en: "She tried to climb up one of the table legs, but it was too slippery; and when she had tired herself out with trying, the poor little thing sat down and cried.", zh: "她试着爬上桌子腿，可那太滑了；当她试着爬到筋疲力尽时，这可怜的小家伙坐下来哭了。" },
          { en: "\"Come, there's no use in crying like that!\" said Alice to herself, rather sharply. \"I advise you to leave off this minute!\"", zh: "“得了，这样哭没有用！”爱丽丝相当严厉地对自己说，“我劝你马上停下来！”" },
          { en: "She was generally a very thoughtful little girl, although she was sometimes very fond of pretending to be two people. \"But it's no use now,\" thought poor Alice, \"to pretend to be two people! Why, there's hardly enough of me left to make one respectable person!\"", zh: "她通常是个很有头脑的小姑娘，尽管有时很喜欢假装自己是两个人。“可现在装两个人也没用了，”可怜的爱丽丝想，“因为剩下的我，连一个像样的人都凑不齐了！”" },
          { en: "Soon her eye fell on a little glass box that was lying under the table: she opened it, and found in it a very small cake, on which the words \"EAT ME\" were beautifully marked in currants.", zh: "不久她的目光落在桌子底下一个玻璃小盒子上：她打开它，发现里面有一块很小的蛋糕，上面用葡萄干漂亮地拼出“吃我”两个字。" },
          { en: "\"Well, I'll eat it,\" said Alice, \"and if it makes me grow larger, I can reach the key; and if it makes me grow smaller, I can creep under the door; so either way I'll get into the garden.\"", zh: "“好吧，我就吃它，”爱丽丝说，“如果它让我变大，我就能够到钥匙；如果它让我变小，我就能从门下钻过去；所以不管怎样我都能进花园。”" }
        ],
        vocab: [
          { w: "telescope", p: "/ˈtelɪskoʊp/", m: "望远镜", e: "look through a telescope 用望远镜看" },
          { w: "seldom", p: "/ˈseldəm/", m: "很少", e: "seldom visit 很少拜访" },
          { w: "scold", p: "/skoʊld/", m: "责骂", e: "scold a child 责骂孩子" },
          { w: "severely", p: "/sɪˈvɪrli/", m: "严厉地；严重地", e: "be severely punished 受重罚" },
          { w: "alas", p: "/əˈlæs/", m: "唉（感叹词）", e: "Alas! It's too late. 唉！太晚了。" },
          { w: "slippery", p: "/ˈslɪpəri/", m: "滑的", e: "a slippery floor 滑溜溜的地板" },
          { w: "respectable", p: "/rɪˈspektəbl/", m: "体面的；可敬的", e: "a respectable person 体面的人" },
          { w: "currant", p: "/ˈkɜːrənt/", m: "葡萄干；红醋栗", e: "currant cake 葡萄干蛋糕" },
          { w: "creep", p: "/kriːp/", m: "爬行；悄悄移动", e: "creep under the door 从门下爬过" },
          { w: "pretend", p: "/prɪˈtend/", m: "假装", e: "pretend to be asleep 假装睡着" }
        ]
      }
    ]
  },
  {
    id: "little_women",
    name: "Little Women",
    author: "Louisa May Alcott",
    intro: "《小妇人》讲述了美国南北战争时期马奇家四姐妹的成长故事，关于家庭、梦想与坚韧。",
    chapters: [
      {
        title: "Chapter 1: Playing Pilgrims",
        paras: [
          { en: "\"Christmas won't be Christmas without any presents,\" grumbled Jo, lying on the rug.", zh: "“没有礼物的圣诞节，就不算圣诞节了，”乔躺在毛毯上嘟囔道。" },
          { en: "\"It's so dreadful to be poor!\" sighed Meg, looking down at her old dress.", zh: "“贫穷真可怕！”梅格叹着气，低头看着自己破旧的裙子。" },
          { en: "\"I don't think it's fair for some girls to have plenty of pretty things, and other girls nothing at all,\" added little Amy, with an injured sniff.", zh: "“我觉得不公平，有些女孩有那么多漂亮东西，别的女孩却什么都没有，”小艾米带着委屈的鼻音补充道。" },
          { en: "\"We've got Father and Mother, and each other,\" said Beth contentedly from her corner.", zh: "“我们还有爸爸妈妈，还有彼此呀，”贝丝在角落里满足地说。" },
          { en: "The four young faces on which the firelight shone brightened at the cheerful words, but darkened again as Jo said sadly, \"We haven't got Father, and shall not have him for a long time.\"", zh: "炉火映照下的四张年轻面孔因这欢快的话语而明亮起来，但当乔难过地说“我们没有爸爸了，而且要很久才能见到他”时，它们又暗淡下去。" },
          { en: "She did not say \"perhaps never,\" but each silently added it, thinking of Father far away, where the fighting was.", zh: "她没有说“也许永远见不到”，但每个人都默默补上了这句话，想着远在战场上的父亲。" },
          { en: "\"Mother said we were not to have anything but bread and milk for supper, because she wanted to help the Hummels,\" said Meg.", zh: "“妈妈说我们晚餐只能吃面包和牛奶，因为她想帮助哈梅尔一家，”梅格说。" },
          { en: "\"I shall take the cream and the muffins for my part, because I am going to make a good resolution,\" said Jo, \"and I won't be selfish any more.\"", zh: "“我要把奶油和松饼留出来，”乔说，“因为我要立下一个好决心，不再自私了。”" },
          { en: "So the little women began their pilgrimage, carrying their burdens cheerfully, and learning that love and family were treasures far greater than any material gifts.", zh: "于是小妇人们开始了她们的朝圣之旅，愉快地背负着各自的担子，懂得了爱与家庭是远比物质礼物珍贵的财富。" }
        ],
        vocab: [
          { w: "grumble", p: "/ˈɡrʌmbl/", m: "抱怨；嘟囔", e: "grumble about the weather 抱怨天气" },
          { w: "dreadful", p: "/ˈdredfl/", m: "可怕的；糟糕的", e: "a dreadful experience 可怕的经历" },
          { w: "sigh", p: "/saɪ/", m: "叹气", e: "sigh deeply 深深叹气" },
          { w: "injured", p: "/ˈɪndʒərd/", m: "受伤的；委屈的", e: "an injured look 委屈的表情" },
          { w: "contentedly", p: "/kənˈtentɪdli/", m: "满足地", e: "smile contentedly 满足地微笑" },
          { w: "brighten", p: "/ˈbraɪtn/", m: "使明亮；使高兴", e: "her face brightened 她的脸亮了起来" },
          { w: "resolution", p: "/ˌrezəˈluːʃn/", m: "决心；决议", e: "make a New Year resolution 立新年决心" },
          { w: "selfish", p: "/ˈselfɪʃ/", m: "自私的", e: "a selfish act 自私的行为" },
          { w: "pilgrimage", p: "/ˈpɪlɡrɪmɪdʒ/", m: "朝圣之旅", e: "go on a pilgrimage 去朝圣" },
          { w: "treasure", p: "/ˈtreʒər/", m: "财富；珍品", e: "national treasure 国宝" }
        ]
      }
    ]
  }
];
