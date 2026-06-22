import { useState } from 'react';
import { Row, Col, Card, Button, Modal, Radio, Space, Result, message } from 'antd';
import {
  EditOutlined, FolderOutlined, CloudOutlined, SafetyCertificateOutlined,
  FieldTimeOutlined, BlockOutlined, TeamOutlined, ShoppingOutlined, BankOutlined,
  ArrowRightOutlined, GiftOutlined, CheckCircleOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import PageHero from '../components/PageHero';
import SectionHead from '../components/SectionHead';

const flow = [
  { title: '智能起草', desc: '海量模板库、AI 智能填充，一键生成规范合同，告别从零开始' },
  { title: '智能审查', desc: 'AI 风险条款识别、合规性校验，自动揪出风险漏洞，合规率大幅提升' },
  { title: '智能比对', desc: '多版本差异智能识别标注，修改痕迹全掌握，比对效率提升 90%' },
  { title: '高效签署', desc: '企业/个人智能发起、批量签、扫码签，快速匹配签约方' },
];

const highlights = [
  { icon: <SafetyCertificateOutlined />, title: '权威实名认证', desc: '对接公安、工商数据，支持人脸识别，确保签约各方身份真实合法。', color: '#2f6bff' },
  { icon: <BlockOutlined />, title: '可靠防篡改', desc: '采用国密算法以及商密证书，文档一旦签署不可更改。', color: '#16b364' },
  { icon: <FieldTimeOutlined />, title: '精准时间戳', desc: '联合授时中心提供精准时间戳，锁定签署时间轨迹、抗抵赖。', color: '#f6a609' },
  { icon: <BlockOutlined />, title: '司法区块链', desc: '全链路信息上链存证，打通公证处与互联网法院，一键出证。', color: '#722ed1' },
];

const scenes = [
  { icon: <TeamOutlined />, title: '人力资源', desc: '劳动合同 / 保密协议 / 收入证明', color: '#2f6bff' },
  { icon: <ShoppingOutlined />, title: '采销供应链', desc: '采购合同 / 供货协议 / 退款单', color: '#12b8a6' },
  { icon: <BankOutlined />, title: '金融与租赁', desc: '贷款协议 / 融资租赁 / 房产租赁', color: '#f6a609' },
];

const lifecycle = [
  { icon: <EditOutlined />, t: '智能签署', d: '在线发起，多方协同' },
  { icon: <FolderOutlined />, t: '智能管理', d: '统一归档，到期提醒' },
  { icon: <CloudOutlined />, t: '智能存证', d: '区块链固证，随时调取' },
];

const packages = [
  { id: 1, contractCount: 10, requiredPoints: 50 },
  { id: 2, contractCount: 110, requiredPoints: 500 },
  { id: 3, contractCount: 230, requiredPoints: 1000 },
];

export default function EContract() {
  const [msg, ctx] = message.useMessage();
  const navigate = useNavigate();
  const [redeemOpen, setRedeemOpen] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState<number | null>(null);
  const [successOpen, setSuccessOpen] = useState(false);
  const [redeemedPkg, setRedeemedPkg] = useState<typeof packages[0] | null>(null);

  const openRedeem = () => {
    setSelectedPkg(null);
    setRedeemOpen(true);
  };

  const handleConfirmRedeem = () => {
    if (!selectedPkg) return;
    const pkg = packages.find((p) => p.id === selectedPkg);
    setRedeemOpen(false);
    setRedeemedPkg(pkg || null);
    setSuccessOpen(true);
  };

  return (
    <div>
      {ctx}
      <PageHero
        chip="智能电子合同"
        title="新一代企业级电子合同"
        subtitle="覆盖合同拟定、签署、管理全生命周期。具备如同纸质实体的最高司法效力，依托区块链与 AI 技术，极速提升企业风控能力与业务流转效率。"
        ctaText="立即兑换体验"
        onCta={openRedeem}
        stats={[
          { num: '300万+', label: '累计签署合同' },
          { num: '99.99%', label: '签署成功率' },
          { num: '<1s', label: '签署平均耗时' },
        ]}
      />

      <div className="zf-container" style={{ padding: '64px 24px 24px' }}>
        <SectionHead center kicker="LIFECYCLE" title="AI 全流程驱动，赋能合同全生命周期" subtitle="从起草到存证，一站式覆盖企业合同的每一个环节" style={{ marginBottom: 36 }} />
        <Row gutter={[20, 20]}>
          {lifecycle.map((x) => (
            <Col xs={24} md={8} key={x.t}>
              <Card className="zf-hover-card" styles={{ body: { textAlign: 'center', padding: 32 } }} style={{ borderRadius: 18 }}>
                <div className="zf-icon-badge" style={{ background: 'var(--zf-grad)', margin: '0 auto' }}>
                  <span style={{ color: '#fff', fontSize: 24 }}>{x.icon}</span>
                </div>
                <div style={{ fontWeight: 700, marginTop: 16, fontSize: 18 }}>{x.t}</div>
                <div style={{ color: '#8a93a0', marginTop: 6 }}>{x.d}</div>
              </Card>
            </Col>
          ))}
        </Row>

        <Row gutter={[20, 20]} style={{ marginTop: 24 }}>
          {flow.map((f, i) => (
            <Col xs={24} md={12} key={f.title}>
              <Card style={{ borderRadius: 16 }} styles={{ body: { padding: 24 } }}>
                <div style={{ display: 'flex', gap: 16 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--zf-grad)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto', fontWeight: 800, fontSize: 18 }}>{i + 1}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 16 }}>{f.title}</div>
                    <div style={{ color: '#6b7488', marginTop: 4, lineHeight: 1.7 }}>{f.desc}</div>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        <SectionHead center kicker="WHY US" title="核心服务亮点" style={{ marginTop: 64, marginBottom: 36 }} />
        <Row gutter={[20, 20]}>
          {highlights.map((h) => (
            <Col xs={24} sm={12} md={6} key={h.title}>
              <Card className="zf-hover-card" style={{ height: '100%', borderRadius: 18 }} styles={{ body: { padding: 26 } }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: `${h.color}1a`, color: h.color, fontSize: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{h.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 16, marginTop: 16 }}>{h.title}</div>
                <div style={{ color: '#6b7488', marginTop: 8, lineHeight: 1.7 }}>{h.desc}</div>
              </Card>
            </Col>
          ))}
        </Row>

        <SectionHead center kicker="SCENARIOS" title="丰富业务场景覆盖" style={{ marginTop: 64, marginBottom: 36 }} />
        <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
          {scenes.map((s) => (
            <Col xs={24} md={8} key={s.title}>
              <Card className="zf-hover-card" styles={{ body: { display: 'flex', alignItems: 'center', gap: 18, padding: 26 } }} style={{ borderRadius: 18 }}>
                <div style={{ width: 56, height: 56, borderRadius: 16, background: `${s.color}1a`, color: s.color, fontSize: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>{s.icon}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 17 }}>{s.title}</div>
                  <div style={{ color: '#8a93a0', marginTop: 4 }}>{s.desc}</div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        <SectionHead center kicker="PACKAGES" title="选择兑换套餐" subtitle="使用积分兑换电子合同签署额度" style={{ marginTop: 64, marginBottom: 36 }} />
        <Row gutter={[20, 20]} style={{ marginBottom: 32 }}>
          {packages.map((pkg) => (
            <Col xs={24} md={8} key={pkg.id}>
              <Card
                className="zf-hover-card"
                style={{ borderRadius: 18, cursor: 'pointer', border: selectedPkg === pkg.id ? '2px solid #2f6bff' : '2px solid transparent', transition: 'border-color 0.2s' }}
                styles={{ body: { padding: 28, textAlign: 'center' } }}
                onClick={() => { setSelectedPkg(pkg.id); setRedeemOpen(true); }}
              >
                <div style={{ fontSize: 36, fontWeight: 800, color: '#1e293b' }}>{pkg.contractCount}<span style={{ fontSize: 16, fontWeight: 400, color: '#8a93a0', marginLeft: 4 }}>份</span></div>
                <div style={{ marginTop: 8, fontSize: 18, fontWeight: 700, color: '#fa7216' }}>{pkg.requiredPoints} 积分</div>
                <Button type="primary" style={{ marginTop: 16 }} onClick={(e) => { e.stopPropagation(); setSelectedPkg(pkg.id); setRedeemOpen(true); }}>
                  <GiftOutlined /> 立即兑换
                </Button>
              </Card>
            </Col>
          ))}
        </Row>

        <div style={{ background: 'var(--zf-grad)', borderRadius: 22, padding: '40px 44px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20, marginBottom: 24 }}>
          <div>
            <h3 style={{ color: '#fff', fontSize: 24, fontWeight: 800, margin: 0 }}>立即体验智能电子合同</h3>
            <p style={{ color: 'rgba(255,255,255,0.85)', margin: '10px 0 0' }}>注册即享免费签署额度，企业认证后解锁全部能力。</p>
          </div>
          <Button size="large" style={{ background: '#fff', color: 'var(--zf-primary)', border: 'none', fontWeight: 700, height: 48, paddingInline: 26 }} onClick={() => navigate('/packages')}>
            查看套餐 <ArrowRightOutlined />
          </Button>
        </div>
      </div>

      <Modal
        title="选择兑换套餐"
        open={redeemOpen}
        onCancel={() => setRedeemOpen(false)}
        onOk={handleConfirmRedeem}
        okText="确认兑换"
        cancelText="取消"
        okButtonProps={{ disabled: !selectedPkg }}
        centered
        width={480}
      >
        <p style={{ color: '#64748b', marginBottom: 16 }}>使用积分兑换电子合同签署额度，兑换成功后客服人员将联系您开通并指导使用。</p>
        <Radio.Group value={selectedPkg} onChange={(e) => setSelectedPkg(e.target.value)} style={{ width: '100%' }}>
          <Space direction="vertical" style={{ width: '100%' }}>
            {packages.map((pkg) => (
              <Radio
                key={pkg.id}
                value={pkg.id}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: 12,
                  border: selectedPkg === pkg.id ? '1px solid #2f6bff' : '1px solid #e7eefb',
                  background: selectedPkg === pkg.id ? '#eef4ff' : '#f8fbff',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 18, fontWeight: 700, color: '#16325c' }}>{pkg.contractCount} <span style={{ fontSize: 13, fontWeight: 400, color: '#94a3b8' }}>份套餐</span></span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#fa7216' }}>{pkg.requiredPoints} 积分</span>
                </div>
              </Radio>
            ))}
          </Space>
        </Radio.Group>
      </Modal>

      <Modal
        open={successOpen}
        onCancel={() => setSuccessOpen(false)}
        footer={
          <Button type="primary" size="large" block onClick={() => setSuccessOpen(false)}>我知道了</Button>
        }
        centered
        width={420}
      >
        <Result
          icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
          title="兑换成功"
          subTitle={redeemedPkg ? `您已成功兑换 ${redeemedPkg.contractCount} 份电子合同套餐，消耗 ${redeemedPkg.requiredPoints} 积分。` : ''}
          style={{ padding: '16px 0' }}
        />
        <div style={{ background: '#f0f5ff', borderRadius: 12, padding: '16px 20px', textAlign: 'center', color: '#1890ff', fontWeight: 500, fontSize: 15 }}>
          兑换后会有客服人员联系您开通并指导使用
        </div>
      </Modal>
    </div>
  );
}
