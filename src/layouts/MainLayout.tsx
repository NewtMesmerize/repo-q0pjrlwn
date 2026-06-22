import { Layout, Button, Dropdown, Avatar, Space, Row, Col } from 'antd';
import { UserOutlined, DownOutlined, CustomerServiceOutlined } from '@ant-design/icons';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../auth';
import Logo from '../components/Logo';

const { Header, Content, Footer } = Layout;

const navItems = [
  { key: '/', label: '首页' },
  { key: '/ai-law', label: 'AI法律' },
  { key: '/ai-law/big-data-query', label: '大数据查询' },
  { key: '/e-contract', label: '电子合同' },
  { key: '/arbitration/consult', label: '在线仲裁' },
  { key: '/packages', label: '产品套餐' },
  { key: '/platform/company', label: '了解平台' },
];

function selectedTopKey(pathname: string): string {
  if (pathname === '/') return '/';
  if (pathname.startsWith('/ai-law/big-data-query')) return '/ai-law/big-data-query';
  if (pathname.startsWith('/ai-law')) return '/ai-law';
  if (pathname.startsWith('/e-contract')) return '/e-contract';
  if (pathname.startsWith('/arbitration')) return '/arbitration/consult';
  if (pathname.startsWith('/packages')) return '/packages';
  if (pathname.startsWith('/platform')) return '/platform/company';
  return '';
}

const footerCols = [
  { title: '产品服务', links: ['AI法律工具', '电子合同', '在线仲裁', '大数据查询'] },
  { title: '解决方案', links: ['企业风控', '合同管理', '纠纷化解', '律师服务'] },
  { title: '了解平台', links: ['企业介绍', '业务介绍', '应用场景', '产品介绍'] },
];

export default function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loggedIn, logout } = useAuth();
  const active = selectedTopKey(location.pathname);

  const userMenu = {
    items: [
      { key: 'console', label: '我的控制台' },
      { key: 'arbitration', label: '我的仲裁' },
      { key: 'orders', label: '我的订单' },
      { type: 'divider' as const },
      { key: 'logout', label: '退出登录', danger: true },
    ],
    onClick: ({ key }: { key: string }) => {
      if (key === 'logout') {
        logout();
        navigate('/');
      } else if (key === 'console') navigate('/console');
      else if (key === 'arbitration') navigate('/console/arbitration');
      else if (key === 'orders') navigate('/console/orders');
    },
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header className="zf-header" style={{ height: 68, padding: '0 24px', lineHeight: 'normal' }}>
        <div style={{ margin: '0 auto', display: 'flex', alignItems: 'center', width: '100%', maxWidth: 1200, height: 68 }}>
          <Link to="/"><Logo /></Link>
          <nav style={{ display: 'flex', gap: 34, marginLeft: 44, flex: 1 }}>
            {navItems.map((it) => (
              <span
                key={it.key}
                className={`zf-nav-link${active === it.key ? ' active' : ''}`}
                onClick={() => navigate(it.key)}
                style={{ cursor: 'pointer' }}
              >
                {it.label}
              </span>
            ))}
          </nav>
          <Space size={14}>
            <Button type="text" icon={<CustomerServiceOutlined />} style={{ fontWeight: 600 }}>客服</Button>
            {loggedIn ? (
              <Dropdown menu={userMenu}>
                <Space style={{ cursor: 'pointer' }}>
                  <Avatar style={{ background: 'linear-gradient(135deg,#2f6bff,#12b8a6)' }} icon={<UserOutlined />} />
                  <span style={{ fontWeight: 600 }}>李律师</span>
                  <DownOutlined style={{ fontSize: 12, color: '#8a93a0' }} />
                </Space>
              </Dropdown>
            ) : (
              <Button type="primary" onClick={() => navigate('/login')}>
                登录 / 注册
              </Button>
            )}
          </Space>
        </div>
      </Header>

      <Content>
        <Outlet />
      </Content>

      <Footer style={{ background: 'var(--zf-grad-dark)', color: 'rgba(255,255,255,0.7)', padding: '56px 24px 28px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Row gutter={[32, 32]}>
            <Col xs={24} md={9}>
              <Logo dark />
              <p style={{ marginTop: 16, maxWidth: 320, color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>
                专注于数字化纠纷预防与在线仲裁处置的专业服务平台，以「数字技术 + 法律合规 + 调仲一体化」为核心，构建全周期解纷生态。
              </p>
              <div style={{ marginTop: 18 }}>
                <span className="zf-chip" style={{ marginRight: 8 }}>司法区块链存证</span>
                <span className="zf-chip">权威实名认证</span>
              </div>
            </Col>
            {footerCols.map((c) => (
              <Col xs={8} md={5} key={c.title}>
                <div style={{ color: '#fff', fontWeight: 700, marginBottom: 14, fontSize: 15 }}>{c.title}</div>
                {c.links.map((l) => (
                  <div key={l} style={{ marginBottom: 10, fontSize: 13.5, color: 'rgba(255,255,255,0.62)', cursor: 'pointer' }}>
                    {l}
                  </div>
                ))}
              </Col>
            ))}
          </Row>
          <div style={{ height: 1, background: 'rgba(255,255,255,0.1)', margin: '32px 0 18px' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
            <span>科技赋能仲裁，专业守护权益</span>
            <span>Copyright © 2026 中枫仲调 版权所有 · 蜀ICP备20261234567号-1</span>
          </div>
        </div>
      </Footer>
    </Layout>
  );
}
