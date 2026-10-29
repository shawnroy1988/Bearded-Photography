# Bearded Photography website

Static site (HTML/CSS/JS, no build step) hosted on GitHub Pages:
https://shawnroy1988.github.io/Bearded-Photography/

## Owner setup (edit `config.js`)
1. **Booking/contact delivery:** create a free form at [Formspree](https://formspree.io) (or Web3Forms/Getform), then paste the endpoint into `formEndpoint`. Until then, submissions open the visitor's email app (mailto) addressed to `email`.
2. **email:** your business email.
3. **schedulerUrl (optional):** a Calendly or Cal.com link; it gets embedded under the booking form for real-time availability.
4. **availability / sessions / blockedDates:** your real hours, session lengths and prices (current values are placeholders).
5. **social:** Instagram/Facebook/X URLs (empty links are hidden).

Note: the built-in booking form sends *requests*. It can't see your real calendar, so confirm each one by email (or use the Calendly/Cal.com embed for live slots).

## Placeholders to replace in `index.html` / `privacy.html`
Search for `[` ... `TBD]` / `[Your ... here]`: prices, session lengths, image counts, bio, service area, phone, testimonials, FAQ policies (deposit, turnaround, reschedule, response time).

## Images
`images/` holds web versions (max 2000px, JPG + WebP, metadata/GPS stripped); `images/thumbs/` holds 700px thumbnails. To add a photo, export both sizes and add an entry to the `photos` list in `script.js`.
