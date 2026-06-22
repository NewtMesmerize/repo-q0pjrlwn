import { useState, useRef } from 'react';
import { Card, Input, Row, Col, Result, Spin, Button, message } from 'antd';
import {
  BankOutlined, UserOutlined, SearchOutlined, SafetyOutlined,
  FileSearchOutlined, AuditOutlined, ThunderboltOutlined, ArrowRightOutlined, ArrowLeftOutlined,
  FilePdfOutlined, EyeOutlined, DownloadOutlined, FileProtectOutlined, HistoryOutlined,
} from '@ant-design/icons';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';
import StepFlow, { StepNav } from '../../components/StepFlow';
import HistoryDrawer from '../../components/HistoryDrawer';
import HistoryDetail from '../../components/HistoryDetail';
import type { AiHistoryRecord } from '../../mock/history';
import { companyQueryResult, personQueryResult } from '../../mock/data';
import type { CompanyQueryResult } from '../../mock/data';

const steps = [{ title: '填写信息' }, { title: '查询报告' }];

type QueryType = 'company' | 'personal';

const features = [
  { icon: <BankOutlined />, title: '企业信用画像', desc: '工商登记、股东结构、经营状态、注册资本等基础信息一键聚合。' },
  { icon: <AuditOutlined />, title: '司法风险排查', desc: '司法案件、失信被执行、限制高消费、被执行人等涉诉风险全覆盖。' },
  { icon: <FileSearchOutlined />, title: '个人核验', desc: '实名核验、涉诉记录、失信记录，快速识别交易对手个人风险。' },
  { icon: <ThunderboltOutlined />, title: '秒级出报告', desc: '多源数据实时聚合，秒级生成结构化风险信用报告，支持下载。' },
];

function ReportDoc({ result, reportNo, genTime }: { result: CompanyQueryResult; reportNo: string; genTime: string }) {
  return (
    <div className="zf-report-doc">
      <h1>{result.title}</h1>
      <div className="zf-report-sub">{result.typeLabel}</div>
      <div className="zf-report-meta">
        <span>报告编号：{reportNo}</span>
        <span>生成时间：{genTime}</span>
      </div>

      <h2>一、基础信息</h2>
      <table>
        <tbody>
          {result.basic.map((b, i) => (
            <tr key={i}><th>{b.label}</th><td>{b.value}</td></tr>
          ))}
        </tbody>
      </table>

      <h2>二、风险信息</h2>
      <table>
        <tbody>
          {result.risk.map((r, i) => (
            <tr key={i}>
              <th>{r.label}</th>
              <td style={{ color: r.color === 'red' ? '#e34d59' : r.color === 'orange' ? '#e8861a' : '#2ba471', fontWeight: 600 }}>
                {r.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="zf-report-foot">
        本报告由中枫仲调大数据风控引擎自动生成，数据来源于工商、司法及信用公开数据，仅供参考。
      </div>
    </div>
  );
}

export default function BigDataQuery() {
  const [started, setStarted] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyRecord, setHistoryRecord] = useState<AiHistoryRecord | null>(null);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [queryType, setQueryType] = useState<QueryType>('company');
  const [pdfLoading, setPdfLoading] = useState(false);
  const [reportNo, setReportNo] = useState('');
  const [genTime, setGenTime] = useState('');
  const reportRef = useRef<HTMLDivElement>(null);

  // company
  const [companyName, setCompanyName] = useState('');
  const [creditCode, setCreditCode] = useState('');
  // personal
  const [personName, setPersonName] = useState('');
  const [idNo, setIdNo] = useState('');

  const canSubmit = queryType === 'company' ? !!companyName.trim() : !!personName.trim() && !!idNo.trim();

  const query = () => {
    setLoading(true);
    setTimeout(() => {
      setReportNo(`ZF-${Date.now().toString().slice(-10)}`);
      setGenTime(new Date().toLocaleString('zh-CN'));
      setLoading(false);
      setCurrent(1);
    }, 1800);
  };

  const result = queryType === 'company' ? companyQueryResult : personQueryResult;

  const enterQuery = () => { setStarted(true); setCurrent(0); };

  const fileName = `${result.title}-风险信用报告.pdf`;

  // 由报告 DOM 生成 A4 PDF（html2canvas-pro 支持中文与现代色彩函数）
  const buildPdf = async () => {
    const el = reportRef.current;
    if (!el) return null;
    const canvas = await html2canvas(el, { scale: 2, backgroundColor: '#ffffff', useCORS: true });
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();
    const imgW = pageW;
    const imgH = (canvas.height * imgW) / canvas.width;
    const img = canvas.toDataURL('image/jpeg', 0.95);
    let heightLeft = imgH;
    let position = 0;
    pdf.addImage(img, 'JPEG', 0, position, imgW, imgH);
    heightLeft -= pageH;
    while (heightLeft > 0) {
      position -= pageH;
      pdf.addPage();
      pdf.addImage(img, 'JPEG', 0, position, imgW, imgH);
      heightLeft -= pageH;
    }
    return pdf;
  };

  const withPdf = async (action: (pdf: jsPDF) => void) => {
    setPdfLoading(true);
    try {
      const pdf = await buildPdf();
      if (pdf) action(pdf);
    } catch {
      message.error('PDF 生成失败，请重试');
    } finally {
      setPdfLoading(false);
    }
  };

  const previewPdf = () => withPdf((pdf) => window.open(pdf.output('bloburl'), '_blank'));
  const downloadPdf = () => withPdf((pdf) => pdf.save(fileName));

  // ===== 历史记录详情（页面内整页展示）=====
  if (historyRecord) {
    return (
      <div className="zf-container" style={{ padding: '20px 24px 24px' }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => setHistoryRecord(null)}>返回</Button>
        <div
          style={{
            background: '#fff', borderRadius: 18, boxShadow: 'var(--zf-shadow-sm)',
            border: '1px solid var(--zf-line)', marginTop: 16, overflow: 'hidden',
          }}
        >
          <HistoryDetail record={historyRecord} />
        </div>
      </div>
    );
  }

  // ===== 介绍页 =====
  if (!started) {
    return (
      <div className="zf-container" style={{ padding: '28px 24px' }}>
        <div
          className="zf-hero"
          style={{
            borderRadius: 20,
            padding: '44px 40px',
          }}
        >
          <div className="zf-grid-mask" />
          <div className="zf-blob" style={{ width: 240, height: 240, background: '#2f6bff', top: -70, right: -30 }} />
          <div className="zf-blob" style={{ width: 180, height: 180, background: '#12b8a6', bottom: -90, right: 160 }} />
          <div style={{ position: 'relative', zIndex: 1, maxWidth: 640 }}>
            <span className="zf-chip-solid">工商 · 司法 · 信用 多源聚合</span>
            <h1 style={{ color: 'var(--zf-hero-ink)', fontSize: 32, fontWeight: 800, margin: '16px 0 10px' }}>大数据查询</h1>
            <p style={{ color: 'var(--zf-hero-sub)', fontSize: 15, lineHeight: 1.9, marginBottom: 26 }}>
              输入企业名称或个人身份信息，秒级聚合工商、司法、信用等多维数据，输出结构化的风险信用报告，
              助你在合作、交易、尽调前快速识别对手方风险。
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Button type="primary" size="large" icon={<ArrowRightOutlined />} iconPosition="end" onClick={enterQuery}>
                去查询
              </Button>
              <Button size="large" icon={<HistoryOutlined />} onClick={() => setHistoryOpen(true)}>历史记录</Button>
            </div>
          </div>
        </div>
        <HistoryDrawer open={historyOpen} onClose={() => setHistoryOpen(false)} toolKey="big-data-query" toolTitle="大数据查询" onSelect={(rec) => { setHistoryRecord(rec); setHistoryOpen(false); }} />

        <Row gutter={[20, 20]} style={{ marginTop: 24 }}>
          {features.map((f, i) => (
            <Col xs={24} sm={12} lg={6} key={i}>
              <Card style={{ height: '100%', borderRadius: 16 }}>
                <div style={{
                  width: 46, height: 46, borderRadius: 12, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: 22, color: '#fff',
                  background: 'linear-gradient(135deg,#2f6bff,#12b8a6)', marginBottom: 14,
                }}>
                  {f.icon}
                </div>
                <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>{f.title}</div>
                <div style={{ color: '#8a93a0', fontSize: 13, lineHeight: 1.8 }}>{f.desc}</div>
              </Card>
            </Col>
          ))}
        </Row>

        <div style={{ textAlign: 'center', marginTop: 28 }}>
          <Button type="primary" size="large" icon={<SearchOutlined />} onClick={enterQuery}>
            立即开始查询
          </Button>
        </div>
      </div>
    );
  }

  // ===== 查询流程 =====
  const toggle = (type: QueryType, icon: React.ReactNode, label: string, desc: string) => {
    const activeCard = queryType === type;
    return (
      <Col xs={24} sm={12}>
        <div
          onClick={() => setQueryType(type)}
          style={{
            display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer',
            border: `2px solid ${activeCard ? '#2f6bff' : '#e8ecf3'}`,
            background: activeCard ? 'linear-gradient(135deg,rgba(47,107,255,0.08),rgba(18,184,166,0.06))' : '#fff',
            borderRadius: 14, padding: '16px 20px', transition: 'all .2s',
          }}
        >
          <div style={{
            width: 48, height: 48, borderRadius: 12, flex: '0 0 48px', display: 'flex',
            alignItems: 'center', justifyContent: 'center', fontSize: 24, color: '#fff',
            background: activeCard ? 'linear-gradient(135deg,#2f6bff,#12b8a6)' : '#b9c2d0',
          }}>
            {icon}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, color: activeCard ? '#2f6bff' : '#1e293b' }}>{label}</div>
            <div style={{ color: '#8a93a0', fontSize: 12.5, marginTop: 2 }}>{desc}</div>
          </div>
        </div>
      </Col>
    );
  };

  return (
    <div className="zf-container" style={{ padding: '8px 24px 24px' }}>
      <StepFlow
        title="大数据查询"
        subtitle="选择企业或个人，填写信息后秒级生成风险信用报告。"
        steps={steps}
        current={current}
      >
        {current === 0 && (
          <>
            <Row gutter={[16, 16]} style={{ marginBottom: 22 }}>
              {toggle('company', <BankOutlined />, '企业查询', '工商 · 司法 · 经营风险 · 失信记录')}
              {toggle('personal', <UserOutlined />, '个人查询', '实名核验 · 失信被执行 · 涉诉记录')}
            </Row>

            <Card title="查询信息">
              {queryType === 'company' ? (
                <>
                  <div style={{ marginBottom: 18 }}>
                    <div style={{ fontWeight: 600, marginBottom: 8 }}>企业名称 <span style={{ color: '#e34d59' }}>*</span></div>
                    <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} size="large" placeholder="请输入完整企业名称" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, marginBottom: 8 }}>统一社会信用代码（选填）</div>
                    <Input value={creditCode} onChange={(e) => setCreditCode(e.target.value)} size="large" placeholder="如填写可提升匹配精度" />
                  </div>
                </>
              ) : (
                <>
                  <div style={{ marginBottom: 18 }}>
                    <div style={{ fontWeight: 600, marginBottom: 8 }}>姓名 <span style={{ color: '#e34d59' }}>*</span></div>
                    <Input value={personName} onChange={(e) => setPersonName(e.target.value)} size="large" placeholder="请输入被查询人姓名" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, marginBottom: 8 }}>身份证号 <span style={{ color: '#e34d59' }}>*</span></div>
                    <Input value={idNo} onChange={(e) => setIdNo(e.target.value)} size="large" placeholder="请输入 18 位身份证号" />
                  </div>
                </>
              )}
              <div style={{ marginTop: 16, color: '#8a93a0', fontSize: 13 }}>
                <SafetyOutlined /> 查询仅用于合法合规用途，请确保已获得相应授权。
              </div>
            </Card>

            <StepNav onNext={query} nextText="开始查询" loading={loading} nextIcon={<SearchOutlined />} nextDisabled={!canSubmit} />
            {loading && (
              <div style={{ textAlign: 'center', marginTop: 24, color: '#8a93a0' }}>
                <Spin /> <span style={{ marginLeft: 8 }}>正在聚合工商、司法与信用数据…</span>
              </div>
            )}
          </>
        )}

        {current === 1 && (
          <>
            <Card>
              <Result
                icon={<FileProtectOutlined style={{ color: '#2ba471' }} />}
                title="风险信用报告已生成"
                subTitle={`${result.title} · ${result.typeLabel}`}
                style={{ padding: '8px 0 0' }}
              />
              <div style={{
                margin: '8px auto 0', maxWidth: 460, display: 'flex', alignItems: 'center', gap: 16,
                border: '1px solid #eef1f6', borderRadius: 14, padding: '18px 20px', background: '#fafbfe',
              }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 12, flex: '0 0 52px', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', fontSize: 28, color: '#fff',
                  background: 'linear-gradient(135deg,#e8504a,#ff7a45)',
                }}>
                  <FilePdfOutlined />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700 }}>{fileName}</div>
                  <div style={{ color: '#8a93a0', fontSize: 12.5, marginTop: 2 }}>
                    生成时间：{genTime}
                  </div>
                </div>
              </div>
              <div style={{ textAlign: 'center', marginTop: 22, display: 'flex', gap: 12, justifyContent: 'center' }}>
                <Button size="large" icon={<EyeOutlined />} loading={pdfLoading} onClick={previewPdf}>预览报告</Button>
                <Button type="primary" size="large" icon={<DownloadOutlined />} loading={pdfLoading} onClick={downloadPdf}>下载报告</Button>
              </div>
              <div style={{ textAlign: 'center', marginTop: 10, color: '#9aa3b0', fontSize: 12 }}>
                预览将在新标签页打开 PDF
              </div>
            </Card>

            <StepNav onPrev={() => setCurrent(0)} prevText="重新查询" />
          </>
        )}
      </StepFlow>

      {/* 离屏渲染：作为 PDF 生成源 */}
      <div style={{ position: 'fixed', left: -10000, top: 0, width: 760, background: '#fff', pointerEvents: 'none' }} aria-hidden>
        <div ref={reportRef}>
          <ReportDoc result={result} reportNo={reportNo} genTime={genTime} />
        </div>
      </div>
    </div>
  );
}
