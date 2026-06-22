import { useState } from 'react';
import { Form, Input, Button, Radio, Checkbox, message, Space } from 'antd';
import { MobileOutlined, SafetyOutlined, UserOutlined, IdcardOutlined, BankOutlined, GiftOutlined } from '@ant-design/icons';
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
    'AI 法律工具，24 小时智能服务',
    '电子合同 · 区块链司法存证',
    '全流程在线仲裁，一裁终局',
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex' }}>
      {ctx}
      {/* left brand panel */}
      <div className="zf-hero" style={{ flex: '1 1 0', display: 'flex', alignItems: 'center', padding: '0 64px' }}>
        <div className="zf-grid-mask" />
        <div className="zf-blob" style={{ width: 320, height: 320, background: '#2f6bff', top: -60, left: -60 }} />
        <div className="zf-blob" style={{ width: 260, height: 260, background: '#12b8a6', bottom: -80, right: 40 }} />
        <div style={{ position: 'relative', maxWidth: 420 }}>
          <Logo />
          <h1 style={{ color: 'var(--zf-hero-ink)', fontSize: 36, fontWeight: 800, lineHeight: 1.3, margin: '32px 0 0', letterSpacing: '-0.6px' }}>
            科技赋能仲裁<br />专业守护权益
          </h1>
          <p style={{ color: 'var(--zf-hero-sub)', fontSize: 16, marginTop: 18 }}>
            一站式数字化纠纷预防与解决平台
          </p>
          <div style={{ marginTop: 36 }}>
            {brandFeatures.map((f) => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18, color: '#33405c', fontSize: 15 }}>
                <span style={{ color: '#12b8a6', fontSize: 18 }}>✓</span> {f}
              </div>
            ))}
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
