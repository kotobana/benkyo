-- 0002_shinro_nav.sql: 相模原・橋本 進路＆奨学金ナビ用テーブル定義と初期データ

CREATE TABLE IF NOT EXISTS local_schools (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  short_name TEXT NOT NULL,
  category TEXT NOT NULL,          -- 'public_general', 'public_special', 'public_creative', 'private'
  station TEXT NOT NULL,
  deviation_range TEXT,
  features TEXT NOT NULL,
  website_url TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS scholarship_schemes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  provider TEXT NOT NULL,          -- '神奈川県', '相模原市', '国'
  type TEXT NOT NULL,              -- 'grant'(給付・返済不要), 'loan'(無利子貸与), 'reduction'(授業料減免)
  amount_desc TEXT NOT NULL,
  target_audience TEXT NOT NULL,
  application_period TEXT NOT NULL,
  summary_points TEXT NOT NULL,    -- JSON array of strings
  official_url TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS calendar_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  school_id TEXT,
  title TEXT NOT NULL,
  category TEXT NOT NULL,          -- 'briefing'(説明会), 'exam'(入試日程), 'scholarship'(奨学金締切)
  event_date TEXT,                 -- 'YYYY-MM-DD'
  deadline_date TEXT,              -- 'YYYY-MM-DD'
  url TEXT,
  note TEXT
);

CREATE TABLE IF NOT EXISTS daily_news (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  source_name TEXT NOT NULL,       -- '神奈川県教育委員会', '相模原市', '相原高校' 等
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  published_date TEXT NOT NULL,    -- 'YYYY-MM-DD'
  original_url TEXT NOT NULL,
  is_approved INTEGER DEFAULT 1
);

-- ========================================================
-- 初期マスターデータ投入
-- ========================================================

-- 1. 高校マスター（橋本駅からの通学圏主要校）
INSERT OR REPLACE INTO local_schools (id, name, short_name, category, station, deviation_range, features, website_url) VALUES
('aihara', '神奈川県立相原高等学校', '相原', 'public_special', 'JR横浜線・相模線・京王相模原線「橋本駅」徒歩12分', '45-48', '【橋本駅徒歩】農業・環境土木・食品科学・ビジネスの4学科。県内屈指の歴史と設備を誇る人気実業高校。実習豊富で就職・進学ともに強い。', 'https://www.pen-kanagawa.ed.jp/aihara-h/'),
('hashimoto', '神奈川県立橋本高等学校', '橋本', 'public_general', 'JR横浜線・相模線・京王相模原線「橋本駅」徒歩15分', '47-49', '【橋本駅最寄り】緑豊かな落ち着いた学習環境の普通科。きめ細やかな進路指導と部活動の活発さが特徴。', 'https://www.pen-kanagawa.ed.jp/hashimoto-h/'),
('sagamihara', '神奈川県立相模原高等学校', '相模原', 'public_general', 'JR横浜線「相模原駅」バス10分 / 小田急線「相模大野駅」バス', '65-68', '【県央トップ進学校】学力向上進学重点校エントリー校。高い進学実績と自由な校風、「文武両道」を高いレベルで実践。', 'https://www.pen-kanagawa.ed.jp/kenritsusagamihara-h/'),
('sagamihara_yaei', '神奈川県立相模原弥栄高等学校', '相模原弥栄', 'public_special', 'JR横浜線「淵野辺駅」バス8分', '58-62', '普通科に加え、音楽・美術・スポーツ科学科を設置。広大なキャンパスと先進的設備。普通科でも特色検査を実施。', 'https://www.pen-kanagawa.ed.jp/sagamiharayaei-h/'),
('kamimizo', '神奈川県立上溝高等学校', '上溝', 'public_general', 'JR相模線「番田駅」徒歩7分', '50-52', '創立100年を超える伝統校。落ち着いた校風で、進路に応じた多様な選択科目。地域との連携が深い。', 'https://www.pen-kanagawa.ed.jp/kamimizo-h/'),
('kamimizominami', '神奈川県立上溝南高等学校', '上溝南', 'public_general', 'JR相模線「原当麻駅」徒歩15分 / 上溝駅バス', '53-55', '「上南（かみなん）」の愛称で親しまれる中堅進学校。ICT教育や大学進学サポートに注力。部活動が非常に盛ん。', 'https://www.pen-kanagawa.ed.jp/kamimizominami-h/'),
('asamizodai', '神奈川県立麻溝台高等学校', '麻溝台', 'public_general', '小田急線「相模大野駅」バス / JR相模線「原当麻駅」バス', '57-60', '県央地区の上位進学校。「麻高（あさこう）」と呼ばれ、真面目でアットホームな校風。国公立・難関私大進学実績多数。', 'https://www.pen-kanagawa.ed.jp/asamizodai-h/'),
('shiroyama', '神奈川県立城山高等学校', '城山', 'public_general', 'JR横浜線・京王線「橋本駅」バス15分（城山高校前下車）', '41-43', '相模原市緑区の自然豊かな高校。少人数指導や基礎からの学び直しを大切にし、生徒一人ひとりの進路を手厚くサポート。', 'https://www.pen-kanagawa.ed.jp/shiroyama-h/'),
('tsukui', '神奈川県立津久井高等学校', '津久井', 'public_special', 'JR中央線「相模湖駅」バス15分 / 橋本駅三ヶ木行きバス', '40-42', '普通科と社会福祉科を併設（定時制あり）。福祉・介護分野の国家資格取得を目指せる県内貴重な公立校。地域密着。', 'https://www.pen-kanagawa.ed.jp/tsukui-h/'),
('koyokan', '神奈川県立相模向陽館高等学校', '相模向陽館', 'public_creative', '小田急線「相武台前駅」徒歩15分', '選考（学力検査なし）', '【クリエイティブスクール・定時制】学力検査なし（面接・作文等）。午前部・午後部で自分のペースで3〜4年で卒業。中学校で不登校だった生徒への支援が手厚い。', 'https://www.pen-kanagawa.ed.jp/sagamikoyokan-h/');

-- 2. 奨学金・支援制度マスター
INSERT OR REPLACE INTO scholarship_schemes (id, name, provider, type, amount_desc, target_audience, application_period, summary_points, official_url) VALUES
('kanagawa_kyufu', '神奈川県高校生等奨学給付金', '神奈川県', 'grant', '年額 85,200円〜152,000円（返還不要）', '生活保護世帯・住民税非課税（所得割非課税）世帯の高校生の保護者', '年2回（7月通常申請、10月〜11月早期申請）', '["授業料以外の教科書・学用品・修学旅行費を直接サポート","【返済不要】もらったお金を返す必要は一切ありません","公立・私立どちらの高校に通っていても対象です"]', 'https://www.pref.kanagawa.jp/docs/v3k/cnt/f6836/p1079361.html'),
('country_shienkin', '高等学校等就学支援金（国の授業料無償化）', '国', 'reduction', '公立: 全額無料（月額9,900円助成） / 私立: 最大年額396,000円', '世帯年収約910万円未満の世帯（所得基準あり）', '入学時（4月〜6月）および毎年度7月', '["高校の【授業料】を国が肩代わりしてくれる基本の制度","入学後に高校を通じて全員がオンライン（e-Shien）で申請します","神奈川県内の公立高校はほぼ全員が授業料実質0円になります"]', 'https://www.mext.go.jp/a_menu/shotou/mushouka/1342674.htm'),
('sagamihara_ikuei', '相模原市育英奨学生制度', '相模原市', 'loan', '高校生: 月額 15,000円〜20,000円（無利子貸与）', '相模原市に1年以上在住し、学力基準・所得基準を満たす生徒', '中学3年秋（予約募集: 9月〜10月）および高校進学後（4月）', '["相模原市独自の無利子（利息ゼロ）の奨学金制度","中学3年生の秋に事前予約募集が行われます（卒業後返還）","他の返還不要給付金と併用して生活費・通学費に充てることができます"]', 'https://www.city.sagamihara.kanagawa.jp/kosodate/1026600/1005230.html'),
('sagamihara_hitori', '相模原市ひとり親家庭等就学支度資金・学資金', '相模原市', 'loan', '就学支度金: 最大42万円 / 修学資金: 月額最大3.5万円（無利子）', '相模原市内在住の母子家庭・父子家庭・養育者家庭', '随時（進学前の秋〜冬に事前相談推奨）', '["ひとり親家庭向けの入学準備（制服・パソコン代）や毎月の修学資金","無利子で借りることができ、返還猶予や免除制度もあります","市役所の子育て給付課（緑区役所・各行政センター）で個別相談できます"]', 'https://www.city.sagamihara.kanagawa.jp/kosodate/1026600/1005232.html');

-- 3. 直近カレンダーイベント（2026年秋〜冬のリアルな入試・説明会日程）
INSERT OR REPLACE INTO calendar_events (id, school_id, title, category, event_date, deadline_date, url, note) VALUES
(1, 'aihara', '第2回 学校説明会・施設見学（橋本駅）', 'briefing', '2026-10-18', '2026-10-06', 'https://www.pen-kanagawa.ed.jp/aihara-h/nyushi/setsumeikai.html', '公式Webにて先着事前予約制。4学科（農業・土木・食品・ビジネス）の個別相談あり。'),
(2, 'hashimoto', '秋の学校説明会・授業見学', 'briefing', '2026-10-24', '2026-10-15', 'https://www.pen-kanagawa.ed.jp/hashimoto-h/zennichi/nyushi.html', '橋本高校体育館にて開催。部活動見学も同時開催。'),
(3, 'sagamihara_yaei', '学校説明会・特色検査ガイダンス', 'briefing', '2026-11-07', '2026-10-20', 'https://www.pen-kanagawa.ed.jp/sagamiharayaei-h/nyugaku/setsumeikai.html', '学科別（普通科・音楽・美術・スポーツ）に分かれて実施。'),
(4, 'kanagawa_kyufu', '神奈川県高校生等奨学給付金（秋季早期給付申請）', 'scholarship', '2026-10-31', '2026-10-15', 'https://www.pref.kanagawa.jp/docs/v3k/cnt/f6836/p1079361.html', '※非課税世帯対象。高校からの配布プリントまたはオンライン提出期限。'),
(5, 'sagamihara_ikuei', '相模原市育英奨学生 中3予約申請締切', 'scholarship', '2026-10-30', '2026-10-30', 'https://www.city.sagamihara.kanagawa.jp/kosodate/1026600/1005230.html', '中学校の担任の先生を通じて必要書類を提出。'),
(6, NULL, '神奈川県公立高校 出願期間（インターネット出願）', 'exam', '2027-01-28', '2027-02-01', 'https://www.pref.kanagawa.jp/docs/u5t/cnt/f6892/index.html', '全県共通の公立高校出願期間。'),
(7, NULL, '神奈川県公立高校 学力検査（入試本番）', 'exam', '2027-02-16', '2027-02-16', 'https://www.pref.kanagawa.jp/docs/u5t/cnt/f6892/index.html', '共通選抜の学力検査日。全日制共通。');

-- 4. 新着ニュース（初期ニュース）
INSERT OR REPLACE INTO daily_news (id, source_name, title, summary, published_date, original_url, is_approved) VALUES
(1, '神奈川県教育委員会', '令和9年度（2027年度）公立高等学校入学者選抜の選考基準等を公表しました', '相原高校・橋本高校を含む各県立高校の内申点・学力検査・面接比率が正式発表されました。普通科・実業科ともに基本比率をご確認ください。', '2026-10-02', 'https://www.pref.kanagawa.jp/docs/u5t/cnt/f6892/index.html', 1),
(2, '相模原市', '【中3保護者向け】令和9年度入学 相模原市育英奨学生の予約募集を開始しました', '高校進学後の修学を支援する相模原市の無利子貸与奨学金です。10月30日までに在学校（中学校）へ申請書を提出してください。', '2026-09-28', 'https://www.city.sagamihara.kanagawa.jp/kosodate/1026600/1005230.html', 1),
(3, '神奈川県教育委員会', '県立高校の学校説明会日程一覧（10月・11月開催分）が更新されました', '相模原弥栄高校、上溝南高校、麻溝台高校などの説明会申し込みが始まっています。定員制の学校が多いため早めの予約を推奨します。', '2026-09-25', 'https://www.pref.kanagawa.jp/docs/u5t/cnt/f6892/index.html', 1);
