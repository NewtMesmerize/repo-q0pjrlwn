import { useState } from 'react';
import { Row, Col, Card, Button, Input, Segmented, Select } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { packages } from '../mock/data';
import PageHero from '../components/PageHero';

export default function Packages() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<string>('全部');
  const [kw, setKw] = useState('');
  const [sort, setSort] = useState('default');

  let list = packages.filter((p) =>
    (tab === '全部' || (tab === '套餐包' ? p.tag === 'package' : p.tag === 'product')) &&
    p.title.includes(kw),
  );
  if (sort === 'asc') list = [...list].sort((a, b) => a.price - b.price);
  if (sort === 'desc') list = [...list].sort((a, b) => b.price - a.price);

  return (
    <div>
      <PageHero
        compact
        chip="产品套餐"
        title="灵活的产品套餐，按需选择"
        subtitle="从个人到企业旗舰，覆盖咨询、合同、仲裁、数据全场景，匹配不同规模的法律服务需求。"
      />

      <div className="zf-container" style={{ padding: '32px 24px 56px' }}>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center', marginBottom: 24 }}>
          <Input
            prefix={<SearchOutlined />}
            placeholder="搜索套餐名称"
            allowClear
            value={kw}
            onChange={(e) => setKw(e.target.value)}
            style={{ width: 280 }}
          />
          <Segmented options={['全部', '套餐包', '产品包']} value={tab} onChange={(v) => setTab(v as string)} size="large" />
          <div style={{ flex: 1 }} />
          <Select
            value={sort}
            onChange={setSort}
            style={{ width: 150 }}
            options={[
              { value: 'default', label: '默认排序' },
              { value: 'asc', label: '价格从低到高' },
              { value: 'desc', label: '价格从高到低' },
            ]}
          />
        </div>

        <Row gutter={[20, 20]} align="stretch">
          {list.map((p) => (
            <Col xs={24} sm={12} md={8} key={p.id}>
              <Card
                className="zf-hover-card"
                style={{ height: '100%', borderRadius: 18, overflow: 'hidden' }}
                styles={{ body: { padding: 0 } }}
                onClick={() => navigate(`/packages/${p.id}`)}
              >
                <div style={{ background: p.color, padding: '24px 24px 20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ fontWeight: 800, fontSize: 19 }}>{p.title}</div>
                  </div>
                  <div style={{ color: '#6b7280', marginTop: 6 }}>{p.subtitle}</div>
                  <div style={{ marginTop: 16, display: 'flex', alignItems: 'baseline', gap: 4 }}>
                    <span style={{ fontSize: 16, fontWeight: 700, color: '#1f2329' }}>¥</span>
                    <span style={{ color: '#1f2329', fontSize: 32, fontWeight: 800 }}>{p.price}</span>
                  </div>
                  <div style={{ marginTop: 8, color: '#ff9500', fontSize: 13, fontWeight: 600 }}>
                    可兑换 {p.points.toLocaleString()} 积分
                  </div>
                </div>
                <div style={{ padding: 24 }}>
                  <Button type="primary" block size="large" onClick={(e) => { e.stopPropagation(); navigate(`/packages/${p.id}`); }}>
                    立即购买
                  </Button>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}
