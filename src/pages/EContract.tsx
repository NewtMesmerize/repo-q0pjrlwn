import { useState } from 'react';
import { Row, Col, Card, Button, Modal, message } from 'antd';
import {
  EditOutlined, FolderOutlined, CloudOutlined, SafetyCertificateOutlined,
  FieldTimeOutlined, BlockOutlined, TeamOutlined, ShoppingOutlined, BankOutlined,
  ArrowRightOutlined, GiftOutlined, FileProtectOutlined,
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

const POINTS_PER_CONTRACT = 3.5;

export default function EContract() {
  const [msg, ctx] = message.useMessage();
  const navigate = useNavigate();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleStartContract = () => {
    setConfirmOpen(true);
  };

  const handleConfirmExchange = () => {
    setConfirmOpen(false);
    msg.success('兑换成功，即将进入合同发起页面');
    setTimeout(() => navigate('/e-contract/create'), 500);
  };

  return (
    <div style={{ paddingBottom: 80 }}>
      {ctx}
      <PageHero
        chip="智能电子合同"
        title="新一代企业级电子合同"
        subtitle="覆盖合同拟定、签署、管理全生命周期。具备如同纸质实体的最高司法效力，依托区块链与 AI 技术，极速提升企业风控能力与业务流转效率。"
        ctaText="立即兑换体验"
        onCta={handleStartContract}
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

      {/* 底部固定操作栏 */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
        background: '#fff', boxShadow: '0 -4px 24px rgba(15,23,42,0.06)',
        padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, fontSize: 15 }}>
            <GiftOutlined style={{ color: '#1890ff' }} /> 畅享智能签约体验
          </div>
          <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>开启您的新一代企业级电子合同之旅</div>
        </div>
        <Button type="primary" size="large" icon={<FileProtectOutlined />} onClick={handleStartContract}
          style={{ borderRadius: 999, fontWeight: 700, height: 44, paddingInline: 28 }}>
          发起合同
        </Button>
      </div>

      <Modal
        title="确认发起合同"
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onOk={handleConfirmExchange}
        okText="确认发起"
        cancelText="取消"
        centered
        width={420}
      >
        <p style={{ fontSize: 15, color: '#1e293b', margin: '16px 0' }}>
          发起合同后将扣除 <span style={{ color: '#fa7216', fontWeight: 700 }}>{POINTS_PER_CONTRACT} 积分</span>，是否继续？
        </p>
        <div style={{ background: '#f0f5ff', borderRadius: 10, padding: '12px 16px', color: '#4f83ff', fontSize: 13 }}>
          兑换成功后将进入合同发起页面，您可以上传合同文件并填写签约方信息。
        </div>
      </Modal>
    </div>
  );
}
