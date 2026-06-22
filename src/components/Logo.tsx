import lockup from '../assets/logo-lockup.png';

export default function Logo({ dark = false }: { dark?: boolean }) {
  const img = (
    <img
      src={lockup}
      alt="中枫仲调 · Z.F Arbitration Mediation"
      style={{ height: 44, width: 'auto', display: 'block', objectFit: 'contain' }}
    />
  );

  // 页脚为深色底，给 logo 垫一个浅色圆角底以保证清晰
  if (dark) {
    return (
      <div
        style={{
          display: 'inline-flex',
          background: '#fff',
          borderRadius: 12,
          padding: '8px 14px',
          boxShadow: '0 6px 16px rgba(0,0,0,0.18)',
        }}
      >
        {img}
      </div>
    );
  }
  return img;
}
