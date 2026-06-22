import { useState, useCallback } from 'react';
import { Row, Col, Card, Statistic, Input, Button, QRCode, Table, Tag, message, Divider, Tabs, Avatar, Tooltip, Modal, Radio, Space } from 'antd';
import { CopyOutlined, EyeOutlined, EyeInvisibleOutlined, UserOutlined, ShopOutlined, DownloadOutlined, PictureOutlined } from '@ant-design/icons';
import { currentUser } from '../../mock/data';

const posterColors: string[][] = [
  ['#1890ff', '#096dd9', '#0050b3'],
  ['#722ed1', '#531dab', '#391085'],
  ['#1e293b', '#0f172a', '#020617'],
  ['#fa8c16', '#d46b08', '#ad4e00'],
];

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
  const [posterModalOpen, setPosterModalOpen] = useState(false);
  const [posterIndex, setPosterIndex] = useState(0);
  const [posterImages, setPosterImages] = useState<string[]>([]);
  const [posterGenerating, setPosterGenerating] = useState(false);

  const copy = (text: string) => { navigator.clipboard?.writeText(text); msg.success('已复制'); };

  const drawPoster = useCallback((colorSet: string[]) => {
    const W = 544, H = 960;
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d')!;

    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, colorSet[0]);
    grad.addColorStop(0.5, colorSet[1]);
    grad.addColorStop(1, colorSet[2]);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    ctx.globalAlpha = 0.08;
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(W * 0.8, H * 0.15, 180, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(W * 0.15, H * 0.7, 120, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('\u4e2d\u67ab\u4ef2\u8c03', W / 2, 100);
    ctx.font = '18px sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.fillText('\u6570\u5b57\u6280\u672f + \u6cd5\u5f8b\u5408\u89c4 + \u8c03\u4ef2\u4e00\u4f53\u5316', W / 2, 140);

    const cardY = 180, cardH = 560, cardX = 40, cardW = W - 80;
    ctx.fillStyle = '#ffffff';
    const r = 20;
    ctx.beginPath();
    ctx.moveTo(cardX + r, cardY);
    ctx.lineTo(cardX + cardW - r, cardY);
    ctx.quadraticCurveTo(cardX + cardW, cardY, cardX + cardW, cardY + r);
    ctx.lineTo(cardX + cardW, cardY + cardH - r);
    ctx.quadraticCurveTo(cardX + cardW, cardY + cardH, cardX + cardW - r, cardY + cardH);
    ctx.lineTo(cardX + r, cardY + cardH);
    ctx.quadraticCurveTo(cardX, cardY + cardH, cardX, cardY + cardH - r);
    ctx.lineTo(cardX, cardY + r);
    ctx.quadraticCurveTo(cardX, cardY, cardX + r, cardY);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 22px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('\u98ce\u9669\u8bc6\u522b \u00b7 \u98ce\u9669\u9884\u9632', W / 2, cardY + 50);
    ctx.fillText('\u4e00\u7ad9\u5f0f\u7ea0\u7eb7\u89e3\u51b3\u65b9\u6848', W / 2, cardY + 82);

    ctx.fillStyle = '#64748b';
    ctx.font = '14px sans-serif';
    ctx.fillText('AI\u6cd5\u5f8b | \u7535\u5b50\u5408\u540c | \u5728\u7ebf\u4ef2\u88c1 | \u5927\u6570\u636e\u67e5\u8be2', W / 2, cardY + 120);

    const qrCanvas = document.querySelector('.zf-poster-qr canvas') as HTMLCanvasElement | null;
    if (qrCanvas) {
      const qrSize = 200;
      ctx.drawImage(qrCanvas, (W - qrSize) / 2, cardY + 150, qrSize, qrSize);
    }

    ctx.fillStyle = '#1890ff';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText(`\u4e13\u5c5e\u9080\u8bf7\u7801\uff1a${currentUser.inviteCode}`, W / 2, cardY + 390);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '14px sans-serif';
    ctx.fillText('\u626b\u63cf\u4e8c\u7ef4\u7801\u6216\u4f7f\u7528\u9080\u8bf7\u7801\u6ce8\u518c', W / 2, cardY + 420);

    const features = ['\u6743\u5a01\u4ef2\u88c1\u673a\u6784', '\u4e00\u88c1\u7ec8\u5c40', '\u5168\u56fd\u6267\u884c\u529b', '\u7ebf\u4e0a\u5168\u6d41\u7a0b'];
    const fY = cardY + 470;
    const fW = (cardW - 40) / 4;
    features.forEach((f, i) => {
      ctx.fillStyle = '#e6f7ff';
      const fx = cardX + 20 + i * fW;
      ctx.beginPath();
      ctx.roundRect(fx, fY, fW - 8, 32, 6);
      ctx.fill();
      ctx.fillStyle = '#1890ff';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(f, fx + (fW - 8) / 2, fY + 21);
    });

    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('\u67ab\u8d77\u516c\u6b63 \u4ef2\u8fbe\u5929\u4e0b', W / 2, H - 60);
    ctx.font = '12px sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.fillText('\u4e2d\u67ab\u4ef2\u8c03 \u00b7 \u4e13\u4e1a\u7ea0\u7eb7\u89e3\u51b3\u670d\u52a1\u5e73\u53f0', W / 2, H - 35);

    return canvas.toDataURL('image/png');
  }, []);

  const generateAllPosters = useCallback(() => {
    setPosterGenerating(true);
    requestAnimationFrame(() => {
      const images = posterColors.map((c) => drawPoster(c));
      setPosterImages(images);
      setPosterIndex(0);
      setPosterGenerating(false);
    });
  }, [drawPoster]);

  const downloadPoster = () => {
    const src = posterImages[posterIndex];
    if (!src) return;
    const a = document.createElement('a');
    a.href = src;
    a.download = `中枫仲调_推广海报_${currentUser.inviteCode}.png`;
    a.click();
    msg.success('海报已下载');
  };

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
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={24} align="middle">
          <Col flex="auto">
            <Row gutter={16}>
              <Col span={8}><Statistic title="累计推广人数" value={mockUsers.length} suffix="人" valueStyle={{ color: '#2f6bff' }} /></Col>
              <Col span={8}><Statistic title="已下单人数" value={mockOrders.filter((o) => o.orderStatus === 1).length} suffix="人" valueStyle={{ color: '#52c41a' }} /></Col>
              <Col span={8}><Statistic title="累计消费" value={mockUsers.reduce((s, u) => s + u.totalConsume, 0)} prefix="¥" valueStyle={{ color: '#ff4d4f' }} /></Col>
            </Row>
          </Col>
        </Row>
      </Card>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col xs={24} md={8}>
          <Card style={{ height: '100%' }}>
            <div style={{ marginBottom: 14 }}>
              <div style={{ color: '#8a93a0', marginBottom: 6 }}>我的推广码</div>
              <Input
                value={currentUser.inviteCode}
                readOnly
                size="large"
                addonAfter={<span style={{ cursor: 'pointer' }} onClick={() => copy(currentUser.inviteCode)}><CopyOutlined /> 复制</span>}
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
        <Col xs={24} md={8}>
          <Card style={{ textAlign: 'center', height: '100%' }}>
            <div className="zf-poster-qr" style={{ display: 'inline-block' }}>
              <QRCode value={currentUser.inviteLink} size={160} style={{ margin: '0 auto' }} />
            </div>
            <p style={{ color: '#8a93a0', marginTop: 10, marginBottom: 10, fontSize: 13 }}>扫码或分享链接，好友注册即可绑定推广关系</p>
            <Space>
              <Button type="primary" onClick={() => copy(currentUser.inviteLink)}>复制链接分享</Button>
              <Button icon={<PictureOutlined />} onClick={() => { setPosterModalOpen(true); generateAllPosters(); }}>生成推广海报</Button>
            </Space>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card title="推广规则说明" style={{ height: '100%' }}>
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
        title="生成推广海报"
        open={posterModalOpen}
        onCancel={() => setPosterModalOpen(false)}
        footer={null}
        centered
        width={600}
      >
        <div style={{ textAlign: 'center', background: '#f5f5f5', borderRadius: 12, padding: '24px 0', minHeight: 400 }}>
          {posterGenerating ? (
            <div style={{ padding: 80, color: '#8a93a0' }}>海报生成中...</div>
          ) : posterImages.length > 0 ? (
            <img src={posterImages[posterIndex]} alt="推广海报" style={{ maxHeight: 480, borderRadius: 8, boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }} />
          ) : null}
        </div>
        {posterImages.length > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 16 }}>
            {posterImages.map((src, i) => (
              <div
                key={i}
                onClick={() => setPosterIndex(i)}
                style={{
                  width: 56,
                  height: 100,
                  borderRadius: 8,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border: posterIndex === i ? '3px solid #1890ff' : '3px solid transparent',
                  transition: 'border-color 0.2s',
                  opacity: posterIndex === i ? 1 : 0.6,
                }}
              >
                <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ))}
          </div>
        )}
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Button type="primary" icon={<DownloadOutlined />} size="large" disabled={posterImages.length === 0} onClick={downloadPoster}>
            下载海报
          </Button>
        </div>
      </Modal>

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
