import { useParams, useNavigate } from 'react-router-dom';
import { Card, Row, Col, Descriptions, Tag, Timeline, Progress, Button, Breadcrumb, Result, Statistic } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import SecondaryNav, { arbNavItems } from '../../components/SecondaryNav';
import { arbCases, caseTimeline } from '../../mock/data';

export default function ArbCaseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const c = arbCases.find((x) => x.id === id);

  if (!c) {
    return (
      <>
        <SecondaryNav title="在线仲裁" items={arbNavItems} />
        <Result status="404" title="案件不存在" extra={<Button type="primary" onClick={() => navigate('/arbitration/cases')}>返回列表</Button>} />
      </>
    );
  }

  return (
    <>
      <SecondaryNav title="在线仲裁" items={arbNavItems} />
      <div className="zf-container" style={{ padding: '24px 24px 48px' }}>
        <Breadcrumb
          style={{ marginBottom: 16 }}
          items={[
            { title: <a onClick={() => navigate('/arbitration/cases')}>我的仲裁</a> },
            { title: c.id },
          ]}
        />

        <Card style={{ marginBottom: 16 }}>
          <Row align="middle" justify="space-between">
            <Col>
              <div style={{ color: '#8a93a0' }}>当前进度</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#2f6bff' }}>
                <ClockCircleOutlined /> {c.status}
              </div>
            </Col>
            <Col flex="auto" style={{ maxWidth: 360, marginLeft: 24 }}>
              <Progress percent={c.progress} status={c.progress === 0 ? 'exception' : c.progress === 100 ? 'success' : 'active'} />
            </Col>
          </Row>
        </Card>

        <Row gutter={16}>
          <Col xs={24} md={14}>
            <Card title="基本信息" style={{ marginBottom: 16 }}>
              <Descriptions column={1} colon>
                <Descriptions.Item label="案件编号">{c.id}</Descriptions.Item>
                <Descriptions.Item label="案件名称">{c.name}</Descriptions.Item>
                <Descriptions.Item label="案件类型"><Tag>{c.type}</Tag></Descriptions.Item>
                <Descriptions.Item label="当事人">{c.party}</Descriptions.Item>
                <Descriptions.Item label="申请时间">{c.date} 10:30:00</Descriptions.Item>
              </Descriptions>
            </Card>
            <Card title="案件详情">
              <div style={{ color: '#8a93a0', marginBottom: 6 }}>纠纷描述</div>
              <p style={{ color: '#4b5563', lineHeight: 1.9 }}>
                申请人就「{c.name}」与被申请人产生争议，现申请仲裁，要求被申请人依法承担相应责任。
              </p>
              <div style={{ marginTop: 12 }}>
                <Statistic title="争议金额" value={c.amount} prefix="¥" valueStyle={{ color: '#f5222d' }} />
              </div>
            </Card>
          </Col>
          <Col xs={24} md={10}>
            <Card title="进度时间轴">
              <Timeline
                items={caseTimeline.map((n, i) => ({
                  color: i === 0 ? '#2f6bff' : 'gray',
                  children: (
                    <div>
                      <div style={{ fontWeight: 700, color: i === 0 ? '#2f6bff' : undefined }}>{n.title}</div>
                      <div style={{ color: '#8a93a0', fontSize: 12 }}>{n.time}</div>
                      <div style={{ color: '#4b5563', marginTop: 4 }}>{n.desc}</div>
                      <div style={{ color: '#8a93a0', fontSize: 12, marginTop: 2 }}>经办：{n.by}</div>
                    </div>
                  ),
                }))}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}
