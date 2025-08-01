import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-items-center justify-center w-full min-h-[calc(100vh-5rem)] p-8 pb-20">
        <p className="text-6xl font-bold m-4">SubTrackr</p>
        <p>All-in-one hub to track, manage, and optimize your subscriptions.</p>
        <p>Get smart reminders, spending insights, and control over recurring bills.</p>
        <button className="px-5 py-2 bg-amber-200 rounded-4xl text-black m-3 font-semibold">Login</button>
    </div>
  );
}
