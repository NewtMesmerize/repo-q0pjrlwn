import { Steps, Button } from 'antd';
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import type { ReactNode } from 'react';

interface StepDef {
  title: string;
  description?: string;
}

export default function StepFlow({
  title,
  subtitle,
  steps,
  current,
  bodyWidth = 860,
  children,
}: {
  title: string;
  subtitle?: string;
  steps: StepDef[];
  current: number;
  bodyWidth?: number;
  children: ReactNode;
}) {
  return (
    <div style={{ padding: 28 }}>
      <div className="zf-section-title" style={{ marginBottom: 6 }}>{title}</div>
      {subtitle && <p style={{ color: '#8a93a0', marginBottom: 24 }}>{subtitle}</p>}
      <Steps current={current} items={steps} style={{ maxWidth: 760, margin: '0 auto 32px' }} />
      <div style={{ maxWidth: bodyWidth, margin: '0 auto' }}>{children}</div>
    </div>
  );
}

export function StepNav({
  onPrev,
  onNext,
  nextText = '下一步',
  prevText = '上一步',
  nextIcon,
  loading,
  nextDisabled,
}: {
  onPrev?: () => void;
  onNext?: () => void;
  nextText?: string;
  prevText?: string;
  nextIcon?: ReactNode;
  loading?: boolean;
  nextDisabled?: boolean;
}) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
      <div>
        {onPrev && (
          <Button size="large" icon={<ArrowLeftOutlined />} onClick={onPrev}>
            {prevText}
          </Button>
        )}
      </div>
      <div>
        {onNext && (
          <Button
            type="primary"
            size="large"
            loading={loading}
            disabled={nextDisabled}
            onClick={onNext}
            icon={nextIcon ?? <ArrowRightOutlined />}
            iconPosition="end"
          >
            {nextText}
          </Button>
        )}
      </div>
    </div>
  );
}
