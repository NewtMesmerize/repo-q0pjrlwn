import { useParams, useNavigate } from 'react-router-dom';
import { Card, Row, Col, Tabs } from 'antd';
import { CheckCircleFilled } from '@ant-design/icons';
import { platformContent } from '../../mock/data';
import PageHero from '../../components/PageHero';

const tabs = [
  { key: 'company', label: '企业介绍' },
  { key: 'business', label: '业务介绍' },
  { key: 'scenario', label: '应用场景' },
  { key: 'product', label: '产品介绍' },
];

const accentColors = ['#2f6bff', '#12b8a6', '#f6a609', '#9254de'];

export default function Platform() {
  const { tab = 'company' } = useParams();
  const navigate = useNavigate();

  return (
    <div>
      <PageHero
        compact
        chip="了解平台"
        title="数字技术 × 法律合规 × 调仲一体化"
        subtitle="中枫仲调专注于数字化纠纷预防与在线仲裁处置，构建覆盖咨询、合同、仲裁、调解的全周期解纷生态。"
        stats={[
          { num: '2018', label: '平台成立' },
          { num: '30+', label: '合作机构' },
          { num: '全国', label: '业务覆盖' },
        ]}
      />

      <div className="zf-container" style={{ padding: '32px 24px 56px' }}>
        <Card style={{ borderRadius: 18, marginBottom: 24 }} styles={{ body: { paddingBottom: 4 } }}>
          <Tabs
            activeKey={tab}
            onChange={(k) => navigate(`/platform/${k}`)}
            items={tabs.map((t) => ({ key: t.key, label: t.label }))}
            size="large"
          />
        </Card>

        {tab === 'company' && (
          <Card style={{ borderRadius: 18 }} styles={{ body: { padding: 40 } }}>
            <h2 className="zf-heading" style={{ fontSize: 26 }}>{platformContent.company.title}</h2>
            <div className="zf-soft-divider" style={{ margin: '20px 0 24px' }} />
            {platformContent.company.paragraphs.map((p, i) => (
              <p key={i} style={{ color: '#4b5563', lineHeight: 2, marginTop: 14, fontSize: 15.5, textIndent: '2em' }}>{p}</p>
            ))}
          </Card>
        )}

        {tab === 'business' && (
          <Row gutter={[20, 20]}>
            {platformContent.business.map((b, i) => (
              <Col xs={24} md={12} key={b.title}>
                <Card className="zf-hover-card" style={{ height: '100%', borderRadius: 18, borderTop: `3px solid ${accentColors[i % 4]}` }} styles={{ body: { padding: 26 } }}>
                  <div style={{ fontWeight: 800, fontSize: 18 }}>{b.title}</div>
                  <div style={{ color: '#5b6577', marginTop: 12, lineHeight: 1.9 }}>{b.desc}</div>
                </Card>
              </Col>
            ))}
          </Row>
        )}

        {tab === 'scenario' && (
          <Row gutter={[20, 20]}>
            {platformContent.scenario.map((s, i) => (
              <Col xs={24} md={12} key={s.title}>
                <Card className="zf-hover-card" style={{ height: '100%', borderRadius: 18 }} styles={{ body: { padding: 26 } }}>
                  <div style={{ display: 'inline-flex', width: 40, height: 40, borderRadius: 11, background: `${accentColors[i % 4]}1a`, color: accentColors[i % 4], alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>{i + 1}</div>
                  <div style={{ fontWeight: 800, fontSize: 18, marginTop: 14 }}>{s.title}</div>
                  <div style={{ color: '#5b6577', marginTop: 10, lineHeight: 1.9 }}>{s.desc}</div>
                </Card>
              </Col>
            ))}
          </Row>
        )}

        {tab === 'product' && (
          <Row gutter={[20, 20]}>
            {platformContent.product.map((p, i) => (
              <Col xs={24} md={8} key={p.title}>
                <Card style={{ height: '100%', borderRadius: 18 }} styles={{ body: { padding: 26 } }}>
                  <div style={{ fontWeight: 800, fontSize: 18, color: accentColors[i % 4] }}>{p.title}</div>
                  <div className="zf-soft-divider" style={{ margin: '16px 0' }} />
                  {p.items.map((it) => (
                    <div key={it} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12, color: '#4b5563', lineHeight: 1.7 }}>
                      <CheckCircleFilled style={{ color: accentColors[i % 4], marginTop: 4 }} /> {it}
                    </div>
                  ))}
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
}
