import { useState } from 'react';
import { Row, Col, Card, Button, Form, Input, Select, message, Modal } from 'antd';
import {
  ArrowRightOutlined,
  CustomerServiceOutlined,
  SafetyCertificateOutlined,
  ThunderboltOutlined,
  RightOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { services, packages, disputeTypes } from '../mock/data';

const serviceColors: Record<string, string> = {
  ai: 'linear-gradient(135deg,#2f6bff,#5b8cff)',
  data: 'linear-gradient(135deg,#faad14,#f6a609)',
  contract: 'linear-gradient(135deg,#12b8a6,#16d6b0)',
  'arb-consult': 'linear-gradient(135deg,#2f54eb,#5b73f5)',
  lawyer: 'linear-gradient(135deg,#eb2f96,#f76bc1)',
  mediation: 'linear-gradient(135deg,#1677ff,#36a3ff)',
  training: 'linear-gradient(135deg,#9254de,#b37feb)',
  marketing: 'linear-gradient(135deg,#ff7a45,#ffa173)',
};

const flow = [
  { step: '01', title: '在线提交', desc: '填写申请、上传证据材料' },
  { step: '02', title: '审核受理', desc: '机构审核材料并正式立案' },
  { step: '03', title: '组庭审理', desc: '指定仲裁员，线上开庭' },
  { step: '04', title: '裁决执行', desc: '一裁终局，强制执行力' },
];

const whyUs = [
  { icon: <SafetyCertificateOutlined />, title: '权威合规', desc: '联动权威仲裁机构与司法资源，裁决具备法律强制力。', color: '#2f6bff' },
  { icon: <ThunderboltOutlined />, title: '高效快速', desc: '全流程线上办理，平均 45 天结案，远快于传统诉讼。', color: '#12b8a6' },
  { icon: <CustomerServiceOutlined />, title: '专家护航', desc: '50+ 资深法务顾问，平均 5 分钟响应，一对一服务。', color: '#f6a609' },
];

const platformCards = [
  { title: '企业介绍', sub: '了解中枫仲调', icon: '/icons/pt-qy.svg', to: '/platform/company' },
  { title: '业务介绍', sub: '核心业务能力', icon: '/icons/pt-yw.svg', to: '/platform/business' },
  { title: '应用场景', sub: '多行业覆盖', icon: '/icons/pt-yy.svg', to: '/platform/scenario' },
  { title: '产品介绍', sub: '完整产品矩阵', icon: '/icons/pt-cp.svg', to: '/platform/product' },
];

export default function Home() {
  const navigate = useNavigate();
  const [msg, ctx] = message.useMessage();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalForm] = Form.useForm();

  const handleConsultSubmit = (values: { name: string; phone: string; type: string }) => {
    // TODO: 对接实际留资接口
    console.log('留资提交', values);
    msg.success('提交成功，专家将尽快与您联系！');
    setModalOpen(false);
    modalForm.resetFields();
  };

  return (
    <div>
      {ctx}
      {/* ===== HERO ===== */}
      <section className="zf-hero" style={{ padding: '84px 0 96px' }}>
        <div className="zf-grid-mask" />
        <div className="zf-blob" style={{ width: 360, height: 360, background: '#2f6bff', top: -80, right: -60 }} />
        <div className="zf-blob" style={{ width: 280, height: 280, background: '#12b8a6', bottom: -120, left: '38%' }} />
        <div className="zf-container" style={{ position: 'relative' }}>
          <Row gutter={[40, 40]} align="middle">
            <Col xs={24} md={13}>
              <div className="zf-fade-up">
                <span className="zf-chip-solid" style={{ marginBottom: 18 }}>
                  <ThunderboltOutlined /> 数字技术 + 法律合规 + 调仲一体化
                </span>
                <h1 style={{ color: 'var(--zf-hero-ink)', fontSize: 48, lineHeight: 1.18, fontWeight: 800, margin: '14px 0 0', letterSpacing: '-1px' }}>
                  风险识别 · 风险预防<br />
                  <span style={{ background: 'linear-gradient(90deg,#2f6bff,#12b8a6)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    一站式纠纷解决方案
                  </span>
                </h1>
                <p style={{ color: 'var(--zf-hero-sub)', fontSize: 17, margin: '22px 0 32px', maxWidth: 520 }}>
                  降低坏账风险、减少经营损耗、维护合法权益。AI 法律工具 + 电子合同 + 在线仲裁，全周期守护企业与个人权益。
                </p>
                <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                  <Button type="primary" size="large" onClick={() => setModalOpen(true)} style={{ height: 50, paddingInline: 28, fontSize: 16 }}>
                    免费获取方案 <ArrowRightOutlined />
                  </Button>
                  <Button
                    size="large"
                    ghost
                    onClick={() => navigate('/ai-law')}
                    style={{ height: 50, paddingInline: 26, fontSize: 16, borderColor: 'rgba(47,107,255,0.45)', color: 'var(--zf-primary)' }}
                  >
                    体验 AI 法律
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </section>

      <div className="zf-container" style={{ padding: '64px 24px 24px' }}>
        {/* ===== 服务体系 ===== */}
        <div className="zf-center" style={{ marginBottom: 36 }}>
          <span className="zf-kicker">SERVICE SYSTEM</span>
          <h2 className="zf-heading">完整的法律科技服务体系</h2>
          <p className="zf-subheading">覆盖咨询、合同、仲裁、调解全链路，满足企业与个人的多元法律需求</p>
        </div>
        <Row gutter={[20, 20]}>
          {services.map((s, i) => (
            <Col xs={12} sm={8} md={6} key={s.key}>
              <Card
                className={`zf-hover-card zf-fade-up zf-d${(i % 4) + 1}`}
                styles={{ body: { padding: 24 } }}
                style={{ borderRadius: 18, height: '100%' }}
                onClick={() => navigate(s.to)}
              >
                <div className="zf-icon-badge" style={{ background: serviceColors[s.key] || 'var(--zf-grad)' }}>
                  <img src={s.icon} alt={s.title} style={{ width: 28, height: 28, filter: 'brightness(0) invert(1)' }} />
                </div>
                <div style={{ fontWeight: 700, fontSize: 17, marginTop: 16 }}>{s.title}</div>
                <div style={{ color: '#8a93a0', fontSize: 13, marginTop: 6, lineHeight: 1.6 }}>{s.desc}</div>
                <div style={{ color: 'var(--zf-primary)', fontSize: 13, marginTop: 14, fontWeight: 600 }}>
                  立即使用 <RightOutlined style={{ fontSize: 11 }} />
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        {/* ===== 为什么选择 ===== */}
        <Row gutter={[20, 20]} style={{ marginTop: 64 }}>
          {whyUs.map((w) => (
            <Col xs={24} md={8} key={w.title}>
              <Card style={{ borderRadius: 18, height: '100%' }} styles={{ body: { padding: 28 } }}>
                <div
                  style={{
                    width: 52, height: 52, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: `${w.color}1a`, color: w.color, fontSize: 24,
                  }}
                >
                  {w.icon}
                </div>
                <div style={{ fontWeight: 700, fontSize: 18, marginTop: 16 }}>{w.title}</div>
                <p style={{ color: '#6b7488', marginTop: 8, marginBottom: 0, lineHeight: 1.7 }}>{w.desc}</p>
              </Card>
            </Col>
          ))}
        </Row>

        {/* ===== 仲裁流程 ===== */}
        <div
          style={{
            marginTop: 64, borderRadius: 24, padding: '44px 40px', position: 'relative', overflow: 'hidden',
            background: 'var(--zf-grad-dark)',
          }}
        >
          <div className="zf-grid-mask" />
          <div style={{ position: 'relative' }}>
            <div style={{ marginBottom: 30 }}>
              <span className="zf-chip">在线仲裁流程</span>
              <h2 style={{ color: '#fff', fontSize: 26, fontWeight: 800, margin: '14px 0 0' }}>四步完成，一裁终局</h2>
            </div>
            <Row gutter={[24, 24]}>
              {flow.map((f, i) => (
                <Col xs={12} md={6} key={f.step}>
                  <div style={{ position: 'relative' }}>
                    <div style={{ fontSize: 40, fontWeight: 800, color: 'rgba(255,255,255,0.18)' }}>{f.step}</div>
                    <div style={{ color: '#fff', fontSize: 18, fontWeight: 700, marginTop: 4 }}>{f.title}</div>
                    <div style={{ color: 'rgba(255,255,255,0.62)', marginTop: 8, fontSize: 14 }}>{f.desc}</div>
                    {i < flow.length - 1 && (
                      <ArrowRightOutlined style={{ position: 'absolute', right: 0, top: 18, color: 'rgba(255,255,255,0.3)' }} />
                    )}
                  </div>
                </Col>
              ))}
            </Row>
            <Button type="primary" size="large" style={{ marginTop: 30 }} onClick={() => navigate('/arbitration/consult')}>
              了解在线仲裁 <ArrowRightOutlined />
            </Button>
          </div>
        </div>

        {/* ===== 产品套餐 ===== */}
        <div style={{ display: 'flex', alignItems: 'flex-end', marginTop: 64 }}>
          <div style={{ flex: 1 }}>
            <span className="zf-kicker">PRICING</span>
            <h2 className="zf-heading">灵活的产品套餐</h2>
          </div>
          <Button type="link" onClick={() => navigate('/packages')} style={{ fontWeight: 600 }}>
            查看全部 <ArrowRightOutlined />
          </Button>
        </div>
        <Row gutter={[20, 20]} style={{ marginTop: 24 }} align="stretch">
          {packages.slice(0, 3).map((p, i) => {
            const featured = i === 1;
            return (
              <Col xs={24} md={8} key={p.id}>
                <Card
                  className="zf-hover-card"
                  style={{
                    borderRadius: 20, height: '100%',
                    border: featured ? '2px solid var(--zf-primary)' : '1px solid var(--zf-line)',
                    boxShadow: featured ? '0 20px 48px rgba(47,107,255,0.2)' : undefined,
                  }}
                  styles={{ body: { padding: 28 } }}
                  onClick={() => navigate(`/packages/${p.id}`)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontWeight: 800, fontSize: 19 }}>{p.title}</div>
                    {featured && <span style={{ background: 'var(--zf-grad)', color: '#fff', borderRadius: 999, padding: '3px 12px', fontSize: 12, fontWeight: 700 }}>推荐</span>}
                  </div>
                  <div style={{ color: '#8a93a0', marginTop: 6 }}>{p.subtitle}</div>
                  <div style={{ margin: '18px 0 6px', display: 'flex', alignItems: 'baseline', gap: 8 }}>
                    <span style={{ color: 'var(--zf-ink)', fontSize: 34, fontWeight: 800 }}>¥{p.price}</span>
                  </div>
                  <div style={{ marginBottom: 22, color: '#ff9500', fontSize: 13, fontWeight: 600 }}>
                    可兑换 {p.points.toLocaleString()} 积分
                  </div>
                  <Button type={featured ? 'primary' : 'default'} block size="large" onClick={(e) => { e.stopPropagation(); navigate(`/packages/${p.id}`); }}>
                    立即购买
                  </Button>
                </Card>
              </Col>
            );
          })}
        </Row>

        {/* ===== 了解平台 ===== */}
        <h2 className="zf-section-title" style={{ marginTop: 64 }}>了解平台</h2>
        <Row gutter={[20, 20]} style={{ marginTop: 22 }}>
          {platformCards.map((p) => (
            <Col xs={12} md={6} key={p.title}>
              <Card className="zf-hover-card" styles={{ body: { padding: 22, display: 'flex', alignItems: 'center', gap: 16 } }} style={{ borderRadius: 16 }} onClick={() => navigate(p.to)}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(47,107,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src={p.icon} alt={p.title} style={{ width: 26, height: 26 }} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>{p.title}</div>
                  <div style={{ fontSize: 12.5, color: '#8a93a0', marginTop: 2 }}>{p.sub}</div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        {/* ===== 留资 CTA ===== */}
        <div style={{ marginTop: 64, marginBottom: 24 }}>
          <Row gutter={0} style={{ borderRadius: 24, overflow: 'hidden', boxShadow: 'var(--zf-shadow-md)' }} align="stretch">
            <Col xs={24} md={10}>
              <div style={{ background: 'var(--zf-grad)', padding: '44px 40px', height: '100%', color: '#fff', position: 'relative', overflow: 'hidden' }}>
                <div className="zf-blob" style={{ width: 200, height: 200, background: '#fff', opacity: 0.15, top: -60, right: -40 }} />
                <h2 style={{ color: '#fff', fontSize: 26, fontWeight: 800, margin: 0 }}>专属案件顾问</h2>
                <p style={{ color: 'rgba(255,255,255,0.85)', margin: '14px 0 26px' }}>资深法务专家一对一服务，平均 5 分钟响应，为您量身定制纠纷解决方案。</p>

                <Button icon={<CustomerServiceOutlined />} style={{ marginTop: 28, background: '#fff', color: 'var(--zf-primary)', border: 'none', fontWeight: 700 }} onClick={() => msg.info('正在为您接入专属客服…')}>
                  联系客服
                </Button>
              </div>
            </Col>
            <Col xs={24} md={14}>
              <div style={{ background: '#fff', padding: '40px 40px' }}>
                <h3 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>免费获取纠纷解决方案</h3>
                <p style={{ color: '#8a93a0', margin: '8px 0 20px' }}>提交需求，专家将尽快与您联系。</p>
                <Form layout="vertical" onFinish={handleConsultSubmit} requiredMark={false}>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item name="name" label="称呼" rules={[{ required: true, message: '请输入您的称呼' }]}>
                        <Input placeholder="请输入您的称呼" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="phone" label="手机号" rules={[{ required: true, pattern: /^1\d{10}$/, message: '请输入正确手机号' }]}>
                        <Input placeholder="请输入手机号码" />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Form.Item name="type" label="纠纷类型" rules={[{ required: true, message: '请选择纠纷类型' }]}>
                    <Select placeholder="请选择纠纷类型" options={disputeTypes.map((d) => ({ value: d, label: d }))} />
                  </Form.Item>
                  <Form.Item style={{ marginBottom: 0 }}>
                    <Button type="primary" htmlType="submit" size="large" block>立即提交</Button>
                  </Form.Item>
                </Form>
              </div>
            </Col>
          </Row>
        </div>
      </div>
      {/* ===== 免费获取方案弹窗 ===== */}
      <Modal
        title="免费获取纠纷解决方案"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        destroyOnClose
        width={480}
        centered
      >
        <p style={{ color: '#8a93a0', margin: '0 0 20px' }}>提交需求，专家将尽快与您联系。</p>
        <Form form={modalForm} layout="vertical" onFinish={handleConsultSubmit} requiredMark={false}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="name" label="称呼" rules={[{ required: true, message: '请输入您的称呼' }]}>
                <Input placeholder="请输入您的称呼" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="phone" label="手机号" rules={[{ required: true, pattern: /^1\d{10}$/, message: '请输入正确手机号' }]}>
                <Input placeholder="请输入手机号码" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="type" label="纠纷类型" rules={[{ required: true, message: '请选择纠纷类型' }]}>
            <Select placeholder="请选择纠纷类型" options={disputeTypes.map((d) => ({ value: d, label: d }))} />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0 }}>
            <Button type="primary" htmlType="submit" size="large" block>立即提交</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
