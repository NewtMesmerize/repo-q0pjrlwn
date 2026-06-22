import { useState } from 'react';
import { Card, Input, Upload, Button, Tag, Progress, Spin, Empty } from 'antd';
import { UploadOutlined, FileTextOutlined, PlusOutlined, DeleteOutlined, BulbOutlined, ThunderboltOutlined } from '@ant-design/icons';
import StepFlow, { StepNav } from '../../components/StepFlow';
import { caseElements, caseAnalysisResult } from '../../mock/data';

const steps = [{ title: '输入案情' }, { title: '要素确认' }, { title: '分析报告' }];

export default function CaseAnalysis() {
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [caseText, setCaseText] = useState('');
  const [fileName, setFileName] = useState('');

  // 要素确认（可编辑）
  const [partyIdx, setPartyIdx] = useState(0);
  const [reasonIdx, setReasonIdx] = useState(0);
  const [facts, setFacts] = useState<string[]>(caseElements.facts);
  const [demands, setDemands] = useState<string[]>(caseElements.demands);

  // 第 1 步 → 第 2 步：要素提取（loading）
  const extract = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setCurrent(1); }, 1500);
  };
  // 第 2 步 → 第 3 步：深度分析（loading）
  const analyze = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setCurrent(2); }, 1700);
  };

  const r = caseAnalysisResult;

  return (
    <StepFlow
      title="案情分析"
      subtitle="输入案情描述，AI 提取争议要素并推演胜诉概率、关键证据与应对策略。"
      steps={steps}
      current={current}
    >
      {current === 0 && (
        <>
          <Card title="案情概述">
            <Input.TextArea
              value={caseText}
              onChange={(e) => setCaseText(e.target.value)}
              rows={7}
              placeholder="请输入案件情况，涉及的主体、时间、地点、争议金额、争议焦点等，信息越详细分析越精准。"
            />
            <div style={{ marginTop: 14 }}>
              {fileName ? (
                <span style={{ color: '#1e293b' }}>
                  <FileTextOutlined style={{ color: '#2f6bff' }} /> {fileName}
                  <a style={{ marginLeft: 12 }} onClick={() => setFileName('')}>删除</a>
                </span>
              ) : (
                <Upload beforeUpload={(f) => { setFileName(f.name); return false; }} showUploadList={false} accept=".doc,.docx,.pdf">
                  <Button icon={<UploadOutlined />}>上传材料（doc / docx / pdf，选填）</Button>
                </Upload>
              )}
            </div>
          </Card>
          <StepNav onNext={extract} nextText="开始智能分析" loading={loading} nextDisabled={!caseText.trim()} />
        </>
      )}

      {current === 1 && (
        <>
          <Card title="提取的要素（可整理修改）" extra={<Tag color="processing">AI 已完成要素提取</Tag>}>
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>当事人 <span style={{ color: '#e34d59' }}>*</span></div>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {caseElements.parties.map((p, idx) => (
                  <div key={idx} onClick={() => setPartyIdx(idx)} style={{
                    padding: '8px 16px', borderRadius: 999, cursor: 'pointer',
                    border: `1px solid ${partyIdx === idx ? '#2f6bff' : '#d9dee7'}`,
                    background: partyIdx === idx ? 'rgba(47,107,255,0.08)' : '#fff',
                    color: partyIdx === idx ? '#2f6bff' : '#4b5563',
                  }}>{p.name}（{p.role}）</div>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 18 }}>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>案由 <span style={{ color: '#e34d59' }}>*</span></div>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {caseElements.reasons.map((rs, idx) => (
                  <div key={idx} onClick={() => setReasonIdx(idx)} style={{
                    padding: '6px 14px', borderRadius: 8, cursor: 'pointer',
                    border: `1px solid ${reasonIdx === idx ? '#2f6bff' : '#d9dee7'}`,
                    background: reasonIdx === idx ? 'rgba(47,107,255,0.08)' : '#fff',
                    color: reasonIdx === idx ? '#2f6bff' : '#4b5563',
                  }}>{rs}</div>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 18 }}>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>事实详情 <span style={{ color: '#e34d59' }}>*</span></div>
              {facts.map((f, idx) => (
                <div key={idx} style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                  <Input.TextArea
                    value={f}
                    onChange={(e) => setFacts(facts.map((x, i) => (i === idx ? e.target.value : x)))}
                    autoSize={{ minRows: 1 }}
                  />
                  <Button danger icon={<DeleteOutlined />} onClick={() => setFacts(facts.filter((_, i) => i !== idx))} />
                </div>
              ))}
              <Button type="dashed" block icon={<PlusOutlined />} onClick={() => setFacts([...facts, ''])}>新增事实</Button>
            </div>

            <div>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>
                当事人诉求　<Tag>当前：{caseElements.parties[partyIdx]?.name}</Tag>
              </div>
              {demands.map((d, idx) => (
                <div key={idx} style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                  <Input.TextArea
                    value={d}
                    onChange={(e) => setDemands(demands.map((x, i) => (i === idx ? e.target.value : x)))}
                    autoSize={{ minRows: 1 }}
                  />
                  <Button danger icon={<DeleteOutlined />} onClick={() => setDemands(demands.filter((_, i) => i !== idx))} />
                </div>
              ))}
              <Button type="dashed" block icon={<PlusOutlined />} onClick={() => setDemands([...demands, ''])}>新增诉求</Button>
            </div>
          </Card>
          <StepNav onPrev={() => setCurrent(0)} onNext={analyze} nextText="生成分析报告" loading={loading} nextIcon={<ThunderboltOutlined />} />
        </>
      )}

      {current === 2 && (
        <>
          {caseText ? (
            <>
              <Card>
                <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
                  <Progress type="dashboard" percent={r.winRate} size={130} format={(p) => `${p}%`} strokeColor={{ '0%': '#2f6bff', '100%': '#12b8a6' }} />
                  <div style={{ flex: 1, minWidth: 220 }}>
                    <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>预估胜诉概率 {r.winRate}%</div>
                    <div style={{ color: '#8a93a0' }}>基于当事人、案由、事实与诉求，结合同类裁判数据综合推演，仅供参考。</div>
                  </div>
                </div>
              </Card>

              <Card title="争议焦点" style={{ marginTop: 16 }}>
                <ol style={{ paddingLeft: 18, margin: 0, color: '#4b5563', lineHeight: 2 }}>
                  {r.focus.map((f, i) => <li key={i}>{f}</li>)}
                </ol>
              </Card>

              <Card title="法律依据" style={{ marginTop: 16 }}>
                {r.basis.map((b, i) => (
                  <div key={i} style={{ marginBottom: 12 }}>
                    <Tag color="blue">{b.law}</Tag>
                    <div style={{ color: '#4b5563', marginTop: 4 }}>{b.content}</div>
                  </div>
                ))}
              </Card>

              <Card title="关键证据建议" style={{ marginTop: 16 }}>
                <ul style={{ paddingLeft: 18, margin: 0, color: '#4b5563', lineHeight: 2 }}>
                  {r.evidence.map((e, i) => <li key={i}>{e}</li>)}
                </ul>
              </Card>

              <Card title={<span><BulbOutlined style={{ color: '#12b8a6' }} /> 应对策略</span>} style={{ marginTop: 16 }}>
                <ol style={{ paddingLeft: 18, margin: 0, color: '#4b5563', lineHeight: 2 }}>
                  {r.strategy.map((s, i) => <li key={i}>{s}</li>)}
                </ol>
              </Card>
            </>
          ) : (
            <Empty description="暂无数据" />
          )}
          <StepNav onPrev={() => setCurrent(1)} prevText="返回要素" onNext={() => {}} nextText="下载分析报告" />
        </>
      )}

      {loading && current === 0 && (
        <div style={{ textAlign: 'center', marginTop: 24, color: '#8a93a0' }}>
          <Spin /> <span style={{ marginLeft: 8 }}>AI 正在梳理案情、识别当事人与争议焦点…</span>
        </div>
      )}
    </StepFlow>
  );
}
