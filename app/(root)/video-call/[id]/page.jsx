import VideoCallInterface from "@/components/VideoCallInterface";

export default async function VideoCallPage({ params: { id } }) {
  return (
    <div className="min-h-screen bg-gray-100 fixed top-0 w-full">
      <VideoCallInterface callId={id} />
    </div>
  );
}
