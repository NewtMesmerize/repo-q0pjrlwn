import { useMemo, useState } from 'react';
import { Card, Upload, Input, Select, Tag, Result, Spin, Empty } from 'antd';
import { InboxOutlined, FileWordOutlined, SafetyCertificateOutlined, BulbOutlined } from '@ant-design/icons';
import StepFlow, { StepNav } from '../../components/StepFlow';
import { contractTypeGroups, contractRiskItems } from '../../mock/data';

const steps = [{ title: '上传合同' }, { title: '确认信息' }, { title: '审查报告' }];

const typeOptions = contractTypeGroups.map((g) => ({
  label: g.label,
  options: g.children.map((c) => ({ label: c.label, value: c.label })),
}));

export default function ContractReview() {
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState('');
  const [contractType, setContractType] = useState<string>('');
  const [role, setRole] = useState('');
  const [requirement, setRequirement] = useState('');

  const roles = useMemo(() => {
    for (const g of contractTypeGroups) {
      const hit = g.children.find((c) => c.label === contractType);
      if (hit) return hit.roles;
    }
    return [];
  }, [contractType]);

  // 第 1 步 → 第 2 步：AI 初步识别（loading 过渡）
  const goConfirm = () => {
    setLoading(true);
    setTimeout(() => {
      setContractType('买卖合同');
      setRole('出卖方（甲方）');
      setLoading(false);
      setCurrent(1);
    }, 1400);
  };

  // 第 2 步 → 第 3 步：深度风险审查（loading 过渡）
  const startReview = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setCurrent(2);
    }, 1600);
  };

  const counts = {
    high: contractRiskItems.filter((r) => r.level === '高风险').length,
    mid: contractRiskItems.filter((r) => r.level === '中风险').length,
    low: contractRiskItems.filter((r) => r.level === '低风险').length,
  };

  return (
    <StepFlow
      title="合同审查"
      subtitle="上传合同，AI 智能识别合同类型并逐条排查风险与合规漏洞。"
      steps={steps}
      current={current}
    >
      {current === 0 && (
        <>
          <Card title="上传合同文件">
            <Upload.Dragger
              beforeUpload={(f) => { setFileName(f.name); return false; }}
              maxCount={1}
              accept=".docx"
              showUploadList={false}
            >
              <p style={{ fontSize: 40, color: '#2f6bff', margin: 0 }}><InboxOutlined /></p>
              <p style={{ marginTop: 8 }}>点击或拖拽文件到此处上传</p>
              <p style={{ color: '#8a93a0', fontSize: 12 }}>单文件上传，仅支持 .docx 格式</p>
            </Upload.Dragger>
            {fileName && (
              <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 8, color: '#1e293b' }}>
                <FileWordOutlined style={{ color: '#2f6bff' }} />
                <span>{fileName}</span>
                <Tag color="success">已选择</Tag>
              </div>
            )}
          </Card>
          <StepNav onNext={goConfirm} nextText="选择文件并初识" loading={loading} nextDisabled={!fileName} />
        </>
      )}

      {current === 1 && (
        <>
          <Card title="确认审查信息" extra={<Tag icon={<SafetyCertificateOutlined />} color="processing">AI 已完成初步识别</Tag>}>
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>AI 识别合同类型 <span style={{ color: '#e34d59' }}>*</span></div>
              <Select
                value={contractType || undefined}
                onChange={(v) => { setContractType(v); setRole(''); }}
                options={typeOptions}
                placeholder="请选择合同类型"
                style={{ width: '100%', maxWidth: 360 }}
                size="large"
              />
            </div>

            <div style={{ marginBottom: 18 }}>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>我方身份及审查立场 <span style={{ color: '#e34d59' }}>*</span></div>
              <div style={{ color: '#8a93a0', fontSize: 13, marginBottom: 10 }}>请选择以哪一方的利益为优先进行风险审查。</div>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {roles.map((r) => (
                  <div
                    key={r}
                    onClick={() => setRole(r)}
                    style={{
                      padding: '8px 18px', borderRadius: 999, cursor: 'pointer',
                      border: `1px solid ${role === r ? '#2f6bff' : '#d9dee7'}`,
                      background: role === r ? 'rgba(47,107,255,0.08)' : '#fff',
                      color: role === r ? '#2f6bff' : '#4b5563', fontWeight: role === r ? 600 : 400,
                    }}
                  >
                    {r}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>其他特殊审查要求（选填）</div>
              <Input.TextArea
                value={requirement}
                onChange={(e) => setRequirement(e.target.value)}
                rows={3}
                placeholder="例如：请重点审查付款条款，确认违约金比例不低于 30% ……"
              />
            </div>
          </Card>
          <StepNav
            onPrev={() => setCurrent(0)}
            onNext={startReview}
            nextText="确认信息并开始智能审查"
            nextIcon={<SafetyCertificateOutlined />}
            loading={loading}
            nextDisabled={!contractType || !role}
          />
        </>
      )}

      {current === 2 && (
        <>
          <Card>
            {fileName ? (
              <Result
                status="success"
                title={`审查完成，发现 ${contractRiskItems.length} 项风险提示`}
                subTitle={`文件：${fileName}　|　合同类型：${contractType}　|　审查立场：${role}`}
                style={{ padding: '8px 0 4px' }}
              />
            ) : (
              <Empty description="暂无数据" />
            )}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 28, marginBottom: 8 }}>
              <span><Tag color="red">高风险</Tag>{counts.high}</span>
              <span><Tag color="orange">中风险</Tag>{counts.mid}</span>
              <span><Tag color="blue">低风险</Tag>{counts.low}</span>
            </div>
          </Card>

          {contractRiskItems.map((r, i) => (
            <Card key={i} style={{ marginTop: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600, fontSize: 16, marginBottom: 12 }}>
                <span style={{
                  width: 24, height: 24, borderRadius: 8, background: '#2f6bff', color: '#fff',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 13,
                }}>{i + 1}</span>
                <Tag color={r.color}>{r.level}</Tag>
                {r.title}
              </div>
              <div style={{ background: '#f6f8fb', borderRadius: 10, padding: '10px 14px', marginBottom: 10 }}>
                <span style={{ color: '#8a93a0' }}>合同原文：</span>
                <span style={{ color: '#1e293b' }}>“{r.original_text}”</span>
              </div>
              <div style={{ marginBottom: 10, color: '#4b5563' }}>
                <span style={{ color: '#8a93a0' }}>风险分析：</span>{r.desc}
              </div>
              <div style={{ background: 'rgba(18,184,166,0.08)', borderRadius: 10, padding: '10px 14px' }}>
                <div style={{ color: '#12b8a6', fontWeight: 600, marginBottom: 4 }}><BulbOutlined /> 修改建议</div>
                <div style={{ color: '#1e293b' }}>{r.suggestion}</div>
              </div>
            </Card>
          ))}

          <StepNav onPrev={() => setCurrent(0)} prevText="重新上传" onNext={() => {}} nextText="下载审查结果" />
        </>
      )}

      {loading && current === 0 && (
        <div style={{ textAlign: 'center', marginTop: 24, color: '#8a93a0' }}>
          <Spin /> <span style={{ marginLeft: 8 }}>AI 正在识别合同类型并提取当事人信息…</span>
        </div>
      )}
    </StepFlow>
  );
}
