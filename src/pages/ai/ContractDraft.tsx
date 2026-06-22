import { useState } from 'react';
import { Card, Input, Select, Upload, Button, Tag, Spin } from 'antd';
import { UploadOutlined, PlusOutlined, DeleteOutlined, FileTextOutlined, DownloadOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import StepFlow, { StepNav } from '../../components/StepFlow';
import { contractTypeGroups, draftOutline, draftResultText, type OutlineItem } from '../../mock/data';

const steps = [{ title: '填写需求' }, { title: '大纲确认' }, { title: '合同正文' }];

const typeOptions = contractTypeGroups.map((g) => ({
  label: g.label,
  options: g.children.map((c) => ({ label: c.label, value: c.label })),
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

export default function ContractDraft() {
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [contractType, setContractType] = useState<string>('');
  const [requirement, setRequirement] = useState('');
  const [files, setFiles] = useState<string[]>([]);
  const [outline, setOutline] = useState<OutlineItem[]>(draftOutline);

  // 第 1 步 → 第 2 步：生成大纲（loading）
  const genOutline = () => {
    setLoading(true);
    setTimeout(() => { setOutline(draftOutline); setLoading(false); setCurrent(1); }, 1600);
  };
  // 第 2 步 → 第 3 步：生成正文（loading）
  const genDraft = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setCurrent(2); }, 1800);
  };

  const updateOutline = (idx: number, key: keyof OutlineItem, val: string) =>
    setOutline(outline.map((o, i) => (i === idx ? { ...o, [key]: val } : o)));
  const move = (idx: number, dir: -1 | 1) => {
    const j = idx + dir;
    if (j < 0 || j >= outline.length) return;
    const next = [...outline];
    [next[idx], next[j]] = [next[j], next[idx]];
    setOutline(next);
  };

  return (
    <StepFlow
      title="合同起草"
      subtitle="描述起草需求，AI 先生成可调整的合同大纲，确认后再生成完整合同正文。"
      steps={steps}
      current={current}
    >
      {current === 0 && (
        <>
          <Card title="起草需求">
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>合同类型 <span style={{ color: '#e34d59' }}>*</span></div>
              <Select
                value={contractType || undefined}
                onChange={setContractType}
                options={typeOptions}
                placeholder="请选择合同类型"
                style={{ width: '100%', maxWidth: 360 }}
                size="large"
              />
            </div>
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>起草要求 <span style={{ color: '#e34d59' }}>*</span></div>
              <Input.TextArea
                value={requirement}
                onChange={(e) => setRequirement(e.target.value)}
                rows={5}
                placeholder="请描述合同主体、标的、金额、付款方式、交付与违约等核心诉求，越具体生成越精准。"
              />
            </div>
            <div>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>参考资料（选填，最多 5 个）</div>
              <Upload
                beforeUpload={(f) => { setFiles((p) => (p.length < 5 ? [...p, f.name] : p)); return false; }}
                fileList={[]}
                accept=".doc,.docx,.pdf"
              >
                <Button icon={<UploadOutlined />} disabled={files.length >= 5}>上传参考资料</Button>
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
          <StepNav onNext={genOutline} nextText="生成合同大纲" loading={loading} nextDisabled={!contractType || !requirement.trim()} />
        </>
      )}

      {current === 1 && (
        <>
          <Card title="合同大纲（可编辑、增删、调序）" extra={<Tag color="processing">AI 已生成大纲</Tag>}>
            {outline.map((o, idx) => (
              <div key={idx} style={{ border: '1px solid #eef1f6', borderRadius: 12, padding: 14, marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <Tag color="blue">第 {idx + 1} 条</Tag>
                  <Input
                    value={o.sub_title}
                    onChange={(e) => updateOutline(idx, 'sub_title', e.target.value)}
                    style={{ flex: 1 }}
                    placeholder="条款标题"
                  />
                  <Button size="small" icon={<ArrowUpOutlined />} onClick={() => move(idx, -1)} />
                  <Button size="small" icon={<ArrowDownOutlined />} onClick={() => move(idx, 1)} />
                  <Button size="small" danger icon={<DeleteOutlined />} onClick={() => setOutline(outline.filter((_, i) => i !== idx))} />
                </div>
                <Input.TextArea
                  value={o.description}
                  onChange={(e) => updateOutline(idx, 'description', e.target.value)}
                  autoSize={{ minRows: 2 }}
                  placeholder="条款说明"
                />
              </div>
            ))}
            <Button type="dashed" block icon={<PlusOutlined />} onClick={() => setOutline([...outline, { sub_title: '', description: '' }])}>
              新增条款
            </Button>
          </Card>
          <StepNav onPrev={() => setCurrent(0)} onNext={genDraft} nextText="生成合同正文" loading={loading} />
        </>
      )}

      {current === 2 && (
        <>
          <Card
            title="合同正文"
            extra={<Button type="primary" icon={<DownloadOutlined />}>下载合同</Button>}
          >
            <div style={{ background: '#fff', border: '1px solid #eef1f6', borderRadius: 12, padding: '24px 32px' }}>
              {renderMarkdown(draftResultText)}
            </div>
          </Card>
          <StepNav onPrev={() => setCurrent(1)} prevText="返回大纲" />
        </>
      )}

      {loading && current === 0 && (
        <div style={{ textAlign: 'center', marginTop: 24, color: '#8a93a0' }}>
          <Spin /> <span style={{ marginLeft: 8 }}>AI 正在拟定合同大纲…</span>
        </div>
      )}
    </StepFlow>
  );
}
