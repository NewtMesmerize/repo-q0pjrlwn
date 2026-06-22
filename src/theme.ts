import type { ThemeConfig } from 'antd';

export const PRIMARY = '#2f6bff';
export const PRIMARY_DEEP = '#1a44c9';
export const ACCENT = '#12b8a6';
export const GOLD = '#f6a609';

// Reusable gradient strings
export const GRAD_PRIMARY = 'linear-gradient(135deg,#2f6bff 0%,#5b8cff 55%,#12b8a6 140%)';
export const GRAD_DARK = 'linear-gradient(135deg,#0e1b3d 0%,#16275c 50%,#1f3a8a 100%)';

const theme: ThemeConfig = {
  token: {
    colorPrimary: PRIMARY,
    colorInfo: PRIMARY,
    colorSuccess: '#16b364',
    colorWarning: GOLD,
    colorError: '#f5483b',
    borderRadius: 10,
    fontSize: 14,
    colorTextBase: '#10182b',
    colorTextSecondary: '#5b6577',
    lineHeight: 1.65,
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', Roboto, sans-serif",
    boxShadow: '0 6px 20px rgba(16,24,43,0.06)',
    boxShadowSecondary: '0 10px 30px rgba(16,24,43,0.10)',
  },
  components: {
    Layout: {
      headerBg: 'rgba(255,255,255,0.85)',
      headerHeight: 68,
      bodyBg: '#f4f6fb',
      footerBg: '#0b1430',
    },
    Menu: {
      itemSelectedBg: 'transparent',
      itemSelectedColor: PRIMARY,
      horizontalItemSelectedColor: PRIMARY,
      itemHoverColor: PRIMARY,
      fontSize: 15,
    },
    Card: {
      borderRadiusLG: 16,
      paddingLG: 24,
    },
    Button: {
      borderRadius: 10,
      controlHeight: 38,
      controlHeightLG: 46,
      fontWeight: 600,
      primaryShadow: '0 8px 18px rgba(47,107,255,0.28)',
    },
    Input: { controlHeight: 40, borderRadius: 10 },
    Select: { controlHeight: 40, borderRadius: 10 },
    Tag: { borderRadiusSM: 6 },
    Steps: { iconSize: 34 },
    Table: { borderRadiusLG: 14, headerBg: '#f4f7ff', headerColor: '#39435a' },
  },
};

export default theme;
