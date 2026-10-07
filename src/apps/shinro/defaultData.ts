import type { 
  LocalSchool, 
  ScholarshipScheme, 
  CalendarEvent, 
  DailyNewsItem, 
  DailyActionItem 
} from './types';

export const DEFAULT_SCHOOLS: LocalSchool[] = [
  {
    id: 'aihara',
    name: '神奈川県立相原高等学校',
    short_name: '相原',
    category: 'public_special',
    station: 'JR横浜線・相模線・京王相模原線「橋本駅」徒歩12分',
    deviation_range: '45-48',
    features: '【橋本駅徒歩】農業・環境土木・食品科学・ビジネスの4学科。県内屈指の歴史と設備を誇る人気実業高校。実習豊富で就職・専門学校・推薦大学進学に極めて強い。',
    website_url: 'https://www.pen-kanagawa.ed.jp/aihara-h/'
  },
  {
    id: 'hashimoto',
    name: '神奈川県立橋本高等学校',
    short_name: '橋本',
    category: 'public_general',
    station: 'JR横浜線・相模線・京王相模原線「橋本駅」徒歩15分',
    deviation_range: '47-49',
    features: '【橋本駅最寄り】落ち着いた緑豊かな学習環境の普通科。きめ細やかな進路指導と温かい校風。部活動や学校行事も盛ん。',
    website_url: 'https://www.pen-kanagawa.ed.jp/hashimoto-h/'
  },
  {
    id: 'sagamihara',
    name: '神奈川県立相模原高等学校',
    short_name: '相模原',
    category: 'public_general',
    station: 'JR横浜線「相模原駅」バス10分 / 小田急線「相模大野駅」バス',
    deviation_range: '65-68',
    features: '【県央トップ進学校】学力向上進学重点校エントリー校。高い進学実績と自由な校風、「文武両道」を高いレベルで実践。',
    website_url: 'https://www.pen-kanagawa.ed.jp/kenritsusagamihara-h/'
  },
  {
    id: 'sagamihara_yaei',
    name: '神奈川県立相模原弥栄高等学校',
    short_name: '相模原弥栄',
    category: 'public_special',
    station: 'JR横浜線「淵野辺駅」バス8分',
    deviation_range: '58-62',
    features: '普通科に加え、音楽科・美術科・スポーツ科学科を設置。先進的設備と広大なキャンパス。普通科でも特色検査を実施。',
    website_url: 'https://www.pen-kanagawa.ed.jp/sagamiharayaei-h/'
  },
  {
    id: 'kamimizo',
    name: '神奈川県立上溝高等学校',
    short_name: '上溝',
    category: 'public_general',
    station: 'JR相模線「番田駅」徒歩7分',
    deviation_range: '50-52',
    features: '創立100年を超える歴史と伝統。落ち着いた校風で、進路に応じた多様な選択科目。地域との連携が深い。',
    website_url: 'https://www.pen-kanagawa.ed.jp/kamimizo-h/'
  },
  {
    id: 'kamimizominami',
    name: '神奈川県立上溝南高等学校',
    short_name: '上溝南',
    category: 'public_general',
    station: 'JR相模線「原当麻駅」徒歩15分 / 上溝駅バス',
    deviation_range: '53-55',
    features: '「上南（かみなん）」の愛称で親しまれる中堅進学校。ICT教育や大学進学サポートに注力。部活動が非常に盛ん。',
    website_url: 'https://www.pen-kanagawa.ed.jp/kamimizominami-h/'
  },
  {
    id: 'asamizodai',
    name: '神奈川県立麻溝台高等学校',
    short_name: '麻溝台',
    category: 'public_general',
    station: '小田急線「相模大野駅」バス / JR相模線「原当麻駅」バス',
    deviation_range: '57-60',
    features: '県央地区の上位進学校。「麻高（あさこう）」と呼ばれ、真面目でアットホームな校風。国公立・難関私大進学実績多数。',
    website_url: 'https://www.pen-kanagawa.ed.jp/asamizodai-h/'
  },
  {
    id: 'shiroyama',
    name: '神奈川県立城山高等学校',
    short_name: '城山',
    category: 'public_general',
    station: 'JR横浜線・京王線「橋本駅」バス15分（城山高校前下車）',
    deviation_range: '41-43',
    features: '相模原市緑区の自然豊かな高校。少人数指導や基礎からの学び直しを大切にし、生徒一人ひとりの進路を手厚くサポート。',
    website_url: 'https://www.pen-kanagawa.ed.jp/shiroyama-h/'
  },
  {
    id: 'tsukui',
    name: '神奈川県立津久井高等学校',
    short_name: '津久井',
    category: 'public_special',
    station: 'JR中央線「相模湖駅」バス15分 / 橋本駅三ヶ木行きバス',
    deviation_range: '40-42',
    features: '普通科と社会福祉科を併設（定時制あり）。福祉・介護分野の国家資格取得を目指せる県内貴重な公立校。地域密着。',
    website_url: 'https://www.pen-kanagawa.ed.jp/tsukui-h/'
  },
  {
    id: 'koyokan',
    name: '神奈川県立相模向陽館高等学校',
    short_name: '相模向陽館',
    category: 'public_creative',
    station: '小田急線「相武台前駅」徒歩15分',
    deviation_range: '選考（学力検査なし）',
    features: '【クリエイティブスクール・定時制】入試での学力検査なし（面接・作文等）。午前部・午後部で自分のペースで3〜4年で卒業。中学校で不登校だった生徒への支援が手厚い。',
    website_url: 'https://www.pen-kanagawa.ed.jp/sagamikoyokan-h/'
  }
];

export const DEFAULT_SCHOLARSHIPS: ScholarshipScheme[] = [
  {
    id: 'kanagawa_kyufu',
    name: '神奈川県高校生等奨学給付金',
    provider: '神奈川県',
    type: 'grant',
    amount_desc: '年額 85,200円〜152,000円（返還不要）',
    target_audience: '生活保護世帯・住民税非課税（所得割非課税）世帯の高校生の保護者',
    application_period: '年2回（7月通常申請、10月〜11月早期申請）',
    summary_points: [
      '授業料以外の教科書・学用品・修学旅行費を直接サポート',
      '【返済不要】もらったお金を返す必要は一切ありません',
      '公立・私立どちらの高校に通っていても対象になります'
    ],
    official_url: 'https://www.pref.kanagawa.jp/docs/v3k/cnt/f6836/p1079361.html'
  },
  {
    id: 'country_shienkin',
    name: '高等学校等就学支援金（国の授業料無償化）',
    provider: '国',
    type: 'reduction',
    amount_desc: '公立: 全額無料（月額9,900円助成） / 私立: 最大年額396,000円',
    target_audience: '世帯年収約910万円未満の世帯（所得要件あり）',
    application_period: '入学時（4月〜6月）および毎年度7月更新',
    summary_points: [
      '高校の【授業料】を国が肩代わりしてくれる基本の制度です',
      '入学後に高校を通じて全員がオンライン（e-Shien）で申請します',
      '神奈川県内の公立高校はほぼ全員が授業料実質0円になります'
    ],
    official_url: 'https://www.mext.go.jp/a_menu/shotou/mushouka/1342674.htm'
  },
  {
    id: 'sagamihara_ikuei',
    name: '相模原市育英奨学生制度',
    provider: '相模原市',
    type: 'loan',
    amount_desc: '高校生: 月額 15,000円〜20,000円（無利子貸与）',
    target_audience: '相模原市に1年以上在住し、学力基準・所得基準を満たす生徒',
    application_period: '中学3年秋（予約募集: 9月〜10月）および高校進学後（4月）',
    summary_points: [
      '相模原市独自の無利子（利息ゼロ）の奨学金制度です',
      '中学3年生の秋に事前予約募集が行われます（高校卒業後に返還）',
      '他の返還不要給付金と併用して生活費や通学交通費に充てることができます'
    ],
    official_url: 'https://www.city.sagamihara.kanagawa.jp/kosodate/1026600/1005230.html'
  },
  {
    id: 'sagamihara_hitori',
    name: '相模原市ひとり親家庭等就学支度資金・学資金',
    provider: '相模原市',
    type: 'loan',
    amount_desc: '就学支度金: 最大42万円 / 修学資金: 月額最大3.5万円（無利子）',
    target_audience: '相模原市内在住の母子家庭・父子家庭・養育者家庭',
    application_period: '随時（進学前の秋〜冬に事前相談推奨）',
    summary_points: [
      'ひとり親家庭向けの入学準備（制服・パソコン代）や毎月の修学資金',
      '無利子で借りることができ、返還猶予や免除制度もあります',
      '市役所の子育て給付課（緑区役所・各行政センター）で個別相談できます'
    ],
    official_url: 'https://www.city.sagamihara.kanagawa.jp/kosodate/1026600/1005232.html'
  }
];

export const DEFAULT_EVENTS: CalendarEvent[] = [
  {
    id: 1,
    school_id: 'aihara',
    title: '第2回 学校説明会・施設見学 事前Web予約（橋本駅）',
    category: 'briefing',
    event_date: '2026-10-18',
    deadline_date: '2026-10-09',
    url: 'https://www.pen-kanagawa.ed.jp/aihara-h/nyushi/setsumeikai.html',
    note: '公式Webにて先着事前予約制。4学科（農業・土木・食品・ビジネス）の個別相談あり。'
  },
  {
    id: 2,
    school_id: 'hashimoto',
    title: '秋の学校説明会・授業見学 Web受付',
    category: 'briefing',
    event_date: '2026-10-24',
    deadline_date: '2026-10-15',
    url: 'https://www.pen-kanagawa.ed.jp/hashimoto-h/zennichi/nyushi.html',
    note: '橋本高校体育館にて開催。部活動見学も同時開催。'
  },
  {
    id: 3,
    school_id: 'sagamihara_yaei',
    title: '学校説明会・特色検査ガイダンス',
    category: 'briefing',
    event_date: '2026-11-07',
    deadline_date: '2026-10-20',
    url: 'https://www.pen-kanagawa.ed.jp/sagamiharayaei-h/nyugaku/setsumeikai.html',
    note: '学科別（普通科・音楽・美術・スポーツ）に分かれて実施。'
  },
  {
    id: 4,
    school_id: null,
    title: '神奈川県高校生等奨学給付金（秋季早期給付申請）',
    category: 'scholarship',
    event_date: '2026-10-31',
    deadline_date: '2026-10-15',
    url: 'https://www.pref.kanagawa.jp/docs/v3k/cnt/f6836/p1079361.html',
    note: '※非課税世帯対象。高校からの配布プリントまたはオンライン提出期限。'
  },
  {
    id: 5,
    school_id: null,
    title: '相模原市育英奨学生 中3予約申請締切',
    category: 'scholarship',
    event_date: '2026-10-30',
    deadline_date: '2026-10-30',
    url: 'https://www.city.sagamihara.kanagawa.jp/kosodate/1006889/index.html',
    note: '中学校の担任の先生を通じて必要書類を提出。'
  },
  {
    id: 6,
    school_id: null,
    title: '神奈川県公立高校 出願期間（インターネット出願）',
    category: 'exam',
    event_date: '2027-01-25',
    deadline_date: '2027-01-29',
    url: 'https://www.pref.kanagawa.jp/docs/dc4/nyusen/nyusen/index.html',
    note: '全県共通の公立高校出願期間。'
  },
  {
    id: 7,
    school_id: null,
    title: '神奈川県公立高校 学力検査（入試本番）',
    category: 'exam',
    event_date: '2027-02-16',
    deadline_date: '2027-02-16',
    url: 'https://www.pref.kanagawa.jp/docs/dc4/nyusen/nyusen/index.html',
    note: '共通選抜の学力検査日。全日制共通。'
  }
];

export const DEFAULT_NEWS: DailyNewsItem[] = [
  {
    id: 1,
    source_name: '神奈川県教育委員会',
    title: '【10月説明会】県立高校（相原・橋本・相模原弥栄など）の秋季学校説明会Web予約が各校で受付中',
    summary: '10月中旬〜下旬に開催される各高校の学校説明会・見学会（e-kanagawa電子申請等による先着予約）の受付が始まっています。定員になり次第終了するため、志望校の公式HPから早めの予約をおすすめします。',
    published_date: '2026-10-06',
    original_url: 'https://www.pref.kanagawa.jp/docs/dc4/nyusen/nyusen/index.html',
    is_approved: 1
  },
  {
    id: 2,
    source_name: '相原高校',
    title: '【橋本駅徒歩】相原高校 第2回学校説明会（10/18開催）のWeb予約受付中',
    summary: '農業・環境土木・食品科学・ビジネスの4学科説明および施設見学会。橋本駅徒歩12分のキャンパスにて開催されます。個別進路相談コーナーも設置されます。',
    published_date: '2026-10-05',
    original_url: 'https://www.pen-kanagawa.ed.jp/aihara-h/nyushi/setsumeikai.html',
    is_approved: 1
  },
  {
    id: 3,
    source_name: '相模原市教育委員会',
    title: '【返還不要】相模原市高校生向け奨学金（年間最大10万円）の随時申請について',
    summary: '市民税所得割額0円の世帯を対象とした相模原市の給付型（返還不要）奨学金です。通常申請（7月）に間に合わなかった場合でも、2027年2月26日まで減額支給での随時申請が可能です。',
    published_date: '2026-10-04',
    original_url: 'https://www.city.sagamihara.kanagawa.jp/kosodate/1006889/index.html',
    is_approved: 1
  },
  {
    id: 4,
    source_name: '神奈川県教育委員会',
    title: '令和9年度（2027年4月入学）公立高等学校入学者選抜の選考基準および日程発表',
    summary: 'インターネット出願期間は令和9年1月25日〜1月29日、共通選抜学力検査（本番）は令和9年2月16日（火）、合格発表は2月26日（金）に実施されます。各校の内申点・学力検査比率をご確認ください。',
    published_date: '2026-10-02',
    original_url: 'https://www.pref.kanagawa.jp/docs/dc4/nyusen/nyusen/index.html',
    is_approved: 1
  },
  {
    id: 5,
    source_name: '相模原市',
    title: '【中3保護者向け】令和9年度入学 相模原市育英奨学生の予約募集は10月30日締切です',
    summary: '高校進学後の修学を支援する相模原市の無利子貸与奨学金（月額1.5万〜2万円）です。10月30日までに在学校（中学校）へ申請書を提出してください。',
    published_date: '2026-10-01',
    original_url: 'https://www.city.sagamihara.kanagawa.jp/kosodate/1006889/index.html',
    is_approved: 1
  }
];

/**
 * 基準日（指定がない場合は現在日付）から、
 * 「本日締切」「あと数日で締切」「今週開催」のアクションアイテムを自動抽出・ソートするエンジン
 */
export function calculateDailyActions(
  events: CalendarEvent[],
  schools: LocalSchool[],
  baseDateStr?: string
): DailyActionItem[] {
  const baseDate = baseDateStr ? new Date(baseDateStr) : new Date();
  baseDate.setHours(0, 0, 0, 0);

  const schoolMap = new Map(schools.map(s => [s.id, s]));
  const results: DailyActionItem[] = [];

  for (const ev of events) {
    const targetDateStr = ev.deadline_date || ev.event_date;
    if (!targetDateStr) continue;

    const targetDate = new Date(targetDateStr);
    targetDate.setHours(0, 0, 0, 0);

    const diffMs = targetDate.getTime() - baseDate.getTime();
    const daysLeft = Math.round(diffMs / (1000 * 60 * 60 * 24));

    // 過去（-1日以前）はアクションとしては対象外（カレンダー一覧で表示）
    if (daysLeft < 0) continue;

    const school = ev.school_id ? schoolMap.get(ev.school_id) : undefined;

    if (daysLeft === 0) {
      results.push({
        event: ev,
        school,
        urgency: 'urgent',
        daysLeft: 0,
        label: '🚨 本日締切・本日開催！'
      });
    } else if (daysLeft <= 3) {
      results.push({
        event: ev,
        school,
        urgency: 'warning',
        daysLeft,
        label: `⚠️ あと ${daysLeft} 日で締切！`
      });
    } else if (daysLeft <= 14) {
      results.push({
        event: ev,
        school,
        urgency: 'upcoming',
        daysLeft,
        label: `📅 あと ${daysLeft} 日（予約受付中）`
      });
    }
  }

  // 緊急度の高い順、残り日数が少ない順にソート
  results.sort((a, b) => {
    const urgencyOrder = { urgent: 0, warning: 1, upcoming: 2 };
    if (urgencyOrder[a.urgency] !== urgencyOrder[b.urgency]) {
      return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
    }
    return a.daysLeft - b.daysLeft;
  });

  return results;
}
