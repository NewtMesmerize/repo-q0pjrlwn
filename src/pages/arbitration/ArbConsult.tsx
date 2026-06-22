import { Row, Col, Card, Button, Collapse } from 'antd';
import { ArrowRightOutlined, ThunderboltOutlined, CheckCircleFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import SecondaryNav, { arbNavItems } from '../../components/SecondaryNav';

const steps = [
  { step: '01', title: '提交申请', desc: '在线填写仲裁申请，上传证据材料' },
  { step: '02', title: '受理立案', desc: '仲裁机构审核材料并正式立案' },
  { step: '03', title: '组庭审理', desc: '指定仲裁员组庭，线上开庭审理' },
  { step: '04', title: '作出裁决', desc: '一裁终局，出具具有强制力的裁决书' },
];

const advantages = [
  '一裁终局，周期更短',
  '裁决具备法律强制力',
  '程序灵活、保密性强',
  '全流程线上，成本更低',
];

const faq = [
  { label: '哪些纠纷可以申请仲裁？', children: '平等主体的公民、法人和其他组织之间发生的合同纠纷和其他财产权益纠纷，可以仲裁。婚姻、收养、监护、扶养、继承纠纷及依法应由行政机关处理的行政争议不能仲裁。' },
  { label: '仲裁和诉讼有什么区别？', children: '仲裁一裁终局、周期更短、程序更灵活、保密性强；诉讼实行两审终审制。仲裁裁决与法院判决具有同等法律效力，可申请强制执行。' },
  { label: '在线仲裁的裁决有法律效力吗？', children: '有。在线仲裁裁决与线下仲裁裁决具有同等法律效力，一方不履行的，另一方可向有管辖权的人民法院申请强制执行。' },
  { label: '申请仲裁需要准备哪些材料？', children: '仲裁申请书、当事人主体资格证明、仲裁协议（合同中的仲裁条款）、证据材料清单及证据等。' },
];

const heroStats = [
  { num: '30+', label: '合作仲裁机构' },
  { num: '12,000+', label: '累计处置案件' },
  { num: '45天', label: '平均结案周期' },
];

export default function ArbConsult() {
  const navigate = useNavigate();
  return (
    <>
      <SecondaryNav title="在线仲裁" items={arbNavItems} />
      <section className="zf-hero" style={{ padding: '64px 0 72px' }}>
        <div className="zf-grid-mask" />
        <div className="zf-blob" style={{ width: 320, height: 320, background: '#2f6bff', top: -80, right: -30 }} />
        <div className="zf-blob" style={{ width: 220, height: 220, background: '#12b8a6', bottom: -100, left: '28%' }} />
        <div className="zf-container" style={{ position: 'relative' }}>
          <div className="zf-fade-up">
            <span className="zf-chip-solid" style={{ marginBottom: 16 }}><ThunderboltOutlined /> 全流程线上仲裁</span>
            <h1 style={{ color: 'var(--zf-hero-ink)', fontSize: 42, margin: '12px 0 0', fontWeight: 800, letterSpacing: '-0.8px' }}>专业在线仲裁咨询</h1>
            <p style={{ fontSize: 17, color: 'var(--zf-hero-sub)', marginTop: 18, maxWidth: 600 }}>
              一裁终局、具备法律强制力，周期短、成本低、效力强。资深仲裁团队为您提供全流程专业指导。
            </p>
            <Button type="primary" size="large" style={{ marginTop: 28, height: 48, paddingInline: 26, fontSize: 16 }} onClick={() => navigate('/arbitration/filing')}>
              立即在线立案 <ArrowRightOutlined />
            </Button>
            <div style={{ display: 'flex', gap: 48, marginTop: 40, flexWrap: 'wrap' }}>
              {heroStats.map((s) => (
                <div key={s.label}>
                  <div className="zf-stat-num" style={{ background: 'linear-gradient(90deg,#2f6bff,#12b8a6)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{s.num}</div>
                  <div style={{ color: 'var(--zf-hero-sub)', marginTop: 8, fontSize: 14 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="zf-container" style={{ padding: '56px 24px' }}>
        <h2 className="zf-section-title">仲裁流程</h2>
        <Row gutter={[20, 20]} style={{ marginTop: 24 }}>
          {steps.map((s, i) => (
            <Col xs={12} md={6} key={s.step}>
              <Card className="zf-hover-card" style={{ borderRadius: 18, height: '100%' }} styles={{ body: { padding: 24, position: 'relative' } }}>
                <div style={{ fontSize: 38, fontWeight: 800, color: 'rgba(47,107,255,0.16)' }}>{s.step}</div>
                <div style={{ fontWeight: 700, fontSize: 17, marginTop: 4 }}>{s.title}</div>
                <div style={{ color: '#8a93a0', marginTop: 8, lineHeight: 1.7 }}>{s.desc}</div>
                {i < steps.length - 1 && <ArrowRightOutlined style={{ position: 'absolute', right: 16, top: 28, color: '#d0d8e6' }} />}
              </Card>
            </Col>
          ))}
        </Row>

        <Row gutter={[24, 24]} style={{ marginTop: 56 }} align="stretch">
          <Col xs={24} md={10}>
            <div style={{ background: 'var(--zf-grad)', borderRadius: 20, padding: 32, height: '100%', color: '#fff', position: 'relative', overflow: 'hidden' }}>
              <div className="zf-blob" style={{ width: 180, height: 180, background: '#fff', opacity: 0.14, top: -50, right: -30 }} />
              <h3 style={{ color: '#fff', fontSize: 22, fontWeight: 800, margin: 0 }}>为什么选择在线仲裁</h3>
              <div style={{ marginTop: 22 }}>
                {advantages.map((a) => (
                  <div key={a} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, fontSize: 15 }}>
                    <CheckCircleFilled style={{ color: '#fff' }} /> {a}
                  </div>
                ))}
              </div>
            </div>
          </Col>
          <Col xs={24} md={14}>
            <h2 className="zf-section-title">常见问题</h2>
            <Collapse
              style={{ marginTop: 20, background: 'transparent' }}
              bordered={false}
              expandIconPosition="end"
              items={faq.map((f, i) => ({
                key: i,
                label: <span style={{ fontWeight: 600 }}>{f.label}</span>,
                style: { marginBottom: 12, borderRadius: 14, background: '#fff', border: '1px solid var(--zf-line)' },
                children: <p style={{ color: '#5b6577', lineHeight: 1.9, margin: 0 }}>{f.children}</p>,
              }))}
            />
          </Col>
        </Row>
      </div>
    </>
  );
}
