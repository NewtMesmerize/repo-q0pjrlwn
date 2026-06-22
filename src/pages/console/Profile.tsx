import { Card, Form, Input, Button, Avatar, Upload, Row, Col, Select, message } from 'antd';
import { UserOutlined, UploadOutlined } from '@ant-design/icons';
import { currentUser } from '../../mock/data';

export default function Profile() {
  const [msg, ctx] = message.useMessage();
  return (
    <div>
      {ctx}
      <div className="zf-section-title" style={{ marginBottom: 20 }}>个人资料</div>
      <Row gutter={24}>
        <Col xs={24} md={7}>
          <Card style={{ textAlign: 'center' }}>
            <Avatar size={96} style={{ background: '#2f6bff' }} icon={<UserOutlined />} />
            <div style={{ fontWeight: 700, fontSize: 18, marginTop: 12 }}>{currentUser.name}</div>
            <div style={{ color: '#8a93a0' }}>{currentUser.role}</div>
            <Upload showUploadList={false} beforeUpload={() => false}>
              <Button icon={<UploadOutlined />} style={{ marginTop: 16 }}>更换头像</Button>
            </Upload>
          </Card>
        </Col>
        <Col xs={24} md={17}>
          <Card title="基本信息">
            <Form
              layout="vertical"
              requiredMark={false}
              initialValues={{ name: currentUser.name, phone: currentUser.phone, role: currentUser.role, email: 'lawyer@zhongfeng.example.com', company: '中枫律师事务所' }}
              onFinish={() => msg.success('保存成功')}
            >
              <Row gutter={16}>
                <Col span={12}><Form.Item name="name" label="姓名"><Input /></Form.Item></Col>
                <Col span={12}><Form.Item name="phone" label="手机号"><Input /></Form.Item></Col>
                <Col span={12}><Form.Item name="role" label="角色">
                  <Select options={['区域经理', '普通会员', '企业管理员'].map((r) => ({ value: r, label: r }))} />
                </Form.Item></Col>
                <Col span={12}><Form.Item name="email" label="邮箱"><Input /></Form.Item></Col>
                <Col span={24}><Form.Item name="company" label="所属机构"><Input /></Form.Item></Col>
              </Row>
              <Button type="primary" htmlType="submit">保存修改</Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
