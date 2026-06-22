import { useState } from 'react';
import { Row, Col, Card, Button, Tag, Drawer, Timeline, Modal, Form, Input, InputNumber, message, Segmented } from 'antd';
import { GiftOutlined, ShareAltOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { myPackagesA, packageFlows, type PackageBalance } from '../../mock/data';

export default function ProductsA() {
  const [flowOpen, setFlowOpen] = useState(false);
  const [active, setActive] = useState<PackageBalance | null>(null);
  const [transfer, setTransfer] = useState<PackageBalance | null>(null);
  const [flowTab, setFlowTab] = useState('全部');
  const [form] = Form.useForm();
  const [msg, ctx] = message.useMessage();

  const flows = packageFlows.filter((f) =>
    flowTab === '全部' || (flowTab === '入账' ? f.delta > 0 : f.title.includes('转赠')),
  );

  return (
    <div>
      {ctx}
      <div className="zf-section-title" style={{ marginBottom: 20 }}>我的产品包A</div>
      <Row gutter={[16, 16]}>
        {myPackagesA.map((p) => (
          <Col xs={24} md={12} key={p.id}>
            <Card className="zf-hover-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 48, height: 48, borderRadius: 10, background: '#eef3ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2f6bff', fontSize: 22 }}>
                  <GiftOutlined />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>{p.name}</div>
                  <div style={{ color: '#8a93a0', fontSize: 13 }}>余量：<b style={{ color: '#2f6bff' }}>{p.remain}</b></div>
                </div>
                <div style={{ color: '#f5222d', fontWeight: 800, fontSize: 18 }}>¥{p.price}</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 14 }}>
                <Button size="small" onClick={() => { setActive(p); setFlowOpen(true); }}>查看流水</Button>
                <Button size="small" icon={<CheckCircleOutlined />} onClick={() => msg.success(`${p.name} 已激活自用`)}>激活自用</Button>
                <Button size="small" type="primary" icon={<ShareAltOutlined />} onClick={() => { setTransfer(p); form.resetFields(); }}>立即转赠</Button>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Drawer
        title={`${active?.name ?? ''} · 流水明细`}
        open={flowOpen}
        onClose={() => setFlowOpen(false)}
        width={420}
      >
        <Segmented options={['全部', '入账', '转赠']} value={flowTab} onChange={(v) => setFlowTab(v as string)} style={{ marginBottom: 16 }} />
        <Timeline
          items={flows.map((f) => ({
            color: f.delta > 0 ? 'green' : 'red',
            children: (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 600 }}>{f.title}</span>
                  <span style={{ color: f.delta > 0 ? '#52c41a' : '#f5222d', fontWeight: 700 }}>{f.delta > 0 ? `+${f.delta}` : f.delta}</span>
                </div>
                <div style={{ color: '#8a93a0', fontSize: 12 }}>ID: {f.id}</div>
                <div style={{ color: '#8a93a0', fontSize: 12 }}>{f.time} · {f.status}</div>
              </div>
            ),
          }))}
        />
      </Drawer>

      <Modal
        title={`转赠 - ${transfer?.name ?? ''}`}
        open={!!transfer}
        onCancel={() => setTransfer(null)}
        onOk={async () => {
          await form.validateFields();
          msg.success('转赠成功（演示）');
          setTransfer(null);
        }}
        okText="确认转赠"
      >
        <Form form={form} layout="vertical" requiredMark={false}>
          <Form.Item name="phone" label="接收人手机号" rules={[{ required: true, pattern: /^1\d{10}$/, message: '请输入正确手机号' }]}>
            <Input placeholder="请输入接收人手机号" />
          </Form.Item>
          <Form.Item name="count" label="转赠数量" initialValue={1} rules={[{ required: true, message: '请输入转赠数量' }]}>
            <InputNumber min={1} max={transfer?.remain} style={{ width: '100%' }} />
          </Form.Item>
          <Tag color="blue">当前余量：{transfer?.remain}</Tag>
        </Form>
      </Modal>
    </div>
  );
}
