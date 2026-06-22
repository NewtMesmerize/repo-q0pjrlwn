import { Tag } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import { statusColor, type AiHistoryRecord } from '../mock/history';

interface Props {
  record: AiHistoryRecord;
}

export default function HistoryDetail({ record }: Props) {
  return (
    <div style={{ padding: '28px 32px' }}>
      <h1 style={{ fontSize: 26, fontWeight: 800, margin: '0 0 10px' }}>{record.title}</h1>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#8a93a0', fontSize: 13, marginBottom: 28 }}>
        <ClockCircleOutlined /> {record.createTime}
        <Tag color={statusColor[record.statusName] || 'default'} style={{ marginInlineEnd: 0 }}>{record.statusName}</Tag>
      </div>

      <div style={{ maxWidth: 900 }}>
        {record.detail.map((s) => (
          <div key={s.label} style={{ marginBottom: 22 }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--zf-ink)', marginBottom: 8 }}>{s.label}</div>
            <div style={{ color: '#4b5563', fontSize: 15, lineHeight: 1.95, background: '#f7f9fc', borderRadius: 12, padding: '16px 18px' }}>
              {s.content}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
