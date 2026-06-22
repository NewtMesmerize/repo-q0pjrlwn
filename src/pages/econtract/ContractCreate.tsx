import { useState, useCallback } from 'react';
import {
  Card, Button, Upload, Input, Select, DatePicker, Form, Radio, Space, Divider,
  Modal, QRCode, message, Tag, Tooltip,
} from 'antd';
import {
  CloudUploadOutlined, FileWordOutlined, FilePdfOutlined, DeleteOutlined,
  PlusOutlined, CloseCircleOutlined, InfoCircleOutlined, CopyOutlined,
  CheckCircleOutlined, UserOutlined, BankOutlined, ArrowLeftOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

const roleNames = ['甲方', '乙方', '丙方', '丁方', '戊方', '己方', '庚方', '辛方', '壬方', '癸方'];

interface Party {
  id: number;
  role: string;
  type: 'company' | 'individual';
  companyName: string;
  orgCode: string;
  name: string;
  phone: string;
  signingLink?: string;
}

const DEFAULT_VALIDITY_DAYS = 30;

let idCounter = 0;
const makeParty = (role: string): Party => ({
  id: idCounter++,
  role,
  type: 'company',
  companyName: '',
  orgCode: '',
  name: '',
  phone: '',
});

export default function ContractCreate() {
  const navigate = useNavigate();
  const [msg, ctx] = message.useMessage();

  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState(0);
  const [parties, setParties] = useState<Party[]>([makeParty('甲方'), makeParty('乙方')]);
  const [deadline, setDeadline] = useState<dayjs.Dayjs | null>(dayjs().add(DEFAULT_VALIDITY_DAYS, 'day'));
  const [submitting, setSubmitting] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [activePartyIdx, setActivePartyIdx] = useState(0);

  const formatFileSize = (bytes: number) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (bytes / Math.pow(k, i)).toFixed(1) + ' ' + sizes[i];
  };

  const updateParty = useCallback((index: number, field: keyof Party, value: string) => {
    setParties((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  }, []);

  const addParty = () => {
    if (parties.length >= roleNames.length) {
      msg.warning('签约方数量已达上限');
      return;
    }
    setParties([...parties, makeParty(roleNames[parties.length])]);
  };

  const removeParty = (index: number) => {
    if (index < 2) return;
    setParties(parties.filter((_, i) => i !== index));
  };

  const canSubmit = (() => {
    if (!fileName) return false;
    for (const p of parties) {
      if (p.type === 'company') {
        if (!p.companyName || !p.orgCode || !p.phone) return false;
      } else {
        if (!p.name || !p.phone) return false;
      }
    }
    return true;
  })();

  const handleSubmit = () => {
    if (!canSubmit) {
      msg.warning('请完善必填信息');
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      const updated = parties.map((p) => ({
        ...p,
        signingLink: `https://sign.example.com/contract/${Date.now()}/${p.role}`,
      }));
      setParties(updated);
      setActivePartyIdx(0);
      setSuccessOpen(true);
    }, 1000);
  };

  const copyLink = (link: string) => {
    navigator.clipboard.writeText(link).then(() => msg.success('链接已复制'));
  };

  const activeParty = parties[activePartyIdx];

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px 100px' }}>
      {ctx}

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <Button icon={<ArrowLeftOutlined />} type="text" onClick={() => navigate('/e-contract')} />
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>发起合同</h2>
      </div>

      {/* 上传合同文件 */}
      <Card style={{ borderRadius: 16, marginBottom: 20 }} styles={{ body: { padding: 24 } }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 4, height: 16, borderRadius: 2, background: '#1890ff', display: 'inline-block' }} />
          上传合同文件
        </h3>
        {!fileName ? (
          <Upload.Dragger
            beforeUpload={(f) => { setFileName(f.name); setFileSize(f.size); return false; }}
            maxCount={1}
            accept=".docx,.pdf"
            showUploadList={false}
          >
            <p style={{ fontSize: 40, color: '#2f6bff', margin: 0 }}><CloudUploadOutlined /></p>
            <p style={{ marginTop: 8, fontWeight: 500 }}>点击或拖拽上传合同文件</p>
            <p style={{ color: '#8a93a0', fontSize: 12 }}>支持 Word (.docx) 和 PDF 格式</p>
          </Upload.Dragger>
        ) : (
          <div style={{ background: '#f6f8fb', borderRadius: 12, padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(47,107,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {fileName.endsWith('.pdf') ? <FilePdfOutlined style={{ fontSize: 22, color: '#ff4d4f' }} /> : <FileWordOutlined style={{ fontSize: 22, color: '#2f6bff' }} />}
              </div>
              <div>
                <div style={{ fontWeight: 600, color: '#1e293b' }}>{fileName}</div>
                <div style={{ fontSize: 12, color: '#8a93a0', marginTop: 2 }}>{formatFileSize(fileSize)}</div>
              </div>
              <Tag color="success">已上传</Tag>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <Upload beforeUpload={(f) => { setFileName(f.name); setFileSize(f.size); return false; }} maxCount={1} accept=".docx,.pdf" showUploadList={false}>
                <a style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}><CloudUploadOutlined /> 重新上传</a>
              </Upload>
              <a onClick={() => { setFileName(''); setFileSize(0); }} style={{ color: '#ff4d4f', fontSize: 13, display: 'flex', alignItems: 'center', gap: 4, marginLeft: 12 }}>
                <DeleteOutlined /> 删除
              </a>
            </div>
          </div>
        )}
      </Card>

      {/* 签约方信息 - 仅上传文件后显示 */}
      {fileName && (
        <>
          <Card style={{ borderRadius: 16, marginBottom: 20 }} styles={{ body: { padding: 24 } }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 4, height: 16, borderRadius: 2, background: '#1890ff', display: 'inline-block' }} />
              签约方信息
            </h3>

            {parties.map((party, index) => (
              <div key={party.id} style={{ background: '#f8fafc', borderRadius: 14, padding: '20px 20px 16px', marginBottom: 16, border: '1px solid #edf2ff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ fontWeight: 700, color: '#16325c', fontSize: 15 }}>{party.role}（{index + 1}）</span>
                  {index >= 2 && (
                    <Button type="text" danger size="small" icon={<CloseCircleOutlined />} onClick={() => removeParty(index)}>移除</Button>
                  )}
                </div>
                <Radio.Group
                  value={party.type}
                  onChange={(e) => updateParty(index, 'type', e.target.value)}
                  style={{ marginBottom: 16 }}
                >
                  <Radio.Button value="company"><BankOutlined /> 单位</Radio.Button>
                  <Radio.Button value="individual"><UserOutlined /> 个人</Radio.Button>
                </Radio.Group>

                {party.type === 'company' ? (
                  <Space direction="vertical" style={{ width: '100%' }} size={12}>
                    <div>
                      <div style={{ fontSize: 13, color: '#64748b', marginBottom: 4 }}>单位名称 <span style={{ color: '#ff4d4f' }}>*</span></div>
                      <Input placeholder="请输入单位名称" value={party.companyName} onChange={(e) => updateParty(index, 'companyName', e.target.value)} />
                    </div>
                    <div>
                      <div style={{ fontSize: 13, color: '#64748b', marginBottom: 4 }}>组织机构代码 <span style={{ color: '#ff4d4f' }}>*</span></div>
                      <Input placeholder="请输入组织机构代码" value={party.orgCode} onChange={(e) => updateParty(index, 'orgCode', e.target.value)} />
                    </div>
                    <div>
                      <div style={{ fontSize: 13, color: '#64748b', marginBottom: 4 }}>手机号 <span style={{ color: '#ff4d4f' }}>*</span></div>
                      <Input placeholder="请输入手机号" maxLength={11} value={party.phone} onChange={(e) => updateParty(index, 'phone', e.target.value)} />
                    </div>
                  </Space>
                ) : (
                  <Space direction="vertical" style={{ width: '100%' }} size={12}>
                    <div>
                      <div style={{ fontSize: 13, color: '#64748b', marginBottom: 4 }}>姓名 <span style={{ color: '#ff4d4f' }}>*</span></div>
                      <Input placeholder="请输入姓名" value={party.name} onChange={(e) => updateParty(index, 'name', e.target.value)} />
                    </div>
                    <div>
                      <div style={{ fontSize: 13, color: '#64748b', marginBottom: 4 }}>手机号 <span style={{ color: '#ff4d4f' }}>*</span></div>
                      <Input placeholder="请输入手机号" maxLength={11} value={party.phone} onChange={(e) => updateParty(index, 'phone', e.target.value)} />
                    </div>
                  </Space>
                )}
              </div>
            ))}

            <Button type="dashed" block icon={<PlusOutlined />} onClick={addParty} style={{ borderRadius: 10, height: 42 }}>
              添加签约方
            </Button>
          </Card>

          {/* 签约截止时间 */}
          <Card style={{ borderRadius: 16, marginBottom: 20 }} styles={{ body: { padding: 24 } }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 4, height: 16, borderRadius: 2, background: '#1890ff', display: 'inline-block' }} />
              签约截止时间
            </h3>
            <DatePicker
              value={deadline}
              onChange={(d) => setDeadline(d)}
              disabledDate={(current) => current && current.isBefore(dayjs(), 'day')}
              style={{ width: '100%' }}
              format="YYYY/MM/DD"
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10, color: '#fa8c16', fontSize: 13 }}>
              <InfoCircleOutlined /> 默认基于当前顺延 {DEFAULT_VALIDITY_DAYS} 天。若过期未签完，系统将自动作废该合同并退还积分。
            </div>
          </Card>
        </>
      )}

      {/* 底部操作栏 */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
        background: '#fff', boxShadow: '0 -4px 24px rgba(15,23,42,0.06)',
        padding: '12px 24px', display: 'flex', justifyContent: 'center',
      }}>
        <Button
          type="primary"
          size="large"
          loading={submitting}
          disabled={!canSubmit}
          onClick={handleSubmit}
          style={{ borderRadius: 999, fontWeight: 700, height: 46, paddingInline: 60, fontSize: 16 }}
        >
          {canSubmit ? '发起合同' : '请完善信息'}
        </Button>
      </div>

      {/* 发起成功弹窗 */}
      <Modal
        open={successOpen}
        onCancel={() => { setSuccessOpen(false); navigate('/e-contract'); }}
        footer={<Button type="primary" block size="large" onClick={() => { setSuccessOpen(false); navigate('/e-contract'); }}>关闭</Button>}
        centered
        width={520}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 20 }} /> 合同发起成功
          </div>
        }
      >
        <div style={{ marginBottom: 16 }}>
          <div style={{ background: '#f6f8fb', borderRadius: 10, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <FileWordOutlined style={{ fontSize: 20, color: '#2f6bff' }} />
            <span style={{ fontWeight: 600 }}>{fileName}</span>
          </div>
        </div>

        <div style={{ fontWeight: 700, marginBottom: 10 }}>签约链接</div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
          {parties.map((p, i) => (
            <Button
              key={p.id}
              type={activePartyIdx === i ? 'primary' : 'default'}
              size="small"
              onClick={() => setActivePartyIdx(i)}
              style={{ borderRadius: 8 }}
            >
              {p.role}
            </Button>
          ))}
        </div>

        {activeParty && (
          <div style={{ background: '#f8fafc', borderRadius: 12, padding: 20, textAlign: 'center' }}>
            <div style={{ marginBottom: 8 }}>
              <span style={{ fontWeight: 600 }}>{activeParty.type === 'company' ? activeParty.companyName : activeParty.name}</span>
              <Tag style={{ marginLeft: 8 }}>{activeParty.type === 'company' ? '单位' : '个人'}</Tag>
            </div>
            {activeParty.signingLink && (
              <>
                <QRCode value={activeParty.signingLink} size={140} style={{ margin: '12px auto' }} />
                <div style={{ fontSize: 12, color: '#64748b', marginBottom: 8 }}>{activeParty.role}扫码签约</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: '#64748b', wordBreak: 'break-all' }}>
                  <span style={{ flex: 1 }}>{activeParty.signingLink}</span>
                  <Button type="link" size="small" icon={<CopyOutlined />} onClick={() => copyLink(activeParty.signingLink!)}>复制</Button>
                </div>
                <div style={{ fontSize: 12, color: '#539ce8', marginTop: 10 }}>
                  你可以截图或复制链接发送给签约人进行签约。
                </div>
              </>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
