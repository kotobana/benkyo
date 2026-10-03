export type Flaw = {
  id: string;
  name: string;
  targetElement: string;
  hint: string;
  explanation: string;
  howToFix: string;
};

export type StageData = {
  id: string;
  number: number;
  title: string;
  subTitle: string;
  category: string;
  badUiName: string;
  goodUiName: string;
  situation: string;
  flaws: Flaw[];
};

export const STAGES_DATA: StageData[] = [
  // ステージ1: フード注文サイト
  {
    id: 'stage-burger',
    number: 1,
    title: 'ハンバーガー注文サイト',
    subTitle: 'お腹がすいた！早く注文したいのに…',
    category: 'ネット注文 / モバイルオーダー',
    badUiName: '💀 イライラバーガー（クソUI版）',
    goodUiName: '✨ スマイルバーガー（神UI版）',
    situation: '放課後、友達と食べるハンバーガーをスマホで注文しようとしたら、悪夢のような使いにくさだった…！罠を見つけて救い出せ！',
    flaws: [
      {
        id: 'no-photo',
        name: 'メニューに写真がない！',
        targetElement: 'menu-photo-area',
        hint: 'メニューの写真があるべき場所を見てみよう',
        explanation: '文字だけで「デラックスバーガー」と書かれても、どんな具材が入っているのか、どれくらいの大きさなのか全然わかりません！',
        howToFix: '美味しそうな写真を大きく載せて、パッと見て味がイメージできるようにする。'
      },
      {
        id: 'tiny-button',
        name: '「カートに入れる」が小さすぎる！',
        targetElement: 'cart-add-btn',
        hint: '商品をカゴに入れるボタンを押そうとしてみて',
        explanation: 'ボタンが小さすぎて指で正確にタップできません！何度も押し間違えてイライラが爆発します。',
        howToFix: 'スマホの親指で無理なく押せる大きさ（最低でも44px以上）にする。'
      },
      {
        id: 'hidden-total',
        name: '合計金額がどこにも書いてない！',
        targetElement: 'total-price-area',
        hint: '今、全部でいくら買っているか画面からわかる？',
        explanation: '今いくら頼んだかわからないまま注文するのはめちゃくちゃ不安！財布のお金が足りるか心配になります。',
        howToFix: '画面の下や上に「現在の合計: 2点 ¥980」と常にわかりやすく表示する。'
      },
      {
        id: 'trap-cancel-btn',
        name: '「注文」の真横に「全消去」ボタン！',
        targetElement: 'checkout-actions-area',
        hint: '一番下の注文ボタンの周りをよく見てみよう',
        explanation: '「注文確定」と同じ色・同じ大きさで、すぐ隣に「すべてキャンセル」が並んでいます！うっかり触れたら全部最初からやり直し！',
        howToFix: '注文ボタンは大きく目立たせ、キャンセルは小さく離れた場所に置く。'
      }
    ]
  },

  // ステージ2: ゲームのアカウント登録画面
  {
    id: 'stage-game-reg',
    number: 2,
    title: '人気ゲームのアカウント登録',
    subTitle: '早く友達とオンライン対戦したいのに…',
    category: 'ゲーム・アプリのログイン画面',
    badUiName: '💀 トラップ登録画面（クソUI版）',
    goodUiName: '✨ スムーズ登録画面（神UI版）',
    situation: '新作ゲームのアカウントを作ろうとしたら、理不尽なエラーばかりで全然登録できない…！罠を見つけてゲームを始めよう！',
    flaws: [
      {
        id: 'hidden-password-rules',
        name: 'パスワードの条件を後出しで怒られる！',
        targetElement: 'password-input-field',
        hint: 'パスワードを入れたあとの反応に注目',
        explanation: '入力前は何のルールも教えてくれないのに、送信した瞬間に「8文字以上で大文字と記号を含めろ！」と真っ赤に怒られます。理不尽！',
        howToFix: '入力する前から「8文字以上」「大文字を含む」などのルールを親切に表示しておく。'
      },
      {
        id: 'clear-on-back',
        name: '戻るを押すと全部消える！',
        targetElement: 'back-button-area',
        hint: '入力中に「前の画面に戻る」とどうなる？',
        explanation: 'ひとつ前の画面に戻っただけで、苦労して入力したニックネームやメアドが全部まっさらリセット！やる気が失せます。',
        howToFix: '一度入力したデータは一時保存しておき、戻っても消えないようにする。'
      },
      {
        id: 'ambiguous-submit',
        name: '送信ボタンが押せるのかわからない！',
        targetElement: 'submit-button-area',
        hint: '一番下の決定ボタン、いま押せる状態に見える？',
        explanation: 'ボタンが薄い灰色で、押せるのか押せない（無効な）のか見分けがつきません。押したのに反応したかも怪しい！',
        howToFix: '条件がそろったら鮮やかな色に光り、ハッキリ「押せる！」とわかるようにする。'
      },
      {
        id: 'tiny-terms-checkbox',
        name: '利用規約のチェックが小さすぎる！',
        targetElement: 'terms-checkbox-area',
        hint: '「利用規約に同意する」の四角いチェックを見て',
        explanation: '米粒みたいに小さなチェックボックス。何回タップしてもチェックが入らず、画面がズームされてイライラ！',
        howToFix: 'チェックボックスを大きくし、文字の部分をタップしてもチェックが入るようにする。'
      }
    ]
  },

  // ステージ3: 学校の時間割・連絡アプリ
  {
    id: 'stage-school-app',
    number: 3,
    title: '学校の時間割・行事連絡アプリ',
    subTitle: '明日の持ち物なんだっけ…？',
    category: '学校ポータル / 連絡網',
    badUiName: '💀 メガチカ連絡網（クソUI版）',
    goodUiName: '✨ すっきり学校手帳（神UI版）',
    situation: '明日の時間割と持ち物を調べたいのに、目がチカチカして大事な情報が全然見つからない…！使いやすい学校手帳に変身させよう！',
    flaws: [
      {
        id: 'eye-bleeding-colors',
        name: '蛍光色でチカチカして目が痛い！',
        targetElement: 'color-theme-area',
        hint: '背景と文字の色をじっくり見てみて…',
        explanation: '真っ黄色な背景に蛍光ピンクの文字！コントラストが悪すぎて文字が読めず、3秒で目が疲れてしまいます。',
        howToFix: '白や薄いグレーをベースに、黒や濃い文字を使って、目に優しく読みやすい色にする。'
      },
      {
        id: 'buried-important-info',
        name: '超重要な持ち物が一番下にある！',
        targetElement: 'items-bring-area',
        hint: '「明日の持ち物」を探すのにどれくらいスクロールした？',
        explanation: '「校長先生の今週の言葉」が一番上で、一番知りたい「明日の体操着・習字セット」が一番下までスクロールしないと見えません！',
        howToFix: '生徒や保護者が一番確認したい重要な情報（明日の持ち物）を一番上に大きく配置する。'
      },
      {
        id: 'no-feedback-buttons',
        name: 'タップしても反応がない（押せたかわからない）！',
        targetElement: 'action-button-area',
        hint: 'ボタンを押したとき、色が変わったり動いたりする？',
        explanation: 'タップしても色が変わらず、音もアニメーションもないので「あれ？押せた？フリーズした？」と不安になり、何度も連打してしまいます。',
        howToFix: '押した瞬間に色が濃くなったり、少し凹むアニメーションをつけて「押せたよ！」と伝える。'
      },
      {
        id: 'jumbled-days',
        name: '時間割の曜日がバラバラ！',
        targetElement: 'timetable-days-area',
        hint: '時間割の曜日並び（月・火・水…）をよく見てみて',
        explanation: '「月曜 ➔ 金曜 ➔ 火曜 ➔ 木曜 ➔ 水曜」とバラバラに並んでいて、明日の時間割を探すのに無駄な時間がかかります！',
        howToFix: '月〜金の順番で自然に整列させ、今日の曜日が一目でわかるバッジをつける。'
      }
    ]
  }
];
