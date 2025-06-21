import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="flex flex-col items-center justify-center m-10">
        <h1 className="text-5xl m-10"> 
          WebSockets Playground
        </h1>
        <Link href={'/chat'}>Realtime Chat</Link>
      </div>
    </>
  );
}
