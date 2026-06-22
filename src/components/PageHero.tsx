import type { ReactNode } from 'react';
import { Button } from 'antd';
import { ArrowRightOutlined, ThunderboltOutlined } from '@ant-design/icons';

interface HeroStat {
  num: string;
  label: string;
}

interface PageHeroProps {
  chip?: string;
  title: ReactNode;
  subtitle?: string;
  ctaText?: string;
  onCta?: () => void;
  stats?: HeroStat[];
  compact?: boolean;
}

export default function PageHero({ chip, title, subtitle, ctaText, onCta, stats, compact }: PageHeroProps) {
  return (
    <section className="zf-hero" style={{ padding: compact ? '56px 0 64px' : '76px 0 84px' }}>
      <div className="zf-grid-mask" />
      <div className="zf-blob" style={{ width: 340, height: 340, background: '#2f6bff', top: -90, right: -40 }} />
      <div className="zf-blob" style={{ width: 240, height: 240, background: '#12b8a6', bottom: -120, left: '30%' }} />
      <div className="zf-container" style={{ position: 'relative' }}>
        <div className="zf-fade-up" style={{ maxWidth: 760 }}>
          {chip && (
            <span className="zf-chip-solid" style={{ marginBottom: 18 }}>
              <ThunderboltOutlined /> {chip}
            </span>
          )}
          <h1 style={{ color: 'var(--zf-hero-ink)', fontSize: compact ? 38 : 44, lineHeight: 1.2, fontWeight: 800, margin: '14px 0 0', letterSpacing: '-0.8px' }}>
            {title}
          </h1>
          {subtitle && (
            <p style={{ color: 'var(--zf-hero-sub)', fontSize: 17, margin: '20px 0 0', maxWidth: 640 }}>
              {subtitle}
            </p>
          )}
          {ctaText && (
            <Button type="primary" size="large" onClick={onCta} style={{ marginTop: 30, height: 48, paddingInline: 26, fontSize: 16 }}>
              {ctaText} <ArrowRightOutlined />
            </Button>
          )}
        </div>
        {stats && (
          <div style={{ display: 'flex', gap: 48, marginTop: 44, flexWrap: 'wrap' }} className="zf-fade-up zf-d2">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="zf-stat-num" style={{ background: 'linear-gradient(90deg,#2f6bff,#12b8a6)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{s.num}</div>
                <div style={{ color: 'var(--zf-hero-sub)', marginTop: 8, fontSize: 14 }}>{s.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
