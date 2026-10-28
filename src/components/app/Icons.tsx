// One outline set, 16px, 1.5px stroke.
const P = {
  width: 16,
  height: 16,
  viewBox: "0 0 16 16",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export const Icon = {
  today: () => (
    <svg {...P}>
      <rect x="2" y="3" width="12" height="11" rx="2" />
      <path d="M2 6.5h12M5.5 1.5v3M10.5 1.5v3" />
    </svg>
  ),
  review: () => (
    <svg {...P}>
      <path d="M3 5.5h8.5a2 2 0 0 1 2 2V13a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" />
      <path d="M5 5.5V3.5a1 1 0 0 1 1-1h3l1 1.5" />
    </svg>
  ),
  path: () => (
    <svg {...P}>
      <circle cx="4" cy="12" r="1.75" />
      <circle cx="12" cy="4" r="1.75" />
      <path d="M5.75 12H10a2 2 0 0 0 0-4H6a2 2 0 0 1 0-4h4.25" />
    </svg>
  ),
  lesson: () => (
    <svg {...P}>
      <path d="M2 3.5c2-.8 4-.8 6 .5 2-1.3 4-1.3 6-.5V13c-2-.8-4-.8-6 .5-2-1.3-4-1.3-6-.5z" />
      <path d="M8 4v9.5" />
    </svg>
  ),
  certificate: () => (
    <svg {...P}>
      <circle cx="8" cy="6" r="4" />
      <path d="M5.5 9.2 4.5 14.5 8 12.8l3.5 1.7-1-5.3" />
    </svg>
  ),
  settings: () => (
    <svg {...P}>
      <circle cx="8" cy="8" r="2" />
      <path d="M8 1.5v2M8 12.5v2M1.5 8h2M12.5 8h2M3.4 3.4l1.4 1.4M11.2 11.2l1.4 1.4M3.4 12.6l1.4-1.4M11.2 4.8l1.4-1.4" />
    </svg>
  ),
  edit: () => (
    <svg {...P}>
      <path d="M10.5 2.5 13.5 5.5 6 13H3v-3z" />
    </svg>
  ),
  list: () => (
    <svg {...P}>
      <path d="M5.5 4h8M5.5 8h8M5.5 12h8" />
      <circle cx="2.5" cy="4" r=".5" />
      <circle cx="2.5" cy="8" r=".5" />
      <circle cx="2.5" cy="12" r=".5" />
    </svg>
  ),
  deck: () => (
    <svg {...P}>
      <rect x="2" y="5" width="10" height="9" rx="1.5" />
      <path d="M4.5 2.5H13a1 1 0 0 1 1 1V11" />
    </svg>
  ),
  image: () => (
    <svg {...P}>
      <rect x="2" y="2.5" width="12" height="11" rx="1.5" />
      <circle cx="6" cy="6.5" r="1.25" />
      <path d="m2.5 12 3.5-3.5 3 3 2-2 2.5 2.5" />
    </svg>
  ),
  audio: () => (
    <svg {...P}>
      <path d="M2.5 6.5h2.5L8.5 3.5v9L5 9.5H2.5z" />
      <path d="M11 5.8a3 3 0 0 1 0 4.4M12.8 4a5.5 5.5 0 0 1 0 8" />
    </svg>
  ),
  back: () => (
    <svg {...P}>
      <path d="M10 3 5 8l5 5" />
    </svg>
  ),
  menu: () => (
    <svg {...P} width={20} height={20}>
      <path d="M2.5 4.5h11M2.5 8h11M2.5 11.5h11" />
    </svg>
  ),
  close: () => (
    <svg {...P} width={20} height={20}>
      <path d="m3.5 3.5 9 9M12.5 3.5l-9 9" />
    </svg>
  ),
  check: () => (
    <svg {...P} width={12} height={12}>
      <path d="m3 8.5 3 3 7-7" strokeWidth={2} />
    </svg>
  ),
  lock: () => (
    <svg {...P}>
      <rect x="3" y="7" width="10" height="7" rx="1.5" />
      <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" />
    </svg>
  ),
  upload: () => (
    <svg {...P}>
      <path d="M8 10.5V2.5M5 5.5l3-3 3 3M2.5 10.5v2a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1v-2" />
    </svg>
  ),
  download: () => (
    <svg {...P}>
      <path d="M8 2.5v8M5 7.5l3 3 3-3M2.5 10.5v2a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1v-2" />
    </svg>
  ),
  plus: () => (
    <svg {...P}>
      <path d="M8 3v10M3 8h10" />
    </svg>
  ),
  arrow: () => (
    <svg {...P}>
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  ),
};
