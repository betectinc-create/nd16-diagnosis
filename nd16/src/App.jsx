import { useState, useEffect, useCallback } from "react";

/* ─────────────────────────────────────────────
   QUESTIONS
───────────────────────────────────────────── */
const QUESTIONS = [
  { text: "興味を持ったことに、時間を忘れて没頭してしまう", pos: "I", neg: "B" },
  { text: "論理より直感で動くことが多い", pos: "I", neg: "B" },
  { text: "話しかけられても、すぐ反応できないことがある", pos: "I", neg: "B" },
  { text: "予定が急に変わると、パニックになりやすい", pos: "B", neg: "I" },
  { text: "自分や周りの感情の変化に、敏感に気づく", pos: "S", neg: "C" },
  { text: "音や光など外からの刺激で、疲れやすい", pos: "C", neg: "S" },
  { text: "自分のペースを乱されると、集中できなくなる", pos: "S", neg: "C" },
  { text: "気持ちを言葉にするのが難しいと感じる", pos: "C", neg: "S" },
  { text: "じっくり考えてから行動したい", pos: "H", neg: "L" },
  { text: "気分が乗ったら、計画なしで動ける", pos: "H", neg: "L" },
  { text: "ちょっとしたミスが、ずっと頭に残って気になる", pos: "H", neg: "L" },
  { text: "複数の会話を同時に追うのが苦手", pos: "L", neg: "H" },
  { text: "短期集中で、一気にやり切るのが得意", pos: "N", neg: "F" },
  { text: "アイデア出しやブレストが楽しい", pos: "N", neg: "F" },
  { text: "言葉がなくても、相手の気持ちが何となくわかる", pos: "N", neg: "F" },
  { text: "人との距離感が近すぎると、疲れる", pos: "F", neg: "N" },
];

/* ─────────────────────────────────────────────
   TYPES DATA (拡張版)
───────────────────────────────────────────── */
const TYPES = {
  "I-S-H-N": {
    name: "ひらめきくん", tag: "アイデア即行動型", emoji: "💡",
    color: "#F59E0B", bg: "#FFFBEB", grad: ["#FDE68A","#FCA5A5"],
    desc: "直感が鋭く、ふとした瞬間に思いつく発想がそのまま価値になります。ゼロから企画を作る「初動の火をつける天才」。自由に動ける場と新しいものを創る余白があるほど才能が輝きます。",
    personality: "頭の中では常に何かがひらめいていて、思考が次々と連鎖していきます。「なんでこれ誰も気づかないの？」という感覚が多く、先を行き過ぎて周りに伝わらないことも。興味が燃え上がった瞬間のエネルギーは圧倒的で、徹夜でもできてしまう没入状態に入れます。その反面、興味が冷めると驚くほど急停止することがあります。感情が乗った仕事は天才的、乗らない仕事は平均以下、という振れ幅が特徴的です。",
    ndTraits: ["過集中で時間感覚がなくなる", "マルチに興味が飛びやすい（ADHD傾向）", "直感的すぎて説明が後付けになりがち", "ルーティン作業でエネルギーが急落"],
    struggles: ["興味のない仕事が続くと心身ともに消耗", "「なんで急に？」と言われることが多い", "アイデアはあるが実行管理が苦手", "〆切より「完成度」が気になってしまう"],
    tips: ["思いついたらすぐメモ（後で整理でOK）", "タイマーで強制終了して切り替える習慣", "得意な初動フェーズだけ請け負う仕事を増やす", "エネルギーが高い時間帯に重要な作業を集中させる"],
    strengths: ["発想力・アイデア量が圧倒的", "ゼロイチの立ち上げが得意", "熱が伝わる巻き込み力"],
    work: ["新規事業・企画立案", "SNS/動画コンテンツ制作", "クリエイティブディレクション", "スタートアップ初期メンバー"],
    care: ["自由度を確保する", "初動フェーズを積極的に任せる", "大枠の方向性だけ伝える", "締切は小分けにして管理"],
    notWork: ["マニュアル厳守の事務作業", "単純繰り返しの業務", "微調整・保守フェーズがメインの仕事"],
    compatible: ["もぐりん（深掘り力で補完）", "ていねい博士（仕組み化を任せられる）"],
    quote: "「あ、これ絶対いける気がする！」",
  },
  "I-S-H-F": {
    name: "もぐりん", tag: "波型集中の没入型", emoji: "🤿",
    color: "#0EA5E9", bg: "#F0F9FF", grad: ["#BAE6FD","#A5F3FC"],
    desc: "興味を持った瞬間に深く潜り込む没入型。一度ハマると強い集中力を発揮し、短期間で大きな成果を上げます。一気にやる→しっかり休むというリズムが最大のパフォーマンスを生みます。",
    personality: "外から見ると「今日は元気、今日は不調」と波が激しく見えますが、実際は脳の消耗スピードが速いだけで、回復すると再び驚くほどの集中力を発揮します。深海に潜るように対象に没入すると、時間も空腹も忘れる状態に入れます。人との関わりよりも「作業」にエネルギーを使いたいタイプで、一人の静かな時間が心の充電になります。エネルギーが高い日と低い日の差を自分でコントロールできるようになると、本領発揮できます。",
    ndTraits: ["集中の「波」が大きい（過集中→消耗のサイクル）", "一人の時間がないと心身が回復しない", "感覚過敏で環境の乱れに弱い", "エネルギー管理が他のタイプより複雑"],
    struggles: ["「波」を怠けと誤解されやすい", "強制的なペース配分が苦痛", "消耗サイクルを周囲に説明しにくい", "回復中に仕事を詰め込まれると崩れる"],
    tips: ["自分のエネルギー波を記録してパターンを知る", "「没入セッション」と「回復日」を予め計画する", "低エネルギー期は軽タスクだけにする仕組みを作る", "環境音を管理（イヤホン・個室など）"],
    strengths: ["没入時の集中力は最強クラス", "短期間で大きな成果を出せる", "単独での深掘り作業が得意"],
    work: ["調査・リサーチ", "ライティング・編集", "プログラミング（集中環境）", "分析・マーケティング"],
    care: ["まとまった作業時間を確保する", "締切に十分な幅を持たせる", "進捗は結果ベースで評価する", "オンオフの波を理解する文化を作る"],
    notWork: ["常に一定ペースを要求される仕事", "即レス・常時対応が必須の業務", "騒がしいオープンオフィス"],
    compatible: ["ひらめきくん（企画を渡してもらえる）", "まとめ役さん（進行を任せられる）"],
    quote: "「静かにしてくれたら、すごいもの作ります」",
  },
  "I-S-L-N": {
    name: "はやあしくん", tag: "軽快フットワーク型", emoji: "⚡",
    color: "#10B981", bg: "#F0FDF4", grad: ["#A7F3D0","#6EE7B7"],
    desc: "思いついたらすぐ行動できる軽快なタイプ。他の人が考えている間に動いて試し、経験値を積み重ねます。「とりあえずやってみる」が価値になる場で能力を発揮します。",
    personality: "頭と足が直結していて、「考えながら動く」より「動きながら考える」方が自然です。失敗を恐れず、むしろ失敗から学ぶことを本能的にやっています。計画より経験値、根拠より直感、準備より実行——これが基本スタンス。じっくり分析するより「まず触れてみる」で世界を理解します。止まっていると逆に不安になるタイプで、小さなアクションを積み重ねることでモチベーションを保ちます。",
    ndTraits: ["衝動性が高く、考える前に体が動く", "飽きやすいが次を見つけるのも速い", "感覚優位で「説明できないけどわかる」が多い", "長時間の座学・会議が苦手"],
    struggles: ["「もっと考えてから動いて」と言われる", "後処理・フォローアップが抜けがち", "途中で興味が移ってしまう", "計画書を書く作業が苦痛"],
    tips: ["行動ログをつけて後からパターン化する", "後処理担当の人とペアを組む", "「とりあえず5分だけ」を合言葉にする", "完璧より「60点で出す」を意識する"],
    strengths: ["行動の初速が圧倒的に速い", "失敗を恐れない実行力", "場数から学ぶ適応力"],
    work: ["SNS運用・動画企画〜制作", "営業の新規開拓", "スタートアップ実働メンバー", "イベント企画・プロモーション"],
    care: ["「動くこと」を評価する仕組みを作る", "方向性だけ伝えて細部は任せる", "裁量を渡して自走させる", "後処理は別担当と分業する"],
    notWork: ["慎重な確認が必要な品質管理", "長期計画に沿って淡々と進める仕事", "ミスが許されない高精度専門職"],
    compatible: ["しずか職人（後処理を任せられる）", "ていねい博士（仕組み化してもらえる）"],
    quote: "「とりあえずやってみよ、失敗してから考えよ」",
  },
  "I-S-L-F": {
    name: "ひとりダッシュ", tag: "マイペース単独型", emoji: "🏃",
    color: "#F43F5E", bg: "#FFF1F2", grad: ["#FECDD3","#FDA4AF"],
    desc: "自分のペースでさっと動く単独行動に強いタイプ。任せてもらえるタスクでは驚くほどのスピードで成果を出します。誰かと足並みを合わせる必要があると大きくエネルギーを消耗します。",
    personality: "「一人でやった方が早い」は本音で、チームの空気を読むエネルギーをそのまま作業に使いたいタイプです。協調性が低いのではなく、「同調コスト」が高いため、独立した仕事単位を任せてもらうのが最も効率的。こだわりが強すぎないため「ほどほどで完成」という割り切りもでき、スピードと柔軟性を兼ね備えています。自分のリズムで黙々とやる時間が、最大の充電になります。",
    ndTraits: ["独自のリズムがあり、他人ペースに合わせると消耗", "感覚が鋭く、集団の雑音・視線が気になる", "単独作業時の集中力と効率が飛び抜けて高い", "マルチタスク・同時コミュニケーションが苦手"],
    struggles: ["チームでの逐次報告・連絡が疲弊する", "会議が多い職場はエネルギーを大量消費", "「なんで連絡しないの？」と言われがち", "大人数の合意形成プロセスが苦痛"],
    tips: ["一人で完結するタスクを積極的に引き取る", "報告ルールを「完成したら共有」に交渉する", "連絡は短文・箇条書きで済ます習慣", "一人作業時間をカレンダーに確保する"],
    strengths: ["単独作業の速さと質が高い", "指示を受けたら黙々と完遂できる", "ペース管理が上手い"],
    work: ["フリーランス業務全般", "ライティング・編集・翻訳", "EC管理・データ整理", "ルーティンタスクの高速処理"],
    care: ["作業ペースを本人に任せる", "成果物だけ確認し過程を管理しない", "ひとり作業時間を物理的に確保する", "マルチタスクを押し付けない"],
    notWork: ["大人数での合意形成が必須の仕事", "チームで逐次連絡しながら進める業務", "監視・詰め文化のある職場"],
    compatible: ["ひらめきくん（方向性をもらって自走）", "まとめ役さん（報告整理を任せられる）"],
    quote: "「任せてくれたら、黙ってやります」",
  },
  "I-C-H-N": {
    name: "こだわりアートさん", tag: "世界観強いクリエイター肌", emoji: "🎨",
    color: "#8B5CF6", bg: "#FAF5FF", grad: ["#DDD6FE","#C4B5FD"],
    desc: "細部やニュアンスに敏感で「世界観」を守る力が非常に強いタイプ。作品づくりやコンテンツ制作では唯一無二のアウトプットを生み出します。明確な方向性を事前に共有されることで能力が最大化されます。",
    personality: "「なんかちょっと違う」という感覚を言語化するのが得意で、そのズレを修正し続けることに強いこだわりがあります。色・言葉・空気感といった細かなニュアンスへの感度が飛び抜けて高く、クオリティへの執念が作品に宿ります。一方で「もう少し直したい」という気持ちが止まらず、完成を出し渋ることも。曖昧な指示は混乱の元で、「こういう世界観で」という言語化された方向性があると爆発的に動きます。",
    ndTraits: ["完璧主義傾向が強く、妥協点を決めるのが難しい", "感覚的なこだわりを言語化するのに時間がかかる", "ルーティン崩れ・急な仕様変更に強いストレス", "美的・感覚的情報への過敏さ（ASD傾向）"],
    struggles: ["「こだわりすぎ」と言われて削られる", "突然の方向転換でリセット感を感じる", "自分の世界観を汚される感覚が苦痛", "〆切より品質優先で遅れることがある"],
    tips: ["コンセプトを文章・ムードボードで事前に固める", "「最低ライン」と「理想ライン」を別々に設定する", "修正依頼は「何を変えたいか」を明確に伝えてもらう", "完成品の承認フローを最初に決めておく"],
    strengths: ["細部まで作り込む圧倒的なこだわり", "唯一無二の世界観の構築力", "ニュアンスの再現精度が高い"],
    work: ["デザイン・イラスト・映像編集", "アートディレクション", "ブランディング・世界観設計", "UI/UX設計"],
    care: ["コンセプト・方向性を事前に言語化して共有", "突然の仕様変更を最小限にする", "クオリティ評価の基準を明確に", "静かな制作環境を確保する"],
    notWork: ["頻繁に方向性が変わる職場", "短納期で大量制作が求められる現場", "自分の裁量がほぼない職場"],
    compatible: ["じっくりさん（計画・スケジュールを任せられる）", "まとめ役さん（調整を任せられる）"],
    quote: "「ここのトーン、もうちょっとだけ直させて」",
  },
  "I-C-H-F": {
    name: "しずか職人", tag: "静かに質を積む職人", emoji: "🔧",
    color: "#6366F1", bg: "#EEF2FF", grad: ["#C7D2FE","#A5B4FC"],
    desc: "派手さよりも「正確さ」や「丁寧さ」を大切にするタイプ。静かに集中できる環境で最高の成果を出します。明確な指示×安定した環境が揃うと最強の力を発揮します。",
    personality: "華やかな場には出たがらないけれど、誰かが丁寧に積み上げないといけない仕事を静かに完璧にこなします。「誰も気づかないけど実はすごい」という存在感を持つタイプです。情報が整理されていて、指示が明確で、予測可能な環境が揃うと、細部まで完璧な仕事を提供します。逆に曖昧さ・騒音・急な変更はエネルギーを大きく削ぎます。評価されにくいことも多いですが、その仕事がなければ全体が崩れるような重要な位置にいます。",
    ndTraits: ["感覚刺激への敏感さ（騒音・においなど）", "曖昧さへの強い不快感（ASD傾向）", "完遂への強いこだわりと責任感", "急な割り込みで集中が途切れると回復に時間がかかる"],
    struggles: ["「もっと積極的に発言して」と言われる", "騒がしい環境では本来の力が出ない", "感情的な人への対応でエネルギーを消耗", "自分の丁寧さが「遅い」と評価されることがある"],
    tips: ["作業前に「今日のゴール」を明確にメモする", "ノイズキャンセリングイヤホンを常備する", "自分の丁寧さが価値になる職場・領域を選ぶ", "割り込みを減らすために「集中タイム」を設定する"],
    strengths: ["正確さ・再現性の高さ", "細かいルールの遵守と品質担保", "地道に積み上げる持続力"],
    work: ["校正・チェック・品質管理", "経理・事務・バックオフィス", "コーディング（精度が必要な領域）", "データ管理・研究アシスタント"],
    care: ["静かな作業環境を確保する", "指示は曖昧語を避けて具体的に", "締切と優先順位を明確にする", "突然の割り込みタスクを減らす"],
    notWork: ["次々と状況が変わる現場仕事", "騒がしいオープンオフィス", "感情労働（クレーム対応など）"],
    compatible: ["ひらめきくん（アイデアを受け取って形にする）", "はやあしくん（初動を任せてもらえる）"],
    quote: "「静かにしてもらえれば、完璧に仕上げます」",
  },
  "I-C-L-N": {
    name: "じっくりさん", tag: "慎重で安定・長期型", emoji: "🌱",
    color: "#22C55E", bg: "#F0FDF4", grad: ["#BBF7D0","#86EFAC"],
    desc: "丁寧に情報を整理し、しっかり考えてから動く慎重派タイプ。大きなミスを防ぐ力が非常に高く、長期的な計画や学習が必要な仕事で真価を発揮します。正確性・安定性が重要な環境では非常に頼りになる存在です。",
    personality: "急がず、でも確実に。情報を丁寧に組み立ててから動くため、大きな失敗をしない「安全網」としての役割を自然に担います。長期的な視野で物事を見ることができ、目先の利益より持続可能な方向を選びます。「急いで」と言われると焦って品質が落ちてしまうため、ゆとりのある期間設定が重要。スピードよりも確実性を大切にする姿勢は、チームの安定性を支える大切な柱になります。",
    ndTraits: ["情報処理に時間がかかる（処理速度の差）", "急かされると思考がまとまらなくなる", "変化への適応に時間が必要", "じっくり型は「遅い」と誤解されやすい"],
    struggles: ["「もっと早く決めて」と急かされる", "スピード文化の職場では常にプレッシャー", "思考が整理される前に発言を求められる", "変化の多い環境で疲弊しやすい"],
    tips: ["「考える時間をください」と言える関係・環境を作る", "意思決定の前に情報整理シートを書く習慣", "スピードより正確性が評価される仕事を選ぶ", "変化が多い時期は意識的に休息を取る"],
    strengths: ["大きなミスを防ぐリスク回避力", "長期計画・学習の持続力", "安定した品質とペース"],
    work: ["研究・分析・調査", "事務・管理・書類作業", "長期プロジェクトの計画立案", "マニュアル作成・ドキュメント整備"],
    care: ["判断に必要な情報を事前に共有する", "「急ぎ」を連発しない", "締切に十分な余白を持たせる", "落ち着いた作業環境を確保する"],
    notWork: ["即決が必要な営業・交渉", "状況変化が激しい現場仕事", "思いつきで動く文化の職場"],
    compatible: ["ひらめきくん（アイデアを実行可能な計画に変える）", "はやあしくん（実行を任せて計画を担う）"],
    quote: "「ちゃんと考えてから動きたいだけです」",
  },
  "I-C-L-F": {
    name: "ていねい博士", tag: "仕組みを理解してから動く知性派", emoji: "📚",
    color: "#64748B", bg: "#F8FAFC", grad: ["#CBD5E1","#94A3B8"],
    desc: "物事の「仕組み」や「背景」を理解してから動きたいタイプ。曖昧なまま進めるのが苦手ですが、きちんと理由が分かれば驚くほどの安定感で進められます。教えるのが上手で、説明役として高い評価を得やすいです。",
    personality: "「なぜそうするのか」が腑に落ちるまで動けない、という感覚を持っています。これは頑固さではなく、理解を確認してから動く確実性重視の思考スタイルです。一度理解できると、安定感と精度は抜群で、同じ誤りを繰り返しません。知識の積み上げが得意で、説明・教育・マニュアル化のような「構造を人に伝える仕事」で光ります。「とりあえずやって」文化とは合わないため、丁寧に背景を共有してもらえる環境が必須です。",
    ndTraits: ["曖昧さへの強い不快感（ASD傾向）", "理解前に動けないことを「反抗」と誤解されやすい", "情報整理・構造化が得意な思考スタイル", "人との距離は取りながらも、深い理解を求める"],
    struggles: ["「考えすぎ」「さっさとやって」と言われる", "説明なしで丸投げされると混乱する", "感覚頼りの職場では力が発揮できない", "理由を聞くたびに「面倒な人」と思われることがある"],
    tips: ["理解するための「質問リスト」を事前に作る", "「理解してから動く方が精度が上がる」と説明する", "マニュアル化・仕組み化が得意なことを積極的にアピール", "背景を共有してくれる上司・職場を選ぶ"],
    strengths: ["構造化・仕組み化の能力が高い", "人に教えること・説明することが上手", "一度理解した後の再現精度が高い"],
    work: ["マニュアル作成・研修講師", "技術文書・システム設計", "研究・分析・ロジック重視の領域", "法務・企画のバックエンド業務"],
    care: ["背景・目的を丁寧に説明してからタスクを渡す", "質問しやすい雰囲気をつくる", "答えを急かさない", "情報の属人化を避けて共有する"],
    notWork: ["ノリと勢いで動く現場", "感覚頼りの不確実な仕事", "説明なしで丸投げされる環境"],
    compatible: ["じっくりさん（慎重さで相互補完）", "わくわく探検隊（実動と分析で分業）"],
    quote: "「理由がわかれば、完璧にやります」",
  },
  "B-S-H-N": {
    name: "わくわく探検隊", tag: "外の刺激でエネルギーが増すタイプ", emoji: "🗺️",
    color: "#F97316", bg: "#FFF7ED", grad: ["#FED7AA","#FCA5A5"],
    desc: "外の世界に対して強い好奇心を持ち、人・場所・情報に触れることでエネルギーが増えるタイプ。職場のムードメーカーとして重宝されます。新しい体験や変化を楽しめ、コミュニティづくりで力を発揮します。",
    personality: "人と会うたびに元気になる、新しい場所に行くたびにわくわくする——外からの刺激が燃料になるタイプです。停滞や孤独よりも、動き続けることがエネルギーの源。人を巻き込む力があり、場の温度を上げることが得意です。ただし過密スケジュールになると燃え尽きやすく、「もっとできる」と思いすぎて限界を超えてしまうことも。休息も「次のわくわく」のためと意識することが大切です。",
    ndTraits: ["外界への強い好奇心・衝動性（ADHD傾向）", "退屈な環境では集中力が著しく低下", "スケジュール過密で燃え尽きやすい", "感情の外向きの表出が大きい"],
    struggles: ["退屈な仕事が続くと完全に集中できなくなる", "休息を後回しにして燃え尽きる", "「もっとやれる」と詰め込みすぎる", "ルーティン作業で急に気力が落ちる"],
    tips: ["毎週「新しい何か」を取り入れてモチベーションを維持", "スケジュールに意識的に休息日を確保する", "燃え尽きのサインを自分で把握しておく", "刺激が少ない時は「次のわくわく」を計画して乗り越える"],
    strengths: ["場を盛り上げるムードメーカー力", "人を巻き込む行動力と熱量", "新しい体験への適応スピード"],
    work: ["営業（特に新規開拓）", "イベント企画・運営", "広報・PR・SNS（表に出る系）", "コミュニティマネージャー"],
    care: ["活動の幅と変化を与える", "人と関わる役割を積極的に配分する", "スケジュールに余白を作る", "成果を褒める文化を大切に"],
    notWork: ["ルーティン中心の事務仕事", "一人で黙々と作業する時間が長い仕事", "刺激の少ない繰り返し業務"],
    compatible: ["ていねい博士（分析・仕組み化で補完）", "しずか職人（バックを支えてもらえる）"],
    quote: "「次どこ行く？何する？なんでも行くよ！」",
  },
  "B-S-H-F": {
    name: "しずか探求者", tag: "静かな外向性の観察型", emoji: "🔍",
    color: "#EC4899", bg: "#FDF2F8", grad: ["#FBCFE8","#F9A8D4"],
    desc: "外の世界に興味はあるが、輪の中心に飛び込むのは苦手なタイプ。フィールドワーク・観察・聞き役など、人の話を丁寧に深掘りする作業で力を発揮します。「静かな外向性」を持つ非常に貴重なタイプです。",
    personality: "場のエネルギーを読んで、自然に聞き役・観察者として入れるのが強みです。自分が話すより「引き出す」ことが得意で、相手が思わず深い話をしてしまう環境を作れます。前に出ることへの抵抗感がある反面、対話の場や調査・観察のような「静かに深掘りする」領域では圧倒的な価値を生みます。無理に外向的に振る舞う必要はなく、「静かな外向性」をそのまま活かせる仕事が合っています。",
    ndTraits: ["HSP（高感受性）傾向が強い", "場の雰囲気・感情に過敏", "人に興味はあるが中心に入るのは消耗", "繊細な観察眼と感受性"],
    struggles: ["「もっと積極的に」と言われてしまう", "パーティー・懇親会が消耗になる", "テンション高めのグループに入るのが苦痛", "自分の観察力が評価されにくいことがある"],
    tips: ["「聞き役」ポジションを自分の強みとして認識する", "1on1や少人数の場を積極的に活用する", "大人数イベントの前後に回復時間を設定する", "観察・分析が得意なことを文書化してアピールする"],
    strengths: ["相手の本音を引き出す傾聴力", "細かい観察と洞察力", "静かな場での深い対話力"],
    work: ["インタビュー・ユーザーリサーチ", "カウンセラー・コーチ", "編集・構成・ルポライター", "静かな接客・丁寧な対応が必要な職種"],
    care: ["静かに話せる面談スペースを確保する", "無理な盛り上がりを強制しない", "じっくり聞ける時間配分を大切に", "本題重視の文化が合っている"],
    notWork: ["テンション高めの接客・営業", "賑やかすぎるチーム文化", "大声・パフォーマンスが求められる仕事"],
    compatible: ["まとめ役さん（整理・調整を任せられる）", "ひとり研究僧（深掘りを一緒に楽しめる）"],
    quote: "「ゆっくり話してくれたら、ちゃんと聞きます」",
  },
  "B-S-L-N": {
    name: "にぎやかプレイヤー", tag: "仲間がいるとスイッチが入るタイプ", emoji: "🎉",
    color: "#D946EF", bg: "#FDF4FF", grad: ["#F0ABFC","#E879F9"],
    desc: "1人作業より誰かと一緒に進めるほうがエネルギーが湧くタイプ。雑談しながらの共同作業や、仲間と環境を共有することで成果が倍増します。チームで動く場で本領を発揮する存在です。",
    personality: "「誰かがいる」という事実だけでエネルギーが増幅されます。オンラインでも、作業通話をしているだけで集中力が上がるタイプ。一人で黙々と進める仕事はパフォーマンスが著しく落ちますが、チームで動く際は場全体を活性化する力があります。人の感情や空気を肌で感じながら動くため、チームの雰囲気管理・関係構築にも自然と貢献します。孤立した環境は心身にダメージが大きいため、「誰かと繋がれる仕組み」が仕事の質に直結します。",
    ndTraits: ["単独作業では集中が維持できない（ADHD傾向）", "「誰かがいる場」でドーパミンが出るタイプ", "孤独な環境が長続きするとメンタルに影響", "刺激があることで脳が活性化する"],
    struggles: ["完全リモートでの一人作業が苦痛", "孤独な作業が続くと意欲が急落する", "「静かにして」と言われる環境が苦手", "一人で詰まると抜け出せなくなる"],
    tips: ["作業通話・もくもく会を積極的に活用する", "週に数回は人と一緒に作業する時間を確保する", "詰まった時は誰かに「ちょっと聞いて」と話しかける", "チーム内に気軽に話せる相手を作っておく"],
    strengths: ["場を活性化する存在感", "チームのモチベーション管理力", "人と一緒に動く時の生産性の高さ"],
    work: ["チーム作業全般", "接客・販売・営業", "イベント運営・チームリーダー", "コールセンター（協力体制が強い場所）"],
    care: ["チーム作業の割合を意識的に増やす", "相談できる人を近くに置く", "雑談OKな職場文化を大切に", "定期的に共同作業の時間を設ける"],
    notWork: ["完全リモートの孤独な作業", "研究職・執筆などのひとり職", "無音・サイレントワーク環境"],
    compatible: ["わくわく探検隊（外向きのエネルギーが共鳴）", "まとめ役さん（場の整理を任せられる）"],
    quote: "「誰かいる？一緒にやろ！」",
  },
  "B-S-L-F": {
    name: "きままさんぽ", tag: "気分と体調に合わせて動く自由型", emoji: "☁️",
    color: "#14B8A6", bg: "#F0FDFA", grad: ["#99F6E4","#6EE7B7"],
    desc: "その日の気分や体調に合わせて動くことで調子が整うタイプ。縛られるより、ゆるい方向性だけ示してもらい「自由に動ける余白」があるほうが良い成果が出ます。のびのびできる職場でポテンシャルが開花します。",
    personality: "「今日はこっちの気分」という感覚を大切に、自分の内部状態と仕事を合わせることで最大限の力を引き出せます。無理に一定ペースを保とうとすると、かえってパフォーマンスが落ちます。ゆるやかに動きながら、気づいたら結果が出ていた、というスタイルが自然体。管理・監視・厳しい評価制度への拒否反応が強く、自由と余白がある環境でのびのびと力を発揮します。",
    ndTraits: ["体調・気分の波が激しいことがある", "強制やプレッシャーで固まってしまう", "自由を感じると創造性が高まる", "外界への反応が大きい（刺激に敏感）"],
    struggles: ["「計画通りにやって」が苦痛", "厳しい締切管理でパニックになることがある", "気分が乗らない日の強制作業が辛い", "細かい監視でパフォーマンスが急落する"],
    tips: ["気分が乗る時間帯を把握して重要作業をそこに当てる", "「今日できること」リストを毎朝書く（大きな計画は不要）", "自由度の高い仕事スタイルを選ぶ（フリーランス、裁量労働など）", "気分転換の方法を複数持っておく"],
    strengths: ["環境変化への柔軟な適応力", "自由な発想と独自の着眼点", "のびのびとした場での創造性"],
    work: ["クリエイティブ制作全般", "フリーランス業務", "SNS運用・ライティング", "動きのあるシンプルな現場作業"],
    care: ["ざっくりした目標だけ共有する", "細かいプロセス管理をしない", "過度なプレッシャーをかけない", "シフトや働き方の柔軟性を確保する"],
    notWork: ["詰められる文化の職場", "時間厳守・細かい行動管理", "急な割り込みが連続する環境"],
    compatible: ["しずか職人（安定感で支えてもらえる）", "ていねい博士（仕組み化を任せられる）"],
    quote: "「今日はそんな気分じゃないけど、明日やります」",
  },
  "B-C-H-N": {
    name: "きもち読みうさぎ", tag: "空気と感情を瞬時に察知する共感型", emoji: "🐰",
    color: "#FB7185", bg: "#FFF1F2", grad: ["#FECDD3","#FCA5A5"],
    desc: "人の表情・声のトーン・空気の変化に敏感で「相手がどう感じているか」を瞬時に察する共感力の高いタイプ。その分、人からの刺激を受けすぎて心が疲れやすく、優しさゆえに抱え込みがちな面もあります。",
    personality: "「あの人今ちょっと辛そう」「この場の空気が変わった」という情報を誰よりも早くキャッチします。この敏感さはギフトであり、同時に疲れやすさの原因でもあります。相手を助けたい気持ちが強く、断るのが苦手で、知らないうちに自分のキャパを超えてしまいます。人の感情を「自分のこと」のように感じてしまうため、距離の取り方を学ぶことがとても大切です。感情エネルギーを消耗しない環境設計が、長期的な活躍の鍵になります。",
    ndTraits: ["HSP・共感過多傾向が非常に強い", "他者の感情を「吸収」してしまう", "断ること・境界線を引くことが苦手", "優しさから抱え込みのループに入りやすい"],
    struggles: ["人の感情を受けすぎて消耗する", "「NO」が言えずにキャパオーバーになる", "感情的な人の多い職場が苦痛", "自分の感情と他人の感情の区別が難しい"],
    tips: ["「他人の感情は自分で解決しなくていい」を意識する", "「一日の感情リセット時間」を作る（入浴・散歩など）", "断る練習：「今は難しいです」だけでOK", "共感疲れのサインを早めに認識して休む"],
    strengths: ["深い共感力と相手への理解", "場の空気を読んだ丁寧な対応", "人が安心して話せる存在感"],
    work: ["カウンセラー・コーチ", "保育・教育・福祉", "SNSコミュニティ管理", "HR（人事）・面談担当"],
    care: ["感情的な人が少ない職場を選ぶ", "相談できるメンター・安全な相手を確保する", "業務範囲を明確にして抱え込みを防ぐ", "環境音を抑えた席配置にする"],
    notWork: ["クレーム対応・攻撃的な顧客が多い仕事", "ノリと勢いの強い営業環境", "感情労働が激しい仕事"],
    compatible: ["ひっそりふくろう（冷静さで感情的バランスを取る）", "まとめ役さん（役割分担で守ってもらえる）"],
    quote: "「大丈夫？って聞く前に、大丈夫じゃないってわかってる」",
  },
  "B-C-H-F": {
    name: "ひっそりふくろう", tag: "冷静に場を読む孤高の観察者", emoji: "🦉",
    color: "#B45309", bg: "#FFFBEB", grad: ["#FDE68A","#FCD34D"],
    desc: "ほどよい距離感を保ちながら、場や人の関係性を静かに観察するタイプ。感情に巻き込まれないため、全体の状況を冷静に把握できます。観察・分析・状況判断が必要な仕事で大きな力を発揮します。",
    personality: "群れに入らず、少し後ろから場全体を俯瞰する位置が自然体です。感情的な展開には巻き込まれず、常に「何が起きているか」を冷静に分析できます。この距離感は「冷たい」ではなく、全体最適を考えるための知性的なスタイルです。意見を聞かれたとき、圧倒的な洞察を一言で提供できることがあります。ただし、突然の感情的な攻撃や、過度なコミュニケーションを求められる環境では大きく消耗します。",
    ndTraits: ["過剰な感情刺激を回避しようとする", "孤独でも精神的に安定している", "一人で情報を整理することで思考が深まる", "感情より論理・構造で世界を理解する傾向"],
    struggles: ["「もっと意見を言って」と急かされる", "感情的な議論に巻き込まれると疲弊する", "騒がしい職場では思考が整理できない", "内面で考えていることが伝わりにくい"],
    tips: ["考えを「書く」ことで整理→共有する習慣を作る", "感情的な場から物理的・心理的に距離を取る技術を磨く", "自分の観察眼が価値になる場（分析・調査・編集）を選ぶ", "静かな職場環境を優先条件にして仕事を選ぶ"],
    strengths: ["全体を俯瞰する冷静な分析力", "感情に流されない判断の安定性", "観察から得る深い洞察"],
    work: ["分析・調査・研究", "編集・校閲・品質管理", "人事（評価・データ系）", "安定した環境のバックオフィス"],
    care: ["静かな個人席を確保する", "感情的・大声文化をなくす", "一人で作業できる環境を保証する", "無理に場の活動に参加させない"],
    notWork: ["騒がしい外勤・イベント運営", "感情労働・クレーム対応", "テンション高めのチーム文化"],
    compatible: ["きもち読みうさぎ（感情面を補完）", "ていねい博士（深い知的対話ができる）"],
    quote: "「言わなかっただけで、全部見えてました」",
  },
  "B-C-L-N": {
    name: "まとめ役さん", tag: "混乱を整理する調整の達人", emoji: "📋",
    color: "#3B82F6", bg: "#EFF6FF", grad: ["#BFDBFE","#93C5FD"],
    desc: "バラバラの意見を整理し、全員が納得できるポイントを見つける調整型のタイプ。慎重で冷静な判断ができ、プロジェクト管理やファシリテーションで高い価値を発揮します。",
    personality: "混乱した状況を構造化して「ここが論点ですよね」と整理できるのが天才的です。人の意見を丁寧に聞き、それを全体が見える形にまとめる力は、チームの潤滑油として機能します。自分の意見を強く押し出すより、全員が前進できる「最大公約数」を見つけることに満足感があります。板挟みになりやすく、責任の押し付けが最もストレスになるため、明確な権限と役割分担が大切です。",
    ndTraits: ["複数の情報を整理・構造化する能力が高い", "全体最適を自然に考える思考パターン", "板挟みへのストレスが大きい", "物事を概念的に把握してから動く"],
    struggles: ["板挟みで責任を押し付けられる", "強引なリーダーがいると機能しにくい", "自分の意見が埋もれてしまうことがある", "即断即決が求められる場が苦手"],
    tips: ["「私は調整役であって責任者ではない」を明示する", "決定の権限と責任の所在を最初に確認する", "「整理したものです」として提示し、最終判断は委ねる", "自分の意見も適切に主張する練習をする"],
    strengths: ["意見を整理して全員を前進させる力", "冷静な場のファシリテーション", "プロジェクトの進捗管理と調整"],
    work: ["プロジェクト管理・ファシリテーション", "カスタマーサクセス", "人事・総務・バックオフィス全般", "会議の議事整理・進行管理"],
    care: ["明確な権限を渡して板挟みを防ぐ", "会議のルールと進め方を整備する", "冷静な議論文化を大切にする", "個人の責任範囲を曖昧にしない"],
    notWork: ["即断即決の営業・交渉", "騒がしい現場作業", "強引なリーダーが支配する職場"],
    compatible: ["ひらめきくん（アイデアを整理・実行に変える）", "じっくりさん（慎重さが相互補完）"],
    quote: "「みんなの言いたいこと、多分こういうことですよね？」",
  },
  "B-C-L-F": {
    name: "ひとり研究僧", tag: "静かに知識を積み上げる探求者", emoji: "📿",
    color: "#16A34A", bg: "#F0FDF4", grad: ["#BBF7D0","#4ADE80"],
    desc: "静かな環境でコツコツ深く掘り下げることが得意なタイプ。周囲の騒音が苦手で、一人時間の質が成果に直結します。知識の積み上げ型の仕事に向き、研究・学習の持久力が抜群です。",
    personality: "「深く知ること」そのものに喜びを感じ、一つのテーマを何時間でも掘り続けることができます。外から見ると地味ですが、時間をかけて積み上げた知識と洞察は他の誰も持っていない深さになります。人との距離は置きながらも、「正しい情報」「深い理解」へのこだわりは誰よりも強い。周囲の音・雑談・マルチタスクが最も苦手で、一人の静かな時間が直接パフォーマンスに影響します。",
    ndTraits: ["特定テーマへの超集中・過没入", "感覚過敏（騒音・マルチ刺激に弱い）", "単独での深掘り作業への極端な適性", "社会的なやり取りより「調べる・考える」を優先"],
    struggles: ["騒がしい環境で思考が全くまとまらない", "マルチタスクで全ての質が下がる", "即レス・常時対応文化が苦痛", "「もっと人と関わって」と言われる"],
    tips: ["静かな環境（個室・在宅）を最優先に確保する", "一日の作業項目は1〜2個に絞る", "自分のアウトプットを「まとめ」として定期的に可視化する", "知識が深まったテーマで講演・執筆などの機会を作る"],
    strengths: ["特定領域への圧倒的な深掘り力", "長期的な知識の積み上げ持久力", "単独での高精度な作業能力"],
    work: ["データ分析・研究開発", "プログラミング・システム開発", "法務・知財・編集・校閲", "ライティング・専門執筆"],
    care: ["静かな席または在宅勤務を優先する", "マルチタスクを強制しない", "深掘りに必要な時間を十分確保する", "作業の途中割り込みを最大限減らす"],
    notWork: ["騒がしい現場・コールセンター", "チームでの同時リアルタイム作業", "即レスが必須のコミュニケーション仕事"],
    compatible: ["しずか探求者（深い対話で知的刺激を得られる）", "ていねい博士（知識の共鳴・相互補完）"],
    quote: "「邪魔さえされなければ、誰よりも深く行けます」",
  },
};

const TYPE_ORDER = [
  "I-S-H-N","I-S-H-F","I-S-L-N","I-S-L-F",
  "I-C-H-N","I-C-H-F","I-C-L-N","I-C-L-F",
  "B-S-H-N","B-S-H-F","B-S-L-N","B-S-L-F",
  "B-C-H-N","B-C-H-F","B-C-L-N","B-C-L-F",
];

/* ─────────────────────────────────────────────
   SVG CHARACTERS
───────────────────────────────────────────── */
const CharSVG = ({ code, size = 120 }) => {
  const c = TYPES[code]?.color || "#aaa";
  const chars = {
    "I-S-H-N": <svg viewBox="0 0 100 110" width={size} height={size}>
      <circle cx="50" cy="65" r="38" fill={c} opacity=".15"/>
      <ellipse cx="50" cy="68" rx="32" ry="30" fill={c}/>
      <ellipse cx="50" cy="26" rx="11" ry="13" fill="#FFF9C4"/>
      <ellipse cx="50" cy="26" rx="11" ry="13" fill="none" stroke={c} strokeWidth="2"/>
      <rect x="45" y="37" width="10" height="6" rx="2" fill="#FFF9C4" stroke={c} strokeWidth="1.5"/>
      <line x1="47" y1="43" x2="47" y2="45" stroke={c} strokeWidth="1.5"/>
      <line x1="53" y1="43" x2="53" y2="45" stroke={c} strokeWidth="1.5"/>
      <line x1="33" y1="22" x2="28" y2="17" stroke="#FFD700" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="67" y1="22" x2="72" y2="17" stroke="#FFD700" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="28" y1="30" x2="22" y2="30" stroke="#FFD700" strokeWidth="2" strokeLinecap="round"/>
      <line x1="72" y1="30" x2="78" y2="30" stroke="#FFD700" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="40" cy="63" r="5.5" fill="white"/><circle cx="60" cy="63" r="5.5" fill="white"/>
      <circle cx="41" cy="63" r="3" fill="#222"/><circle cx="61" cy="63" r="3" fill="#222"/>
      <circle cx="42" cy="62" r="1.2" fill="white"/>
      <path d="M 41 74 Q 50 82 59 74" stroke="#555" fill="none" strokeWidth="2.5" strokeLinecap="round"/>
      <ellipse cx="33" cy="71" rx="6" ry="3.5" fill="rgba(255,160,100,.35)"/>
      <ellipse cx="67" cy="71" rx="6" ry="3.5" fill="rgba(255,160,100,.35)"/>
    </svg>,
    "I-S-H-F": <svg viewBox="0 0 100 110" width={size} height={size}>
      <circle cx="50" cy="65" r="38" fill={c} opacity=".15"/>
      <ellipse cx="50" cy="68" rx="31" ry="30" fill={c}/>
      <path d="M 73 52 Q 82 35 75 22" stroke="#555" fill="none" strokeWidth="3.5" strokeLinecap="round"/>
      <circle cx="75" cy="20" r="5" fill="#555"/>
      <rect x="28" y="57" width="17" height="13" rx="7" fill="rgba(100,220,255,.35)" stroke="white" strokeWidth="2.5"/>
      <rect x="52" y="57" width="17" height="13" rx="7" fill="rgba(100,220,255,.35)" stroke="white" strokeWidth="2.5"/>
      <line x1="45" y1="63.5" x2="52" y2="63.5" stroke="white" strokeWidth="2.5"/>
      <circle cx="37" cy="63" r="3" fill="#222"/><circle cx="61" cy="63" r="3" fill="#222"/>
      <path d="M 41 76 Q 50 84 59 76" stroke="white" fill="none" strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="84" cy="42" r="4" fill="none" stroke="rgba(150,230,255,.8)" strokeWidth="2"/>
      <circle cx="80" cy="55" r="2.5" fill="none" stroke="rgba(150,230,255,.7)" strokeWidth="1.5"/>
      <circle cx="87" cy="58" r="2" fill="none" stroke="rgba(150,230,255,.6)" strokeWidth="1.5"/>
    </svg>,
    "I-S-L-N": <svg viewBox="0 0 100 110" width={size} height={size}>
      <circle cx="50" cy="65" r="38" fill={c} opacity=".15"/>
      <line x1="8" y1="55" x2="23" y2="55" stroke={c} strokeWidth="2.5" strokeLinecap="round" opacity=".6"/>
      <line x1="6" y1="63" x2="20" y2="63" stroke={c} strokeWidth="2" strokeLinecap="round" opacity=".4"/>
      <line x1="10" y1="71" x2="22" y2="71" stroke={c} strokeWidth="1.5" strokeLinecap="round" opacity=".3"/>
      <ellipse cx="52" cy="68" rx="30" ry="29" fill={c}/>
      <polygon points="50,28 44,42 50,40 44,54 58,37 51,39" fill="#FFD700"/>
      <circle cx="42" cy="63" r="5.5" fill="white"/><circle cx="62" cy="63" r="5.5" fill="white"/>
      <circle cx="43" cy="63" r="3" fill="#222"/><circle cx="63" cy="63" r="3" fill="#222"/>
      <circle cx="44" cy="62" r="1.2" fill="white"/>
      <path d="M 40 74 Q 52 85 64 74" stroke="#555" fill="rgba(255,255,255,.3)" strokeWidth="2.5" strokeLinecap="round"/>
      <ellipse cx="35" cy="72" rx="6" ry="3.5" fill="rgba(255,160,100,.35)"/>
      <ellipse cx="69" cy="72" rx="6" ry="3.5" fill="rgba(255,160,100,.35)"/>
    </svg>,
    "I-S-L-F": <svg viewBox="0 0 100 110" width={size} height={size}>
      <circle cx="50" cy="65" r="38" fill={c} opacity=".15"/>
      <ellipse cx="50" cy="68" rx="32" ry="30" fill={c}/>
      <rect x="20" y="34" width="60" height="5" rx="2.5" fill="white" opacity=".6"/>
      <polygon points="83,24 83,46 97,35" fill="white" opacity=".7"/>
      <circle cx="40" cy="63" r="5.5" fill="white"/><circle cx="60" cy="63" r="5.5" fill="white"/>
      <circle cx="41" cy="63" r="3" fill="#222"/><circle cx="61" cy="63" r="3" fill="#222"/>
      <path d="M 41 74 Q 50 80 59 74" stroke="#555" fill="none" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="36" y1="56" x2="44" y2="58" stroke="rgba(255,255,255,.6)" strokeWidth="2" strokeLinecap="round"/>
      <line x1="56" y1="58" x2="64" y2="56" stroke="rgba(255,255,255,.6)" strokeWidth="2" strokeLinecap="round"/>
    </svg>,
    "I-C-H-N": <svg viewBox="0 0 100 110" width={size} height={size}>
      <circle cx="50" cy="65" r="38" fill={c} opacity=".15"/>
      <ellipse cx="50" cy="68" rx="32" ry="30" fill={c}/>
      <ellipse cx="50" cy="34" rx="22" ry="10" fill="#6D28D9"/>
      <ellipse cx="50" cy="32" rx="20" ry="9" fill="#7C3AED"/>
      <circle cx="64" cy="28" r="4" fill="#5B21B6"/>
      <ellipse cx="79" cy="57" rx="5" ry="7" fill="#A78BFA" opacity=".7"/>
      <ellipse cx="81" cy="67" rx="3" ry="4" fill="#A78BFA" opacity=".5"/>
      <circle cx="40" cy="63" r="5.5" fill="white"/><circle cx="60" cy="63" r="5.5" fill="white"/>
      <circle cx="41" cy="63" r="3" fill="#222"/><circle cx="61" cy="63" r="3" fill="#222"/>
      <circle cx="42" cy="62" r="1.2" fill="white"/>
      <path d="M 42 74 Q 50 80 58 74" stroke="#555" fill="none" strokeWidth="2.5" strokeLinecap="round"/>
      <ellipse cx="34" cy="71" rx="6" ry="3.5" fill="rgba(200,150,255,.4)"/>
      <ellipse cx="66" cy="71" rx="6" ry="3.5" fill="rgba(200,150,255,.4)"/>
    </svg>,
    "I-C-H-F": <svg viewBox="0 0 100 110" width={size} height={size}>
      <circle cx="50" cy="65" r="38" fill={c} opacity=".15"/>
      <ellipse cx="50" cy="68" rx="32" ry="30" fill={c}/>
      <rect x="22" y="36" width="56" height="5" rx="2.5" fill="rgba(255,255,255,.5)"/>
      <g transform="rotate(-30,78,32)"><rect x="70" y="28" width="14" height="5" rx="2.5" fill="rgba(255,255,255,.85)"/><rect x="76" y="24" width="4" height="4" rx="1" fill="rgba(255,255,255,.6)"/></g>
      <circle cx="40" cy="63" r="5.5" fill="white"/><circle cx="60" cy="63" r="5.5" fill="white"/>
      <circle cx="40" cy="63" r="3" fill="#222"/><circle cx="60" cy="63" r="3" fill="#222"/>
      <circle cx="41" cy="62" r="1.2" fill="white"/>
      <path d="M 42 74 Q 50 79 58 74" stroke="#555" fill="none" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="38" cy="80" r="2" fill="rgba(255,255,255,.3)"/>
      <circle cx="50" cy="83" r="2" fill="rgba(255,255,255,.3)"/>
      <circle cx="62" cy="80" r="2" fill="rgba(255,255,255,.3)"/>
    </svg>,
    "I-C-L-N": <svg viewBox="0 0 100 110" width={size} height={size}>
      <circle cx="50" cy="65" r="38" fill={c} opacity=".15"/>
      <ellipse cx="50" cy="68" rx="32" ry="30" fill={c}/>
      <line x1="50" y1="36" x2="50" y2="24" stroke="#166534" strokeWidth="2.5" strokeLinecap="round"/>
      <ellipse cx="50" cy="20" rx="8" ry="6" fill="#4ADE80" transform="rotate(-15 50 20)"/>
      <ellipse cx="44" cy="26" rx="6" ry="4" fill="#86EFAC" transform="rotate(30 44 26)"/>
      <circle cx="40" cy="63" r="5.5" fill="white"/><circle cx="60" cy="63" r="5.5" fill="white"/>
      <circle cx="40" cy="63" r="3" fill="#222"/><circle cx="60" cy="63" r="3" fill="#222"/>
      <circle cx="41" cy="62" r="1.2" fill="white"/>
      <path d="M 42 74 Q 50 81 58 74" stroke="#555" fill="none" strokeWidth="2.5" strokeLinecap="round"/>
      <ellipse cx="34" cy="71" rx="6" ry="3.5" fill="rgba(150,255,180,.4)"/>
      <ellipse cx="66" cy="71" rx="6" ry="3.5" fill="rgba(150,255,180,.4)"/>
    </svg>,
    "I-C-L-F": <svg viewBox="0 0 100 110" width={size} height={size}>
      <circle cx="50" cy="65" r="38" fill={c} opacity=".15"/>
      <ellipse cx="50" cy="68" rx="32" ry="30" fill={c}/>
      <circle cx="40" cy="62" r="9" fill="none" stroke="rgba(255,255,255,.8)" strokeWidth="2.5"/>
      <circle cx="60" cy="62" r="9" fill="none" stroke="rgba(255,255,255,.8)" strokeWidth="2.5"/>
      <line x1="49" y1="62" x2="51" y2="62" stroke="rgba(255,255,255,.8)" strokeWidth="2"/>
      <line x1="26" y1="59" x2="31" y2="62" stroke="rgba(255,255,255,.8)" strokeWidth="2"/>
      <line x1="69" y1="62" x2="74" y2="59" stroke="rgba(255,255,255,.8)" strokeWidth="2"/>
      <circle cx="40" cy="62" r="3" fill="#222"/><circle cx="60" cy="62" r="3" fill="#222"/>
      <circle cx="41" cy="61" r="1.2" fill="white"/>
      <rect x="30" y="80" width="18" height="13" rx="2" fill="rgba(255,255,255,.4)"/>
      <line x1="39" y1="80" x2="39" y2="93" stroke="rgba(255,255,255,.4)" strokeWidth="1.5"/>
      <line x1="33" y1="85" x2="45" y2="85" stroke="rgba(255,255,255,.3)" strokeWidth="1"/>
      <path d="M 42 73 Q 50 79 58 73" stroke="rgba(255,255,255,.8)" fill="none" strokeWidth="2" strokeLinecap="round"/>
    </svg>,
    "B-S-H-N": <svg viewBox="0 0 100 110" width={size} height={size}>
      <circle cx="50" cy="65" r="38" fill={c} opacity=".15"/>
      <ellipse cx="50" cy="68" rx="32" ry="30" fill={c}/>
      <ellipse cx="50" cy="36" rx="26" ry="7" fill="#7C2D12"/>
      <rect x="32" y="25" width="36" height="12" rx="5" fill="#92400E"/>
      <ellipse cx="50" cy="25" rx="18" ry="5" fill="#B45309"/>
      <rect x="32" y="33" width="36" height="4" rx="1" fill="#FDE68A"/>
      <circle cx="40" cy="62" r="6.5" fill="white"/><circle cx="60" cy="62" r="6.5" fill="white"/>
      <circle cx="41" cy="62" r="3.5" fill="#222"/><circle cx="61" cy="62" r="3.5" fill="#222"/>
      <circle cx="42" cy="61" r="1.5" fill="white"/>
      <path d="M 38 74 Q 50 86 62 74" stroke="#555" fill="rgba(255,255,255,.2)" strokeWidth="2.5" strokeLinecap="round"/>
      <ellipse cx="33" cy="70" rx="6" ry="4" fill="rgba(255,160,100,.4)"/>
      <ellipse cx="67" cy="70" rx="6" ry="4" fill="rgba(255,160,100,.4)"/>
    </svg>,
    "B-S-H-F": <svg viewBox="0 0 100 110" width={size} height={size}>
      <circle cx="50" cy="65" r="38" fill={c} opacity=".15"/>
      <ellipse cx="50" cy="68" rx="32" ry="30" fill={c}/>
      <circle cx="73" cy="37" r="12" fill="none" stroke="white" strokeWidth="3" opacity=".75"/>
      <circle cx="73" cy="37" r="8" fill="rgba(255,255,255,.2)"/>
      <line x1="65" y1="45" x2="57" y2="53" stroke="white" strokeWidth="3" strokeLinecap="round" opacity=".75"/>
      <circle cx="40" cy="63" r="6.5" fill="white"/><circle cx="58" cy="63" r="6.5" fill="white"/>
      <circle cx="41" cy="63" r="3.5" fill="#222"/><circle cx="59" cy="63" r="3.5" fill="#222"/>
      <circle cx="42" cy="62" r="1.5" fill="white"/>
      <path d="M 40 75 Q 49 82 58 75" stroke="#555" fill="none" strokeWidth="2.5" strokeLinecap="round"/>
      <ellipse cx="33" cy="71" rx="6" ry="3.5" fill="rgba(255,180,210,.4)"/>
      <ellipse cx="65" cy="71" rx="6" ry="3.5" fill="rgba(255,180,210,.4)"/>
    </svg>,
    "B-S-L-N": <svg viewBox="0 0 100 110" width={size} height={size}>
      <circle cx="50" cy="65" r="38" fill={c} opacity=".15"/>
      <ellipse cx="50" cy="68" rx="32" ry="30" fill={c}/>
      <text x="21" y="35" fontSize="14" fill="white" opacity=".85">♪</text>
      <text x="64" y="31" fontSize="11" fill="white" opacity=".75">♩</text>
      <circle cx="80" cy="47" r="3.5" fill="#FFD700" opacity=".85"/>
      <circle cx="19" cy="56" r="2.5" fill="#FF9FD6" opacity=".75"/>
      <circle cx="83" cy="71" r="2" fill="white" opacity=".65"/>
      <circle cx="14" cy="70" r="3" fill="#A78BFA" opacity=".6"/>
      <circle cx="40" cy="62" r="6.5" fill="white"/><circle cx="60" cy="62" r="6.5" fill="white"/>
      <circle cx="41" cy="62" r="4" fill="#222"/><circle cx="61" cy="62" r="4" fill="#222"/>
      <circle cx="42" cy="61" r="1.5" fill="white"/>
      <path d="M 37 74 Q 50 87 63 74" stroke="#555" fill="rgba(255,255,255,.2)" strokeWidth="2.5" strokeLinecap="round"/>
      <ellipse cx="33" cy="70" rx="6" ry="4" fill="rgba(255,130,220,.4)"/>
      <ellipse cx="67" cy="70" rx="6" ry="4" fill="rgba(255,130,220,.4)"/>
    </svg>,
    "B-S-L-F": <svg viewBox="0 0 100 110" width={size} height={size}>
      <circle cx="50" cy="65" r="38" fill={c} opacity=".15"/>
      <ellipse cx="50" cy="68" rx="32" ry="30" fill={c}/>
      <ellipse cx="50" cy="28" rx="16" ry="9" fill="white" opacity=".8"/>
      <ellipse cx="38" cy="32" rx="10" ry="7" fill="white" opacity=".8"/>
      <ellipse cx="62" cy="32" rx="10" ry="7" fill="white" opacity=".8"/>
      <path d="M 30 96 Q 50 76 70 96" fill="none" stroke="#FF6B6B" strokeWidth="2.5" opacity=".6"/>
      <path d="M 33 96 Q 50 79 67 96" fill="none" stroke="#FFD700" strokeWidth="2" opacity=".5"/>
      <path d="M 36 96 Q 50 82 64 96" fill="none" stroke="#4ADE80" strokeWidth="1.5" opacity=".5"/>
      <circle cx="40" cy="63" r="5.5" fill="white"/><circle cx="60" cy="63" r="5.5" fill="white"/>
      <circle cx="40" cy="63" r="3" fill="#222"/><circle cx="60" cy="63" r="3" fill="#222"/>
      <circle cx="41" cy="62" r="1.2" fill="white"/>
      <path d="M 42 74 Q 50 81 58 74" stroke="#555" fill="none" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>,
    "B-C-H-N": <svg viewBox="0 0 100 110" width={size} height={size}>
      <circle cx="50" cy="65" r="38" fill={c} opacity=".15"/>
      <ellipse cx="50" cy="68" rx="32" ry="30" fill={c}/>
      <ellipse cx="37" cy="24" rx="7" ry="16" fill="white"/>
      <ellipse cx="37" cy="24" rx="4" ry="12" fill="#FFC0CB"/>
      <ellipse cx="63" cy="24" rx="7" ry="16" fill="white"/>
      <ellipse cx="63" cy="24" rx="4" ry="12" fill="#FFC0CB"/>
      <path d="M 50 48 C 50 48 42 41 42 46 C 42 51 50 57 50 57 C 50 57 58 51 58 46 C 58 41 50 48 50 48 Z" fill="white" opacity=".75"/>
      <circle cx="40" cy="63" r="6" fill="white"/><circle cx="60" cy="63" r="6" fill="white"/>
      <circle cx="40" cy="63" r="3.5" fill="#222"/><circle cx="60" cy="63" r="3.5" fill="#222"/>
      <circle cx="41" cy="62" r="1.5" fill="white"/>
      <path d="M 41 75 Q 50 82 59 75" stroke="#555" fill="none" strokeWidth="2.5" strokeLinecap="round"/>
      <ellipse cx="34" cy="71" rx="6" ry="4" fill="rgba(255,160,170,.5)"/>
      <ellipse cx="66" cy="71" rx="6" ry="4" fill="rgba(255,160,170,.5)"/>
    </svg>,
    "B-C-H-F": <svg viewBox="0 0 100 110" width={size} height={size}>
      <circle cx="50" cy="65" r="38" fill={c} opacity=".15"/>
      <ellipse cx="50" cy="68" rx="32" ry="30" fill={c}/>
      <ellipse cx="35" cy="35" rx="7" ry="10" fill={c}/>
      <ellipse cx="65" cy="35" rx="7" ry="10" fill={c}/>
      <ellipse cx="35" cy="35" rx="4" ry="7" fill="#78350F"/>
      <ellipse cx="65" cy="35" rx="4" ry="7" fill="#78350F"/>
      <circle cx="40" cy="63" r="9" fill="white"/><circle cx="60" cy="63" r="9" fill="white"/>
      <circle cx="40" cy="64" r="6" fill="#92400E"/><circle cx="60" cy="64" r="6" fill="#92400E"/>
      <circle cx="40" cy="64" r="3.5" fill="#222"/><circle cx="60" cy="64" r="3.5" fill="#222"/>
      <circle cx="41" cy="63" r="1.5" fill="white"/><circle cx="61" cy="63" r="1.5" fill="white"/>
      <polygon points="50,72 46,77 54,77" fill="#D97706"/>
      <path d="M 19 73 Q 29 68 35 79" fill="rgba(180,83,9,.25)" stroke={c} strokeWidth="1" opacity=".5"/>
      <path d="M 81 73 Q 71 68 65 79" fill="rgba(180,83,9,.25)" stroke={c} strokeWidth="1" opacity=".5"/>
    </svg>,
    "B-C-L-N": <svg viewBox="0 0 100 110" width={size} height={size}>
      <circle cx="50" cy="65" r="38" fill={c} opacity=".15"/>
      <ellipse cx="50" cy="68" rx="32" ry="30" fill={c}/>
      <rect x="62" y="42" width="25" height="33" rx="3" fill="white" opacity=".75"/>
      <rect x="68" y="37" width="13" height="7" rx="3.5" fill="rgba(59,130,246,.7)"/>
      <line x1="65" y1="53" x2="84" y2="53" stroke={c} strokeWidth="1.5" opacity=".7"/>
      <line x1="65" y1="59" x2="84" y2="59" stroke={c} strokeWidth="1.5" opacity=".7"/>
      <line x1="65" y1="65" x2="77" y2="65" stroke={c} strokeWidth="1.5" opacity=".7"/>
      <circle cx="39" cy="63" r="5.5" fill="white"/><circle cx="57" cy="63" r="5.5" fill="white"/>
      <circle cx="39" cy="63" r="3" fill="#222"/><circle cx="57" cy="63" r="3" fill="#222"/>
      <circle cx="40" cy="62" r="1.2" fill="white"/>
      <path d="M 39 74 Q 48 81 57 74" stroke="#555" fill="none" strokeWidth="2.5" strokeLinecap="round"/>
      <ellipse cx="32" cy="71" rx="6" ry="3.5" fill="rgba(147,197,253,.4)"/>
    </svg>,
    "B-C-L-F": <svg viewBox="0 0 100 110" width={size} height={size}>
      <ellipse cx="50" cy="72" rx="34" ry="33" fill="#14532D"/>
      <ellipse cx="50" cy="68" rx="29" ry="28" fill={c}/>
      <rect x="64" y="47" width="20" height="26" rx="4" fill="#FEF3C7" opacity=".9"/>
      <ellipse cx="74" cy="47" rx="10" ry="4.5" fill="#FDE68A" opacity=".9"/>
      <ellipse cx="74" cy="73" rx="10" ry="4.5" fill="#FDE68A" opacity=".9"/>
      <line x1="67" y1="55" x2="81" y2="55" stroke={c} strokeWidth="1.5" opacity=".6"/>
      <line x1="67" y1="61" x2="81" y2="61" stroke={c} strokeWidth="1.5" opacity=".6"/>
      <line x1="67" y1="67" x2="76" y2="67" stroke={c} strokeWidth="1.5" opacity=".6"/>
      <circle cx="39" cy="63" r="5.5" fill="white"/><circle cx="57" cy="63" r="5.5" fill="white"/>
      <circle cx="39" cy="63" r="3" fill="#222"/><circle cx="57" cy="63" r="3" fill="#222"/>
      <circle cx="40" cy="62" r="1.2" fill="white"/>
      <path d="M 41 73 Q 48 78 55 73" stroke="#555" fill="none" strokeWidth="2" strokeLinecap="round"/>
    </svg>,
  };
  return chars[code] || <svg viewBox="0 0 100 100" width={size} height={size}><circle cx="50" cy="50" r="40" fill={c}/></svg>;
};

/* ─────────────────────────────────────────────
   GLOBAL STYLES
───────────────────────────────────────────── */
const globalCSS = `
@import url('https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@400;500;700;900&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Zen Maru Gothic', sans-serif; }
@keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
@keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
@keyframes popIn { 0%{opacity:0;transform:scale(0.4) translateY(20px)} 70%{transform:scale(1.06) translateY(-4px)} 100%{opacity:1;transform:scale(1) translateY(0)} }
@keyframes shimmer { 0%{opacity:.5} 50%{opacity:1} 100%{opacity:.5} }
@keyframes slideLeft { from{opacity:0;transform:translateX(30px)} to{opacity:1;transform:translateX(0)} }
@keyframes scaleIn { from{opacity:0;transform:scale(0.92)} to{opacity:1;transform:scale(1)} }
.float-anim { animation: float 3s ease-in-out infinite; }
.fade-up-1 { animation: fadeUp 0.5s 0s ease both; }
.fade-up-2 { animation: fadeUp 0.5s 0.12s ease both; }
.fade-up-3 { animation: fadeUp 0.5s 0.24s ease both; }
.fade-up-4 { animation: fadeUp 0.5s 0.36s ease both; }
.pop-in { animation: popIn 0.65s cubic-bezier(0.34,1.56,0.64,1) both; }
.slide-in { animation: slideLeft 0.35s ease both; }
.scale-in { animation: scaleIn 0.3s ease both; }
.btn-hover { transition: all 0.2s ease; cursor: pointer; }
.btn-hover:hover { transform: translateY(-2px) scale(1.03); opacity: 0.9; }
.card-hover { transition: all 0.22s ease; cursor: pointer; }
.card-hover:hover { transform: translateY(-5px) scale(1.02); box-shadow: 0 16px 48px rgba(0,0,0,0.13) !important; }
.scale-btn { transition: all 0.14s ease; cursor: pointer; border: none; }
.scale-btn:hover { transform: scale(1.15) translateY(-3px) !important; }
.tab-btn { transition: all 0.2s; cursor: pointer; border: none; font-family: inherit; }
.nav-tab { transition: all 0.2s; cursor: pointer; border: none; font-family: inherit; }
.copy-flash { animation: shimmer 0.6s ease; }
`;

/* ─────────────────────────────────────────────
   SCORE CALCULATION
───────────────────────────────────────────── */
function calcResult(answers) {
  const scores = { I: 0, B: 0, S: 0, C: 0, H: 0, L: 0, N: 0, F: 0 };
  QUESTIONS.forEach((q, i) => {
    const val = answers[i];
    if (val === null || val === undefined) return;
    if (val > 0) scores[q.pos] += val;
    else if (val < 0) scores[q.neg] += -val;
  });
  return (scores.I >= scores.B ? "I" : "B") + "-" +
    (scores.S >= scores.C ? "S" : "C") + "-" +
    (scores.H >= scores.L ? "H" : "L") + "-" +
    (scores.N >= scores.F ? "N" : "F");
}

/* ─────────────────────────────────────────────
   INTRO SCREEN
───────────────────────────────────────────── */
function IntroScreen({ onStart, onGallery }) {
  return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", background:"linear-gradient(135deg,#fce4ec 0%,#e3f2fd 35%,#f3e5f5 65%,#e8f5e9 100%)", padding:"24px 16px" }}>
      <style>{globalCSS}</style>
      <div style={{ position:"fixed", top:-60, left:-60, width:220, height:220, borderRadius:"60% 40% 50%", background:"rgba(255,182,193,.3)", zIndex:0 }}/>
      <div style={{ position:"fixed", bottom:-40, right:-40, width:180, height:180, borderRadius:"50% 60% 40%", background:"rgba(187,222,251,.3)", zIndex:0 }}/>
      <div style={{ position:"fixed", top:"40%", right:"5%", width:120, height:120, borderRadius:"50%", background:"rgba(220,200,255,.25)", zIndex:0 }}/>
      <div style={{ position:"relative", zIndex:1, textAlign:"center", maxWidth:520, width:"100%" }}>
        {/* preview row */}
        <div className="float-anim" style={{ display:"flex", justifyContent:"center", gap:6, marginBottom:20 }}>
          {["I-S-H-N","B-C-H-N","I-C-L-F","B-S-H-N","B-C-H-F"].map((code,i)=>(
            <div key={code} style={{ transform:i===1?"scale(1.2)":i===2?"scale(1.05)":"scale(0.8)", opacity:i===1?1:i===2?0.8:0.55, transition:"all 0.3s" }}>
              <CharSVG code={code} size={80}/>
            </div>
          ))}
        </div>
        <div className="fade-up-1">
          <div style={{ display:"inline-block", background:"rgba(255,255,255,.65)", borderRadius:100, padding:"5px 18px", fontSize:12, fontWeight:700, color:"#9C27B0", letterSpacing:3, marginBottom:14, backdropFilter:"blur(8px)" }}>ND16 TYPE DIAGNOSIS</div>
          <h1 style={{ fontSize:36, fontWeight:900, color:"#3D2060", marginBottom:10, lineHeight:1.2 }}>脳の特性タイプ診断</h1>
          <p style={{ fontSize:14, color:"#6B7280", lineHeight:1.8, marginBottom:6 }}>ND（ニューロダイバージェント）とは、発達障害やグレーゾーン、定型発達とは少し違う脳の特性を持つ人たちの国際的な総称です。</p>
        </div>
        <div className="fade-up-2" style={{ background:"rgba(255,255,255,.55)", borderRadius:20, padding:"18px 22px", marginBottom:22, backdropFilter:"blur(12px)", border:"1px solid rgba(255,255,255,.7)" }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, textAlign:"left" }}>
            {[["💡 注意の向き","内側集中 / 外界反応"],["🧩 情報処理","感覚寄り / 概念寄り"],["⚡ 行動スタイル","波が大きい / ゆっくり安定"],["💫 対人距離","感情に近い / 距離を取る"]].map(([a,b])=>(
              <div key={a} style={{ background:"rgba(255,255,255,.5)", borderRadius:12, padding:"10px 14px" }}>
                <div style={{ fontSize:13, fontWeight:700, color:"#4B0082", marginBottom:2 }}>{a}</div>
                <div style={{ fontSize:11, color:"#9CA3AF" }}>{b}</div>
              </div>
            ))}
          </div>
          <p style={{ fontSize:12, color:"#9CA3AF", marginTop:12, marginBottom:0 }}>✦ 16問 · 各7段階 · 所要時間 約3分</p>
        </div>
        <div className="fade-up-3" style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:12 }}>
          <button className="btn-hover" onClick={onStart} style={{ background:"linear-gradient(135deg,#E91E8C,#7B1FA2)", color:"white", border:"none", borderRadius:100, padding:"16px 52px", fontSize:18, fontWeight:900, cursor:"pointer", boxShadow:"0 8px 30px rgba(200,50,150,.3)", fontFamily:"'Zen Maru Gothic',sans-serif", letterSpacing:1 }}>
            診断スタート →
          </button>
          <button className="btn-hover" onClick={onGallery} style={{ background:"rgba(255,255,255,.65)", color:"#7B1FA2", border:"2px solid rgba(123,31,162,.25)", borderRadius:100, padding:"11px 32px", fontSize:14, fontWeight:700, cursor:"pointer", backdropFilter:"blur(8px)", fontFamily:"'Zen Maru Gothic',sans-serif" }}>
            16キャラ一覧を見る →
          </button>
          <p style={{ fontSize:11, color:"#C0A0C0" }}>正式な医療的診断ではありません。自己理解のためのツールです。</p>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   QUIZ SCREEN
───────────────────────────────────────────── */
const SCALE_VALS = [-3,-2,-1,0,1,2,3];
const axisBgMap = { "I":"#FFF3E0","B":"#FFF3E0","S":"#E8F5E9","C":"#E8F5E9","H":"#EDE7F6","L":"#EDE7F6","N":"#FCE4EC","F":"#FCE4EC" };
const axisColorMap = { "I":"#E65100","B":"#E65100","S":"#2E7D32","C":"#2E7D32","H":"#4527A0","L":"#4527A0","N":"#880E4F","F":"#880E4F" };
const axisNameMap = { "I":"注意の向き","B":"注意の向き","S":"情報処理","C":"情報処理","H":"行動スタイル","L":"行動スタイル","N":"対人距離","F":"対人距離" };

function QuizScreen({ step, total, question, value, onSelect, onNext, onBack }) {
  const bg = axisBgMap[question.pos];
  const color = axisColorMap[question.pos];
  const label = value === null ? null : value === 0 ? "どちらでもない" : value > 0 ? `${value > 2?"強く":value > 1?"":"やや"}そう思う` : `${value < -2?"全く":value < -1?"":"あまり"}そう思わない`;
  return (
    <div style={{ minHeight:"100vh", background:bg, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"24px 16px", fontFamily:"'Zen Maru Gothic',sans-serif" }}>
      <div style={{ width:"100%", maxWidth:560 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
          <button className="btn-hover" onClick={onBack} style={{ background:"transparent", color, fontWeight:700, fontSize:14, padding:"8px 16px", borderRadius:100, border:`2px solid ${color}30`, cursor:"pointer", fontFamily:"'Zen Maru Gothic',sans-serif" }}>← 戻る</button>
          <div style={{ fontSize:12, fontWeight:700, color, background:`${color}15`, padding:"4px 14px", borderRadius:100 }}>{axisNameMap[question.pos]}</div>
          <div style={{ fontSize:16, fontWeight:900, color }}>{step+1}<span style={{ fontSize:11, fontWeight:400, color:`${color}70` }}>/{total}</span></div>
        </div>
        <div style={{ height:8, background:`${color}20`, borderRadius:100, marginBottom:26, overflow:"hidden" }}>
          <div style={{ height:"100%", width:`${((step+1)/total)*100}%`, background:`linear-gradient(90deg,${color}70,${color})`, borderRadius:100, transition:"width 0.4s ease" }}/>
        </div>
        <div className="slide-in" style={{ background:"white", borderRadius:24, padding:"30px 26px", boxShadow:`0 8px 40px ${color}14`, marginBottom:22 }}>
          <p style={{ fontSize:20, fontWeight:700, color:"#2D1B40", lineHeight:1.65, margin:0, textAlign:"center" }}>{question.text}</p>
        </div>
        <div style={{ background:"white", borderRadius:24, padding:"22px 18px", boxShadow:`0 4px 20px ${color}10` }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
            <span style={{ fontSize:11, color:"#9CA3AF" }}>そう思わない</span>
            <span style={{ fontSize:11, color:"#9CA3AF" }}>強くそう思う</span>
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", gap:5, alignItems:"center" }}>
            {SCALE_VALS.map(val=>{
              const abs = Math.abs(val);
              const sz = 34 + abs*5;
              const sel = value === val;
              return (
                <button key={val} className="scale-btn" onClick={()=>onSelect(val)} style={{ width:sz, height:sz, borderRadius:"50%", background:sel?`linear-gradient(135deg,${color},${color}bb)`:`${color}${Math.round((0.25+abs*0.15)*255).toString(16).padStart(2,"0")}`, boxShadow:sel?`0 4px 16px ${color}50`:"none", transform:sel?"scale(1.2) translateY(-4px)":"scale(1)", transition:"all 0.15s" }}/>
              );
            })}
          </div>
          <div style={{ textAlign:"center", marginTop:14, fontSize:13, minHeight:20 }}>
            {label ? <span style={{ color, fontWeight:700 }}>{label}</span> : <span style={{ color:"#9CA3AF" }}>タップして選んでね</span>}
          </div>
        </div>
        <div style={{ textAlign:"center", marginTop:18 }}>
          <button className="btn-hover" onClick={value!==null?onNext:undefined} style={{ background:value!==null?`linear-gradient(135deg,${color},${color}cc)`:"#E5E7EB", color:value!==null?"white":"#9CA3AF", padding:"14px 40px", borderRadius:100, fontSize:16, fontWeight:700, border:"none", boxShadow:value!==null?`0 6px 24px ${color}40`:"none", fontFamily:"'Zen Maru Gothic',sans-serif", cursor:value!==null?"pointer":"default", opacity:value!==null?1:0.6 }}>
            {step<total-1?"次の質問 →":"結果を見る ✦"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   RESULT SCREEN
───────────────────────────────────────────── */
const RESULT_TABS = [
  { key:"personality", label:"性格・内面", icon:"🧠" },
  { key:"ndTraits",    label:"ND特性",    icon:"⚡" },
  { key:"struggles",  label:"困りごと",  icon:"💦" },
  { key:"tips",       label:"対処法",    icon:"💡" },
  { key:"work",       label:"向いてる仕事", icon:"💼" },
  { key:"care",       label:"配慮ポイント", icon:"🤝" },
];

function ResultScreen({ code, onRetry, onGallery }) {
  const t = TYPES[code];
  const [tab, setTab] = useState("personality");
  const [copied, setCopied] = useState(false);
  const shareText = `私のND16タイプは「${t.name}」(${code})でした！${t.tag}\n${t.quote}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText).then(()=>{
      setCopied(true);
      setTimeout(()=>setCopied(false), 2000);
    });
  };

  const currentData = t[tab];

  return (
    <div style={{ minHeight:"100vh", background:`linear-gradient(160deg,${t.bg} 0%,white 50%,${t.bg} 100%)`, padding:"24px 16px 56px", fontFamily:"'Zen Maru Gothic',sans-serif" }}>
      <div style={{ maxWidth:520, margin:"0 auto" }}>
        {/* Nav */}
        <div className="fade-up-1" style={{ display:"flex", justifyContent:"space-between", marginBottom:20 }}>
          <button className="btn-hover" onClick={onGallery} style={{ background:"rgba(255,255,255,.7)", color:t.color, border:`1.5px solid ${t.color}30`, borderRadius:100, padding:"8px 16px", fontSize:13, fontWeight:700, cursor:"pointer", backdropFilter:"blur(8px)", fontFamily:"'Zen Maru Gothic',sans-serif" }}>← 一覧</button>
          <button className="btn-hover" onClick={onRetry} style={{ background:"rgba(255,255,255,.7)", color:"#6B7280", border:"1.5px solid rgba(107,114,128,.2)", borderRadius:100, padding:"8px 16px", fontSize:13, fontWeight:700, cursor:"pointer", backdropFilter:"blur(8px)", fontFamily:"'Zen Maru Gothic',sans-serif" }}>もう一度</button>
        </div>

        {/* Badge */}
        <div className="fade-up-1" style={{ textAlign:"center", marginBottom:6 }}>
          <div style={{ display:"inline-block", background:`${t.color}18`, border:`2px solid ${t.color}35`, borderRadius:100, padding:"6px 22px", fontSize:12, fontWeight:700, color:t.color, letterSpacing:2 }}>あなたのタイプ</div>
        </div>
        <div className="fade-up-1" style={{ textAlign:"center", marginBottom:10 }}>
          <span style={{ fontSize:28, fontWeight:900, color:t.color, letterSpacing:4, background:`${t.color}10`, padding:"6px 22px", borderRadius:14, display:"inline-block" }}>{code}</span>
        </div>

        {/* Character */}
        <div className="pop-in float-anim" style={{ textAlign:"center", marginBottom:6 }}>
          <div style={{ display:"inline-block", background:`${t.color}12`, borderRadius:"50%", padding:18, boxShadow:`0 12px 44px ${t.color}28` }}>
            <CharSVG code={code} size={145}/>
          </div>
        </div>

        {/* Name & quote */}
        <div className="fade-up-2" style={{ textAlign:"center", marginBottom:8 }}>
          <h2 style={{ fontSize:30, fontWeight:900, color:"#2D1B40", marginBottom:6 }}>{t.emoji} {t.name}</h2>
          <p style={{ fontSize:13, color:t.color, fontWeight:700, background:`${t.color}15`, display:"inline-block", padding:"4px 16px", borderRadius:100, marginBottom:10 }}>{t.tag}</p>
          <div style={{ background:`${t.color}10`, border:`1.5px solid ${t.color}25`, borderRadius:16, padding:"12px 18px", marginTop:4 }}>
            <p style={{ fontSize:14, color:"#4B5563", lineHeight:1.7, margin:0, fontStyle:"italic" }}>「{t.quote.replace(/[「」]/g,"")}」</p>
          </div>
        </div>

        {/* Desc */}
        <div className="fade-up-2" style={{ background:"white", borderRadius:20, padding:"18px 20px", marginBottom:18, boxShadow:`0 4px 24px ${t.color}12` }}>
          <p style={{ margin:0, color:"#4B5563", fontSize:13.5, lineHeight:1.8 }}>{t.desc}</p>
        </div>

        {/* Axis */}
        <div className="fade-up-2" style={{ background:"white", borderRadius:20, padding:"14px 18px", marginBottom:18, boxShadow:`0 4px 20px ${t.color}10` }}>
          <p style={{ fontSize:11, fontWeight:700, color:"#9CA3AF", letterSpacing:2, marginBottom:10 }}>4つの特性軸</p>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
            {code.split("-").map((axis,i)=>{
              const labels=[["I","内向き集中","B","外への反応"],["S","感覚・具体","C","概念・抽象"],["H","波が大きい","L","ゆっくり安定"],["N","感情に近い","F","距離を取る"]];
              const [a,al,b,bl]=labels[i]; const isA=axis===a;
              return (
                <div key={i} style={{ background:`${t.color}10`, borderRadius:12, padding:"10px 12px", display:"flex", alignItems:"center", gap:8 }}>
                  <div style={{ fontSize:20, fontWeight:900, color:t.color, minWidth:24 }}>{axis}</div>
                  <div>
                    <div style={{ fontSize:10, color:"#9CA3AF" }}>軸{i+1}</div>
                    <div style={{ fontSize:12, fontWeight:700, color:"#374151" }}>{isA?al:bl}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detail tabs */}
        <div className="fade-up-3">
          <div style={{ display:"flex", gap:4, marginBottom:10, overflowX:"auto", paddingBottom:2 }}>
            {RESULT_TABS.map(({key,label,icon})=>(
              <button key={key} className="tab-btn" onClick={()=>setTab(key)} style={{ flexShrink:0, padding:"9px 12px", borderRadius:14, fontSize:12, fontWeight:700, background:tab===key?t.color:`${t.color}14`, color:tab===key?"white":t.color, boxShadow:tab===key?`0 4px 16px ${t.color}40`:"none", whiteSpace:"nowrap" }}>
                {icon} {label}
              </button>
            ))}
          </div>
          <div className="scale-in" key={tab} style={{ background:"white", borderRadius:20, padding:"18px 20px", boxShadow:`0 4px 20px ${t.color}10`, minHeight:140 }}>
            {Array.isArray(currentData) ? currentData.map((item,i)=>(
              <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:12, padding:"10px 0", borderBottom:i<currentData.length-1?`1px solid ${t.color}12`:"none" }}>
                <div style={{ width:28, height:28, borderRadius:"50%", background:`${t.color}18`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:1 }}>
                  <span style={{ color:t.color, fontWeight:900, fontSize:12 }}>{["✦","●","◆","▲","★","✿"][i%6]}</span>
                </div>
                <span style={{ fontSize:13.5, color:"#374151", fontWeight:500, lineHeight:1.6 }}>{item}</span>
              </div>
            )) : (
              <p style={{ color:"#4B5563", fontSize:13.5, lineHeight:1.8, margin:0 }}>{currentData}</p>
            )}
          </div>
        </div>

        {/* Compatible */}
        <div className="fade-up-3" style={{ background:"white", borderRadius:20, padding:"16px 20px", marginTop:16, boxShadow:`0 4px 20px ${t.color}10` }}>
          <p style={{ fontSize:11, fontWeight:700, color:"#9CA3AF", letterSpacing:2, marginBottom:10 }}>相性のいいタイプ</p>
          {t.compatible.map((item,i)=>(
            <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 0", borderBottom:i<t.compatible.length-1?`1px solid ${t.color}12`:"none" }}>
              <span style={{ fontSize:16 }}>💫</span>
              <span style={{ fontSize:13, color:"#374151" }}>{item}</span>
            </div>
          ))}
        </div>

        {/* Share */}
        <div className="fade-up-4" style={{ marginTop:22 }}>
          <div style={{ background:`linear-gradient(135deg,${t.color}18,${t.color}08)`, border:`1.5px solid ${t.color}25`, borderRadius:20, padding:"18px 20px" }}>
            <p style={{ fontSize:12, fontWeight:700, color:"#9CA3AF", letterSpacing:2, marginBottom:10 }}>結果をシェアする</p>
            <div style={{ background:"rgba(255,255,255,.7)", borderRadius:14, padding:"14px 16px", marginBottom:14, backdropFilter:"blur(6px)" }}>
              <p style={{ fontSize:13, color:"#374151", lineHeight:1.7, margin:0, whiteSpace:"pre-line" }}>{shareText}</p>
            </div>
            <div style={{ display:"flex", gap:10 }}>
              <button className="btn-hover" onClick={handleCopy} style={{ flex:1, background:copied?`#22C55E`:t.color, color:"white", border:"none", borderRadius:100, padding:"12px 0", fontSize:13, fontWeight:700, cursor:"pointer", boxShadow:`0 4px 16px ${t.color}35`, fontFamily:"'Zen Maru Gothic',sans-serif", transition:"all 0.3s" }}>
                {copied ? "✓ コピー完了！" : "📋 テキストをコピー"}
              </button>
              <button className="btn-hover" onClick={()=>{ const url=`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`; window.open(url,"_blank"); }} style={{ flex:1, background:"#1DA1F2", color:"white", border:"none", borderRadius:100, padding:"12px 0", fontSize:13, fontWeight:700, cursor:"pointer", boxShadow:"0 4px 16px rgba(29,161,242,.35)", fontFamily:"'Zen Maru Gothic',sans-serif" }}>
                𝕏 Xでシェア
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   GALLERY SCREEN
───────────────────────────────────────────── */
function GalleryScreen({ onBack, onViewType, highlightCode }) {
  const [filter, setFilter] = useState("all");
  const filters = [
    { key:"all", label:"全16タイプ" },
    { key:"I", label:"内向き (I)" },
    { key:"B", label:"外向き (B)" },
    { key:"S", label:"感覚 (S)" },
    { key:"C", label:"概念 (C)" },
  ];
  const shown = TYPE_ORDER.filter(code=>{
    if (filter==="all") return true;
    return code.startsWith(filter+"-") || code.split("-").includes(filter);
  });
  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(135deg,#f8f0ff 0%,#f0f7ff 50%,#fff0f5 100%)", padding:"24px 16px 48px", fontFamily:"'Zen Maru Gothic',sans-serif" }}>
      {/* Header */}
      <div style={{ maxWidth:640, margin:"0 auto" }}>
        <div className="fade-up-1" style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
          <button className="btn-hover" onClick={onBack} style={{ background:"rgba(255,255,255,.8)", color:"#7B1FA2", border:"1.5px solid rgba(123,31,162,.2)", borderRadius:100, padding:"9px 18px", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"'Zen Maru Gothic',sans-serif" }}>← 戻る</button>
          <div>
            <h2 style={{ fontSize:22, fontWeight:900, color:"#3D2060", lineHeight:1 }}>16キャラ図鑑</h2>
            <p style={{ fontSize:12, color:"#9CA3AF", marginTop:2 }}>タップして詳細を見る</p>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="fade-up-2" style={{ display:"flex", gap:6, marginBottom:20, overflowX:"auto", paddingBottom:4 }}>
          {filters.map(({key,label})=>(
            <button key={key} className="tab-btn" onClick={()=>setFilter(key)} style={{ flexShrink:0, padding:"8px 16px", borderRadius:100, fontSize:12, fontWeight:700, background:filter===key?"#7B1FA2":"rgba(255,255,255,.8)", color:filter===key?"white":"#7B1FA2", border:`1.5px solid ${filter===key?"#7B1FA2":"rgba(123,31,162,.2)"}`, boxShadow:filter===key?"0 4px 16px rgba(123,31,162,.3)":"none" }}>
              {label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))", gap:14 }}>
          {shown.map((code,i)=>{
            const t = TYPES[code];
            const isHL = code===highlightCode;
            return (
              <div key={code} className="card-hover" onClick={()=>onViewType(code)} style={{ background:isHL?`linear-gradient(135deg,${t.color}25,${t.color}10)`:"white", borderRadius:20, padding:"16px 12px", textAlign:"center", boxShadow:isHL?`0 8px 30px ${t.color}35`:`0 4px 18px rgba(0,0,0,.07)`, border:isHL?`2px solid ${t.color}60`:"2px solid transparent", animation:`fadeUp 0.4s ${i*0.04}s ease both`, cursor:"pointer", position:"relative" }}>
                {isHL && <div style={{ position:"absolute", top:8, right:8, background:t.color, color:"white", borderRadius:100, padding:"2px 8px", fontSize:10, fontWeight:700 }}>あなた</div>}
                <div style={{ marginBottom:6 }}>
                  <CharSVG code={code} size={72}/>
                </div>
                <div style={{ fontSize:10, fontWeight:700, color:t.color, background:`${t.color}15`, borderRadius:100, padding:"2px 8px", marginBottom:6, display:"inline-block" }}>{code}</div>
                <div style={{ fontSize:13, fontWeight:700, color:"#2D1B40", lineHeight:1.3, marginBottom:4 }}>{t.name}</div>
                <div style={{ fontSize:10, color:"#9CA3AF", lineHeight:1.4 }}>{t.tag}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   TYPE DETAIL MODAL (from gallery)
───────────────────────────────────────────── */
function TypeDetailScreen({ code, onBack, onStartQuiz }) {
  const t = TYPES[code];
  const [tab, setTab] = useState("personality");
  const currentData = t[tab];
  return (
    <div style={{ minHeight:"100vh", background:`linear-gradient(160deg,${t.bg} 0%,white 60%,${t.bg} 100%)`, padding:"24px 16px 56px", fontFamily:"'Zen Maru Gothic',sans-serif" }}>
      <div style={{ maxWidth:520, margin:"0 auto" }}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:20 }}>
          <button className="btn-hover" onClick={onBack} style={{ background:"rgba(255,255,255,.8)", color:t.color, border:`1.5px solid ${t.color}30`, borderRadius:100, padding:"9px 18px", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"'Zen Maru Gothic',sans-serif" }}>← 一覧に戻る</button>
          <button className="btn-hover" onClick={onStartQuiz} style={{ background:t.color, color:"white", border:"none", borderRadius:100, padding:"9px 18px", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"'Zen Maru Gothic',sans-serif" }}>診断する →</button>
        </div>

        <div style={{ textAlign:"center", marginBottom:6 }}>
          <span style={{ fontSize:24, fontWeight:900, color:t.color, letterSpacing:4, background:`${t.color}12`, padding:"5px 20px", borderRadius:14, display:"inline-block" }}>{code}</span>
        </div>
        <div className="float-anim" style={{ textAlign:"center", margin:"8px 0 10px" }}>
          <div style={{ display:"inline-block", background:`${t.color}12`, borderRadius:"50%", padding:16, boxShadow:`0 10px 36px ${t.color}22` }}>
            <CharSVG code={code} size={130}/>
          </div>
        </div>
        <div style={{ textAlign:"center", marginBottom:14 }}>
          <h2 style={{ fontSize:28, fontWeight:900, color:"#2D1B40", marginBottom:6 }}>{t.emoji} {t.name}</h2>
          <p style={{ fontSize:13, color:t.color, fontWeight:700, background:`${t.color}15`, display:"inline-block", padding:"4px 16px", borderRadius:100 }}>{t.tag}</p>
        </div>

        <div style={{ background:"white", borderRadius:20, padding:"16px 18px", marginBottom:16, boxShadow:`0 4px 20px ${t.color}10` }}>
          <p style={{ fontSize:13, color:"#4B5563", lineHeight:1.8, margin:0 }}>{t.desc}</p>
        </div>

        <div style={{ background:`${t.color}10`, border:`1.5px solid ${t.color}22`, borderRadius:16, padding:"12px 18px", marginBottom:16 }}>
          <p style={{ fontSize:14, color:"#4B5563", fontStyle:"italic", margin:0, textAlign:"center" }}>「{t.quote.replace(/[「」]/g,"")}」</p>
        </div>

        {/* Tabs */}
        <div style={{ display:"flex", gap:4, marginBottom:10, overflowX:"auto", paddingBottom:2 }}>
          {RESULT_TABS.map(({key,label,icon})=>(
            <button key={key} className="tab-btn" onClick={()=>setTab(key)} style={{ flexShrink:0, padding:"8px 11px", borderRadius:12, fontSize:12, fontWeight:700, background:tab===key?t.color:`${t.color}14`, color:tab===key?"white":t.color, boxShadow:tab===key?`0 4px 14px ${t.color}40`:"none" }}>
              {icon} {label}
            </button>
          ))}
        </div>
        <div key={tab} className="scale-in" style={{ background:"white", borderRadius:20, padding:"16px 18px", boxShadow:`0 4px 20px ${t.color}10`, minHeight:120, marginBottom:16 }}>
          {Array.isArray(currentData) ? currentData.map((item,i)=>(
            <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:10, padding:"9px 0", borderBottom:i<currentData.length-1?`1px solid ${t.color}12`:"none" }}>
              <div style={{ width:26, height:26, borderRadius:"50%", background:`${t.color}18`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <span style={{ color:t.color, fontSize:11, fontWeight:900 }}>{["✦","●","◆","▲","★","✿"][i%6]}</span>
              </div>
              <span style={{ fontSize:13, color:"#374151", lineHeight:1.6 }}>{item}</span>
            </div>
          )) : (
            <p style={{ color:"#4B5563", fontSize:13, lineHeight:1.8, margin:0 }}>{currentData}</p>
          )}
        </div>

        <div style={{ background:"white", borderRadius:20, padding:"14px 18px", boxShadow:`0 4px 20px ${t.color}10` }}>
          <p style={{ fontSize:11, fontWeight:700, color:"#9CA3AF", letterSpacing:2, marginBottom:10 }}>相性のいいタイプ</p>
          {t.compatible.map((item,i)=>(
            <div key={i} style={{ display:"flex", gap:10, padding:"8px 0", borderBottom:i<t.compatible.length-1?`1px solid ${t.color}12`:"none" }}>
              <span>💫</span><span style={{ fontSize:13, color:"#374151" }}>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN APP
───────────────────────────────────────────── */
export default function App() {
  const [phase, setPhase] = useState("intro");   // intro | quiz | result | gallery | typeDetail
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState(Array(16).fill(null));
  const [result, setResult] = useState(null);
  const [galleryDetail, setGalleryDetail] = useState(null);

  // URL hash sync
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.startsWith("#result=")) {
      const code = hash.replace("#result=","");
      if (TYPES[code]) { setResult(code); setPhase("result"); }
    }
  }, []);

  useEffect(() => {
    if (phase==="result" && result) {
      window.history.replaceState(null,"",`#result=${result}`);
    } else if (phase==="intro" || phase==="quiz") {
      window.history.replaceState(null,"","#");
    }
  }, [phase, result]);

  const selectAnswer = val => {
    const a=[...answers]; a[step]=val; setAnswers(a);
  };
  const goNext = () => {
    if (answers[step]===null) return;
    if (step<15) { setStep(s=>s+1); }
    else { const code=calcResult(answers); setResult(code); setPhase("result"); }
  };
  const goBack = () => {
    if (step>0) setStep(s=>s-1);
    else setPhase("intro");
  };
  const retry = () => { setPhase("intro"); setStep(0); setAnswers(Array(16).fill(null)); setResult(null); };

  if (phase==="intro") return <IntroScreen onStart={()=>{setStep(0);setAnswers(Array(16).fill(null));setPhase("quiz");}} onGallery={()=>setPhase("gallery")}/>;
  if (phase==="quiz") return <QuizScreen step={step} total={16} question={QUESTIONS[step]} value={answers[step]} onSelect={selectAnswer} onNext={goNext} onBack={goBack}/>;
  if (phase==="result") return <ResultScreen code={result} onRetry={retry} onGallery={()=>setPhase("gallery")}/>;
  if (phase==="gallery") return <GalleryScreen onBack={()=>setPhase(result?"result":"intro")} onViewType={code=>{setGalleryDetail(code);setPhase("typeDetail");}} highlightCode={result}/>;
  if (phase==="typeDetail") return <TypeDetailScreen code={galleryDetail} onBack={()=>setPhase("gallery")} onStartQuiz={()=>{setStep(0);setAnswers(Array(16).fill(null));setPhase("quiz");}}/>;
  return null;
}