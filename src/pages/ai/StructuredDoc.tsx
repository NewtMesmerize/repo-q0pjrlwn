import { useState } from 'react';
import { Card, Input, Select, Upload, Button, Tag, Spin } from 'antd';
import { UploadOutlined, FileTextOutlined, DownloadOutlined, EditOutlined } from '@ant-design/icons';
import StepFlow, { StepNav } from '../../components/StepFlow';
import { docTypeGroups, docResultText } from '../../mock/data';

const steps = [{ title: '填写信息' }, { title: '文书结果' }];

const docOptions = docTypeGroups.map((g) => ({
  label: g.label,
  options: g.children.map((c) => ({ label: c, value: c })),
}));

function renderMarkdown(md: string) {
  return md.split('\n').map((line, i) => {
    if (line.startsWith('# ')) return <h2 key={i} style={{ textAlign: 'center', margin: '4px 0 18px' }}>{line.slice(2)}</h2>;
    if (line.startsWith('## ')) return <h3 key={i} style={{ marginTop: 18 }}>{line.slice(3)}</h3>;
    if (line.trim() === '') return <div key={i} style={{ height: 8 }} />;
    const html = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    return <p key={i} style={{ margin: '4px 0', color: '#1e293b', lineHeight: 1.9 }} dangerouslySetInnerHTML={{ __html: html }} />;
  });
}

export default function StructuredDoc() {
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [docType, setDocType] = useState<string>('');
  const [caseInfo, setCaseInfo] = useState('');
  const [files, setFiles] = useState<string[]>([]);

  // 第 1 步 → 第 2 步：智能生成（loading）
  const generate = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setCurrent(1); }, 1700);
  };

  return (
    <StepFlow
      title="文书生成"
      subtitle="选择文书类型并填写案件信息，AI 一键生成规范的法律文书。"
      steps={steps}
      current={current}
    >
      {current === 0 && (
        <>
          <Card title="文书信息">
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>文书类型 <span style={{ color: '#e34d59' }}>*</span></div>
              <Select
                value={docType || undefined}
                onChange={setDocType}
                options={docOptions}
                placeholder="请选择需要生成的文书类型"
                style={{ width: '100%', maxWidth: 360 }}
                size="large"
              />
            </div>
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>案件信息 <span style={{ color: '#e34d59' }}>*</span></div>
              <Input.TextArea
                value={caseInfo}
                onChange={(e) => setCaseInfo(e.target.value)}
                rows={6}
                placeholder="请填写当事人信息、案件事实、请求事项等，AI 将据此生成文书内容。"
              />
            </div>
            <div>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>上传材料（选填）</div>
              <Upload
                beforeUpload={(f) => { setFiles((p) => [...p, f.name]); return false; }}
                fileList={[]}
                accept=".doc,.docx,.pdf"
              >
                <Button icon={<UploadOutlined />}>上传材料</Button>
              </Upload>
              <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {files.map((f, i) => (
                  <span key={i} style={{ color: '#1e293b' }}>
                    <FileTextOutlined style={{ color: '#2f6bff' }} /> {f}
                    <a style={{ marginLeft: 12 }} onClick={() => setFiles(files.filter((_, j) => j !== i))}>删除</a>
                  </span>
                ))}
              </div>
            </div>
          </Card>
          <StepNav onNext={generate} nextText="生成文书" loading={loading} nextDisabled={!docType || !caseInfo.trim()} />
        </>
      )}

      {current === 1 && (
        <>
          <Card
            title={<span>{docType || '法律文书'} <Tag color="success">已生成</Tag></span>}
            extra={
              <span style={{ display: 'flex', gap: 8 }}>
                <Button icon={<EditOutlined />}>编辑</Button>
                <Button type="primary" icon={<DownloadOutlined />}>下载文书</Button>
              </span>
            }
          >
            <div style={{ background: '#fff', border: '1px solid #eef1f6', borderRadius: 12, padding: '24px 32px' }}>
              {renderMarkdown(docResultText)}
            </div>
          </Card>
          <StepNav onPrev={() => setCurrent(0)} prevText="重新填写" />
        </>
      )}

      {loading && current === 0 && (
        <div style={{ textAlign: 'center', marginTop: 24, color: '#8a93a0' }}>
          <Spin /> <span style={{ marginLeft: 8 }}>AI 正在生成{docType || '文书'}…</span>
        </div>
      )}
    </StepFlow>
  );
}
