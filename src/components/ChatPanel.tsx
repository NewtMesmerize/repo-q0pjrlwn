import { useRef, useState, useEffect } from 'react';
import { Input, Button, Avatar, Tag } from 'antd';
import { SendOutlined, UserOutlined, RobotOutlined } from '@ant-design/icons';

interface Msg {
  role: 'user' | 'ai';
  text: string;
}

export default function ChatPanel({
  title,
  greeting,
  suggestions = [],
  tags = [],
}: {
  title: string;
  greeting: string;
  suggestions?: string[];
  tags?: string[];
}) {
  const [msgs, setMsgs] = useState<Msg[]>([{ role: 'ai', text: greeting }]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs, typing]);

  const send = (text: string) => {
    const t = text.trim();
    if (!t || typing) return;
    setMsgs((m) => [...m, { role: 'user', text: t }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      setMsgs((m) => [
        ...m,
        {
          role: 'ai',
          text:
            `关于「${t}」，根据相关法律规定与实务经验，建议如下：\n` +
            '1. 第一时间固定并保存相关证据（合同、聊天记录、转账凭证等）；\n' +
            '2. 优先通过协商或调解方式化解，降低维权成本；\n' +
            '3. 协商不成的，可依据合同中的仲裁条款申请在线仲裁，一裁终局、效力强。\n' +
            '（以上内容由 AI 生成，仅供参考，具体请咨询专业律师。）',
        },
      ]);
      setTyping(false);
    }, 900);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 200px)' }}>
      <div style={{ padding: '16px 24px', borderBottom: '1px solid #f0f0f0', fontWeight: 700, fontSize: 16 }}>{title}</div>
      <div style={{ flex: 1, overflowY: 'auto', padding: 24, background: '#f7f9fc' }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 18, flexDirection: m.role === 'user' ? 'row-reverse' : 'row' }}>
            <Avatar
              icon={m.role === 'user' ? <UserOutlined /> : <RobotOutlined />}
              style={{ background: m.role === 'user' ? '#2f6bff' : '#13c2c2', flex: '0 0 auto' }}
            />
            <div
              style={{
                maxWidth: '70%',
                background: m.role === 'user' ? '#2f6bff' : '#fff',
                color: m.role === 'user' ? '#fff' : '#1f2329',
                padding: '12px 16px',
                borderRadius: 12,
                whiteSpace: 'pre-wrap',
                lineHeight: 1.7,
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              }}
            >
              {m.text}
            </div>
          </div>
        ))}
        {typing && <div style={{ color: '#8a93a0', marginLeft: 52 }}>AI 正在思考…</div>}
        {msgs.length === 1 && suggestions.length > 0 && (
          <div style={{ marginLeft: 52 }}>
            <div style={{ color: '#8a93a0', marginBottom: 8 }}>你可以这样问：</div>
            {suggestions.map((s) => (
              <div
                key={s}
                onClick={() => send(s)}
                className="zf-hover-card"
                style={{ background: '#fff', padding: '10px 14px', borderRadius: 8, marginBottom: 8, maxWidth: 520, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
              >
                {s}
              </div>
            ))}
          </div>
        )}
        <div ref={endRef} />
      </div>
      <div style={{ padding: 16, borderTop: '1px solid #f0f0f0' }}>
        {tags.length > 0 && (
          <div style={{ marginBottom: 10 }}>
            {tags.map((t) => (
              <Tag key={t} style={{ cursor: 'pointer' }} onClick={() => setInput((v) => (v ? v + ' ' + t : t))}>{t}</Tag>
            ))}
          </div>
        )}
        <Input.Search
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onSearch={send}
          placeholder="请输入您的法律问题或需求…"
          enterButton={<Button type="primary" icon={<SendOutlined />}>发送</Button>}
          size="large"
        />
      </div>
    </div>
  );
}
