import { Row, Col, Card, Button, message } from 'antd';
import { GiftOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { myPackagesB } from '../../mock/data';

export default function ProductsB() {
  const [msg, ctx] = message.useMessage();
  return (
    <div>
      {ctx}
      <div className="zf-section-title" style={{ marginBottom: 20 }}>我的产品包B</div>
      <Row gutter={[16, 16]}>
        {myPackagesB.map((p) => (
          <Col xs={24} md={12} key={p.id}>
            <Card className="zf-hover-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 48, height: 48, borderRadius: 10, background: '#f3eeff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#722ed1', fontSize: 22 }}>
                  <GiftOutlined />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>{p.name}</div>
                  <div style={{ color: '#8a93a0', fontSize: 13 }}>余量：<b style={{ color: '#722ed1' }}>{p.remain}</b></div>
                </div>
                <div style={{ color: '#f5222d', fontWeight: 800, fontSize: 18 }}>¥{p.price}</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 14 }}>
                <Button type="primary" icon={<CheckCircleOutlined />} onClick={() => msg.success(`${p.name} 已激活使用`)}>激活使用</Button>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
      <p style={{ color: '#8a93a0', marginTop: 16 }}>产品包B 为企业内部分配额度，仅支持激活使用，不支持转赠。</p>
    </div>
  );
}
