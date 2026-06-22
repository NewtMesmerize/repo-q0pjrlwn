import ChatPanel from '../../components/ChatPanel';

export default function ArbitrationConsultTool() {
  return (
    <ChatPanel
      title="仲裁咨询"
      greeting="您好！我是仲裁咨询助理，可为您解答仲裁条件、流程、费用及材料准备等问题。"
      suggestions={[
        '我的合同纠纷能申请仲裁吗？',
        '在线仲裁的流程是怎样的？',
        '申请仲裁需要交哪些费用？',
        '仲裁裁决后对方不履行怎么办？',
      ]}
      tags={['仲裁条件', '仲裁流程', '仲裁费用', '强制执行']}
    />
  );
}
