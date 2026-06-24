export type EventItem = {
  id: string;
  title: string;
  date: string;
  rawDate?: string;
  rawTime?: string;
  location: string;
  image: string;
  description: string;
  category?: string;
  entriesOpen?: boolean;
};

export type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
};

export const publicNavItems = [
  { label: "Events", href: "/events" },
  { label: "Schedule", href: "/schedule" },
  { label: "Membership", href: "/membership" },
  { label: "Products", href: "/products" },
  { label: "Results", href: "/results" },
  { label: "Contact", href: "/contact" },
];

export const memberNavItems = [
  { label: "Profile", href: "/navigation/profile" },
  { label: "Membership", href: "/membership" },
  { label: "Orders", href: "/orders" },
  { label: "Settings", href: "/setting" },
];

export const demoEvents: EventItem[] = [
  {
    id: "rocky-mountain-classic",
    title: "Rocky Mountain Classic",
    date: "Saturday, June 6, 2026 at 6:30 PM",
    rawDate: "2026-06-06",
    rawTime: "18:30",
    location: "Calgary, AB",
    image: "/hero-rodeo.webp",
    category: "Rodeo",
    entriesOpen: true,
    description:
      "A full evening rodeo program with timed events, rough stock, member check-in, and family seating.",
  },
  {
    id: "prairie-summer-series",
    title: "Prairie Summer Series",
    date: "Friday, July 17, 2026 at 5:00 PM",
    rawDate: "2026-07-17",
    rawTime: "17:00",
    location: "Red Deer, AB",
    image: "/bullriding.webp",
    category: "Series",
    entriesOpen: true,
    description:
      "A member points event with youth, open, and senior divisions across the weekend.",
  },
  {
    id: "heritage-finals",
    title: "Heritage Finals",
    date: "Saturday, September 12, 2026 at 7:00 PM",
    rawDate: "2026-09-12",
    rawTime: "19:00",
    location: "Lethbridge, AB",
    image: "/hero-rodeo.webp",
    category: "Finals",
    entriesOpen: false,
    description:
      "Season finals featuring top qualifiers, awards presentations, and sponsor recognition.",
  },
];

export const membershipTiers = [
  {
    name: "Junior",
    price: 45,
    description: "For young competitors and families starting in CCRA programs.",
    features: ["Eligible for youth events", "Member profile", "Season updates"],
  },
  {
    name: "Competitor",
    price: 95,
    description: "For active rodeo competitors entering sanctioned events.",
    features: ["Event entry access", "Points tracking", "Member resources"],
  },
  {
    name: "Family",
    price: 150,
    description: "One membership package for households supporting multiple riders.",
    features: ["Multiple profiles", "Family event updates", "Sponsor offers"],
  },
];

export const products: Product[] = [
  {
    id: "ccra-cap",
    name: "CCRA Cap",
    price: 32,
    category: "Apparel",
    image: "/hero-rodeo.webp",
    description: "Structured cotton cap with embroidered CCRA mark.",
  },
  {
    id: "event-hoodie",
    name: "Event Hoodie",
    price: 72,
    category: "Apparel",
    image: "/bullriding.webp",
    description: "Warm fleece hoodie for cool arena evenings.",
  },
  {
    id: "member-decal",
    name: "Member Decal Pack",
    price: 12,
    category: "Accessories",
    image: "/hero-rodeo.webp",
    description: "Weather-resistant decals for trailers, gear cases, and laptops.",
  },
  {
    id: "rulebook-print",
    name: "Printed Rulebook",
    price: 18,
    category: "Resources",
    image: "/bullriding.webp",
    description: "A compact printed copy of the current CCRA rulebook.",
  },
];

export const directors = [
  { name: "Morgan Ellis", role: "President", focus: "Association strategy and member representation" },
  { name: "Riley Thompson", role: "Vice President", focus: "Event operations and volunteer support" },
  { name: "Avery Collins", role: "Treasurer", focus: "Budgets, sponsorships, and reporting" },
  { name: "Jordan Lee", role: "Secretary", focus: "Minutes, policy updates, and member communication" },
  { name: "Casey Brooks", role: "Director at Large", focus: "Competitor feedback and youth programs" },
  { name: "Taylor Grant", role: "Director at Large", focus: "Results, rankings, and finals qualification" },
];

export const results = [
  {
    event: "Rocky Mountain Classic",
    division: "Open Barrel Racing",
    winner: "Avery Collins",
    score: "15.42 sec",
  },
  {
    event: "Rocky Mountain Classic",
    division: "Team Roping",
    winner: "M. Ellis / J. Lee",
    score: "6.88 sec",
  },
  {
    event: "Prairie Summer Series",
    division: "Saddle Bronc",
    winner: "Riley Thompson",
    score: "82 pts",
  },
  {
    event: "Heritage Finals",
    division: "Bull Riding",
    winner: "Casey Brooks",
    score: "86 pts",
  },
];

export const galleryImages = [
  {
    title: "Arena lights",
    image: "/hero-rodeo.webp",
    caption: "Evening performance at the main arena.",
  },
  {
    title: "Chute prep",
    image: "/bullriding.webp",
    caption: "Competitors and stock contractors preparing for the next ride.",
  },
  {
    title: "Finals night",
    image: "/hero-rodeo.webp",
    caption: "Members gathering for awards and sponsor recognition.",
  },
  {
    title: "Member community",
    image: "/bullriding.webp",
    caption: "Families, volunteers, and riders keeping the season moving.",
  },
];

export const rulebookSections = [
  {
    title: "Membership",
    points: [
      "Members must keep contact information current before entering events.",
      "Competitors are responsible for understanding class eligibility.",
      "Membership cards or digital profiles may be checked at event registration.",
    ],
  },
  {
    title: "Event Entries",
    points: [
      "Entries must be submitted before the posted deadline.",
      "Late entries may be accepted at the discretion of event administration.",
      "Draw changes are handled by the event office before competition begins.",
    ],
  },
  {
    title: "Arena Conduct",
    points: [
      "Respect officials, volunteers, livestock, and other competitors.",
      "Unsafe conduct may result in removal from an event.",
      "Judges' decisions are final unless a formal review process is announced.",
    ],
  },
  {
    title: "Points and Results",
    points: [
      "Results are posted after verification by the event office.",
      "Season standings are calculated from sanctioned events.",
      "Corrections should be reported promptly with supporting information.",
    ],
  },
];

export const scheduleRows = [
  { date: "June 6, 2026", time: "6:30 PM", event: "Rocky Mountain Classic", location: "Calgary, AB" },
  { date: "July 17, 2026", time: "5:00 PM", event: "Prairie Summer Series", location: "Red Deer, AB" },
  { date: "August 8, 2026", time: "10:00 AM", event: "Youth Skills Clinic", location: "Airdrie, AB" },
  { date: "September 12, 2026", time: "7:00 PM", event: "Heritage Finals", location: "Lethbridge, AB" },
];

export const sponsorNames = ["Range West", "Prairie Feed", "High River Tack", "Stampede Supply", "ArenaPro"];
