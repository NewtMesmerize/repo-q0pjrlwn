// AI 法律各模块的历史记录（演示数据）
export interface HistorySection {
  label: string;
  content: string;
}

export interface AiHistoryRecord {
  id: string;
  toolKey: string; // 对应 aiTools 的 key
  title: string;
  createTime: string; // YYYY-MM-DD HH:mm
  statusName: string; // 已完成 / 进行中 / 草稿
  detail: HistorySection[];
}

export const statusColor: Record<string, string> = {
  已完成: 'green',
  进行中: 'blue',
  调解中: 'blue',
  草稿: 'default',
};

export const aiHistory: AiHistoryRecord[] = [
  // 智能咨询
  {
    id: 'h-chat-1', toolKey: 'chat', title: '关于劳动合同到期不续签的咨询',
    createTime: '2026-06-08 14:32', statusName: '已完成',
    detail: [
      { label: '咨询问题', content: '公司劳动合同到期不续签，需要支付经济补偿金吗？' },
      { label: 'AI 解答', content: '若用人单位维持或提高劳动合同约定条件续订，劳动者不同意续订的，无需支付经济补偿；若用人单位降低条件或不续订，应按工作年限支付经济补偿（每满一年支付一个月工资）。' },
      { label: '法律依据', content: '《劳动合同法》第四十六条、第四十七条' },
    ],
  },
  {
    id: 'h-chat-2', toolKey: 'chat', title: '租赁合同押金不退如何维权',
    createTime: '2026-06-05 09:10', statusName: '已完成',
    detail: [
      { label: '咨询问题', content: '房东以房屋有损耗为由拒退押金，应如何处理？' },
      { label: 'AI 解答', content: '建议先与房东协商并要求出具损耗清单与凭证；协商不成可向人民法院起诉或申请仲裁，主张返还押金。注意保留租赁合同、付款记录、退租验房照片等证据。' },
      { label: '法律依据', content: '《民法典》第七百零三条、第五百七十七条' },
    ],
  },
  // 合同审查
  {
    id: 'h-review-1', toolKey: 'contract-review', title: '采购框架协议-审查报告',
    createTime: '2026-06-09 16:48', statusName: '已完成',
    detail: [
      { label: '合同类型', content: '采购框架协议（我方为采购方）' },
      { label: '风险等级', content: '中风险（发现 3 处主要风险）' },
      { label: '主要风险', content: '1. 验收标准约定模糊；2. 违约责任仅约束供方一方；3. 付款节点与交付节点不匹配。' },
      { label: '修改建议', content: '建议明确验收标准与期限、补充双方违约责任对等条款、将付款与验收合格绑定。' },
    ],
  },
  {
    id: 'h-review-2', toolKey: 'contract-review', title: '房屋租赁合同-审查报告',
    createTime: '2026-06-02 11:20', statusName: '已完成',
    detail: [
      { label: '合同类型', content: '房屋租赁合同（我方为承租方）' },
      { label: '风险等级', content: '低风险（发现 1 处提示项）' },
      { label: '主要风险', content: '租金递增条款未约定上限。' },
      { label: '修改建议', content: '建议增加年度递增幅度上限，避免后续大幅上调。' },
    ],
  },
  // 案情分析
  {
    id: 'h-case-1', toolKey: 'case-analysis', title: '买卖合同货款拖欠纠纷-分析报告',
    createTime: '2026-06-07 10:05', statusName: '已完成',
    detail: [
      { label: '纠纷类型', content: '买卖合同纠纷' },
      { label: '胜诉概率', content: '约 78%' },
      { label: '争议焦点', content: '货物是否已交付、对账单效力、逾期利息计算标准。' },
      { label: '建议策略', content: '固定送货签收凭证与对账记录，主张本金及逾期利息，必要时申请财产保全。' },
    ],
  },
  // 合同起草
  {
    id: 'h-draft-1', toolKey: 'contract-draft', title: '技术服务合同-起草初稿',
    createTime: '2026-06-06 15:40', statusName: '已完成',
    detail: [
      { label: '合同类型', content: '技术服务合同' },
      { label: '核心条款', content: '服务范围、服务期限、服务费用与支付、知识产权归属、保密义务、违约责任。' },
      { label: '生成结果', content: '已生成包含 12 条主体条款的合同初稿，可在线编辑后导出。' },
    ],
  },
  // 文书生成
  {
    id: 'h-doc-1', toolKey: 'structured-doc', title: '仲裁申请书-劳动报酬争议',
    createTime: '2026-06-04 17:22', statusName: '已完成',
    detail: [
      { label: '文书类型', content: '仲裁申请书' },
      { label: '当事人', content: '申请人：张某；被申请人：某科技有限公司' },
      { label: '仲裁请求', content: '请求裁决被申请人支付拖欠工资及经济补偿合计 36,000 元。' },
      { label: '生成结果', content: '已生成规范仲裁申请书，可预览并下载 PDF。' },
    ],
  },
  // 仲裁咨询
  {
    id: 'h-arb-1', toolKey: 'arbitration-consult', title: '在线仲裁立案流程咨询',
    createTime: '2026-06-03 13:15', statusName: '已完成',
    detail: [
      { label: '咨询问题', content: '线上仲裁如何立案？需要准备哪些材料？' },
      { label: 'AI 解答', content: '需准备仲裁申请书、双方主体资格证明、仲裁协议、证据材料清单。提交后由仲裁机构审核受理并通知缴费。' },
    ],
  },
  // 律师服务
  {
    id: 'h-lawyer-1', toolKey: 'lawyer-service', title: '一对一律师咨询预约-合同纠纷',
    createTime: '2026-06-01 19:30', statusName: '已完成',
    detail: [
      { label: '服务类型', content: '一对一律师咨询' },
      { label: '律师', content: '王律师（合同与商事争议方向，执业 12 年）' },
      { label: '咨询主题', content: '合作经营合同解除及损失赔偿。' },
      { label: '状态', content: '咨询已完成，律师已出具书面意见。' },
    ],
  },
  // 大数据查询
  {
    id: 'h-bigdata-1', toolKey: 'big-data-query', title: '企业查询-某科技有限公司',
    createTime: '2026-06-09 10:18', statusName: '已完成',
    detail: [
      { label: '查询类型', content: '企业查询' },
      { label: '查询对象', content: '某科技有限公司（统一社会信用代码 91********XA）' },
      { label: '风险概览', content: '工商存续；涉诉案件 2 起；失信记录 0；行政处罚 1。' },
      { label: '报告', content: '已生成风险信用报告，可预览 / 下载 PDF。' },
    ],
  },
  {
    id: 'h-bigdata-2', toolKey: 'big-data-query', title: '个人核验-张某',
    createTime: '2026-06-06 16:02', statusName: '已完成',
    detail: [
      { label: '查询类型', content: '个人查询' },
      { label: '查询对象', content: '张某（身份证 5****************X）' },
      { label: '风险概览', content: '实名核验通过；涉诉记录 0；失信记录 0。' },
      { label: '报告', content: '已生成个人风险核验报告，可预览 / 下载 PDF。' },
    ],
  },
  // 调解服务
  {
    id: 'h-mediation-1', toolKey: 'mediation-service', title: '民间借贷纠纷调解申请',
    createTime: '2026-05-30 09:50', statusName: '调解中',
    detail: [
      { label: '纠纷类型', content: '民间借贷纠纷' },
      { label: '调解标的', content: '借款本金 50,000 元及利息' },
      { label: '当前进度', content: '已受理并指派调解员，等待双方到场调解。' },
    ],
  },
];
