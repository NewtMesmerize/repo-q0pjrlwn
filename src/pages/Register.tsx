import { useState } from 'react';
import { Form, Input, Button, Radio, Checkbox, message, Space } from 'antd';
import { MobileOutlined, SafetyOutlined, IdcardOutlined, BankOutlined, GiftOutlined, CheckCircleFilled, SafetyCertificateOutlined, ThunderboltOutlined, TeamOutlined, FileProtectOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth';
import Logo from '../components/Logo';

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [userType, setUserType] = useState<'personal' | 'enterprise'>('personal');
  const [counting, setCounting] = useState(0);
  const [agreed, setAgreed] = useState(false);
  const [msg, ctx] = message.useMessage();
  const [form] = Form.useForm();

  const sendCode = () => {
    const phone = form.getFieldValue('phone');
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      msg.error('请输入正确的手机号');
      return;
    }
    if (counting > 0) return;
    setCounting(60);
    msg.success('验证码已发送（演示：1234）');
    const timer = setInterval(() => {
      setCounting((c) => {
        if (c <= 1) {
          clearInterval(timer);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  };

  const onFinish = (values: { phone: string; name: string; code: string; inviteCode: string; companyName?: string }) => {
    if (!agreed) {
      msg.error('请先阅读并同意用户协议');
      return;
    }
    login(values.phone);
    msg.success('注册成功');
    setTimeout(() => navigate('/console'), 400);
  };

  const brandFeatures = [
    { icon: <SafetyCertificateOutlined />, text: 'AI 法律工具，24 小时智能咨询服务' },
    { icon: <FileProtectOutlined />, text: '电子合同 · 区块链司法存证，法律效力保障' },
    { icon: <ThunderboltOutlined />, text: '全流程在线仲裁，平均45天结案，一裁终局' },
    { icon: <TeamOutlined />, text: '50+ 资深法务专家，一对一专业护航' },
  ];

  const stats = [
    { num: '30+', label: '合作仲裁机构' },
    { num: '12,000+', label: '累计处置案件' },
    { num: '98%', label: '调解成功率' },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex' }}>
      {ctx}
      {/* left brand panel */}
      <div className="zf-hero" style={{ flex: '1 1 0', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 64px' }}>
        <div className="zf-grid-mask" />
        <div className="zf-blob" style={{ width: 320, height: 320, background: '#2f6bff', top: -60, left: -60 }} />
        <div className="zf-blob" style={{ width: 260, height: 260, background: '#12b8a6', bottom: -80, right: 40 }} />
        <div style={{ position: 'relative', maxWidth: 440, width: '100%' }}>
          <Logo />
          <h1 style={{ color: 'var(--zf-hero-ink)', fontSize: 34, fontWeight: 800, lineHeight: 1.3, margin: '28px 0 0', letterSpacing: '-0.6px' }}>
            枫起公正 仲达天下
          </h1>
          <p style={{ color: 'var(--zf-hero-sub)', fontSize: 15, marginTop: 12, lineHeight: 1.7 }}>
            一站式数字化纠纷预防与解决平台，依托成熟技术体系与全国司法协作资源，构建全周期解纷生态。
          </p>

          {/* stats */}
          <div style={{ display: 'flex', gap: 24, marginTop: 28, padding: '18px 0', borderTop: '1px solid rgba(47,107,255,0.12)', borderBottom: '1px solid rgba(47,107,255,0.12)' }}>
            {stats.map((s) => (
              <div key={s.label} style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ fontSize: 26, fontWeight: 800, color: '#2f6bff', lineHeight: 1 }}>{s.num}</div>
                <div style={{ fontSize: 12, color: '#6b7d9a', marginTop: 6 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* features */}
          <div style={{ marginTop: 28 }}>
            {brandFeatures.map((f) => (
              <div key={f.text} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 16, color: '#33405c', fontSize: 14, lineHeight: 1.6 }}>
                <CheckCircleFilled style={{ color: '#12b8a6', fontSize: 17, marginTop: 3, flexShrink: 0 }} />
                <span>{f.text}</span>
              </div>
            ))}
          </div>

          {/* trust badges */}
          <div style={{ marginTop: 24, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <span className="zf-chip">司法区块链存证</span>
            <span className="zf-chip">权威实名认证</span>
            <span className="zf-chip">一裁终局</span>
            <span className="zf-chip">全国执行力</span>
          </div>
        </div>
      </div>

      {/* right register panel */}
      <div style={{ flex: '0 0 480px', maxWidth: 480, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', padding: 40, overflowY: 'auto' }}>
        <div style={{ width: '100%', maxWidth: 380 }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>注册账号</h2>
          <p style={{ color: '#8a93a0', margin: '8px 0 20px' }}>注册中枫仲调，开启智能法律服务</p>

          <Radio.Group
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
            optionType="button"
            buttonStyle="solid"
            style={{ width: '100%', display: 'flex', marginBottom: 24 }}
            options={[
              { label: '个人用户', value: 'personal' },
              { label: '企业用户', value: 'enterprise' },
            ]}
          />

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            requiredMark={false}
            size="large"
          >
            {userType === 'enterprise' && (
              <Form.Item
                name="companyName"
                label="企业全称"
                rules={[{ required: true, message: '请填写企业全称' }]}
              >
                <Input prefix={<BankOutlined />} placeholder="请填写企业全称" />
              </Form.Item>
            )}

            <Form.Item
              name="name"
              label="真实姓名"
              rules={[{ required: true, message: '请输入真实姓名' }]}
            >
              <Input prefix={<IdcardOutlined />} placeholder="请输入真实姓名" />
            </Form.Item>

            <Form.Item
              name="phone"
              label="手机号"
              rules={[
                { required: true, message: '请输入手机号' },
                { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的11位手机号' },
              ]}
            >
              <Input prefix={<MobileOutlined />} placeholder="请输入注册手机号" maxLength={11} />
            </Form.Item>

            <Form.Item
              name="code"
              label="验证码"
              rules={[{ required: true, message: '请输入验证码' }]}
            >
              <Space.Compact style={{ width: '100%' }}>
                <Input prefix={<SafetyOutlined />} placeholder="请输入短信验证码" maxLength={6} />
                <Button onClick={sendCode} disabled={counting > 0} style={{ width: 130 }}>
                  {counting > 0 ? `${counting}s 后重发` : '获取验证码'}
                </Button>
              </Space.Compact>
            </Form.Item>

            <Form.Item
              name="inviteCode"
              label="邀请码"
              rules={[
                { required: true, message: '请输入邀请码' },
                { len: 5, message: '邀请码为5位字母数字' },
              ]}
              normalize={(val: string) => val?.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 5)}
            >
              <Input prefix={<GiftOutlined />} placeholder="请输入邀请码（字母数字5位）" maxLength={5} />
            </Form.Item>

            <Form.Item style={{ marginBottom: 12 }}>
              <Checkbox checked={agreed} onChange={(e) => setAgreed(e.target.checked)}>
                <span style={{ fontSize: 13, color: '#8a93a0' }}>
                  已阅读并同意{' '}
                  <a style={{ color: '#2f6bff' }} onClick={(e) => e.preventDefault()}>
                    《中枫仲调用户协议》
                  </a>
                </span>
              </Checkbox>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>注 册</Button>
            </Form.Item>
          </Form>

          <div style={{ textAlign: 'center', color: '#8a93a0', marginTop: 4 }}>
            已有账号？ <a style={{ color: '#2f6bff', fontWeight: 600 }} onClick={() => navigate('/login')}>立即登录</a>
          </div>
          <div style={{ textAlign: 'center', marginTop: 8 }}>
            <Button type="link" onClick={() => navigate('/')}>暂不注册，先逛逛 →</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
