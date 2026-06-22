import { useNavigate, useLocation } from 'react-router-dom';

interface NavItem {
  key: string;
  label: string;
}

export default function SecondaryNav({ items, title }: { items: NavItem[]; title?: string }) {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <div style={{ background: '#fff', borderBottom: '1px solid #eef0f3' }}>
      <div className="zf-container" style={{ display: 'flex', alignItems: 'center', height: 54 }}>
        {title && <div style={{ fontWeight: 700, marginRight: 32 }}>{title}</div>}
        <div style={{ display: 'flex', gap: 28 }}>
          {items.map((it) => {
            const active = location.pathname === it.key;
            return (
              <div
                key={it.key}
                onClick={() => navigate(it.key)}
                style={{
                  cursor: 'pointer',
                  height: 54,
                  lineHeight: '54px',
                  color: active ? '#2f6bff' : '#4b5563',
                  fontWeight: active ? 700 : 400,
                  borderBottom: active ? '2px solid #2f6bff' : '2px solid transparent',
                }}
              >
                {it.label}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const arbNavItems: NavItem[] = [
  { key: '/arbitration/consult', label: '仲裁咨询' },
  { key: '/arbitration/filing', label: '在线立案' },
  { key: '/arbitration/cases', label: '我的仲裁' },
];
