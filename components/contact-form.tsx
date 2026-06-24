"use client";

import { useState } from "react";
import { CheckCircle2, Send } from "lucide-react";

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
      }}
      className="rounded-md border border-stone-200 bg-white p-6 shadow-sm sm:p-8"
    >
      <h2 className="text-2xl font-semibold text-stone-950">Send a message</h2>
      <p className="mt-2 text-sm leading-6 text-stone-600">
        This prototype stores no messages yet, but the workflow is ready for a backend integration.
      </p>

      <div className="mt-6 grid gap-4">
        <div className="grid gap-2">
          <label htmlFor="name" className="text-sm font-semibold text-stone-700">
            Name
          </label>
          <input
            id="name"
            name="name"
            required
            className="h-12 rounded-md border border-stone-300 px-3 outline-none transition focus:border-orange-500"
          />
        </div>
        <div className="grid gap-2">
          <label htmlFor="email" className="text-sm font-semibold text-stone-700">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="h-12 rounded-md border border-stone-300 px-3 outline-none transition focus:border-orange-500"
          />
        </div>
        <div className="grid gap-2">
          <label htmlFor="topic" className="text-sm font-semibold text-stone-700">
            Topic
          </label>
          <select
            id="topic"
            name="topic"
            className="h-12 rounded-md border border-stone-300 bg-white px-3 outline-none transition focus:border-orange-500"
          >
            <option>Membership</option>
            <option>Event entries</option>
            <option>Sponsorship</option>
            <option>Results correction</option>
            <option>General question</option>
          </select>
        </div>
        <div className="grid gap-2">
          <label htmlFor="message" className="text-sm font-semibold text-stone-700">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            required
            className="rounded-md border border-stone-300 px-3 py-3 outline-none transition focus:border-orange-500"
          />
        </div>
      </div>

      {submitted && (
        <p className="mt-5 flex items-start gap-2 rounded-md bg-green-50 px-4 py-3 text-sm text-green-800">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          Message captured for this session. Connect a mail service or Firestore collection to persist it.
        </p>
      )}

      <button
        type="submit"
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-700"
      >
        <Send className="h-4 w-4" />
        Send message
      </button>
    </form>
  );
}
