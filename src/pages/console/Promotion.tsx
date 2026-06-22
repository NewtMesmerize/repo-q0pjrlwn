import { useState } from 'react';
import { Row, Col, Card, Statistic, Input, Button, QRCode, Table, Tag, message, Divider, Tabs, Avatar, Tooltip, Modal, Radio, Space } from 'antd';
import { CopyOutlined, EyeOutlined, EyeInvisibleOutlined, UserOutlined, ShopOutlined } from '@ant-design/icons';
import { currentUser } from '../../mock/data';

const maskPhone = (phone: string) => phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');

const mockUsers = [
  { id: '1', realName: '王*三', phone: '13912341234', createTime: '2024-05-12 10:20', postName: '个人用户', totalConsume: 399 },
  { id: '2', realName: '李*四', phone: '13856785678', createTime: '2024-05-10 14:05', postName: '企业用户', totalConsume: 6980 },
  { id: '3', realName: '赵*六', phone: '13788888888', createTime: '2024-05-08 09:40', postName: '个人用户', totalConsume: 0 },
  { id: '4', realName: '张*七', phone: '13611112222', createTime: '2024-05-06 16:30', postName: '推广员', totalConsume: 19800 },
  { id: '5', realName: '陈*八', phone: '13922223333', createTime: '2024-05-03 11:15', postName: '个人用户', totalConsume: 399 },
];

const mockOrders = [
  { id: '1', realName: '王*三', packageName: '个人基础服务包', createTime: '2024-05-13 09:20', payAmount: 399, orderStatus: 1 },
  { id: '2', realName: '李*四', packageName: '企业基础服务包', createTime: '2024-05-11 15:30', payAmount: 6980, orderStatus: 1 },
  { id: '3', realName: '张*七', packageName: '旗舰服务包', createTime: '2024-05-07 10:00', payAmount: 19800, orderStatus: 1 },
  { id: '4', realName: '陈*八', packageName: '个人基础服务包', createTime: '2024-05-04 14:20', payAmount: 399, orderStatus: 1 },
  { id: '5', realName: '赵*六', packageName: '企业基础服务包', createTime: '2024-05-09 08:45', payAmount: 6980, orderStatus: 0 },
];

const identityOptions = [
  { value: '1', label: '个人用户', quantity: 10 },
  { value: '2', label: '企业用户', quantity: 5 },
  { value: '3', label: '推广员', quantity: 3 },
  { value: '4', label: '业务主管', quantity: 1 },
  { value: '5', label: '总监', quantity: 0 },
];

export default function Promotion() {
  const [msg, ctx] = message.useMessage();
  const [revealedPhones, setRevealedPhones] = useState<Record<string, boolean>>({});
  const [identityModalOpen, setIdentityModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<typeof mockUsers[0] | null>(null);
  const [selectedIdentity, setSelectedIdentity] = useState('');
  const [filterUser, setFilterUser] = useState<string | null>(null);

  const copy = (text: string) => { navigator.clipboard?.writeText(text); msg.success('已复制'); };

  const togglePhone = (id: string) => {
    setRevealedPhones((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSetIdentity = (user: typeof mockUsers[0]) => {
    setSelectedUser(user);
    setSelectedIdentity('');
    setIdentityModalOpen(true);
  };

  const handleSaveIdentity = () => {
    if (!selectedIdentity) {
      msg.error('请选择身份');
      return;
    }
    msg.success('身份设置成功');
    setIdentityModalOpen(false);
    setSelectedUser(null);
  };

  const filteredOrders = filterUser
    ? mockOrders.filter((o) => o.realName === filterUser)
    : mockOrders;

  const userColumns = [
    {
      title: '用户',
      dataIndex: 'realName',
      render: (name: string, record: typeof mockUsers[0]) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Avatar style={{ background: 'linear-gradient(135deg, #4f83ff, #2b61ff)', flexShrink: 0 }}>{name.charAt(0)}</Avatar>
          <div>
            <div style={{ fontWeight: 600 }}>
              {name}
              <span style={{ marginLeft: 8, fontSize: 12, color: '#94a3b8' }}>
                {revealedPhones[record.id] ? record.phone : maskPhone(record.phone)}
                <Tooltip title={revealedPhones[record.id] ? '隐藏手机号' : '显示手机号'}>
                  <span style={{ cursor: 'pointer', marginLeft: 4 }} onClick={(e) => { e.stopPropagation(); togglePhone(record.id); }}>
                    {revealedPhones[record.id] ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                  </span>
                </Tooltip>
              </span>
            </div>
            <div style={{ fontSize: 12, color: '#94a3b8' }}>注册时间：{record.createTime}</div>
          </div>
        </div>
      ),
    },
    {
      title: '身份',
      dataIndex: 'postName',
      width: 140,
      render: (v: string, record: typeof mockUsers[0]) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Tag color="blue">{v}</Tag>
          <a style={{ fontSize: 12 }} onClick={(e) => { e.stopPropagation(); handleSetIdentity(record); }}>设置</a>
        </div>
      ),
    },
    {
      title: '累计消费',
      dataIndex: 'totalConsume',
      width: 120,
      align: 'right' as const,
      render: (v: number) => <span style={{ fontWeight: 700, color: v > 0 ? '#ff4d4f' : '#94a3b8' }}>¥{v}</span>,
    },
    {
      title: '操作',
      width: 100,
      align: 'center' as const,
      render: (_: unknown, record: typeof mockUsers[0]) => (
        <a onClick={() => setFilterUser(record.realName)}>查看订单</a>
      ),
    },
  ];

  const orderColumns = [
    {
      title: '下单用户',
      dataIndex: 'realName',
      render: (v: string) => (
        <Space>
          <Tag color="blue" style={{ borderRadius: 999 }}>{v}</Tag>
          <Tag style={{ borderRadius: 999 }}>下单</Tag>
        </Space>
      ),
    },
    { title: '产品', dataIndex: 'packageName' },
    { title: '下单时间', dataIndex: 'createTime', width: 170 },
    {
      title: '金额',
      dataIndex: 'payAmount',
      width: 100,
      align: 'right' as const,
      render: (v: number) => <span style={{ fontWeight: 700, color: '#ff4d4f', fontSize: 15 }}>¥{v}</span>,
    },
    {
      title: '状态',
      dataIndex: 'orderStatus',
      width: 90,
      align: 'center' as const,
      render: (v: number) => (
        <Tag color={v === 1 ? 'green' : 'orange'}>{v === 1 ? '已支付' : '待支付'}</Tag>
      ),
    },
  ];

  return (
    <div>
      {ctx}
      <div className="zf-section-title" style={{ marginBottom: 20 }}>我的推广</div>
      <Row gutter={16}>
        <Col xs={24} md={14}>
          <Card style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col span={8}><Statistic title="累计推广人数" value={mockUsers.length} suffix="人" valueStyle={{ color: '#2f6bff' }} /></Col>
              <Col span={8}><Statistic title="已下单人数" value={mockOrders.filter((o) => o.orderStatus === 1).length} suffix="人" valueStyle={{ color: '#52c41a' }} /></Col>
              <Col span={8}><Statistic title="累计消费" value={mockUsers.reduce((s, u) => s + u.totalConsume, 0)} prefix="¥" valueStyle={{ color: '#ff4d4f' }} /></Col>
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
        </Col>
        <Col xs={24} md={10}>
          <Card title="推广二维码" style={{ textAlign: 'center', marginBottom: 16 }}>
            <QRCode value={currentUser.inviteLink} size={200} style={{ margin: '0 auto' }} />
            <p style={{ color: '#8a93a0', marginTop: 12 }}>扫码或分享链接，好友注册下单即可绑定推广关系</p>
            <Button type="primary" onClick={() => copy(currentUser.inviteLink)}>复制链接分享</Button>
          </Card>
          <Card title="推广规则说明">
            <p style={{ color: '#4b5563', lineHeight: 1.9 }}>1. 好友通过您分享的链接或扫码注册，即可绑定推广关系。</p>
            <p style={{ color: '#4b5563', lineHeight: 1.9 }}>2. 推广成功后，用户下单购买产品为您发放奖励，具体奖励规则咨询平台客服。</p>
          </Card>
        </Col>
      </Row>

      <Card style={{ marginTop: 16 }}>
        <Tabs
          defaultActiveKey="users"
          items={[
            {
              key: 'users',
              label: <span><UserOutlined /> 邀请人员 <Tag style={{ marginLeft: 4 }}>{mockUsers.length}</Tag></span>,
              children: (
                <Table
                  dataSource={mockUsers}
                  columns={userColumns}
                  rowKey="id"
                  pagination={{ pageSize: 10, size: 'small', showTotal: (t) => `共 ${t} 人` }}
                />
              ),
            },
            {
              key: 'orders',
              label: <span><ShopOutlined /> 订单记录 <Tag style={{ marginLeft: 4 }}>{mockOrders.length}</Tag></span>,
              children: (
                <>
                  {filterUser && (
                    <div style={{ background: '#e6f7ff', padding: '8px 16px', borderRadius: 8, marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13, color: '#1890ff' }}>
                      <span>{filterUser} 的订单</span>
                      <a onClick={() => setFilterUser(null)}>清除筛选</a>
                    </div>
                  )}
                  <Table
                    dataSource={filteredOrders}
                    columns={orderColumns}
                    rowKey="id"
                    pagination={{ pageSize: 10, size: 'small', showTotal: (t) => `共 ${t} 条` }}
                  />
                </>
              ),
            },
          ]}
        />
      </Card>

      <Modal
        title="设置推广身份"
        open={identityModalOpen}
        onCancel={() => { setIdentityModalOpen(false); setSelectedUser(null); }}
        onOk={handleSaveIdentity}
        okText="确认"
        cancelText="取消"
        centered
        width={420}
      >
        {selectedUser && (
          <div style={{ background: '#f8fafc', padding: 16, borderRadius: 12, marginBottom: 16 }}>
            <div style={{ fontSize: 16, fontWeight: 600 }}>{selectedUser.realName}</div>
            <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>当前身份：{selectedUser.postName}</div>
          </div>
        )}
        <Radio.Group value={selectedIdentity} onChange={(e) => setSelectedIdentity(e.target.value)} style={{ width: '100%' }}>
          <Space direction="vertical" style={{ width: '100%' }}>
            {identityOptions.map((opt) => (
              <Radio
                key={opt.value}
                value={opt.value}
                disabled={opt.quantity === 0}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: `2px solid ${selectedIdentity === opt.value ? '#1890ff' : '#e2e8f0'}`,
                  borderRadius: 12,
                  background: selectedIdentity === opt.value ? '#e6f7ff' : opt.quantity === 0 ? '#f8fafc' : '#fff',
                }}
              >
                {opt.label} <span style={{ fontSize: 12, color: '#64748b' }}>（可分配数量：{opt.quantity}）</span>
              </Radio>
            ))}
          </Space>
        </Radio.Group>
      </Modal>
    </div>
  );
}
