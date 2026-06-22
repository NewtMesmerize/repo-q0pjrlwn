// Mock data for the 中枫仲调 PC prototype.
// Mirrors the content of the original mobile mini-program prototype.

export interface ServiceItem {
  key: string;
  title: string;
  desc: string;
  icon: string; // path under /icons
  to: string;
}

export const services: ServiceItem[] = [
  { key: 'ai', title: 'AI法律', desc: '智能咨询·合同审查·案情分析', icon: '/icons/fw-ai.svg', to: '/ai-law' },
  { key: 'data', title: '大数据查询', desc: '司法/企业信用大数据', icon: '/icons/fw-dsj.svg', to: '/ai-law/big-data-query' },
  { key: 'contract', title: '电子合同', desc: '智能签署·管理·存证', icon: '/icons/fw-ht.svg', to: '/e-contract' },
  { key: 'arb-consult', title: '仲裁咨询', desc: '专业仲裁流程指导', icon: '/icons/fw-zc.svg', to: '/arbitration/consult' },
  { key: 'lawyer', title: '律师服务', desc: '精品律所一对一服务', icon: '/icons/fw-ls.svg', to: '/services/lawyer' },
  { key: 'mediation', title: '调解服务', desc: '民商事纠纷高效化解', icon: '/icons/fw-tj.svg', to: '/services/mediation' },
  { key: 'training', title: '培训课程', desc: '合规与法律实务培训', icon: '/icons/fw-px.svg', to: '/platform/product' },
  { key: 'marketing', title: '营销工具', desc: '获客与转化支持', icon: '/icons/fw-yx.svg', to: '/console/promotion' },
];

export interface PackageItem {
  id: string;
  title: string;
  subtitle: string;
  price: number;
  points: number;
  tag: 'package' | 'product';
  color: string;
}

export const packages: PackageItem[] = [
  {
    id: 'p399', title: '个人基础服务包', subtitle: '极致效率提升', price: 399, points: 399,
    tag: 'package', color: '#fff1e6',
  },
  {
    id: 'p6980', title: '企业基础服务包', subtitle: '显著成本优化', price: 6980, points: 6980,
    tag: 'package', color: '#e6fff4',
  },
  {
    id: 'p19800', title: '旗舰服务包', subtitle: '全生命周期闭环服务', price: 19800, points: 19800,
    tag: 'package', color: '#e8efff',
  },
  {
    id: 'ec299', title: '电子合同产品包', subtitle: '智能合同管理', price: 299, points: 299,
    tag: 'product', color: '#fff7e0',
  },
  {
    id: 'data599', title: '数据分析产品包', subtitle: '企业数据洞察', price: 599, points: 599,
    tag: 'product', color: '#f0e8ff',
  },
];

export interface AiTool {
  key: string;
  title: string;
  desc: string;
  color: string;
  emoji: string;
}

export const aiTools: AiTool[] = [
  { key: 'chat', title: '智能咨询', desc: '即时在线问答', color: '#ff7a59', emoji: '💬' },
  { key: 'contract-review', title: '合同审查', desc: '合同风险快速识别', color: '#2f6bff', emoji: '📄' },
  { key: 'case-analysis', title: '案情分析', desc: '案例智能推演', color: '#13c2c2', emoji: '📊' },
  { key: 'contract-draft', title: '合同起草', desc: '模板智能生成', color: '#52c41a', emoji: '✍️' },
  { key: 'structured-doc', title: '文书生成', desc: '一键导出法律文书', color: '#9254de', emoji: '📑' },
];

export const hotQuestions = [
  '在公司招待费报销中遇到争议，如何处理？',
  '劳动合同签订后，如何应对违约问题？',
  '遇到合同纠纷，如何快速保护证据？',
  '股东之间发生股权争议，可以申请仲裁吗？',
];

export const disputeTypes = [
  '合同纠纷', '劳动纠纷', '债务纠纷', '消费纠纷', '知识产权',
  '公司纠纷', '建设工程', '金融借贷', '民间借贷',
];

export type CaseStatus =
  | '材料准备' | '案件初审' | '提交仲裁' | '仲裁立案' | '仲裁调解'
  | '调解成功' | '仲裁完成' | '案件关闭' | '立案失败';

export interface ArbCase {
  id: string;
  name: string;
  party: string;
  type: string;
  status: CaseStatus;
  statusColor: string;
  progress: number;
  date: string;
  amount: number;
}

export const arbCases: ArbCase[] = [
  { id: 'ZC20240518001', name: '劳动合同纠纷案', party: '张三', type: '劳动纠纷', status: '材料准备', statusColor: 'default', progress: 10, date: '2024-05-18', amount: 50000 },
  { id: 'ZC20240517002', name: '房屋租赁合同纠纷', party: '李四', type: '合同纠纷', status: '案件初审', statusColor: 'processing', progress: 20, date: '2024-05-17', amount: 120000 },
  { id: 'ZC20240516003', name: '债务纠纷案', party: '王五', type: '债务纠纷', status: '提交仲裁', statusColor: 'warning', progress: 30, date: '2024-05-16', amount: 88000 },
  { id: 'ZC20240515004', name: '产品质量纠纷', party: '赵六', type: '消费纠纷', status: '仲裁立案', statusColor: 'warning', progress: 40, date: '2024-05-15', amount: 36000 },
  { id: 'ZC20240514005', name: '知识产权纠纷', party: '钱七', type: '知识产权', status: '仲裁调解', statusColor: 'warning', progress: 60, date: '2024-05-14', amount: 210000 },
  { id: 'ZC20240513006', name: '建设工程纠纷', party: '孙八', type: '建设工程', status: '调解成功', statusColor: 'success', progress: 80, date: '2024-05-13', amount: 560000 },
  { id: 'ZC20240512007', name: '股权转让纠纷', party: '周九', type: '公司纠纷', status: '仲裁完成', statusColor: 'success', progress: 100, date: '2024-05-12', amount: 1500000 },
  { id: 'ZC20240511008', name: '买卖合同纠纷', party: '吴十', type: '合同纠纷', status: '案件关闭', statusColor: 'default', progress: 100, date: '2024-05-11', amount: 76000 },
  { id: 'ZC20240510009', name: '服务合同纠纷', party: '郑十一', type: '合同纠纷', status: '立案失败', statusColor: 'error', progress: 0, date: '2024-05-10', amount: 42000 },
];

export interface TimelineNode {
  title: string;
  time: string;
  desc: string;
  by: string;
}

export const caseTimeline: TimelineNode[] = [
  { title: '第一次调解', time: '2024-05-10 14:00', desc: '双方已到场，初步沟通', by: '调解员李律师' },
  { title: '调解员指派', time: '2024-05-08 10:00', desc: '指派李律师为本案调解员', by: '系统' },
  { title: '平台受理', time: '2024-05-07 09:00', desc: '材料审核通过，正式受理', by: '平台审核员' },
  { title: '申请提交', time: '2024-05-06 10:30', desc: '提交仲裁申请及相关材料', by: '张三' },
];

export interface OrderItem {
  id: string;
  product: string;
  amount: number;
  status: '已完成' | '待支付' | '已退款';
  date: string;
}

export const orders: OrderItem[] = [
  { id: 'DD20240518001', product: '企业基础服务包', amount: 6980, status: '已完成', date: '2024-05-18 10:24' },
  { id: 'DD20240515002', product: '电子合同产品包', amount: 299, status: '已完成', date: '2024-05-15 16:08' },
  { id: 'DD20240512003', product: '数据分析产品包', amount: 599, status: '待支付', date: '2024-05-12 09:31' },
  { id: 'DD20240509004', product: '个人基础服务包', amount: 399, status: '已退款', date: '2024-05-09 11:45' },
];

export interface PackageBalance {
  id: string;
  name: string;
  remain: number;
  price: number;
  type: 'A' | 'B';
}

export const myPackagesA: PackageBalance[] = [
  { id: 'a980', name: '980年费包', remain: 5, price: 980, type: 'A' },
  { id: 'a9980', name: '9980年费包', remain: 3, price: 9980, type: 'A' },
  { id: 'a399', name: '399产品包', remain: 10, price: 399, type: 'A' },
  { id: 'a6980', name: '6980产品包', remain: 8, price: 6980, type: 'A' },
];

export const myPackagesB: PackageBalance[] = [
  { id: 'b399', name: '399产品包', remain: 10, price: 399, type: 'B' },
  { id: 'b6980', name: '6980产品包', remain: 8, price: 6980, type: 'B' },
];

export interface PackageFlow {
  id: string;
  title: string;
  delta: number;
  time: string;
  status: string;
}

export const packageFlows: PackageFlow[] = [
  { id: 'L20240510001', title: '产品包入账', delta: 3, time: '2024-05-10 09:20', status: '已入账 (余: 3)' },
  { id: 'L20240509001', title: '转赠他人', delta: -2, time: '2024-05-09 16:45', status: '转赠至: 张*三 (139****1234)' },
  { id: 'L20240508001', title: '自用激活', delta: -2, time: '2024-05-08 14:20', status: '已生效' },
  { id: 'L20240507001', title: '自用激活', delta: -1, time: '2024-05-07 09:30', status: '已生效' },
  { id: 'L20240506001', title: '产品包入账', delta: 10, time: '2024-05-06 10:30', status: '已入账 (余: 5)' },
  { id: 'L20240501001', title: '产品包入账', delta: 4, time: '2024-05-01 08:00', status: '已入账 (余: 0)' },
];

export interface Lawyer {
  id: string;
  name: string;
  title: string;
  firm: string;
  years: number;
  good: string[];
  cases: number;
  rating: number;
}

export const lawyers: Lawyer[] = [
  { id: 'l1', name: '李明华', title: '高级合伙人', firm: '中枫律师事务所', years: 15, good: ['合同纠纷', '公司治理', '劳动争议'], cases: 1200, rating: 4.9 },
  { id: 'l2', name: '王思雨', title: '专职律师', firm: '中枫律师事务所', years: 8, good: ['知识产权', '股权纠纷'], cases: 640, rating: 4.8 },
  { id: 'l3', name: '张建国', title: '资深顾问', firm: '中枫律师事务所', years: 20, good: ['建设工程', '债务纠纷', '仲裁'], cases: 2100, rating: 5.0 },
  { id: 'l4', name: '陈晓燕', title: '专职律师', firm: '中枫律师事务所', years: 6, good: ['消费维权', '金融借贷'], cases: 420, rating: 4.7 },
];

export const platformContent = {
  company: {
    title: '关于中枫仲调',
    paragraphs: [
      '中枫仲调是国内专注于数字化纠纷预防与在线仲裁处置的专业服务平台，依托中枫数科成熟技术体系与全国司法协作资源，以"数字技术+法律合规+调仲一体化"为核心，构建"源头预防、前端化解、快速裁决、高效执行"的全周期解纷生态。',
      '平台深度联动权威仲裁机构、专业调解中心、精品律师事务所，坚持"非诉讼先行"政策导向，用技术降低维权门槛、提升处置效率，为金融机构、企业、个人提供合规、高效、低成本的一站式纠纷解决方案，助力社会诉源治理，致力于成为客户值得信赖的数字法律服务与在线仲裁标杆平台。',
    ],
  },
  business: [
    { title: '核心业务定位', desc: '以在线仲裁+智能调解+区块链存证+司法执行为闭环，提供全流程、数字化、可落地的民商事纠纷预防与处置服务。' },
    { title: '纠纷预防与合规存证', desc: '电子合同签署、风险核验、区块链存证固证，从源头降低违约与纠纷风险。' },
    { title: '智能调解与非诉化解', desc: '线上调解、AI辅助分析、专业调解员介入，高效促成和解，修复合作关系。' },
    { title: '在线仲裁与裁决服务', desc: '全流程线上仲裁、一裁终局、具备法律强制力，周期短、成本低、效力强。' },
  ],
  scenario: [
    { title: '金融信贷纠纷', desc: '银行、消费金融、小贷公司的逾期回款、借贷合同违约处置。' },
    { title: '民间借贷纠纷', desc: '个人与个人、个人与企业间借贷合同签署、存证、违约维权。' },
    { title: '企业合同纠纷', desc: '供应链、合作协议、服务合同、货款拖欠等商事纠纷快速处置。' },
    { title: '消费维权纠纷', desc: '商品服务、线上交易、预付消费等小额高频纠纷非诉化解。' },
  ],
  product: [
    { title: '核心服务包产品', items: ['仲裁服务包：一站式在线仲裁全流程服务，含立案、庭审、裁决。', '仲裁零售包：轻量化仲裁申请、基础文书与流程指导服务。', '新媒体服务包：品牌推广、内容获客、流量转化支持。', '违约处置服务包：调解+司法确认+执行代理，按回款计费。'] },
    { title: 'AI智能法律工具', items: ['AI法律咨询、AI合同审查、AI文书起草、AI案情分析。', '智能生成合同模板、证据材料、调解/仲裁文书。'] },
    { title: '数据查询与系统服务', items: ['提供全面的司法数据查询、企业信用查询以及一站式SaaS系统服务支持。'] },
  ],
};

export const currentUser = {
  name: '李律师',
  role: '区域经理',
  phone: '138****0001',
  points: 1250,
  inviteCode: 'ABC12',
  inviteLink: 'https://zhongfeng.example.com/?inviteCode=ABC12',
  promoteCount: 0,
};

// ============================================================
// AI 工具流程数据（依据小程序源码 uni/subpkgs/ai-law 还原）
// ============================================================

// ---------- 合同审查 contract-review ----------
export interface ContractTypeGroup {
  label: string;
  children: { label: string; roles: string[] }[];
}

export const contractTypeGroups: ContractTypeGroup[] = [
  {
    label: '买卖合同',
    children: [
      { label: '买卖合同', roles: ['出卖方（甲方）', '买受方（乙方）'] },
      { label: '采购合同', roles: ['采购方（甲方）', '供货方（乙方）'] },
    ],
  },
  {
    label: '租赁合同',
    children: [
      { label: '房屋租赁合同', roles: ['出租方（甲方）', '承租方（乙方）'] },
      { label: '设备租赁合同', roles: ['出租方（甲方）', '承租方（乙方）'] },
    ],
  },
  {
    label: '劳动用工',
    children: [
      { label: '劳动合同', roles: ['用人单位', '劳动者'] },
      { label: '劳务合同', roles: ['用工方', '提供劳务方'] },
    ],
  },
  {
    label: '借款合同',
    children: [
      { label: '借款合同', roles: ['出借方（甲方）', '借款方（乙方）'] },
      { label: '担保合同', roles: ['债权人', '担保人'] },
    ],
  },
];

export interface RiskItem {
  level: '高风险' | '中风险' | '低风险';
  color: string;
  title: string;
  original_text: string;
  desc: string;
  suggestion: string;
}

export const contractRiskItems: RiskItem[] = [
  {
    level: '高风险', color: 'red', title: '违约责任条款缺失',
    original_text: '如一方未按约定履行义务，应承担相应责任。',
    desc: '合同未约定具体违约金比例或损失赔偿计算方式，"相应责任"表述模糊，发生违约时缺乏可执行的维权依据。',
    suggestion: '建议补充明确的违约责任条款，例如"逾期交付的，每逾期一日按合同总价款的 0.5% 支付违约金，累计不超过合同总价款的 30%"。',
  },
  {
    level: '中风险', color: 'orange', title: '付款时间约定模糊',
    original_text: '乙方收到货物后及时支付货款。',
    desc: '"及时"无明确期限，履行标准不清，易就付款时点产生争议。',
    suggestion: '建议修改为"乙方应于收到货物并验收合格后 X 个工作日内一次性支付全部货款"。',
  },
  {
    level: '中风险', color: 'orange', title: '争议解决方式不明确',
    original_text: '双方发生争议的，应协商解决。',
    desc: '仅约定协商，未约定协商不成时的仲裁或诉讼路径，不利于快速维权。',
    suggestion: '建议增加在线仲裁条款："协商不成的，提交中枫仲调约定的仲裁机构仲裁，一裁终局。"',
  },
  {
    level: '低风险', color: 'blue', title: '送达地址未确认',
    original_text: '（合同未约定文书送达条款）',
    desc: '未约定有效送达地址，后续争议中法律文书送达可能受阻。',
    suggestion: '建议增加送达条款，明确各方确认的送达地址、电子邮箱及手机号，并约定地址变更通知义务。',
  },
];

// ---------- 案情分析 case-analysis ----------
export interface CaseParty { name: string; role: string; }
export interface CaseElements {
  parties: CaseParty[];
  reasons: string[];
  facts: string[];
  demands: string[];
}

export const caseElements: CaseElements = {
  parties: [
    { name: '张三', role: '申请人' },
    { name: '某科技有限公司', role: '被申请人' },
  ],
  reasons: ['劳动合同纠纷', '劳动报酬争议', '经济补偿金争议'],
  facts: [
    '申请人于 2021 年 3 月入职被申请人处，担任技术岗位，双方签订三年期劳动合同。',
    '2024 年 1 月被申请人以"组织架构调整"为由口头通知解除劳动合同，未提前 30 日书面通知。',
    '被申请人尚拖欠申请人 2023 年 12 月至离职期间工资共计 4.8 万元未支付。',
  ],
  demands: [
    '请求裁决被申请人支付违法解除劳动合同赔偿金 9.6 万元。',
    '请求裁决被申请人支付拖欠工资 4.8 万元。',
  ],
};

export interface CaseAnalysisResult {
  winRate: number;
  focus: string[];
  basis: { law: string; content: string }[];
  evidence: string[];
  strategy: string[];
}

export const caseAnalysisResult: CaseAnalysisResult = {
  winRate: 78,
  focus: [
    '被申请人解除劳动合同是否符合法定程序与实体要件',
    '拖欠工资的金额认定与举证责任分配',
  ],
  basis: [
    { law: '《劳动合同法》第八十七条', content: '用人单位违反本法规定解除或者终止劳动合同的，应当依照经济补偿标准的二倍向劳动者支付赔偿金。' },
    { law: '《劳动合同法》第三十条', content: '用人单位应当按照劳动合同约定和国家规定，向劳动者及时足额支付劳动报酬。' },
    { law: '《劳动争议调解仲裁法》第六条', content: '因用人单位作出的解除劳动合同等决定发生争议的，由用人单位负举证责任。' },
  ],
  evidence: [
    '劳动合同原件（证明劳动关系及合同期限）',
    '解除通知或相关聊天记录（证明违法解除事实）',
    '工资流水与考勤记录（证明拖欠工资金额）',
  ],
  strategy: [
    '优先主张违法解除赔偿金，举证责任在用人单位，胜诉概率较高。',
    '就拖欠工资部分申请财产保全，避免被申请人转移资产。',
    '可在仲裁前尝试调解，争取一次性结清以缩短维权周期。',
  ],
};

// ---------- 合同起草 contract-draft ----------
export interface OutlineItem { sub_title: string; description: string; }

export const draftOutline: OutlineItem[] = [
  { sub_title: '合同主体与定义', description: '明确甲乙双方名称、统一社会信用代码/身份证号、联系方式，并定义合同中的专有名词。' },
  { sub_title: '标的与数量', description: '约定标的物名称、规格、型号、数量及质量标准。' },
  { sub_title: '价款与支付方式', description: '约定合同总价款、付款节点、支付方式及开票要求。' },
  { sub_title: '交付与验收', description: '约定交付时间、地点、方式及验收标准与异议期限。' },
  { sub_title: '违约责任', description: '约定逾期交付/逾期付款/质量不符等情形的违约金及赔偿计算方式。' },
  { sub_title: '争议解决', description: '约定争议提交中枫仲调约定仲裁机构在线仲裁，一裁终局。' },
];

export const draftResultText = `# 买卖合同

**甲方（出卖方）：** ______________________
**乙方（买受方）：** ______________________

根据《中华人民共和国民法典》及相关法律法规，甲乙双方在平等、自愿、公平、诚信的基础上，就买卖事宜达成如下协议：

## 第一条 标的与数量
甲方向乙方出售______（名称/规格/型号），数量为______，质量标准应符合______。

## 第二条 价款与支付方式
合同总价款为人民币______元（大写：______）。乙方应于收到货物并验收合格后 5 个工作日内一次性支付全部货款。

## 第三条 交付与验收
甲方应于______前将货物交付至______。乙方应于收货后 3 个工作日内完成验收，逾期未提出书面异议视为验收合格。

## 第四条 违约责任
任何一方逾期履行的，每逾期一日按合同总价款的 0.5% 向对方支付违约金，累计不超过合同总价款的 30%。

## 第五条 争议解决
因本合同引起的或与本合同有关的任何争议，双方应友好协商解决；协商不成的，提交中枫仲调约定的仲裁机构仲裁，一裁终局。

（以下无正文）`;

// ---------- 文书生成 structured-doc (docs) ----------
export interface DocTypeGroup { label: string; children: string[]; }

export const docTypeGroups: DocTypeGroup[] = [
  { label: '仲裁文书', children: ['仲裁申请书', '仲裁答辩书', '仲裁代理词'] },
  { label: '诉讼文书', children: ['民事起诉状', '民事答辩状', '上诉状'] },
  { label: '非诉文书', children: ['律师函', '催款函', '和解协议'] },
];

export const docResultText = `# 仲裁申请书

**申请人：** 张三，男，汉族，197X 年 X 月 X 日出生，住______，身份证号______。
**被申请人：** 某科技有限公司，住所地______，统一社会信用代码______，法定代表人______。

## 仲裁请求
1. 请求裁决被申请人支付违法解除劳动合同赔偿金人民币 96,000 元；
2. 请求裁决被申请人支付拖欠工资人民币 48,000 元；
3. 本案仲裁费用由被申请人承担。

## 事实与理由
申请人于 2021 年 3 月入职被申请人处，双方签订三年期劳动合同。2024 年 1 月，被申请人以"组织架构调整"为由口头通知解除劳动合同，未提前 30 日书面通知，亦未支付任何补偿，且拖欠申请人工资共计 48,000 元未付。

被申请人的行为违反《劳动合同法》第三十条、第八十七条之规定。为维护申请人合法权益，特依法提起仲裁，请予支持。

此致
______仲裁委员会

申请人（签名）：______
______年______月______日`;

// ---------- 大数据查询 big-data-query ----------
export interface CompanyQueryResult {
  title: string;
  typeLabel: string;
  basic: { label: string; value: string }[];
  risk: { label: string; value: string; color: string }[];
}

export const companyQueryResult: CompanyQueryResult = {
  title: '某科技有限公司',
  typeLabel: '企业信用报告',
  basic: [
    { label: '统一社会信用代码', value: '91310000XXXXXXXX1A' },
    { label: '法定代表人', value: '王某某' },
    { label: '注册资本', value: '1,000 万元人民币' },
    { label: '成立日期', value: '2016-08-12' },
    { label: '经营状态', value: '存续（在营、开业、在册）' },
  ],
  risk: [
    { label: '司法案件', value: '12 起', color: 'orange' },
    { label: '失信记录', value: '0 条', color: 'green' },
    { label: '被执行人', value: '1 条', color: 'red' },
    { label: '经营异常', value: '0 条', color: 'green' },
    { label: '行政处罚', value: '2 条', color: 'orange' },
    { label: '股权出质', value: '1 条', color: 'orange' },
  ],
};

export interface PersonQueryResult {
  title: string;
  typeLabel: string;
  basic: { label: string; value: string }[];
  risk: { label: string; value: string; color: string }[];
}

export const personQueryResult: PersonQueryResult = {
  title: '张某某',
  typeLabel: '个人信用画像报告',
  basic: [
    { label: '实名核验', value: '通过（姓名与身份证号一致）' },
    { label: '关联企业', value: '2 家（含 1 家任法定代表人）' },
  ],
  risk: [
    { label: '失信被执行', value: '0 条', color: 'green' },
    { label: '限制高消费', value: '0 条', color: 'green' },
    { label: '涉诉记录', value: '3 条', color: 'orange' },
    { label: '被执行记录', value: '1 条', color: 'red' },
  ],
};
