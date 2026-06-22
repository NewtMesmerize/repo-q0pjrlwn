import { useState } from 'react';
import { Button } from 'antd';
import { ArrowLeftOutlined, HistoryOutlined } from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { aiTools } from '../mock/data';
import HistoryDrawer from '../components/HistoryDrawer';
import HistoryDetail from '../components/HistoryDetail';
import type { AiHistoryRecord } from '../mock/history';

export default function AiToolLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const seg = location.pathname.replace('/ai-law/', '');
  const current = aiTools.find((t) => t.key === seg);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [selected, setSelected] = useState<AiHistoryRecord | null>(null);
  // 仅当所选记录属于当前工具时才展示其详情（切换工具后自动回到工具页）
  const showDetail = selected && selected.toolKey === seg;

  return (
    <div className="zf-container" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => (showDetail ? setSelected(null) : navigate('/ai-law'))}
        >
          {showDetail ? '返回' : '返回 AI 工具'}
        </Button>
        <div style={{ fontWeight: 800, fontSize: 18 }}>
          {current ? `${current.emoji} ${current.title}` : 'AI 法律工具'}
        </div>
        <div style={{ flex: 1 }} />
        <Button icon={<HistoryOutlined />} onClick={() => setHistoryOpen(true)}>历史记录</Button>
      </div>
      <div
        style={{
          background: '#fff',
          borderRadius: 18,
          boxShadow: 'var(--zf-shadow-sm)',
          border: '1px solid var(--zf-line)',
          minHeight: 'calc(100vh - 240px)',
          overflow: 'hidden',
        }}
      >
        {showDetail
          ? <HistoryDetail record={selected} />
          : <Outlet />}
      </div>
      <HistoryDrawer
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        toolKey={seg}
        toolTitle={current ? current.title : 'AI 法律工具'}
        onSelect={(rec) => { setSelected(rec); setHistoryOpen(false); }}
      />
    </div>
  );
}
