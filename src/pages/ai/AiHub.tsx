import { Row, Col, Card, Input, Tag } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { aiTools, hotQuestions } from '../../mock/data';
import panda from '../../assets/panda.png';

export default function AiHub() {
  const navigate = useNavigate();
  return (
    <div className="zf-container" style={{ padding: '28px 24px 48px' }}>
      <div
        className="zf-hero"
        style={{
          borderRadius: 20,
          padding: 36,
          marginBottom: 28,
        }}
      >
        <div className="zf-grid-mask" />
        <div className="zf-blob" style={{ width: 220, height: 220, background: '#2f6bff', top: -70, right: 40 }} />
        <div className="zf-blob" style={{ width: 180, height: 180, background: '#12b8a6', bottom: -90, right: 200 }} />
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 24 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{ fontSize: 28, margin: 0, fontWeight: 800, color: 'var(--zf-hero-ink)' }}>
              Hi，我是<span style={{ background: 'linear-gradient(90deg,#2f6bff,#12b8a6)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>中枫法务助理</span> 👋
            </h1>
            <p style={{ color: 'var(--zf-hero-sub)', marginTop: 10, fontSize: 15 }}>
              智能咨询 · 合同避坑 · 案情推演，您随身的 AI 法律专家，24 小时在线解答。
            </p>
            <Input.Search
              placeholder="请输入您的法律问题或需求…"
              enterButton="开始咨询"
              size="large"
              style={{ maxWidth: 640, marginTop: 18 }}
              onSearch={() => navigate('/ai-law/chat')}
            />
          </div>
          <img
            src={panda}
            alt="中枫法务助理"
            className="zf-ai-panda"
            style={{ width: 150, height: 150, flex: '0 0 150px', objectFit: 'contain', filter: 'drop-shadow(0 10px 22px rgba(0,0,0,0.35))' }}
          />
        </div>
      </div>

      <div className="zf-section-title">热门问题</div>
      <Row gutter={[12, 12]} style={{ margin: '16px 0 32px' }}>
        {hotQuestions.map((q) => (
          <Col xs={24} md={12} key={q}>
            <Card size="small" className="zf-hover-card" onClick={() => navigate('/ai-law/chat')}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{q}</span>
                <ArrowRightOutlined style={{ color: '#8a93a0' }} />
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <div className="zf-section-title">全部 AI 工具</div>
      <Row gutter={[18, 18]} style={{ marginTop: 16 }}>
        {aiTools.map((t) => (
          <Col xs={24} sm={12} lg={8} key={t.key}>
            <Card
              className="zf-hover-card zf-tool-card"
              styles={{ body: { padding: 20 } }}
              onClick={() => navigate(`/ai-law/${t.key}`)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div
                  style={{
                    width: 56, height: 56, borderRadius: 14, flex: '0 0 56px',
                    background: `linear-gradient(135deg, ${t.color}, ${t.color}cc)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28,
                    boxShadow: `0 8px 18px ${t.color}44`,
                  }}
                >
                  {t.emoji}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>{t.title}</div>
                  <div style={{ color: '#8a93a0', fontSize: 13, marginTop: 3 }}>{t.desc}</div>
                </div>
                <ArrowRightOutlined className="zf-tool-arrow" style={{ color: '#c2cad6', fontSize: 16 }} />
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <div style={{ marginTop: 24 }}>
        {['合同解读', '劳动纠纷', '知识产权', '股权设计', '债务催收'].map((t) => (
          <Tag key={t} color="blue" style={{ cursor: 'pointer' }} onClick={() => navigate('/ai-law/chat')}>{t}</Tag>
        ))}
      </div>
    </div>
  );
}
