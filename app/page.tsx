import Image from "next/image";

export default function Home() {
  return (
    <div className="">
      {/* Welcome Header */}
      <header className="my-5">
        <h1 className="text-4xl">Welcome</h1>
        <h4 className="text-sm">"Join Canada's premier rodeo community."</h4>
        <h1 className="text-3xl">Canadian Classic Rodeo Association</h1>
      </header>

      {/* Upcoming Events */}
      <div className="my-5">
        <h2 className="text-2xl">Upcoming Events</h2>
        <div>
          <div>
            <h3 className="text-xl">Calgary Bullriding</h3>
            <p>June 5-10, 2026</p>
            <p>Calgary, AB</p>
            <button className="text-lg">Details</button>
          </div>
        </div>
      </div>

      {/* Why Join the CCRA */}
      <div className="my-5">
        <h2 className="text-2xl">Why Join the CCRA?</h2>
        <div>
          <h3 className="text-xl">Membership Benefits</h3>
          <p>Access exclusive perks and member resources</p>
        </div>
      </div>

      {/* Sponsors */}
      <div className="my-5">
        <h2 className="text-2xl">Our Sponsors</h2>
        <div>
          <p>Sponsor Image</p>
        </div>
        <h2 className="text-2xl mt-3">Become a Sponsor</h2>
        <p>Support Canadian rodeos and promote your brand</p>
        <button className="text-xl">Become a Sponsor</button>
      </div>
    </div>
  );
}
