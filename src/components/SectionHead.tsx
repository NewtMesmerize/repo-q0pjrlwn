interface SectionHeadProps {
  kicker?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
  style?: React.CSSProperties;
}

export default function SectionHead({ kicker, title, subtitle, center, style }: SectionHeadProps) {
  return (
    <div className={center ? 'zf-center' : ''} style={style}>
      {kicker && <span className="zf-kicker">{kicker}</span>}
      <h2 className="zf-heading">{title}</h2>
      {subtitle && <p className="zf-subheading">{subtitle}</p>}
    </div>
  );
}
