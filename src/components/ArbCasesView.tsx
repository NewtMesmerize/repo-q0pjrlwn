import { useState } from 'react';
import { Table, Tag, Progress, Input, Select, Space, Button } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';
import { arbCases, type ArbCase } from '../mock/data';

const statusList = ['全部状态', '材料准备', '案件初审', '提交仲裁', '仲裁立案', '仲裁调解', '调解成功', '仲裁完成', '案件关闭', '立案失败'];

export default function ArbCasesView({ embedded = false }: { embedded?: boolean }) {
  const navigate = useNavigate();
  const [status, setStatus] = useState('全部状态');
  const [kw, setKw] = useState('');

  const data = arbCases.filter(
    (c) => (status === '全部状态' || c.status === status) && (c.name.includes(kw) || c.party.includes(kw) || c.id.includes(kw)),
  );

  const columns: ColumnsType<ArbCase> = [
    { title: '案件编号', dataIndex: 'id', key: 'id', render: (v) => <span style={{ fontWeight: 600 }}>{v}</span> },
    { title: '案件名称', dataIndex: 'name', key: 'name' },
    { title: '当事人', dataIndex: 'party', key: 'party' },
    { title: '纠纷类型', dataIndex: 'type', key: 'type', render: (v) => <Tag>{v}</Tag> },
    {
      title: '状态', dataIndex: 'status', key: 'status',
      render: (_, r) => <Tag color={r.statusColor === 'default' ? undefined : r.statusColor}>{r.status}</Tag>,
    },
    { title: '争议金额', dataIndex: 'amount', key: 'amount', render: (v) => `¥${v.toLocaleString()}` },
    {
      title: '仲裁进度', dataIndex: 'progress', key: 'progress', width: 180,
      render: (v) => <Progress percent={v} size="small" status={v === 0 ? 'exception' : v === 100 ? 'success' : 'active'} />,
    },
    { title: '申请日期', dataIndex: 'date', key: 'date' },
    {
      title: '操作', key: 'action',
      render: (_, r) => <Button type="link" onClick={() => navigate(`/arbitration/cases/${r.id}`)}>详情</Button>,
    },
  ];

  return (
    <div>
      <Space style={{ marginBottom: 16, flexWrap: 'wrap' }} size={12}>
        <Select value={status} onChange={setStatus} style={{ width: 140 }} options={statusList.map((s) => ({ value: s, label: s }))} />
        <Input.Search placeholder="搜索当事人或案件名称" allowClear value={kw} onChange={(e) => setKw(e.target.value)} style={{ width: 280 }} />
        {!embedded && <Button type="primary" onClick={() => navigate('/arbitration/filing')}>+ 在线立案</Button>}
      </Space>
      <Table rowKey="id" columns={columns} dataSource={data} pagination={{ pageSize: 6, showTotal: (t) => `共 ${t} 件` }} scroll={{ x: 1100 }} />
    </div>
  );
}
