import { Card, Table, Alert, Tag } from 'antd';

const rows = [
  { key: '1', item: 'AI 法律咨询', unit: '次', price: '会员免费 / 非会员 9.9 元', note: '单次问答' },
  { key: '2', item: 'AI 合同审查', unit: '份', price: '会员包含 / 超出 29 元/份', note: '按份计费' },
  { key: '3', item: 'AI 文书生成', unit: '份', price: '19 元/份', note: '导出 PDF' },
  { key: '4', item: '大数据查询', unit: '次', price: '企业信用 5 元 / 司法案件 8 元', note: '按次计费' },
  { key: '5', item: '在线仲裁立案', unit: '件', price: '按争议金额阶梯收取', note: '依仲裁规则' },
  { key: '6', item: '律师一对一服务', unit: '小时', price: '300 元起/小时', note: '按律师等级' },
  { key: '7', item: '调解服务', unit: '件', price: '线下议价', note: '不通过积分兑换' },
];

export default function Billing() {
  return (
    <div>
      <div className="zf-section-title" style={{ marginBottom: 20 }}>计费规则</div>
      <Alert
        type="info"
        showIcon
        message="以下为平台各项服务的计费规则示例（演示数据）。购买服务包后，包内服务按权益免费或抵扣，超出部分按下表计费。"
        style={{ marginBottom: 16 }}
      />
      <Card>
        <Table
          dataSource={rows}
          pagination={false}
          columns={[
            { title: '服务项目', dataIndex: 'item', render: (v) => <b>{v}</b> },
            { title: '计费单位', dataIndex: 'unit', render: (v) => <Tag>{v}</Tag> },
            { title: '计费标准', dataIndex: 'price' },
            { title: '备注', dataIndex: 'note' },
          ]}
        />
      </Card>
    </div>
  );
}
