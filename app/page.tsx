"use client";

import Image from "next/image";
import Carousel from "@/components/carousel";

// Events
interface Event {
  image: string;
  title: string;
  dates: string;
  location: string;
}

const events: Event[] = [
  {
    image: "/bullriding.jpg",
    title: "Calgary Bullriding",
    dates: "June 5-10, 2026",
    location: "Calgary, AB",
  },
  {
    image: "/bullriding.jpg",
    title: "Calgary Bullriding",
    dates: "June 10-15, 2026",
    location: "Calgary, AB",
  },
  {
    image: "/bullriding.jpg",
    title: "Calgary Bullriding",
    dates: "June 15-20, 2026",
    location: "Calgary, AB",
  },
  {
    image: "/bullriding.jpg",
    title: "Calgary Bullriding",
    dates: "June 20-25, 2026",
    location: "Calgary, AB",
  },
  {
    image: "/bullriding.jpg",
    title: "Calgary Bullriding",
    dates: "June 25-30, 2026",
    location: "Calgary, AB",
  },
];

// Sponsors
interface Sponsor {
  image: string;
  title: string;
}

const sponsors: Sponsor[] = [{ image: "/bullriding.jpg", title: "Sponsor" }];

export default function Home() {
  return (
    <div className="bg-orange-50">
      {/* Welcome Header */}
      <header className="m-5 p-3 rounded-xl bg-orange-200">
        <h1 className="pl-3 text-4xl font-bold">Welcome</h1>
        <h4 className="text-sm">"Join Canada's premier rodeo community."</h4>
        <h1 className="pt-3 pl-3 text-3xl font-bold">
          Canadian Classic Rodeo Association
        </h1>
      </header>

      {/* Upcoming Events */}
      <div className="m-5 pb-5">
        <h2 className="pb-2 text-2xl font-bold">Upcoming Events</h2>
        <Carousel
          items={events}
          visibleCount={3}
          renderSlide={(event) => (
            <div className="flex flex-col items-center mx-2 p-2 border rounded bg-orange-200">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-64 object-cover"
              />
              <h3 className="my-2 text-xl font-bold">{event.title}</h3>
              <p className="text-sm">{event.dates}</p>
              <p className="text-sm">{event.location}</p>
              <div className="my-5">
                <button className="px-5 py-1 text-white text-lg rounded bg-orange-400">
                  Details
                </button>
              </div>
            </div>
          )}
        />
      </div>

      {/* Why Join the CCRA */}
      <div className="m-5 pb-5">
        <h2 className="text-2xl font-bold">Why Join the CCRA?</h2>
        <div className="ml-3">
          <h3 className="text-xl">Membership Benefits</h3>
          <p>Access exclusive perks and member resources</p>
        </div>
      </div>

      {/* Sponsors */}
      <div className="m-5 pb-5">
        <h2 className="text-2xl font-bold">Our Sponsors</h2>
        <Carousel
          items={sponsors}
          visibleCount={3}
          renderSlide={(sponsor) => (
            <div className="flex flex-col items-center p-2 mx-4 border rounded bg-orange-200">
              <img
                src={sponsor.image}
                alt={sponsor.title}
                className="w-full h-64 object-cover"
              />
              <h3 className="text-xl">{sponsor.title}</h3>
            </div>
          )}
        />
        <h2 className="mt-3 text-2xl font-bold">Become a Sponsor</h2>
        <div className="ml-3">
          <p>Support Canadian rodeos and promote your brand</p>
          <button className="m-2 px-3 text-xl font-bold border rounded">
            Become a Sponsor
          </button>
        </div>
      </div>
    </div>
  );
}
