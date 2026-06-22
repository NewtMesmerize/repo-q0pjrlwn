import { useState } from 'react';
import { Form, Input, Button, Tabs, message, Space } from 'antd';
import { MobileOutlined, SafetyOutlined, LockOutlined, UserOutlined, CheckCircleFilled, ReloadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth';
import Logo from '../components/Logo';

function genCaptcha() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [counting, setCounting] = useState(0);
  const [captcha, setCaptcha] = useState(genCaptcha);
  const [msg, ctx] = message.useMessage();
  const refreshCaptcha = () => setCaptcha(genCaptcha());

  const captchaColors = ['#2f6bff', '#12b8a6', '#eb2f96', '#faad14', '#722ed1'];
  const captchaBox = (
    <div
      onClick={refreshCaptcha}
      title="点击刷新验证码"
      style={{
        width: 120, height: 40, flex: '0 0 120px', cursor: 'pointer', userSelect: 'none',
        borderRadius: 8, border: '1px solid #e6e9f0',
        background: 'repeating-linear-gradient(45deg,#f6f8fc,#f6f8fc 6px,#eef2fa 6px,#eef2fa 12px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, position: 'relative',
      }}
    >
      {captcha.split('').map((c, i) => (
        <span
          key={i}
          style={{
            fontSize: 21, fontWeight: 800, fontFamily: 'Georgia, serif',
            color: captchaColors[i % captchaColors.length],
            transform: `rotate(${(i % 2 ? 1 : -1) * (6 + i * 2)}deg)`,
            display: 'inline-block', textShadow: '0 1px 1px rgba(0,0,0,0.12)',
          }}
        >
          {c}
        </span>
      ))}
      <ReloadOutlined style={{ position: 'absolute', right: 5, bottom: 4, fontSize: 11, color: '#b6bdcb' }} />
    </div>
  );

  const sendCode = () => {
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

  const onFinish = (v: { phone: string }) => {
    login(v.phone);
    msg.success('登录成功');
    setTimeout(() => navigate('/console'), 400);
  };

  const onPwdFinish = (v: { account: string; captcha: string }) => {
    if (v.captcha.trim().toUpperCase() !== captcha) {
      msg.error('图形验证码错误');
      refreshCaptcha();
      return;
    }
    login(v.account);
    msg.success('登录成功');
    setTimeout(() => navigate('/console'), 400);
  };

  const pwdForm = (
    <Form layout="vertical" onFinish={onPwdFinish} requiredMark={false} size="large">
      <Form.Item name="account" label="用户名" rules={[{ required: true, message: '请输入用户名' }]}>
        <Input prefix={<UserOutlined />} placeholder="请输入用户名" />
      </Form.Item>
      <Form.Item name="pwd" label="密码" rules={[{ required: true, message: '请输入密码' }]}>
        <Input.Password prefix={<LockOutlined />} placeholder="请输入密码" />
      </Form.Item>
      <Form.Item name="captcha" label="图形验证码" rules={[{ required: true, message: '请输入图形验证码' }]}>
        <Space.Compact style={{ width: '100%' }}>
          <Input prefix={<SafetyOutlined />} placeholder="请输入图形验证码" maxLength={4} />
          {captchaBox}
        </Space.Compact>
      </Form.Item>
      <Form.Item style={{ marginTop: 8 }}>
        <Button type="primary" htmlType="submit" block>登录</Button>
      </Form.Item>
    </Form>
  );

  const codeForm = (
    <Form layout="vertical" onFinish={onFinish} requiredMark={false} size="large">
      <Form.Item name="phone" label="手机号" rules={[{ required: true, pattern: /^1\d{10}$/, message: '请输入正确的手机号' }]}>
        <Input prefix={<MobileOutlined />} placeholder="请输入手机号" />
      </Form.Item>
      <Form.Item name="code" label="短信验证码" rules={[{ required: true, message: '请输入短信验证码' }]}>
        <Space.Compact style={{ width: '100%' }}>
          <Input prefix={<SafetyOutlined />} placeholder="请输入短信验证码" />
          <Button onClick={sendCode} disabled={counting > 0} style={{ width: 130 }}>
            {counting > 0 ? `${counting}s 后重发` : '获取验证码'}
          </Button>
        </Space.Compact>
      </Form.Item>
      <Form.Item style={{ marginTop: 8 }}>
        <Button type="primary" htmlType="submit" block>登录</Button>
      </Form.Item>
    </Form>
  );

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
                <CheckCircleFilled style={{ color: '#12b8a6', fontSize: 18 }} /> {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* right login panel */}
      <div style={{ flex: '0 0 480px', maxWidth: 480, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', padding: 40 }}>
        <div style={{ width: '100%', maxWidth: 360 }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>欢迎回来</h2>
          <p style={{ color: '#8a93a0', margin: '8px 0 20px' }}>登录中枫仲调，开启智能法律服务</p>
          <Tabs
            defaultActiveKey="pwd"
            items={[
              { key: 'pwd', label: '账号密码登录', children: pwdForm },
              { key: 'code', label: '短信验证码登录', children: codeForm },
            ]}
          />
          <div style={{ textAlign: 'center', color: '#8a93a0', marginTop: 4 }}>
            还没有账号？ <a style={{ color: '#2f6bff', fontWeight: 600 }} onClick={() => navigate('/register')}>去注册</a>
          </div>
          <div style={{ textAlign: 'center', marginTop: 8 }}>
            <Button type="link" onClick={() => navigate('/')}>暂不登录，先逛逛 →</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
