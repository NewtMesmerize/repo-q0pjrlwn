import { Row, Col, Card, Steps, Statistic, List, Button, message } from 'antd';
import { CheckCircleFilled } from '@ant-design/icons';

const scenes = ['合同纠纷', '股权争议', '公司治理', '建设工程', '债权债务', '合作纠纷'];
const flow = [
  { title: '提交申请', description: '填写调解申请表，提交相关材料' },
  { title: '案件评估', description: '专业团队评估案件，制定调解方案' },
  { title: '调解过程', description: '组织双方调解，协商解决方案' },
  { title: '达成协议', description: '签署调解协议，完成调解流程' },
];
const advantages = ['专业团队，经验丰富', '高效便捷，节省时间', '保密性强，保护隐私', '成本较低，性价比高', '灵活多样，适应性强', '法律效力，有保障'];

export default function MediationService() {
  const [msg, ctx] = message.useMessage();
  return (
    <div style={{ padding: 28 }}>
      {ctx}
      <div className="zf-gradient-blue" style={{ borderRadius: 12, padding: 28, color: '#fff', marginBottom: 24 }}>
        <h1 style={{ color: '#fff', margin: 0, fontSize: 28, fontWeight: 800 }}>民商事纠纷调解服务</h1>
        <p style={{ color: 'rgba(255,255,255,0.85)', marginTop: 8 }}>专业调解团队 · 高效解决纠纷，线下购买对接，全程跟进服务</p>
        <Button size="large" style={{ marginTop: 16 }} onClick={() => msg.info('正在为您接入调解服务客服…')}>了解购买流程</Button>
      </div>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}><Card><Statistic title="资深调解员" value={50} suffix="+" valueStyle={{ color: '#2f6bff' }} /></Card></Col>
        <Col span={8}><Card><Statistic title="调解成功率" value={98} suffix="%" valueStyle={{ color: '#2f6bff' }} /></Card></Col>
        <Col span={8}><Card><Statistic title="成功案例" value={1000} suffix="+" valueStyle={{ color: '#2f6bff' }} /></Card></Col>
      </Row>

      <div className="zf-section-title">适用场景</div>
      <Row gutter={[12, 12]} style={{ margin: '16px 0 32px' }}>
        {scenes.map((s) => (
          <Col xs={12} md={8} key={s}>
            <Card size="small" style={{ textAlign: 'center' }}>{s}</Card>
          </Col>
        ))}
      </Row>

      <div className="zf-section-title">服务流程</div>
      <Card style={{ margin: '16px 0 32px' }}>
        <Steps current={-1} items={flow} />
      </Card>

      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Card title="服务优势" style={{ height: '100%' }}>
            <List
              dataSource={advantages}
              renderItem={(a) => <List.Item><CheckCircleFilled style={{ color: '#52c41a', marginRight: 10 }} />{a}</List.Item>}
            />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="收费标准" style={{ height: '100%' }}>
            <p style={{ color: '#4b5563', lineHeight: 1.9 }}>
              调解服务为线下购买项，不通过平台积分兑换。具体费用根据案件复杂程度、争议金额等因素确定，详情请咨询客服。
            </p>
            <p style={{ color: '#4b5563', lineHeight: 1.9 }}>
              由资深调解员、法律专家、行业顾问组成的专业团队，具备丰富的民商事纠纷调解经验，为您提供专业、高效的调解服务。
            </p>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
