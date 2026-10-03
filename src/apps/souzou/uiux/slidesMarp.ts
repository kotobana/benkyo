/**
 * 創造学習 第1回「UI/UXってなに？」 Marp形式スライドMarkdown
 * Marp CLI, VS Code Marp Extension, および本アプリのスライドビューアで直接利用可能
 */

export const UIUX_MARP_MARKDOWN = `---
marp: true
theme: default
paginate: true
header: "創造学習 第1回: UI/UXってなに？"
footer: "無料塾 benkyo 探究プログラム"
style: |
  section {
    font-family: 'Noto Sans JP', -apple-system, sans-serif;
    background: #fbfdfc;
    color: #24382e;
    padding: 40px 60px;
    font-size: 26px;
  }
  h1 {
    color: #1b3d30;
    font-size: 44px;
    margin-bottom: 20px;
  }
  h2 {
    color: #2b5f49;
    font-size: 34px;
    margin-bottom: 16px;
  }
  h3 {
    color: #3b7b60;
    font-size: 26px;
  }
  .columns {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 28px;
    margin-top: 20px;
  }
  .card-a, .card-b {
    background: #ffffff;
    border: 3px solid #dce8e0;
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.04);
  }
  .card-a { border-color: #fca5a5; }
  .card-b { border-color: #86efac; }
  .badge-mission {
    background: #e6f4ec;
    color: #1a633a;
    padding: 6px 14px;
    border-radius: 20px;
    font-weight: bold;
    display: inline-block;
    font-size: 20px;
  }
  .point-box {
    background: #ffffff;
    border-left: 6px solid #315e4d;
    padding: 16px 20px;
    margin: 14px 0;
    border-radius: 0 12px 12px 0;
    box-shadow: 0 2px 8px rgba(0,0,0,0.03);
  }
---

<!-- _class: lead -->
<span class="badge-mission">💡 月1回 50分探究プログラム</span>

# UI/UXってなんだろう？
### 〜使う人の気持ちを考えるデザインの魔法〜

**今日のミッション**
「なんか使いにくい！」「めっちゃわかりやすい！」の正体を解き明かそう！

---

## 今日のタイムスケジュール（50分）

<div class="point-box">
  <strong>① 講義（15分）：直感2択クイズ＆解説</strong><br>
  「どっちがいい？」を体感して、UIとUXの違いを知ろう
</div>

<div class="point-box">
  <strong>② ゲーム（30分）：クソUI脱出ゲーム ＆ 神UI見比べ</strong><br>
  身近なサイト（バーガー注文・ゲーム登録・学校連絡）の罠を探せ！
</div>

<div class="point-box">
  <strong>③ まとめ（5分）：日常のデザイン観察</strong><br>
  身の回りの「思いやりデザイン」を見つけてみよう
</div>

---

<!-- _class: lead -->
# イントロ：直感クイズ Q1
## どっちの電子レンジを使いたい？

冷凍ごはんを温めたい！パッと見てすぐ使えるのはどっち？

<div class="columns">
<div class="card-a">

### 🅰️ スタイリッシュ英語ボタン
- 黒いボディに小さく英語がズラリ
- 「START」「CANCEL」「MENU」…
- 💭 *「えっ、温めはどれ押せばいいの？」*

</div>
<div class="card-b">

### 🅱️ 大きな「あたため」ボタン
- 白いボディに日本語で大きなボタン
- 「あたため（スタート）」が光っている
- 💭 *「迷わず1秒でポンと押せる！」*

</div>
</div>

---

## Q1の解説：なぜBを選びたくなるの？

- 多くの人が **🅱️（大きなあたためボタン）** を直感で選びました！
- 理由：
  - **「探す手間」がない**（一番よく使うボタンが目立っている）
  - **「英語が読めなくてもわかる」**（誰でも失敗しない）

> 💡 **見た目のカッコよさ（A）** より、
> **使う人が迷わない工夫（B）** の方が親切！

---

<!-- _class: lead -->
# イントロ：直感クイズ Q2
## どっちの「データ削除」が安心？

大事なセーブデータを消すときの画面、どっちが親切？

<div class="columns">
<div class="card-a">

### 🅰️ 赤い大きな「削除」ボタン
- 押した瞬間、何も聞かれずに即データ消去！
- 💭 *「うっかり手が当たっただけで全部消えた…！！😱」*

</div>
<div class="card-b">

### 🅱️ 確認ダイアログが出るボタン
- 「本当に消しますか？【はい / いいえ】」と再確認
- 💭 *「間違えて押しても、やり直せるから安心！😌」*

</div>
</div>

---

## Q2の解説：間違えやすい行動を止めてあげる

- 迷わず **🅱️（確認ダイアログ）** ですね！
- 人間は誰でも「うっかりミス」をします。
  - つまずくのを防ぐデザインを **「ポカヨケ（フールプルーフ）」** と呼びます。

> 💡 **「使う人が失敗しないように先回りする」** のもデザインの大切な役目！

---

<!-- _class: lead -->
# イントロ：直感クイズ Q3
## どっちのドアが押しやすい？

コンビニや学校の出入り口のドア、どっちが迷わない？

<div class="columns">
<div class="card-a">

### 🅰️ 両側に同じ「縦の取っ手」
- 引くのか押すのかわからない
- 押そうとしたら開かなくてガタガタ…
- 💭 *「どっちやねん！」*

</div>
<div class="card-b">

### 🅱️ 押す側には「平らな横バー」
- 引く取っ手がないので、「押すしかない」
- 体が触れるだけで自然に開く
- 💭 *「考える前に体が動いて通れる！」*

</div>
</div>

---

## いよいよ本題：UIとUXってなに？

<div class="columns">
<div class="card-a" style="border-color: #3b82f6;">

### 📱 UI（ユーザーインターフェース）
- **「見た目」「ボタン」「画面の配置」**
- 人と機械が触れ合う **接点・道具** のこと！
- 例：ボタンの形、文字の大きさ、色、取っ手

</div>
<div class="card-b" style="border-color: #10b981;">

### 😊 UX（ユーザーエクスペリエンス）
- **「使ったときの気持ち」「体験」**
- UIを触った結果、**どう感じたか？**
- 例：「注文しやすかった！」「イライラした…」「安心した！」

</div>
</div>

> **UIは手段、UXは心！**
> よいUIがあるからこそ、よいUX（うれしい気持ち）が生まれます。

---

## 身近な「神UI/UX」の例

- **自販機の小銭投入口**
  - 横長じゃなくて、コインを何枚もまとめてジャラッと入れられるお皿型！
- **LINEの既読表示・送信取り消し**
  - メッセージが相手に届いたか安心できる、間違えても消せる安心感。
- **フタが丸いペットボトル**
  - 回すだけで簡単に開け閉めできる。

> 私たちの周りは、誰かが考えてくれた **「思いやりデザイン」** で溢れています！

---

<!-- _class: lead -->
# さあ、クソUI脱出ゲームへ！
## 💀 使いにくいサイトの罠を暴け！

わざとイライラするように作られた「クソUIサイト」を用意しました！
班で協力して、潜んでいる罠をクリックで見つけ出そう！

<div class="columns">
<div class="point-box">
  <strong>🍔 ステージ1: ハンバーガー注文</strong><br>
  写真がない？ボタンが小さすぎる？
</div>
<div class="point-box">
  <strong>⚔️ ステージ2: ゲーム会員登録</strong><br>
  パスワード条件が非表示？戻ると全消去？
</div>
</div>

<div class="point-box" style="margin-top: 10px;">
  <strong>🏫 ステージ3: 学校連絡・出席アプリ</strong><br>
  ボタンを押しても無反応？大事な連絡が奥底に埋もれてる？
</div>

> 🌟 **「✨ 神UI版」に切り替えると、同じサイトの超使いやすいバージョンが見られるよ！**

---

<!-- _class: lead -->
# 今日のまとめ：デザインは「思いやり」

1. **UIは「見た目」、UXは「使ったときの気持ち」**
2. **良いデザインは、使う人を迷わせない・失敗させない**
3. **プログラミングをしなくても、デザインの視点は誰でも使える！**
   - 友達にノートを見せるとき、字を大きく書くのもUI/UX！
   - 相手がどう感じるかを想像することが、すべての第一歩です。

**ご清聴ありがとうございました！👏**
`;

export interface ParsedMarpSlide {
  index: number;
  content: string;
  isLead: boolean;
  title: string;
}

/**
 * Marp Markdown文字列を各スライドに分割・簡易パースする関数
 */
export function parseMarpSlides(markdown: string): ParsedMarpSlide[] {
  // フロントマター（最初の --- ... ---）を除去
  let body = markdown.trim();
  if (body.startsWith('---')) {
    const secondDashIndex = body.indexOf('\n---', 3);
    if (secondDashIndex !== -1) {
      body = body.slice(secondDashIndex + 4).trim();
    }
  }

  // スライド区切り '---' で分割
  const rawSlides = body.split(/\n---\n/);

  return rawSlides.map((raw, index) => {
    const isLead = raw.includes('<!-- _class: lead -->');
    // タイトル行を抽出（# または ## から始まる行）
    const titleMatch = raw.match(/^#+\s*(.+)$/m);
    const title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').trim() : `スライド ${index + 1}`;

    return {
      index,
      content: raw.replace('<!-- _class: lead -->', '').trim(),
      isLead,
      title
    };
  });
}
