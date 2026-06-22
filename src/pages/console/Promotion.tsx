import { Row, Col, Card, Statistic, Input, Button, QRCode, Table, Tag, message, Divider } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import { currentUser } from '../../mock/data';

const records = [
  { key: '1', user: '王*三', phone: '139****1234', time: '2024-05-12 10:20', status: '已注册' },
  { key: '2', user: '李*四', phone: '138****5678', time: '2024-05-10 14:05', status: '已下单' },
  { key: '3', user: '赵*六', phone: '137****8888', time: '2024-05-08 09:40', status: '已注册' },
];

export default function Promotion() {
  const [msg, ctx] = message.useMessage();
  const copy = (text: string) => { navigator.clipboard?.writeText(text); msg.success('已复制'); };

  return (
    <div>
      {ctx}
      <div className="zf-section-title" style={{ marginBottom: 20 }}>我的推广</div>
      <Row gutter={16}>
        <Col xs={24} md={14}>
          <Card style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col span={8}><Statistic title="累计推广人数" value={records.length} suffix="人" valueStyle={{ color: '#2f6bff' }} /></Col>
              <Col span={8}><Statistic title="已注册" value={records.filter((r) => r.status === '已注册').length} suffix="人" /></Col>
              <Col span={8}><Statistic title="已下单" value={records.filter((r) => r.status === '已下单').length} suffix="人" valueStyle={{ color: '#52c41a' }} /></Col>
            </Row>
            <Divider />
            <div style={{ marginBottom: 14 }}>
              <div style={{ color: '#8a93a0', marginBottom: 6 }}>我的推广码</div>
              <Input
                value={currentUser.inviteCode}
                readOnly
                size="large"
                addonAfter={<span style={{ cursor: 'pointer' }} onClick={() => copy(currentUser.inviteCode)}><CopyOutlined /> 复制</span>}
                style={{ maxWidth: 320 }}
              />
            </div>
            <div>
              <div style={{ color: '#8a93a0', marginBottom: 6 }}>专属推广链接</div>
              <Input
                value={currentUser.inviteLink}
                readOnly
                addonAfter={<span style={{ cursor: 'pointer' }} onClick={() => copy(currentUser.inviteLink)}><CopyOutlined /> 复制</span>}
              />
            </div>
          </Card>
          <Card title="推广明细">
            <Table
              dataSource={records}
              pagination={false}
              columns={[
                { title: '用户', dataIndex: 'user' },
                { title: '手机号', dataIndex: 'phone' },
                { title: '注册时间', dataIndex: 'time' },
                { title: '状态', dataIndex: 'status', render: (v) => <Tag color={v === '已下单' ? 'green' : 'blue'}>{v}</Tag> },
              ]}
            />
          </Card>
        </Col>
        <Col xs={24} md={10}>
          <Card title="推广二维码" style={{ textAlign: 'center' }}>
            <QRCode value={currentUser.inviteLink} size={200} style={{ margin: '0 auto' }} />
            <p style={{ color: '#8a93a0', marginTop: 12 }}>扫码或分享链接，好友注册下单即可绑定推广关系</p>
            <Button type="primary" onClick={() => copy(currentUser.inviteLink)}>复制链接分享</Button>
          </Card>
          <Card title="推广规则说明" style={{ marginTop: 16 }}>
            <p style={{ color: '#4b5563', lineHeight: 1.9 }}>1. 好友通过您分享的链接或扫码注册，即可绑定推广关系。</p>
            <p style={{ color: '#4b5563', lineHeight: 1.9 }}>2. 推广成功后，用户下单购买产品为您发放奖励，具体奖励规则咨询平台客服。</p>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
