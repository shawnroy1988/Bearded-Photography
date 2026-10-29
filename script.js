(() => {
  const C = window.SITE_CONFIG || {};
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  $('#yr').textContent = new Date().getFullYear();

  /* Nav */
  const mb = $('.menu-btn'), menu = $('#menu');
  mb.addEventListener('click', () => { const o = menu.classList.toggle('open'); mb.setAttribute('aria-expanded', o); });
  $$('#menu a').forEach(a => a.addEventListener('click', () => { menu.classList.remove('open'); mb.setAttribute('aria-expanded', false); }));

  /* Contact info & socials */
  if (C.email) $$('.js-email').forEach(a => { a.href = 'mailto:' + C.email; a.textContent = C.email; });
  $$('[data-social]').forEach(a => { const u = (C.social || {})[a.dataset.social]; if (u) { a.href = u; a.target = '_blank'; a.rel = 'noopener'; } else if (a.getAttribute('href') === '#') a.hidden = true; });

  /* Gallery */
  const photos = [
    ['portrait-sunglasses', 'portraits', 'Smiling woman in sunglasses outdoors', 'wide'],
    ['child-pumpkin', 'family', 'Young child in a pumpkin shirt', 'tall'],
    ['dog-bandana', 'pets', 'Dog wearing a Halloween bandana', 'tall'],
    ['asters', 'nature', 'Purple wildflower asters in the sun', ''],
    ['tire-swing', 'family', 'Kid playing on a tire swing', 'tall'],
    ['night-stars', 'nature', 'Night sky full of stars between trees', ''],
    ['mushrooms', 'nature', 'Mushrooms growing on a fallen log', ''],
    ['garden-stakes', 'nature', 'Colorful garden stakes', 'tall'],
    ['aster-cluster', 'nature', 'Cluster of asters on a dark background', ''],
    ['tree-trunk', 'nature', 'Textured tree trunk', 'tall']
  ];
  const g = $('#gallery');
  g.innerHTML = photos.map(([f, c, alt, s], i) =>
    `<button class="tile ${s}" data-cat="${c}" data-i="${i}" aria-label="View larger: ${alt}"><picture><source srcset="images/thumbs/${f}.webp" type="image/webp"><img src="images/thumbs/${f}.jpg" alt="${alt}" loading="lazy" decoding="async"></picture></button>`).join('');
  let visible = photos.map((_, i) => i);
  $$('.filters button').forEach(b => b.addEventListener('click', () => {
    $$('.filters button').forEach(x => { x.classList.toggle('active', x === b); x.setAttribute('aria-pressed', x === b); });
    const f = b.dataset.filter; visible = [];
    $$('.tile').forEach(t => { const show = f === 'all' || t.dataset.cat === f; t.hidden = !show; if (show) visible.push(+t.dataset.i); });
  }));

  /* Lightbox */
  const lb = $('#lightbox'), lbImg = $('img', lb), cap = $('figcaption', lb); let cur = 0, lastFocus;
  const show = i => { cur = i; const [f, , alt] = photos[i]; lbImg.src = `images/${f}.webp`; lbImg.onerror = () => { lbImg.onerror = null; lbImg.src = `images/${f}.jpg`; }; lbImg.alt = alt; cap.textContent = alt; };
  const step = d => { const p = visible.indexOf(cur); show(visible[(p + d + visible.length) % visible.length]); };
  const close = () => { lb.hidden = true; document.body.style.overflow = ''; lastFocus && lastFocus.focus(); };
  g.addEventListener('click', e => { const t = e.target.closest('.tile'); if (!t) return; lastFocus = t; show(+t.dataset.i); lb.hidden = false; document.body.style.overflow = 'hidden'; $('.lb-close').focus(); });
  $('.lb-close').onclick = close; $('.lb-prev').onclick = () => step(-1); $('.lb-next').onclick = () => step(1);
  lb.addEventListener('click', e => { if (e.target === lb) close(); });
  document.addEventListener('keydown', e => { if (lb.hidden) return; if (e.key === 'Escape') close(); if (e.key === 'ArrowLeft') step(-1); if (e.key === 'ArrowRight') step(1);
    if (e.key === 'Tab') { const f = $$('button', lb); const i = f.indexOf(document.activeElement); if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); } else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); } } });

  /* Form delivery: endpoint, else mailto */
  async function deliver(subject, data) {
    if (C.formEndpoint) {
      const fd = new FormData(); fd.append('_subject', subject); Object.entries(data).forEach(([k, v]) => fd.append(k, v));
      const r = await fetch(C.formEndpoint, { method: 'POST', body: fd, headers: { Accept: 'application/json' } });
      if (!r.ok) throw new Error('send failed'); return 'sent';
    }
    const body = Object.entries(data).map(([k, v]) => `${k}: ${v}`).join('\n');
    location.href = `mailto:${C.email || ''}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    return 'mailto';
  }

  /* Booking wizard */
  const form = $('#booking'), st = { step: 1, session: null, date: null, time: null };
  const pad = n => String(n).padStart(2, '0'), iso = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const fmtDate = d => d.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  const fmtTime = t => { const [h, m] = t.split(':').map(Number); return new Date(2000, 0, 1, h, m).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }); };
  const sessions = C.sessions || [];
  $('#sessionOpts').innerHTML = sessions.map((s, i) => `<label class="opt"><input type="radio" name="session" value="${i}"><span><strong>${s.name}</strong><small>${s.duration} min · ${s.price}</small></span></label>`).join('');
  $('#sessionOpts').addEventListener('change', e => { st.session = sessions[+e.target.value]; upd(); });
  $$('[data-pick]').forEach(a => a.addEventListener('click', () => { const i = sessions.findIndex(s => s.name === a.dataset.pick); if (i > -1) { $$('#sessionOpts input')[i].checked = true; st.session = sessions[i]; goto(1); } }));

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const minD = new Date(today); minD.setDate(minD.getDate() + (C.minNoticeDays ?? 1));
  const maxD = new Date(today); maxD.setDate(maxD.getDate() + (C.maxDaysAhead ?? 90));
  const avail = d => d >= minD && d <= maxD && (C.availability?.[d.getDay()] || []).length && !(C.blockedDates || []).includes(iso(d));
  let view = new Date(minD.getFullYear(), minD.getMonth(), 1);
  function renderCal() {
    const y = view.getFullYear(), m = view.getMonth(), first = new Date(y, m, 1).getDay(), days = new Date(y, m + 1, 0).getDate();
    let h = `<div class="cal-head"><button type="button" class="cal-nav" data-d="-1" aria-label="Previous month">‹</button><strong>${view.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</strong><button type="button" class="cal-nav" data-d="1" aria-label="Next month">›</button></div><div class="cal-grid">`;
    h += ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => `<span class="dow" aria-hidden="true">${d}</span>`).join('') + '<span></span>'.repeat(first);
    for (let i = 1; i <= days; i++) { const d = new Date(y, m, i), ok = avail(d), sel = st.date && iso(st.date) === iso(d);
      h += `<button type="button" class="day${sel ? ' sel' : ''}" data-date="${iso(d)}" ${ok ? '' : 'disabled'} aria-label="${fmtDate(d)}${ok ? '' : ' (unavailable)'}" aria-pressed="${sel}">${i}</button>`; }
    $('#cal').innerHTML = h + '</div><p class="muted small">Highlighted days have open times.</p>';
  }
  $('#cal').addEventListener('click', e => {
    const n = e.target.closest('.cal-nav'); if (n) { const nv = new Date(view.getFullYear(), view.getMonth() + +n.dataset.d, 1); if (nv >= new Date(minD.getFullYear(), minD.getMonth(), 1) && nv <= maxD) view = nv; renderCal(); return; }
    const b = e.target.closest('.day'); if (b && !b.disabled) { const [y, m, d] = b.dataset.date.split('-').map(Number); st.date = new Date(y, m - 1, d); st.time = null; renderCal(); upd(); }
  });
  function renderSlots() {
    $('#slotDate').textContent = fmtDate(st.date);
    $('#slots').innerHTML = (C.availability[st.date.getDay()] || []).map(t => `<button type="button" class="slot${st.time === t ? ' sel' : ''}" data-t="${t}" aria-pressed="${st.time === t}">${fmtTime(t)}</button>`).join('');
  }
  $('#slots').addEventListener('click', e => { const b = e.target.closest('.slot'); if (b) { st.time = b.dataset.t; renderSlots(); upd(); } });

  const summary = () => `${st.session.name} (${st.session.duration} min) on ${fmtDate(st.date)} at ${fmtTime(st.time)}`;
  function goto(n) {
    st.step = n; $$('.step', form).forEach(f => f.hidden = +f.dataset.step !== n);
    $$('.steps li').forEach((l, i) => { l.classList.toggle('on', i < n); if (i === n - 1) l.setAttribute('aria-current', 'step'); else l.removeAttribute('aria-current'); });
    if (n === 2) renderCal(); if (n === 3) renderSlots(); if (n === 4) $('#summary').innerHTML = `<strong>Your request:</strong> ${summary()}`;
    $('#back').hidden = n === 1; $('#next').hidden = n === 4; $('#submit').hidden = n !== 4; $('#bookErr').textContent = ''; upd();
    const lg = $(`.step[data-step="${n}"] legend`, form); lg.tabIndex = -1; if (n > 1) lg.focus();
  }
  function upd() { $('#next').disabled = !({ 1: st.session, 2: st.date, 3: st.time }[st.step]); }
  $('#next').onclick = () => goto(st.step + 1); $('#back').onclick = () => goto(st.step - 1);
  form.addEventListener('submit', async e => {
    e.preventDefault(); const f = new FormData(form);
    if (f.get('_gotcha')) return;
    if (!form.name.value.trim() || !form.email.checkValidity() || !form.consent.checked) { $('#bookErr').textContent = 'Please enter your name, a valid email, and accept the privacy note.'; return; }
    const data = { 'Session': st.session.name, 'Duration': st.session.duration + ' min', 'Date': iso(st.date) + ' (' + fmtDate(st.date) + ')', 'Time': fmtTime(st.time), 'Name': f.get('name'), 'Email': f.get('email'), 'Phone': f.get('phone') || '-', 'Party': f.get('party') || '-', 'Notes': f.get('message') || '-' };
    $('#submit').disabled = true; $('#submit').textContent = 'Sending…';
    try { const how = await deliver(`Booking request: ${st.session.name} - ${iso(st.date)} ${st.time}`, data);
      form.hidden = true; $('#confirm').hidden = false; $('#confirmText').textContent = `${summary()}. Name: ${data.Name} · ${data.Email}` + (how === 'mailto' ? ' (Your email app opened with the details; please hit send to finish.)' : ''); $('#confirm').focus();
    } catch { $('#bookErr').textContent = `Sorry, something went wrong. Please try again${C.email ? ' or email ' + C.email : ''}.`; }
    $('#submit').disabled = false; $('#submit').textContent = 'Request booking';
  });
  $('#again').onclick = () => { form.reset(); Object.assign(st, { session: null, date: null, time: null }); form.hidden = false; $('#confirm').hidden = true; goto(1); };
  goto(1);

  if (C.schedulerUrl) { $('#calembed').hidden = false; $('#calframe').src = C.schedulerUrl + (C.schedulerUrl.includes('?') ? '&' : '?') + 'embed=true'; }

  /* Contact */
  $('#contactForm').addEventListener('submit', async e => {
    e.preventDefault(); const f = e.target, m = $('#contactMsg');
    if (!f.checkValidity() || f._gotcha.value) { f.reportValidity(); return; }
    try { const how = await deliver('Website message from ' + f.name.value, { Name: f.name.value, Email: f.email.value, Message: f.message.value });
      m.textContent = how === 'sent' ? 'Thanks! Your message was sent.' : 'Your email app opened; hit send to finish.'; if (how === 'sent') f.reset();
    } catch { m.textContent = 'Sorry, sending failed. Please try again.'; }
  });
})();
