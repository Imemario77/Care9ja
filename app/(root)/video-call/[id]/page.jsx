import VideoCallInterface from "@/components/VideoCallInterface";

export default function VideoCallPage({ params: { id } }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <VideoCallInterface callId={id} />
    </div>
  );
}
