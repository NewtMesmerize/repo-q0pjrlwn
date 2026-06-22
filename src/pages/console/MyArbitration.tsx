import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import ArbCasesView from '../../components/ArbCasesView';

export default function MyArbitration() {
  const navigate = useNavigate();
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
        <div className="zf-section-title" style={{ flex: 1 }}>我的仲裁</div>
        <Button type="primary" onClick={() => navigate('/arbitration/filing')}>+ 在线立案</Button>
      </div>
      <ArbCasesView embedded />
    </div>
  );
}
