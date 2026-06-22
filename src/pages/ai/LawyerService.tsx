import { useState } from 'react';
import { Row, Col, Card, Avatar, Tag, Button, Rate, Modal, Descriptions, message } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { lawyers, type Lawyer } from '../../mock/data';

export default function LawyerService() {
  const [active, setActive] = useState<Lawyer | null>(null);
  const [msg, ctx] = message.useMessage();

  return (
    <div style={{ padding: 28 }}>
      {ctx}
      <div className="zf-section-title" style={{ marginBottom: 6 }}>律师服务</div>
      <p style={{ color: '#8a93a0', marginBottom: 20 }}>精品律所一对一服务，资深律师在线接案。</p>
      <Row gutter={[16, 16]}>
        {lawyers.map((l) => (
          <Col xs={24} sm={12} md={12} key={l.id}>
            <Card className="zf-hover-card">
              <div style={{ display: 'flex', gap: 16 }}>
                <Avatar size={64} style={{ background: '#2f6bff', flex: '0 0 auto' }} icon={<UserOutlined />} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontWeight: 700, fontSize: 18 }}>{l.name}</span>
                    <Tag color="blue">{l.title}</Tag>
                  </div>
                  <div style={{ color: '#8a93a0', marginTop: 2 }}>{l.firm} · 执业 {l.years} 年</div>
                  <div style={{ margin: '8px 0' }}>
                    {l.good.map((g) => <Tag key={g}>{g}</Tag>)}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Rate disabled allowHalf defaultValue={l.rating} style={{ fontSize: 14 }} />
                    <span style={{ color: '#fa8c16' }}>{l.rating}</span>
                    <span style={{ color: '#8a93a0' }}>· 服务 {l.cases} 例</span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                <Button onClick={() => setActive(l)}>查看详情</Button>
                <Button type="primary" onClick={() => msg.success(`已为您预约 ${l.name} 律师`)}>立即咨询</Button>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal open={!!active} title="律师详情" footer={null} onCancel={() => setActive(null)}>
        {active && (
          <>
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <Avatar size={72} style={{ background: '#2f6bff' }} icon={<UserOutlined />} />
              <div style={{ fontWeight: 700, fontSize: 18, marginTop: 8 }}>{active.name} <Tag color="blue">{active.title}</Tag></div>
            </div>
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="所属律所">{active.firm}</Descriptions.Item>
              <Descriptions.Item label="执业年限">{active.years} 年</Descriptions.Item>
              <Descriptions.Item label="擅长领域">{active.good.map((g) => <Tag key={g}>{g}</Tag>)}</Descriptions.Item>
              <Descriptions.Item label="服务案例">{active.cases} 例</Descriptions.Item>
              <Descriptions.Item label="综合评分">{active.rating} / 5.0</Descriptions.Item>
            </Descriptions>
            <Button type="primary" block style={{ marginTop: 16 }} onClick={() => { msg.success(`已为您预约 ${active.name} 律师`); setActive(null); }}>
              立即咨询
            </Button>
          </>
        )}
      </Modal>
    </div>
  );
}
