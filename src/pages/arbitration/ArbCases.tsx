import { Card } from 'antd';
import SecondaryNav, { arbNavItems } from '../../components/SecondaryNav';
import ArbCasesView from '../../components/ArbCasesView';

export default function ArbCases() {
  return (
    <>
      <SecondaryNav title="在线仲裁" items={arbNavItems} />
      <div className="zf-container" style={{ padding: '32px 24px 48px' }}>
        <div className="zf-section-title" style={{ marginBottom: 20 }}>我的仲裁</div>
        <Card>
          <ArbCasesView />
        </Card>
      </div>
    </>
  );
}
