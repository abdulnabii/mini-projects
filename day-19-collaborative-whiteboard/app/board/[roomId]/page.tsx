import BoardClient from '@/components/BoardClient';

interface Props {
  params: Promise<{ roomId: string }>;
}

export default async function BoardPage({ params }: Props) {
  const { roomId } = await params;

  return <BoardClient roomId={roomId} />;
}

export async function generateMetadata({ params }: Props) {
  const { roomId } = await params;
  return {
    title: `Board: ${roomId} — CanvasFlow.AI`,
    description: 'Real-time collaborative infinite canvas whiteboard with AI diagram generation.',
  };
}
