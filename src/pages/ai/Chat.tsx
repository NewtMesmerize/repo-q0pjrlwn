import ChatPanel from '../../components/ChatPanel';
import { hotQuestions } from '../../mock/data';

export default function Chat() {
  return (
    <ChatPanel
      title="智能咨询"
      greeting="您好！我是中枫法务助理，请问有什么法律问题需要帮助？"
      suggestions={hotQuestions}
      tags={['合同纠纷', '劳动争议', '债务催收', '知识产权']}
    />
  );
}
