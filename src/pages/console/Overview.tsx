import { Row, Col, Card, Avatar, Tag, Statistic, Button, List } from 'antd';
import {
  UserOutlined, WalletOutlined, FileTextOutlined, AppstoreOutlined, AuditOutlined, RightOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { currentUser, orders, arbCases } from '../../mock/data';

export default function Overview() {
  const navigate = useNavigate();
  const quick = [
    { label: '我的订单', to: '/console/orders' },
    { label: '我的产品包A', to: '/console/products-a' },
    { label: '我的产品包B', to: '/console/products-b' },
    { label: '我的仲裁', to: '/console/arbitration' },
    { label: '我的推广', to: '/console/promotion' },
    { label: '个人资料', to: '/console/profile' },
  ];

  return (
    <div>
      <Card style={{ marginBottom: 16, background: 'linear-gradient(120deg,#2f6bff,#1c4dd6)', border: 'none' }} styles={{ body: { display: 'flex', alignItems: 'center', gap: 20 } }}>
        <Avatar size={64} style={{ background: 'rgba(255,255,255,0.25)' }} icon={<UserOutlined />} />
        <div style={{ color: '#fff' }}>
          <div style={{ fontSize: 22, fontWeight: 800 }}>{currentUser.name} <Tag color="gold" style={{ marginLeft: 8 }}>{currentUser.role}</Tag></div>
          <div style={{ color: 'rgba(255,255,255,0.8)', marginTop: 4 }}>{currentUser.phone}</div>
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ textAlign: 'right', color: '#fff' }}>
          <div style={{ color: 'rgba(255,255,255,0.8)' }}>我的积分</div>
          <div style={{ fontSize: 28, fontWeight: 800 }}>{currentUser.points}</div>
        </div>
      </Card>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col xs={12} md={6}><Card><Statistic title="我的积分" value={currentUser.points} prefix={<WalletOutlined />} valueStyle={{ color: '#fa8c16' }} /></Card></Col>
        <Col xs={12} md={6}><Card><Statistic title="我的订单" value={orders.length} prefix={<FileTextOutlined />} valueStyle={{ color: '#2f6bff' }} /></Card></Col>
        <Col xs={12} md={6}><Card><Statistic title="产品包余量" value={26} prefix={<AppstoreOutlined />} valueStyle={{ color: '#722ed1' }} /></Card></Col>
        <Col xs={12} md={6}><Card><Statistic title="进行中仲裁" value={arbCases.filter((c) => c.progress > 0 && c.progress < 100).length} prefix={<AuditOutlined />} valueStyle={{ color: '#52c41a' }} /></Card></Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} md={14}>
          <Card title="最近订单" extra={<a onClick={() => navigate('/console/orders')}>全部</a>}>
            <List
              dataSource={orders.slice(0, 4)}
              renderItem={(o) => (
                <List.Item actions={[<Tag key="s" color={o.status === '已完成' ? 'green' : o.status === '待支付' ? 'orange' : 'default'}>{o.status}</Tag>]}>
                  <List.Item.Meta title={o.product} description={`${o.id} · ${o.date}`} />
                  <span style={{ color: '#f5222d', fontWeight: 700 }}>¥{o.amount}</span>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col xs={24} md={10}>
          <Card title="快捷入口">
            <Row gutter={[12, 12]}>
              {quick.map((q) => (
                <Col span={12} key={q.to}>
                  <Button block style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} onClick={() => navigate(q.to)}>
                    {q.label} <RightOutlined style={{ fontSize: 12 }} />
                  </Button>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
