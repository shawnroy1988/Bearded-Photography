/* ===== Bearded Photography: OWNER SETTINGS (edit me) ===== */
window.SITE_CONFIG = {
  // Form delivery: create a free form at https://formspree.io (or Web3Forms/Getform) and paste its endpoint.
  // e.g. "https://formspree.io/f/abcdwxyz". If left blank, the site falls back to opening the visitor's email app (mailto).
  formEndpoint: "",
  // Your business email (used for mailto fallback and the Contact section).
  email: "",                       // e.g. "hello@beardedphotography.com"
  // Optional live scheduler (Calendly or Cal.com link). If set, it's embedded under the booking form.
  schedulerUrl: "",                // e.g. "https://calendly.com/yourname/session" or "https://cal.com/yourname"
  social: { instagram: "", facebook: "", x: "" },
  // Sessions shown in the booking picker. Durations/prices are PLACEHOLDERS.
  sessions: [
    { name: "Portrait Session", duration: 60, price: "[$ TBD]" },
    { name: "Family & Kids Session", duration: 60, price: "[$ TBD]" },
    { name: "Pet Portrait Session", duration: 45, price: "[$ TBD]" },
    { name: "Mini Session", duration: 30, price: "[$ TBD]" }
  ],
  // Availability: days 0=Sun..6=Sat -> list of start times (24h). PLACEHOLDER hours, adjust to yours.
  availability: {
    0: ["10:00", "14:00", "16:30"],
    3: ["16:00", "17:30"],
    5: ["16:00", "17:30"],
    6: ["09:00", "10:30", "14:00", "16:30"]
  },
  minNoticeDays: 2,     // earliest bookable day from today
  maxDaysAhead: 90,     // how far ahead clients can book
  blockedDates: []      // e.g. ["2026-12-25"]
};
