import VideoCallInterface from "@/components/VideoCallInterface";

export default async function VideoCallPage({ params: { id } }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <VideoCallInterface callId={id} />
    </div>
  );
}
