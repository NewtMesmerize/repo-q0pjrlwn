import { useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Card, Button, Tag, Breadcrumb, Result, message } from 'antd';
import { packages } from '../mock/data';

export default function PackageDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [msg, ctx] = message.useMessage();
  const pkg = packages.find((p) => p.id === id);

  if (!pkg) {
    return <Result status="404" title="套餐不存在" extra={<Button type="primary" onClick={() => navigate('/packages')}>返回套餐列表</Button>} />;
  }

  return (
    <div className="zf-container" style={{ padding: '24px 24px 48px' }}>
      {ctx}
      <Breadcrumb
        style={{ marginBottom: 16 }}
        items={[
          { title: <a onClick={() => navigate('/')}>首页</a> },
          { title: <a onClick={() => navigate('/packages')}>产品套餐</a> },
          { title: pkg.title },
        ]}
      />
      <Row gutter={24}>
        <Col xs={24} md={15}>
          <Card style={{ background: pkg.color, border: 'none' }}>
            <Tag color="gold">可兑换 {pkg.points.toLocaleString()} 积分</Tag>
            <h1 style={{ fontSize: 30, fontWeight: 800, margin: '12px 0 4px' }}>{pkg.title}</h1>
            <div style={{ color: '#6b7280' }}>{pkg.subtitle}</div>
            <div style={{ color: '#f5222d', fontSize: 40, fontWeight: 800, marginTop: 16 }}>¥{pkg.price}</div>
          </Card>
          <Card style={{ marginTop: 16 }} title="套餐说明">
            <p style={{ color: '#6b7280', lineHeight: 1.9 }}>
              本套餐为演示数据。购买后可在「我的控制台 → 我的产品包」中查看余量、激活自用或转赠他人。
              服务有效期 12 个月，具体使用规则请咨询平台客服。
            </p>
          </Card>
        </Col>
        <Col xs={24} md={9}>
          <Card style={{ position: 'sticky', top: 88 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ color: '#8a93a0' }}>套餐价格</span>
              <span style={{ color: '#f5222d', fontWeight: 700, fontSize: 22 }}>¥{pkg.price}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ color: '#8a93a0' }}>可兑换积分</span>
              <span style={{ color: '#ff9500', fontWeight: 700 }}>{pkg.points.toLocaleString()} 积分</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <span style={{ color: '#8a93a0' }}>有效期</span>
              <span>12 个月</span>
            </div>
            <Button type="primary" size="large" block onClick={() => msg.success('已加入订单（演示）')}>
              立即购买
            </Button>
            <Button size="large" block style={{ marginTop: 12 }} onClick={() => msg.info('正在为您接入客服…')}>
              咨询客服
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
