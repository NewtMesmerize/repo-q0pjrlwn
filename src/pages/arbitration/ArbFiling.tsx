import { useState } from 'react';
import { Card, Button, Checkbox, Modal, message, Tag } from 'antd';
import {
  WalletOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
  CheckCircleFilled,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import SecondaryNav, { arbNavItems } from '../../components/SecondaryNav';

// 立案技术服务费（平台收取，演示值；实际由后台 ai_service_config 配置）
const CONSUME_POINTS = 200;

const processSteps = [
  { title: '提交申请', description: '在线提交立案申请，支付立案技术服务费' },
  { title: '专员对接', description: '专属专员联系您，了解案件详情和需求' },
  { title: '材料准备', description: '协助准备立案所需的各项材料' },
  { title: '提交仲裁委', description: '向仲裁委提交立案申请' },
  { title: '立案完成', description: '完成立案，进入仲裁程序' },
];

const notices = [
  '立案技术服务费为平台收取，用于支付立案协助服务',
  '仲裁立案服务费由仲裁委收取，具体金额以仲裁委通知为准',
  '提交申请后，专员将在 1-2 个工作日内联系您',
  '请确保提供的联系方式准确有效',
];

const nextSteps = [
  { title: '专员联系', description: '专属专员将在 1-2 个工作日内联系您' },
  { title: '对接案件', description: '专员将了解您的案件详情和具体需求' },
  { title: '材料准备', description: '协助您准备立案所需的各项材料' },
  { title: '提交申请', description: '向仲裁委提交立案申请' },
];

const tips = [
  '请保持手机畅通，以便专员及时联系您',
  '请提前准备好相关案件材料',
  '如有疑问可随时联系客服',
];

const sectionStyle: React.CSSProperties = {
  borderRadius: 16,
  marginBottom: 16,
};
const titleStyle: React.CSSProperties = {
  fontSize: 16,
  fontWeight: 700,
  color: 'var(--zf-ink)',
  marginBottom: 16,
};

export default function ArbFiling() {
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);
  const [success, setSuccess] = useState(false);
  const [msg, ctx] = message.useMessage();

  const handleSubmit = () => {
    if (!agreed) {
      msg.warning('请先阅读并同意服务条款');
      return;
    }
    Modal.confirm({
      title: '确认提交',
      content: `确认提交立案申请？将扣除 ${CONSUME_POINTS} 积分作为立案技术服务费。`,
      okText: '确认扣除',
      cancelText: '取消',
      onOk: () => {
        msg.success('提交成功');
        setSuccess(true);
      },
    });
  };

  if (success) {
    return (
      <>
        <SecondaryNav title="在线仲裁" items={arbNavItems} />
        <div className="zf-container" style={{ padding: '32px 24px 48px', maxWidth: 860 }}>
          <Card style={sectionStyle}>
            <div style={{ textAlign: 'center', padding: '12px 0 4px' }}>
              <CheckCircleFilled style={{ fontSize: 64, color: '#52c41a' }} />
              <div style={{ fontSize: 22, fontWeight: 800, margin: '14px 0 6px' }}>提交成功</div>
              <div style={{ color: '#8a93a0' }}>将会有专员联系您对接案件细节。</div>
            </div>
            <div
              style={{
                display: 'flex', alignItems: 'center', gap: 10, marginTop: 20,
                background: 'rgba(47,107,255,0.06)', borderRadius: 12, padding: '12px 16px',
                color: '#2f6bff',
              }}
            >
              <InfoCircleOutlined />
              此扣费为立案技术服务费，已扣除 {CONSUME_POINTS} 积分
            </div>
          </Card>

          <Card style={sectionStyle}>
            <div style={titleStyle}>后续步骤</div>
            {nextSteps.map((s, i) => (
              <div key={s.title} style={{ display: 'flex', gap: 14, marginBottom: i === nextSteps.length - 1 ? 0 : 16 }}>
                <div
                  style={{
                    flex: '0 0 26px', width: 26, height: 26, borderRadius: '50%',
                    background: 'var(--zf-primary)', color: '#fff', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700,
                  }}
                >{i + 1}</div>
                <div>
                  <div style={{ fontWeight: 600 }}>{s.title}</div>
                  <div style={{ color: '#8a93a0', fontSize: 13 }}>{s.description}</div>
                </div>
              </div>
            ))}
          </Card>

          <Card style={sectionStyle}>
            <div style={titleStyle}>温馨提示</div>
            {tips.map((t) => (
              <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#4b5563', marginBottom: 10 }}>
                <CheckCircleOutlined style={{ color: '#52c41a' }} /> {t}
              </div>
            ))}
          </Card>

          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <Button type="primary" onClick={() => navigate('/arbitration/cases')}>查看我的仲裁</Button>
            <Button onClick={() => navigate('/arbitration/consult')}>返回咨询页面</Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {ctx}
      <SecondaryNav title="在线仲裁" items={arbNavItems} />
      <div className="zf-container" style={{ padding: '32px 24px 48px', maxWidth: 860 }}>
        <div className="zf-section-title" style={{ marginBottom: 20 }}>在线立案</div>

        <Card style={sectionStyle}>
          <div style={titleStyle}>服务介绍</div>
          <div style={{ color: '#4b5563', lineHeight: 1.9 }}>
            仲裁立案是仲裁程序的起点，平台为您提供专业的立案协助服务。我们的专员将协助您准备立案材料，指导您完成立案流程，确保您的案件能够顺利进入仲裁程序。
          </div>
        </Card>

        <Card style={sectionStyle}>
          <div style={titleStyle}>费用说明</div>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 320px', display: 'flex', gap: 14, alignItems: 'flex-start', border: '1px solid var(--zf-line)', borderRadius: 12, padding: 16, position: 'relative' }}>
              <WalletOutlined style={{ fontSize: 26, color: '#1890ff' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700 }}>立案技术服务费</div>
                <div style={{ color: '#8a93a0', fontSize: 13, margin: '2px 0 8px' }}>平台收取，用于立案协助服务</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--zf-primary)' }}>
                  {CONSUME_POINTS} <span style={{ fontSize: 13, fontWeight: 500, color: '#8a93a0' }}>积分</span>
                </div>
              </div>
              <Tag color="blue" style={{ position: 'absolute', top: 12, right: 12, marginInlineEnd: 0 }}>平台</Tag>
            </div>
            <div style={{ flex: '1 1 320px', display: 'flex', gap: 14, alignItems: 'flex-start', border: '1px solid var(--zf-line)', borderRadius: 12, padding: 16, position: 'relative' }}>
              <CheckCircleOutlined style={{ fontSize: 26, color: '#52c41a' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700 }}>仲裁立案服务费</div>
                <div style={{ color: '#8a93a0', fontSize: 13, margin: '2px 0 8px' }}>仲裁委收取，根据案件标的额计算</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#4b5563' }}>以仲裁委通知为准</div>
              </div>
              <Tag color="green" style={{ position: 'absolute', top: 12, right: 12, marginInlineEnd: 0 }}>仲裁委</Tag>
            </div>
          </div>
        </Card>

        <Card style={sectionStyle}>
          <div style={titleStyle}>服务流程</div>
          {processSteps.map((s, i) => (
            <div key={s.title} style={{ display: 'flex', gap: 14, marginBottom: i === processSteps.length - 1 ? 0 : 16 }}>
              <div
                style={{
                  flex: '0 0 26px', width: 26, height: 26, borderRadius: '50%',
                  background: 'var(--zf-primary)', color: '#fff', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700,
                }}
              >{i + 1}</div>
              <div>
                <div style={{ fontWeight: 600 }}>{s.title}</div>
                <div style={{ color: '#8a93a0', fontSize: 13 }}>{s.description}</div>
              </div>
            </div>
          ))}
        </Card>

        <Card style={sectionStyle}>
          <div style={titleStyle}>注意事项</div>
          {notices.map((n) => (
            <div key={n} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, color: '#4b5563', marginBottom: 10 }}>
              <InfoCircleOutlined style={{ color: '#1890ff', marginTop: 4 }} /> {n}
            </div>
          ))}
        </Card>

        <Card style={sectionStyle}>
          <Checkbox checked={agreed} onChange={(e) => setAgreed(e.target.checked)}>
            我已阅读并知悉上述内容，同意扣除积分用于立案技术服务。
          </Checkbox>
        </Card>

        <Button type="primary" size="large" block disabled={!agreed} onClick={handleSubmit} style={{ height: 48 }}>
          提交立案申请
        </Button>
      </div>
    </>
  );
}
