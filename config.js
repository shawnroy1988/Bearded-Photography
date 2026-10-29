/* ===== Bearded Photography: OWNER SETTINGS (edit me) ===== */
window.SITE_CONFIG = {
  // Form delivery via FormSubmit (no signup). The FIRST submission triggers an activation email to the address below; click it once.
  // Alternatively use a Formspree endpoint. create a free form at https://formspree.io (or Web3Forms/Getform) and paste its endpoint.
  // e.g. "https://formspree.io/f/abcdwxyz". If left blank, the site falls back to opening the visitor's email app (mailto).
  formEndpoint: "https://formsubmit.co/ajax/Shawroy1988@gmail.com",
  // Your business email (used for mailto fallback and the Contact section).
  email: "Shawroy1988@gmail.com",                       // e.g. "hello@beardedphotography.com"
  // Optional live scheduler (Calendly or Cal.com link). If set, it's embedded under the booking form.
  schedulerUrl: "",                // e.g. "https://calendly.com/yourname/session" or "https://cal.com/yourname"
  social: { instagram: "", facebook: "", x: "" },
  // Sessions shown in the booking picker. Durations/prices are PLACEHOLDERS.
  sessions: [
    { name: "Portrait Session", duration: 30, price: "$50 · 5 edited photos" },
    { name: "Family & Kids Session", duration: 30, price: "$50 · 5 edited photos" },
    { name: "Pet Portrait Session", duration: 30, price: "$50 · 5 edited photos" },
    { name: "Nature Session", duration: 30, price: "$50 · 5 edited photos" }
  ],
  // Availability: days 0=Sun..6=Sat -> list of start times (24h). PLACEHOLDER hours, adjust to yours.
  availability: {
    0: ["10:00", "10:30", "11:00", "14:00", "14:30", "15:00", "16:00", "16:30"],
    3: ["16:00", "16:30", "17:00", "17:30"],
    5: ["16:00", "16:30", "17:00", "17:30"],
    6: ["09:00", "09:30", "10:00", "10:30", "14:00", "14:30", "15:00", "16:00", "16:30"]
  },
  minNoticeDays: 2,     // earliest bookable day from today
  maxDaysAhead: 90,     // how far ahead clients can book
  blockedDates: []      // e.g. ["2026-12-25"]
};
