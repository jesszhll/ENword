export interface VocabularyItem {
  id: number;
  chinese: string;
  english: string; // Primary standard spelling
  alternatives?: string[]; // Alternative acceptable answers
  example?: string; // Simple 3rd grade level example sentence
  exampleChinese?: string; // Translation of the example sentence
}

export interface RewardCard {
  level: number;
  dinoName: string;
  cardName: string;
  badgeName: string;
  type: string;
  description: string;
  skills: { label: string; value: number }[];
  color: string;
  bgColor: string;
}

export const VOCABULARY_DATA: VocabularyItem[] = [
  // LEVEL 1: Words 1-15
  { id: 1, chinese: "我们的", english: "our", example: "This is our classroom.", exampleChinese: "这是我们的教室。" },
  { id: 2, chinese: "阅读", english: "read", alternatives: ["reading"], example: "I like to read books.", exampleChinese: "我喜欢读书。" },
  { id: 3, chinese: "唱歌", english: "sing", alternatives: ["singing"], example: "Let's sing a song together.", exampleChinese: "让我们一起唱首歌吧。" },
  { id: 4, chinese: "用颜料画", english: "paint", alternatives: ["painting"], example: "I can paint a blue bird.", exampleChinese: "我会画一只蓝色的鸟。" },
  { id: 5, chinese: "跳舞", english: "dance", alternatives: ["dancing"], example: "She likes to dance.", exampleChinese: "她喜欢跳舞。" },
  { id: 6, chinese: "游泳", english: "swim", alternatives: ["swimming"], example: "Can you swim in the pool?", exampleChinese: "你会在泳池里游泳吗？" },
  { id: 7, chinese: "打篮球", english: "play basketball", example: "We play basketball after school.", exampleChinese: "我们放学后打篮球。" },
  { id: 8, chinese: "打乒乓球", english: "play table tennis", alternatives: ["play ping pong"], example: "My friend and I play table tennis.", exampleChinese: "我和我的朋友打乒乓球。" },
  { id: 9, chinese: "踢足球", english: "play football", alternatives: ["play soccer"], example: "The boys play football on the grass.", exampleChinese: "男孩子们在草地上踢足球。" },
  { id: 10, chinese: "女士", english: "Ms.", alternatives: ["Ms", "lady", "miss", "Mrs."], example: "This is Ms. Green, our teacher.", exampleChinese: "这是格林女士，我们的老师。" },
  { id: 11, chinese: "讨论；谈论", english: "talk", alternatives: ["talk about", "discuss"], example: "They talk about their hobbies.", exampleChinese: "他们谈论他们的爱好。" },
  { id: 12, chinese: "业余爱好", english: "hobby", alternatives: ["hobbies"], example: "My hobby is reading.", exampleChinese: "我的爱好是阅读。" },
  { id: 13, chinese: "做；干；办（某事）", english: "do", example: "What do you do in your free time?", exampleChinese: "你空闲时间做什么？" },
  { id: 14, chinese: "空闲的", english: "free", example: "I am free this Saturday.", exampleChinese: "这个星期六我有空。" },
  { id: 15, chinese: "音乐", english: "music", example: "We listen to beautiful music.", exampleChinese: "我们听优美的音乐。" },

  // LEVEL 2: Words 16-30
  { id: 16, chinese: "最喜欢的", english: "favourite", alternatives: ["favorite"], example: "What is your favourite sport?", exampleChinese: "你最喜欢的运动是什么？" },
  { id: 17, chinese: "体育运动", english: "sport", alternatives: ["sports"], example: "Football is an exciting sport.", exampleChinese: "足球是一项令人兴奋的运动。" },
  { id: 18, chinese: "做游戏", english: "play games", alternatives: ["play game"], example: "The children play games in the garden.", exampleChinese: "孩子们在花园里做游戏。" },
  { id: 19, chinese: "拍照", english: "take photos", alternatives: ["take photo", "take pictures", "take a photo"], example: "I like to take photos of flowers.", exampleChinese: "我喜欢拍花朵的照片。" },
  { id: 20, chinese: "划船", english: "row a boat", example: "Let's row a boat on the lake.", exampleChinese: "让我们在湖上划船吧。" },
  { id: 21, chinese: "讲故事", english: "tell stories", alternatives: ["tell a story"], example: "My grandpa can tell stories.", exampleChinese: "我的爷爷会讲故事。" },
  { id: 22, chinese: "小船", english: "boat", example: "There is a small boat on the river.", exampleChinese: "河上有一只小船。" },
  { id: 23, chinese: "沙堡", english: "sandcastle", alternatives: ["sand castle"], example: "We build a big sandcastle on the beach.", exampleChinese: "我们在沙滩上建了一个大沙堡。" },
  { id: 24, chinese: "很好的，很棒的", english: "great", alternatives: ["good", "excellent", "wonderful"], example: "That's a great idea!", exampleChinese: "那是个棒极了的主意！" },
  { id: 25, chinese: "沙子", english: "sand", example: "The sand is warm and clean.", exampleChinese: "沙子又温暖又干净。" },
  { id: 26, chinese: "参与；加入到……之中", english: "join", alternatives: ["join in"], example: "Would you like to join us?", exampleChinese: "你想加入我们吗？" },
  { id: 27, chinese: "（与……）见面", english: "meet", example: "Nice to meet you here.", exampleChinese: "很高兴在这里见到你。" },
  { id: 28, chinese: "她的", english: "her", example: "Her dress is very pretty.", exampleChinese: "她的连衣裙非常漂亮。" },
  { id: 29, chinese: "我们（宾格）", english: "us", example: "Please tell us a funny story.", exampleChinese: "请给我们讲个有趣的故事。" },
  { id: 30, chinese: "我们（主格）", english: "we", example: "We are good students.", exampleChinese: "我们是好学生。" },

  // LEVEL 3: Words 31-45
  { id: 31, chinese: "玩沙子", english: "play with sand", alternatives: ["play in sand"], example: "Little babies like to play with sand.", exampleChinese: "小宝宝喜欢玩沙子。" },
  { id: 32, chinese: "玩沙滩排球", english: "play beach volleyball", alternatives: ["play beachvolleyball"], example: "They play beach volleyball on the sand.", exampleChinese: "他们在沙滩上玩沙滩排球。" },
  { id: 33, chinese: "毛衣", english: "sweater", example: "Keep warm with this soft sweater.", exampleChinese: "穿上这件柔软的毛衣保暖吧。" },
  { id: 34, chinese: "T恤衫，短袖汗衫", english: "T-shirt", alternatives: ["t-shirt", "tshirt"], example: "I wear a cool white T-shirt today.", exampleChinese: "我今天穿了一件清爽的白色T恤。" },
  { id: 35, chinese: "短裙，半身裙", english: "skirt", example: "The girl's skirt is pink.", exampleChinese: "那个女孩的短裙是粉红色的。" },
  { id: 36, chinese: "连衣裙", english: "dress", example: "She wears a beautiful yellow dress.", exampleChinese: "她穿着一件漂亮的黄色连衣裙。" },
  { id: 37, chinese: "衬衫", english: "shirt", example: "My dad wears a clean blue shirt.", exampleChinese: "我的爸爸穿着一件干净的蓝色衬衫。" },
  { id: 38, chinese: "裤子", english: "trousers", alternatives: ["pants"], example: "His black trousers are very long.", exampleChinese: "他的黑色裤子很长。" },
  { id: 39, chinese: "短裤", english: "shorts", example: "It is hot, so I wear red shorts.", exampleChinese: "天气热，所以我穿红短裤。" },
  { id: 40, chinese: "外套；外衣；大衣", english: "coat", alternatives: ["jacket"], example: "Put on your warm coat, it's cold outside.", exampleChinese: "穿上你的暖和外套，外面冷。" },
  { id: 41, chinese: "帽子", english: "cap", alternatives: ["hat"], example: "I wear a cap to block the sun.", exampleChinese: "我戴了一顶帽子来遮挡太阳。" },
  { id: 42, chinese: "鞋子", english: "shoes", alternatives: ["shoe"], example: "My new shoes are white.", exampleChinese: "我的新鞋子是白色的。" },
  { id: 43, chinese: "学生", english: "pupil", alternatives: ["student"], example: "I am a pupil of Grade 3.", exampleChinese: "我是三年级的学生。" },
  { id: 44, chinese: "穿；戴；佩戴", english: "wear", example: "We must wear school uniforms tomorrow.", exampleChinese: "我们明天必须穿校服。" },
  { id: 45, chinese: "学校", english: "school", example: "I go to school by bus every day.", exampleChinese: "我每天坐公交车去学校。" },

  // LEVEL 4: Words 46-60
  { id: 46, chinese: "不同的", english: "different", example: "We have different ideas.", exampleChinese: "我们有不同的想法。" },
  { id: 47, chinese: "衣服；服装", english: "clothes", alternatives: ["clothing"], example: "There are lots of clothes in the box.", exampleChinese: "箱子里有许多衣服。" },
  { id: 48, chinese: "制服；校服", english: "uniform", alternatives: ["school uniform"], example: "Our school uniform is blue and white.", exampleChinese: "我们的校服是蓝白相间的。" },
  { id: 49, chinese: "谁的", english: "whose", example: "Whose schoolbag is this?", exampleChinese: "这是谁的书包？" },
  { id: 50, chinese: "世界", english: "world", example: "The world is very big and wonderful.", exampleChinese: "世界非常大且精彩。" },
  { id: 51, chinese: "在世界各地", english: "around the world", example: "Children around the world play games.", exampleChinese: "世界各地的孩子们都玩游戏。" },
  { id: 52, chinese: "看一看", english: "have a look", alternatives: ["look"], example: "Please have a look at this drawing.", exampleChinese: "请看一看这幅画。" },
  { id: 53, chinese: "一条，一双，一对", english: "a pair of", example: "I bought a pair of new shoes.", exampleChinese: "我买了一双新鞋。" },
  { id: 54, chinese: "草", english: "grass", example: "Don't walk on the green grass.", exampleChinese: "不要在绿草地上行走。" },
  { id: 55, chinese: "河；江", english: "river", example: "The water in the river is very clean.", exampleChinese: "江里的水非常干净。" },
  { id: 56, chinese: "听见；听到", english: "hear", example: "Can you hear the music?", exampleChinese: "你能听到音乐吗？" },
  { id: 57, chinese: "鸟", english: "bird", example: "A little bird is singing in the tree.", exampleChinese: "一只小鸟在树上唱歌。" },
  { id: 58, chinese: "鸭子", english: "duck", example: "The yellow duck is swimming in the pond.", exampleChinese: "黄色的鸭子在池塘里游泳。" },
  { id: 59, chinese: "蜜蜂", english: "bee", example: "The busy bee is flying near the flower.", exampleChinese: "忙碌的蜜蜂在花旁飞舞。" },
  { id: 60, chinese: "湖；湖泊", english: "lake", example: "There are many fish in this lake.", exampleChinese: "这个湖里有许多鱼。" },

  // LEVEL 5: Words 61-75
  { id: 61, chinese: "（鸟叫声）", english: "tweet", alternatives: ["chirp"], example: "The bird goes 'tweet, tweet'.", exampleChinese: "小鸟发出‘叽叽喳喳’的叫声。" },
  { id: 62, chinese: "（蜜蜂声）", english: "buzz", example: "The bees go 'buzz, buzz'.", exampleChinese: "蜜蜂发出‘嗡嗡’的声音。" },
  { id: 63, chinese: "在……旁边", english: "beside", alternatives: ["next to", "by"], example: "My chair is beside the window.", exampleChinese: "我的椅子在窗户旁边。" },
  { id: 64, chinese: "（风声）", english: "whoosh", alternatives: ["swish", "howl"], example: "The wind goes 'whoosh' through the trees.", exampleChinese: "风呼呼地吹过树林。" },
  { id: 65, chinese: "刮；吹", english: "blow", example: "The wind begins to blow hard.", exampleChinese: "风开始猛烈地吹了。" },
  { id: 66, chinese: "（鸭子叫声）", english: "quack", example: "The ducks go 'quack, quack'.", exampleChinese: "鸭子发出‘嘎嘎’的叫声。" },
  { id: 67, chinese: "经过", english: "pass", alternatives: ["go by"], example: "Many cars pass our school every day.", exampleChinese: "每天有很多车经过我们学校。" },
  { id: 68, chinese: "走；行走", english: "walk", example: "I like to walk in the park.", exampleChinese: "我喜欢在公园里散步。" },
  { id: 69, chinese: "沿着；顺着", english: "along", example: "Let's walk along this small path.", exampleChinese: "让我们沿着这条小路走吧。" },
  { id: 70, chinese: "小路；小径", english: "path", alternatives: ["road"], example: "This path leads to the forest.", exampleChinese: "这条小径通向森林。" },
  { id: 71, chinese: "（雨声）", english: "pitter-patter", alternatives: ["drip-drop", "drip drop"], example: "The rain goes 'pitter-patter' on the roof.", exampleChinese: "雨点啪嗒啪嗒地打在屋顶上。" },
  { id: 72, chinese: "时间", english: "time", example: "What time is it now?", exampleChinese: "现在几点了？" },
  { id: 73, chinese: "再一次；又一次", english: "again", example: "Please read the story again.", exampleChinese: "请再读一遍这个故事。" },
  { id: 74, chinese: "声音", english: "sound", alternatives: ["voice"], example: "I hear a strange sound outside.", exampleChinese: "我听到外面有奇怪的声音。" },
  { id: 75, chinese: "去外面", english: "go outside", alternatives: ["go out"], example: "We can go outside to play now.", exampleChinese: "我们现在可以去外面玩了。" },

  // LEVEL 6: Words 76-91
  { id: 76, chinese: "回家", english: "go home", example: "We go home together after school.", exampleChinese: "我们放学后一起回家。" },
  { id: 77, chinese: "哪里", english: "where", example: "Where is my pencil box?", exampleChinese: "我的铅笔盒在哪里？" },
  { id: 78, chinese: "颜色", english: "colour", alternatives: ["color"], example: "What colour do you like?", exampleChinese: "你喜欢什么颜色？" },
  { id: 79, chinese: "粉红色；粉红色的", english: "pink", example: "She has a pink toy rabbit.", exampleChinese: "她有一个粉红色的玩具兔。" },
  { id: 80, chinese: "蓝色；蓝色的", english: "blue", example: "The sky is clear and blue.", exampleChinese: "天空晴朗而蔚蓝。" },
  { id: 81, chinese: "红色；红色的", english: "red", example: "My apples are big and red.", exampleChinese: "我的苹果又大又红。" },
  { id: 82, chinese: "棕色；棕色的", english: "brown", example: "The little teddy bear is brown.", exampleChinese: "小泰迪熊是棕色的。" },
  { id: 83, chinese: "黑色；黑色的", english: "black", example: "The cat has soft black fur.", exampleChinese: "那只猫有柔软的黑色毛发。" },
  { id: 84, chinese: "白色；白色的", english: "white", example: "There are white clouds in the sky.", exampleChinese: "天空中有白云。" },
  { id: 85, chinese: "紫色；紫色的", english: "purple", example: "These grapes are sweet and purple.", exampleChinese: "这些葡萄甜美呈紫色。" },
  { id: 86, chinese: "绿色；绿色的", english: "green", example: "The leaves are green in spring.", exampleChinese: "春天树叶是绿色的。" },
  { id: 87, chinese: "橘黄色；橘黄色的", english: "orange", example: "Orange juice is delicious.", exampleChinese: "橘子汁非常好喝。" },
  { id: 88, chinese: "黄色；黄色的", english: "yellow", example: "The shining sun is warm and yellow.", exampleChinese: "闪耀的太阳是温暖的黄色。" },
  { id: 89, chinese: "雪", english: "snow", example: "Look! Beautiful snow is falling.", exampleChinese: "看！美丽的雪花正在飘落。" },
  { id: 90, chinese: "树；树木", english: "tree", example: "There is an apple tree in the yard.", exampleChinese: "院子里有一棵苹果树。" },
  { id: 91, chinese: "在室外", english: "outdoors", alternatives: ["outside"], example: "It is fine, let's play outdoors.", exampleChinese: "天气晴朗，让我们在室外玩吧。" },

  // LEVEL 7: Words 92-107
  { id: 92, chinese: "花园", english: "garden", example: "My grandpa grows roses in his garden.", exampleChinese: "我爷爷在他的花园里种玫瑰。" },
  { id: 93, chinese: "向上；在上面", english: "up", example: "Look up at the beautiful sky.", exampleChinese: "抬头看美丽的天空。" },
  { id: 94, chinese: "（表示存在或发生）", english: "there", example: "There is a book on the table.", exampleChinese: "桌上有一本书。" },
  { id: 95, chinese: "蝴蝶", english: "butterfly", example: "A colorful butterfly landed on the leaf.", exampleChinese: "一只五彩斑斓的蝴蝶落在叶子上。" },
  { id: 96, chinese: "蜥蜴", english: "lizard", example: "The little green lizard is climbing the wall.", exampleChinese: "绿色的小蜥蜴在爬墙。" },
  { id: 97, chinese: "现在", english: "now", example: "We must do our homework now.", exampleChinese: "我们现在必须做作业。" },
  { id: 98, chinese: "难题；困难", english: "problem", alternatives: ["difficulty"], example: "This math problem is not very hard.", exampleChinese: "这道数学题不是很困难。" },
  { id: 99, chinese: "天；天空", english: "sky", example: "Birds fly freely in the blue sky.", exampleChinese: "鸟儿在蓝天中自由飞翔。" },
  { id: 100, chinese: "黑暗的；昏暗的", english: "dark", example: "It gets dark very early in winter.", exampleChinese: "冬天很早就变黑了。" },
  { id: 101, chinese: "夜晚", english: "night", example: "Good night, have a sweet dream.", exampleChinese: "晚安，做个甜美的梦。" },
  { id: 102, chinese: "五彩缤纷的", english: "colourful", alternatives: ["colorful"], example: "The flowers in the park are colourful.", exampleChinese: "公园里的花五彩缤纷。" },
  { id: 103, chinese: "烟花", english: "firework", alternatives: ["fireworks"], example: "We watch beautiful fireworks on New Year's Eve.", exampleChinese: "我们在除夕看美丽的烟花。" },
  { id: 104, chinese: "厨房", english: "kitchen", example: "My mother is cooking in the kitchen.", exampleChinese: "我妈妈在厨房里做饭。" },
  { id: 105, chinese: "浴室；盥洗室", english: "bathroom", example: "Wash your hands in the bathroom.", exampleChinese: "在浴室里洗你的手。" },
  { id: 106, chinese: "卧室", english: "bedroom", example: "I have a big bed in my bedroom.", exampleChinese: "我的卧室里有一张大床。" },
  { id: 107, chinese: "餐厅", english: "dining room", example: "The family has dinner in the dining room.", exampleChinese: "全家人在餐厅里吃晚饭。" },

  // LEVEL 8: Words 108-123
  { id: 108, chinese: "客厅；起居室", english: "living room", example: "We watch TV in the living room.", exampleChinese: "我们在客厅里看电视。" },
  { id: 109, chinese: "书房", english: "study", example: "My dad reads newspapers in his study.", exampleChinese: "我爸爸在书房里读报纸。" },
  { id: 110, chinese: "书桌", english: "desk", example: "I put my textbooks on the desk.", exampleChinese: "我把课本放在书桌上。" },
  { id: 111, chinese: "椅子", english: "chair", example: "Please sit down on the wooden chair.", exampleChinese: "请坐在这张木椅上。" },
  { id: 112, chinese: "长沙发", english: "sofa", alternatives: ["couch"], example: "The soft sofa is very comfortable.", exampleChinese: "这个软长沙发非常舒适。" },
  { id: 113, chinese: "房间", english: "room", example: "My room is always clean and tidy.", exampleChinese: "我的房间总是干净整洁。" },
  { id: 114, chinese: "从；来自", english: "from", example: "Where are you from?", exampleChinese: "你来自哪里？" },
  { id: 115, chinese: "新的", english: "new", example: "I have a pair of new shoes.", exampleChinese: "我有一双新鞋。" },
  { id: 116, chinese: "亲爱的", english: "dear", example: "Dear grandma, I miss you.", exampleChinese: "亲爱的奶奶，我想念您。" },
  { id: 117, chinese: "给……看；展示", english: "show", example: "Please show me your drawings.", exampleChinese: "请给我看你的画。" },
  { id: 118, chinese: "写字；写作", english: "write", example: "Can you write your name here?", exampleChinese: "你能在里写你的名字吗？" },
  { id: 119, chinese: "窗；窗户", english: "window", example: "Please open the window to let fresh air in.", exampleChinese: "请打开窗户让新鲜空气进来。" },
  { id: 120, chinese: "祝愿", english: "wish", alternatives: ["wishes"], example: "Make a wish and blow out the candles.", exampleChinese: "许个愿并吹灭蜡烛。" },
  { id: 121, chinese: "在……前面", english: "in front of", example: "There is a tall tree in front of our house.", exampleChinese: "我们家前面有一棵高树。" },
  { id: 122, chinese: "向……外看", english: "look out of", alternatives: ["look out"], example: "The puppy likes to look out of the window.", exampleChinese: "小狗喜欢向窗外看。" },
  { id: 123, chinese: "泰迪熊", english: "teddy bear", alternatives: ["teddy"], example: "I sleep with my brown teddy bear.", exampleChinese: "我和我那只棕色的泰迪熊一起睡觉。" },

  // LEVEL 9: Words 124-139
  { id: 124, chinese: "欢迎", english: "welcome", example: "Welcome to our beautiful school!", exampleChinese: "欢迎来到我们美丽的学校！" },
  { id: 125, chinese: "教室", english: "classroom", example: "Our classroom is bright and tidy.", exampleChinese: "我们的教室明亮而整洁。" },
  { id: 126, chinese: "电脑室", english: "computer room", example: "We learn how to type in the computer room.", exampleChinese: "我们在电脑室里学习怎么打字。" },
  { id: 127, chinese: "厕所；卫生间", english: "toilet", alternatives: ["bathroom", "washroom", "restroom"], example: "Can I go to the toilet, please?", exampleChinese: "请问我可以去洗手间吗？" },
  { id: 128, chinese: "操场", english: "playground", example: "We play football on the playground.", exampleChinese: "我们在操场上踢足球。" },
  { id: 129, chinese: "图书馆", english: "library", example: "There are lots of interesting books in the library.", exampleChinese: "图书馆里有很多有趣的书。" },
  { id: 130, chinese: "办公室", english: "office", example: "The English teachers are working in the office.", exampleChinese: "英语老师们正在办公室工作。" },
  { id: 131, chinese: "图画", english: "picture", alternatives: ["drawing", "painting"], example: "She is drawing a picture of an elephant.", exampleChinese: "她正在画一幅大象的图画。" },
  { id: 132, chinese: "明天", english: "tomorrow", example: "We will go to the zoo tomorrow.", exampleChinese: "我们明天将去动物园。" },
  { id: 133, chinese: "也", english: "too", alternatives: ["also"], example: "I like reading and singing too.", exampleChinese: "我也喜欢阅读和唱歌。" },
  { id: 134, chinese: "书包", english: "schoolbag", alternatives: ["backpack"], example: "I pack my schoolbag every evening.", exampleChinese: "我每天晚上整理我的书包。" },
  { id: 135, chinese: "直尺", english: "ruler", example: "Please lend me your ruler.", exampleChinese: "请把你的直尺借给我。" },
  { id: 136, chinese: "铅笔", english: "pencil", example: "Write your name with a pencil.", exampleChinese: "用铅笔写你的名字。" },
  { id: 137, chinese: "钢笔", english: "pen", example: "The teacher writes comments with a red pen.", exampleChinese: "老师用红钢笔写评语。" },
  { id: 138, chinese: "美术教室", english: "art room", example: "We paint colorful flowers in the art room.", exampleChinese: "我们在美术教室里画彩色的花。" },
  { id: 139, chinese: "游泳池", english: "swimming pool", alternatives: ["pool"], example: "The water in the swimming pool is cool.", exampleChinese: "游泳池里的水很凉快。" },

  // LEVEL 10: Words 140-155
  { id: 140, chinese: "大量的；很多的", english: "many", alternatives: ["a lot of", "lots of", "much"], example: "There are many animals in the zoo.", exampleChinese: "动物园里有很多动物。" },
  { id: 141, chinese: "来看一看！", english: "Come and have a look", alternatives: ["Come and look", "Come and have a look!"], example: "Come and have a look! Here is a lovely dog.", exampleChinese: "来看一看！这里有一只可爱的小狗。" },
  { id: 142, chinese: "儿童节", english: "Children's Day", alternatives: ["childrens day"], example: "Happy Children's Day to all of you!", exampleChinese: "祝你们大家儿童节快乐！" },
  { id: 143, chinese: "去海滩", english: "go to the beach", example: "We often go to the beach in summer.", exampleChinese: "我们夏天经常去海滩。" },
  { id: 144, chinese: "（去电影院）看电影", english: "go to the cinema", alternatives: ["see a movie", "watch a movie"], example: "We will go to the cinema this evening.", exampleChinese: "我们今晚要去电影院看电影。" },
  { id: 145, chinese: "去公园", english: "go to the park", example: "Let's go to the park to fly a kite.", exampleChinese: "让我们去公园放风筝吧。" },
  { id: 146, chinese: "去动物园", english: "go to the zoo", example: "Can we go to the zoo to see pandas?", exampleChinese: "我们能去动物园看大熊猫吗？" },
  { id: 147, chinese: "去博物馆", english: "go to the museum", example: "I like to go to the science museum.", exampleChinese: "我喜欢去科技馆。" },
  { id: 148, chinese: "象", english: "elephant", example: "The elephant has a very long nose.", exampleChinese: "大象长着一只很长的鼻子。" },
  { id: 149, chinese: "电影", english: "film", alternatives: ["movie"], example: "Do you like this fun film?", exampleChinese: "你喜欢这部好玩的电影吗？" },
  { id: 150, chinese: "比萨饼；意大利饼", english: "pizza", example: "I'd like to eat a delicious pizza.", exampleChinese: "我想吃一个美味的比萨饼。" },
  { id: 151, chinese: "商店", english: "shop", alternatives: ["store"], example: "There is a pet shop near my house.", exampleChinese: "我家附近有一家宠物商店。" },
  { id: 152, chinese: "吃", english: "eat", example: "Do you want to eat some apples?", exampleChinese: "你想吃些苹果吗？" },
  { id: 153, chinese: "同班同学", english: "classmate", alternatives: ["classmates"], example: "Tim is my classmate, we play together.", exampleChinese: "蒂姆是我的同班同学，我们一起玩。" },
  { id: 154, chinese: "做调查", english: "do a survey", alternatives: ["survey"], example: "Let's do a survey about hobbies.", exampleChinese: "让我们做个关于爱好的调查吧。" },
  { id: 155, chinese: "科技馆", english: "science museum", example: "We saw many robots in the science museum.", exampleChinese: "我们在科技馆看到了许多机器人。" }
];

export const REWARD_CARDS: RewardCard[] = [
  {
    level: 1,
    dinoName: "Rexy (雷克斯)",
    cardName: "霸王龙拼写卡",
    badgeName: "霸王龙拼写之王",
    type: "火系 (Spelling Champion)",
    description: "百兽之王，拼写威严！当你写出第一个‘our’时，它的怒吼就化为了美妙的掌声！",
    skills: [
      { label: "词汇掌握", value: 85 },
      { label: "拼写爆发力", value: 95 },
      { label: "恐龙威慑力", value: 99 }
    ],
    color: "from-red-400 to-orange-500",
    bgColor: "bg-red-50"
  },
  {
    level: 2,
    dinoName: "Cera (小角)",
    cardName: "三角龙稳健卡",
    badgeName: "三角龙守护卫士",
    type: "土系 (Solid Speller)",
    description: "头顶三只大角，拼写沉稳可靠。它每走一步都无比扎实，最讨厌拼写马虎！",
    skills: [
      { label: "词汇掌握", value: 90 },
      { label: "耐力", value: 92 },
      { label: "纠错能力", value: 88 }
    ],
    color: "from-amber-400 to-yellow-600",
    bgColor: "bg-amber-50"
  },
  {
    level: 3,
    dinoName: "Brachy (长颈巴奇)",
    cardName: "腕龙眼界卡",
    badgeName: "腕龙博学大师",
    type: "木系 (High Sight)",
    description: "长长的脖子伸入云端，能看见别的恐龙看不见的超长单词！跟着它学词，眼光更开阔！",
    skills: [
      { label: "词汇储备", value: 95 },
      { label: "拼写视野", value: 90 },
      { label: "高度", value: 98 }
    ],
    color: "from-emerald-400 to-green-600",
    bgColor: "bg-emerald-50"
  },
  {
    level: 4,
    dinoName: "Pteri (小翼)",
    cardName: "翼手龙飞天卡",
    badgeName: "翼手龙单词使者",
    type: "风系 (Air Messenger)",
    description: "拍打双翼，在字母天空中翱翔。只要你念出声，它就能在万里高空精准捞起对的字母！",
    skills: [
      { label: "拼写速度", value: 98 },
      { label: "敏捷度", value: 95 },
      { label: "风中回音", value: 85 }
    ],
    color: "from-sky-400 to-blue-600",
    bgColor: "bg-sky-50"
  },
  {
    level: 5,
    dinoName: "Steggy (板甲小剑)",
    cardName: "剑龙智慧盾卡",
    badgeName: "剑龙逻辑智者",
    type: "金系 (Shield of Wisdom)",
    description: "背上整齐排列的骨板，就像一本本展开的魔法书。它的尾刺专门戳破拼写错误的小气泡！",
    skills: [
      { label: "逻辑思考", value: 92 },
      { label: "拼写防御", value: 96 },
      { label: "逆袭暴击", value: 89 }
    ],
    color: "from-indigo-400 to-purple-600",
    bgColor: "bg-indigo-50"
  },
  {
    level: 6,
    dinoName: "Raptor (闪电迅迅)",
    cardName: "迅猛龙极速卡",
    badgeName: "迅猛龙极速极光",
    type: "雷系 (Lightning Typist)",
    description: "速度奇快，它是恐龙界的短跑冠军。看它的英文打字速度，手指都快要擦出闪电火花了！",
    skills: [
      { label: "反应速度", value: 99 },
      { label: "手指爆发力", value: 97 },
      { label: "瞬时记忆", value: 90 }
    ],
    color: "from-purple-400 to-pink-600",
    bgColor: "bg-purple-50"
  },
  {
    level: 7,
    dinoName: "Anky (坚甲胖胖)",
    cardName: "甲龙金刚防线卡",
    badgeName: "甲龙无畏骑士",
    type: "钢系 (Iron Spelling Defender)",
    description: "尾巴上巨大的骨槌是它的超级武器。它能一槌把任何拼写难题砸个稀碎，给你双倍信心！",
    skills: [
      { label: "耐心度", value: 97 },
      { label: "稳定性", value: 95 },
      { label: "厚积薄发", value: 91 }
    ],
    color: "from-teal-400 to-cyan-600",
    bgColor: "bg-teal-50"
  },
  {
    level: 8,
    dinoName: "Spiny (棘背飞鳍)",
    cardName: "棘龙破浪卡",
    badgeName: "棘龙深海潜航员",
    type: "水系 (Deep Sea Swimmer)",
    description: "背上有漂亮的帆状鳍，在水里游得飞快。擅长攻克所有跟‘水’和‘海滩’相关的英文单词！",
    skills: [
      { label: "水生词汇", value: 98 },
      { label: "逆境适应力", value: 91 },
      { label: "深潜专注", value: 94 }
    ],
    color: "from-blue-400 to-indigo-600",
    bgColor: "bg-blue-50"
  },
  {
    level: 9,
    dinoName: "Para (乐师妙妙)",
    cardName: "副栉龙乐章卡",
    badgeName: "副栉龙金嗓歌手",
    type: "音系 (Musical Speller)",
    description: "头上的中空冠能吹奏出最奇妙的交响乐。听到它头冠的鸣叫，你拼写单词的手指就会跟着起舞！",
    skills: [
      { label: "听力感知", value: 96 },
      { label: "音乐律动", value: 99 },
      { label: "韵律拼写", value: 93 }
    ],
    color: "from-rose-400 to-red-600",
    bgColor: "bg-rose-50"
  },
  {
    level: 10,
    dinoName: "Diplo (七彩梁龙)",
    cardName: "梁龙无敌至尊卡",
    badgeName: "七彩终极神龙",
    type: "神圣系 (Rainbow Ultimate Legend)",
    description: "155个单词全部默写通关的终极证明！它是身长达数十米的终极梁龙，浑身散发着金色的神圣智慧光芒！",
    skills: [
      { label: "全词通关力", value: 100 },
      { label: "持久力", value: 100 },
      { label: "少儿英语大师", value: 100 }
    ],
    color: "from-yellow-400 via-pink-500 to-purple-600",
    bgColor: "bg-yellow-50"
  }
];

export function getWordsForLevel(level: number): VocabularyItem[] {
  // Level ranges: 
  // L1: 0-14 (15 words)
  // L2: 15-29 (15 words)
  // L3: 30-44 (15 words)
  // L4: 45-59 (15 words)
  // L5: 60-74 (15 words)
  // L6: 75-90 (16 words)
  // L7: 91-106 (16 words)
  // L8: 107-122 (16 words)
  // L9: 123-138 (16 words)
  // L10: 139-154 (16 words)
  const startIndex = level <= 5 ? (level - 1) * 15 : 75 + (level - 6) * 16;
  const count = level <= 5 ? 15 : 16;
  return VOCABULARY_DATA.slice(startIndex, startIndex + count);
}
