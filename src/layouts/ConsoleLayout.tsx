import { Layout, Menu, Avatar } from 'antd';
import {
  DashboardOutlined, FileTextOutlined, AppstoreOutlined, AppstoreAddOutlined,
  AuditOutlined, ShareAltOutlined, IdcardOutlined, ProfileOutlined, UserOutlined,
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const { Sider, Content } = Layout;

const items = [
  { key: '/console', icon: <DashboardOutlined />, label: '概览' },
  { key: '/console/orders', icon: <FileTextOutlined />, label: '我的订单' },
  { key: '/console/products-a', icon: <AppstoreOutlined />, label: '我的产品包A' },
  { key: '/console/products-b', icon: <AppstoreAddOutlined />, label: '我的产品包B' },
  { key: '/console/arbitration', icon: <AuditOutlined />, label: '我的仲裁' },
  { key: '/console/promotion', icon: <ShareAltOutlined />, label: '我的推广' },
  { key: '/console/profile', icon: <IdcardOutlined />, label: '个人资料' },
  { key: '/console/billing', icon: <ProfileOutlined />, label: '计费规则' },
];

export default function ConsoleLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="zf-container" style={{ padding: '24px' }}>
      <Layout style={{ background: 'transparent', gap: 16 }}>
        <Sider
          width={232}
          style={{ background: '#fff', borderRadius: 18, overflow: 'hidden', boxShadow: 'var(--zf-shadow-sm)', border: '1px solid var(--zf-line)' }}
        >
          <div style={{ padding: 20, background: 'var(--zf-grad)', position: 'relative', overflow: 'hidden' }}>
            <div className="zf-blob" style={{ width: 120, height: 120, background: '#fff', opacity: 0.16, top: -40, right: -20 }} />
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 12 }}>
              <Avatar size={44} style={{ background: 'rgba(255,255,255,0.25)' }} icon={<UserOutlined />} />
              <div>
                <div style={{ color: '#fff', fontWeight: 800, fontSize: 16 }}>李律师</div>
                <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12.5, marginTop: 2 }}>积分 1250 · VIP 会员</div>
              </div>
            </div>
          </div>
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            items={items}
            onClick={({ key }) => navigate(key)}
            style={{ borderInlineEnd: 'none', paddingTop: 8 }}
          />
        </Sider>
        <Content style={{ background: '#fff', borderRadius: 18, minHeight: 'calc(100vh - 160px)', padding: 28, boxShadow: 'var(--zf-shadow-sm)', border: '1px solid var(--zf-line)' }}>
          <Outlet />
        </Content>
      </Layout>
    </div>
  );
}
