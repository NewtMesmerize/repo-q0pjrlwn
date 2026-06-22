import { Table, Tag, Button, Space, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { orders, type OrderItem } from '../../mock/data';

export default function Orders() {
  const [msg, ctx] = message.useMessage();
  const columns: ColumnsType<OrderItem> = [
    { title: '订单编号', dataIndex: 'id' },
    { title: '商品', dataIndex: 'product' },
    { title: '金额', dataIndex: 'amount', render: (v) => <span style={{ color: '#f5222d', fontWeight: 600 }}>¥{v}</span> },
    {
      title: '状态', dataIndex: 'status',
      render: (v: OrderItem['status']) => <Tag color={v === '已完成' ? 'green' : v === '待支付' ? 'orange' : 'default'}>{v}</Tag>,
    },
    { title: '下单时间', dataIndex: 'date' },
    {
      title: '操作', key: 'action',
      render: (_, r) => (
        <Space>
          <Button type="link" onClick={() => msg.info(`订单 ${r.id} 详情（演示）`)}>详情</Button>
          {r.status === '待支付' && <Button type="link" onClick={() => msg.success('支付成功（演示）')}>去支付</Button>}
        </Space>
      ),
    },
  ];

  return (
    <div>
      {ctx}
      <div className="zf-section-title" style={{ marginBottom: 20 }}>我的订单</div>
      <Table rowKey="id" columns={columns} dataSource={orders} pagination={{ pageSize: 10 }} />
    </div>
  );
}
