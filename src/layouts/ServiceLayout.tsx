import { Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Outlet, useNavigate } from 'react-router-dom';

export default function ServiceLayout() {
  const navigate = useNavigate();
  return (
    <div className="zf-container" style={{ padding: '24px' }}>
      <div style={{ marginBottom: 16 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/')}>返回首页</Button>
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
        <Outlet />
      </div>
    </div>
  );
}
