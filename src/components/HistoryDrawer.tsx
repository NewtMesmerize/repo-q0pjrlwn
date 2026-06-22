import { useMemo, useState } from 'react';
import { Drawer, Empty, Tag, Button, Popconfirm, message } from 'antd';
import { DeleteOutlined, RightOutlined } from '@ant-design/icons';
import { aiHistory, statusColor, type AiHistoryRecord } from '../mock/history';

interface Props {
  open: boolean;
  onClose: () => void;
  toolKey: string;
  toolTitle: string;
  onSelect: (record: AiHistoryRecord) => void;
}

export default function HistoryDrawer({ open, onClose, toolKey, toolTitle, onSelect }: Props) {
  const [deleted, setDeleted] = useState<Set<string>>(new Set());
  const [msg, ctx] = message.useMessage();

  const list = useMemo(
    () => aiHistory.filter((r) => r.toolKey === toolKey && !deleted.has(r.id)),
    [toolKey, deleted],
  );

  const remove = (id: string) => {
    setDeleted((prev) => new Set(prev).add(id));
    msg.success('已删除该记录');
  };

  return (
    <Drawer
      title={`${toolTitle} · 历史记录`}
      placement="right"
      width={420}
      open={open}
      onClose={onClose}
      styles={{ body: { padding: '12px 0' } }}
    >
      {ctx}
      {list.length === 0 ? (
        <Empty style={{ marginTop: '32vh' }} description="暂无历史记录" />
      ) : (
        <div>
          {list.map((r) => (
            <div
              key={r.id}
              onClick={() => onSelect(r)}
              style={{
                display: 'flex', alignItems: 'flex-start', gap: 8,
                padding: '16px 20px', cursor: 'pointer', borderBottom: '1px solid #f0f2f6',
              }}
              className="zf-history-item"
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--zf-ink)', marginBottom: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {r.title}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#8a93a0', fontSize: 12 }}>
                  <span>{r.createTime}</span>
                  <Tag color={statusColor[r.statusName] || 'default'} style={{ marginInlineEnd: 0, transform: 'scale(0.9)' }}>{r.statusName}</Tag>
                </div>
              </div>
              <Popconfirm
                title="删除该记录？"
                okText="删除"
                cancelText="取消"
                okButtonProps={{ danger: true }}
                onConfirm={() => remove(r.id)}
              >
                <Button type="text" size="small" icon={<DeleteOutlined />} onClick={(e) => e.stopPropagation()} style={{ color: '#bcc3d0' }} />
              </Popconfirm>
              <RightOutlined style={{ color: '#c1c6d8', fontSize: 12, marginTop: 4 }} />
            </div>
          ))}
        </div>
      )}
    </Drawer>
  );
}
