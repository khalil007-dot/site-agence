const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const eur = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });

// Barre de navigation : bordure au défilement + menu mobile
const nav = document.querySelector('.nav');
const sticky = document.querySelector('.sticky-cta');
const onScroll = () => {
  nav.classList.toggle('scrolled', scrollY > 8);
  if (sticky) sticky.classList.toggle('show', scrollY > 520);
};
onScroll();
addEventListener('scroll', onScroll, { passive: true });

const menuBtn = document.querySelector('.menu-btn');
const links = document.getElementById('nav-links');
const setMenu = open => {
  menuBtn.setAttribute('aria-expanded', open);
  menuBtn.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
  links.classList.toggle('open', open);
};
menuBtn.addEventListener('click', () => setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'));
links.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
addEventListener('keydown', e => {
  if (e.key === 'Escape' && links.classList.contains('open')) { setMenu(false); menuBtn.focus(); }
});

// Simulateur de budget (accueil)
const est = document.getElementById('estimator');
if (est) {
  const toggles = [...est.querySelectorAll('.toggle')];
  const once = document.getElementById('est-once');
  const monthly = document.getElementById('est-monthly');
  const count = document.getElementById('est-count');
  const cta = document.getElementById('est-cta');
  const update = () => {
    const on = toggles.filter(t => t.getAttribute('aria-pressed') === 'true');
    const sum = k => on.reduce((s, t) => s + Number(t.dataset[k] || 0), 0);
    const a = sum('once'), m = sum('monthly');
    once.textContent = eur.format(a);
    monthly.textContent = m ? '+ ' + eur.format(m) + ' par mois' : 'Aucun abonnement';
    count.textContent = on.length
      ? on.length + (on.length > 1 ? ' services sélectionnés' : ' service sélectionné')
      : 'Sélectionnez au moins un service';
    cta.href = 'devis.html' + (on.length ? '?service=' + on.map(t => t.dataset.id).join(',') : '');
    cta.setAttribute('aria-disabled', on.length ? 'false' : 'true');
  };
  toggles.forEach(t => t.addEventListener('click', () => {
    t.setAttribute('aria-pressed', t.getAttribute('aria-pressed') !== 'true');
    update();
  }));
  update();
}

// Réalisations : filtre par catégorie, gardé dans l'adresse (?type=logo)
const filters = document.querySelectorAll('[data-filter]');
if (filters.length) {
  const projects = document.querySelectorAll('.project[data-type]');
  const count = document.getElementById('filter-count');
  const apply = type => {
    filters.forEach(f => f.setAttribute('aria-pressed', f.dataset.filter === type));
    let shown = 0;
    projects.forEach(p => { const on = type === 'tout' || p.dataset.type === type; p.hidden = !on; shown += on; });
    count.textContent = shown + (shown > 1 ? ' projets' : ' projet');
    const url = new URL(location);
    type === 'tout' ? url.searchParams.delete('type') : url.searchParams.set('type', type);
    history.replaceState(null, '', url);
  };
  filters.forEach(f => f.addEventListener('click', () => apply(f.dataset.filter)));
  const start = new URLSearchParams(location.search).get('type');
  apply([...filters].some(f => f.dataset.filter === start) ? start : 'tout');
}

// Devis en 3 étapes
const form = document.getElementById('quote-form');
if (form) {
  const steps = [...form.querySelectorAll('.step')];
  const marks = [...document.querySelectorAll('.progress li')];
  let current = 0;

  // « devis.html?service=seo,logo » pré-coche les services
  (new URLSearchParams(location.search).get('service') || '').split(',').forEach(id => {
    const box = id && form.querySelector(`input[name="services"][value="${CSS.escape(id)}"]`);
    if (box) box.checked = true;
  });

  // Venu du bloc « Audit gratuit » : on reprend l'adresse du site et on le signale
  const q = new URLSearchParams(location.search);
  if (q.get('audit') && q.get('site')) {
    form.site.value = q.get('site');
    const note = document.getElementById('audit-note');
    note.textContent = 'Audit gratuit demandé pour ' + q.get('site') + '. Complétez le formulaire pour le recevoir sous 72 h.';
    note.hidden = false;
  }

  const show = i => {
    steps.forEach((s, n) => { s.hidden = n !== i; });
    marks.forEach((m, n) => {
      m.classList.toggle('done', n < i);
      n === i ? m.setAttribute('aria-current', 'step') : m.removeAttribute('aria-current');
    });
    current = i;
    const h = steps[i].querySelector('h2');
    h.setAttribute('tabindex', '-1');
    h.focus({ preventScroll: true });
    form.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  };

  const setError = (field, text) => {
    field.setAttribute('aria-invalid', text ? 'true' : 'false');
    document.getElementById('err-' + field.id).textContent = text;
    return !text;
  };

  const validators = [
    () => {
      const ok = form.querySelectorAll('input[name="services"]:checked').length > 0;
      document.getElementById('err-step-1').textContent = ok ? '' : 'Choisissez au moins un service pour continuer.';
      return ok;
    },
    () => true,
    () => {
      const nom = setError(form.nom, form.nom.value.trim() ? '' : 'Indiquez votre nom pour qu\'on sache à qui adresser le devis.');
      const mail = setError(form.email, /^\S+@\S+\.\S+$/.test(form.email.value.trim()) ? '' : 'Cette adresse e-mail semble incomplète. Exemple : prenom@domaine.fr');
      if (!nom) form.nom.focus(); else if (!mail) form.email.focus();
      return nom && mail;
    },
  ];

  form.addEventListener('click', e => {
    if (e.target.closest('[data-next]') && validators[current]()) show(current + 1);
    if (e.target.closest('[data-prev]')) show(current - 1);
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (current !== 2 || !validators[2]()) return;
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Envoi…';
    setTimeout(() => {
      const chosen = [...form.querySelectorAll('input[name="services"]:checked')].map(i => i.nextElementSibling.textContent);
      document.getElementById('recap').textContent = chosen.join(', ');
      document.getElementById('recap-mail').textContent = form.email.value.trim();
      steps.forEach(s => { s.hidden = true; });
      marks.forEach(m => { m.classList.add('done'); m.removeAttribute('aria-current'); });
      const done = document.getElementById('step-done');
      done.hidden = false;
      done.querySelector('h2').focus();
    }, 800);
  });

  // Entrée dans un champ des étapes 1 et 2 : passe à l'étape suivante au lieu d'envoyer
  form.addEventListener('keydown', e => {
    if (e.key === 'Enter' && current < 2 && e.target.tagName === 'INPUT') {
      e.preventDefault();
      if (validators[current]()) show(current + 1);
    }
  });
}

// Onglets accessibles (métiers sur l'accueil, devis / appel sur la page devis)
function tabs(list, onChange) {
  const items = [...list.querySelectorAll('[role="tab"]')];
  const select = (tab, focus) => {
    items.forEach(t => {
      const on = t === tab;
      t.setAttribute('aria-selected', on);
      t.tabIndex = on ? 0 : -1;
      const panel = document.getElementById(t.getAttribute('aria-controls'));
      panel.hidden = !on;
      panel.classList.toggle('is-in', on);
    });
    if (focus) tab.focus();
    if (onChange) onChange(tab);
  };
  items.forEach((t, i) => {
    t.addEventListener('click', () => select(t));
    t.addEventListener('keydown', e => {
      const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (d) { e.preventDefault(); select(items[(i + d + items.length) % items.length], true); }
    });
  });
  return select;
}
const mtabs = document.querySelector('.mtabs');
if (mtabs) tabs(mtabs);

// Formules : paiement en une fois ou en 12 mois
const bills = document.querySelectorAll('.bill');
bills.forEach(b => b.addEventListener('click', () => {
  bills.forEach(x => x.setAttribute('aria-pressed', x === b));
  const mode = b.dataset.bill;
  document.querySelectorAll('.plan .price').forEach(p => {
    p.querySelector('.pv').textContent = p.dataset[mode];
    p.querySelector('.pl').textContent = p.dataset[mode + 'L'];
  });
}));

// Page devis : devis écrit ou rendez-vous téléphonique (?mode=appel)
const modes = document.querySelector('.modes');
if (modes) {
  const select = tabs(modes, tab => {
    const url = new URL(location);
    tab.id === 'tab-appel' ? url.searchParams.set('mode', 'appel') : url.searchParams.delete('mode');
    history.replaceState(null, '', url);
  });
  if (new URLSearchParams(location.search).get('mode') === 'appel') select(document.getElementById('tab-appel'));

  // Créneaux : les 5 prochains jours ouvrés, 4 horaires par jour
  const daysBox = document.getElementById('days');
  const slotsBox = document.getElementById('slots');
  const recap = document.getElementById('slot-recap');
  const dayFmt = new Intl.DateTimeFormat('fr-FR', { weekday: 'short' });
  const numFmt = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short' });
  const longFmt = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
  const HOURS = ['9 h 30', '11 h 00', '14 h 00', '16 h 30'];
  const days = [];
  for (let d = new Date(); days.length < 5;) {
    d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);
    if (d.getDay() !== 0 && d.getDay() !== 6) days.push(d);
  }
  let chosenDay = null, chosenHour = null;
  const radio = (box, el) => box.querySelectorAll('[role="radio"]').forEach(x => {
    x.setAttribute('aria-checked', x === el); x.tabIndex = x === el ? 0 : -1;
  });
  const updateRecap = () => {
    recap.textContent = chosenDay && chosenHour ? 'Le ' + longFmt.format(chosenDay) + ' à ' + chosenHour : 'Aucun créneau choisi';
  };
  const renderSlots = () => {
    slotsBox.innerHTML = '';
    // Démo : un créneau sur trois est déjà pris, de façon stable selon le jour
    HOURS.forEach((h, i) => {
      if ((chosenDay.getDate() + i) % 3 === 0) return;
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'slot'; b.setAttribute('role', 'radio');
      b.setAttribute('aria-checked', 'false'); b.textContent = h; b.tabIndex = -1;
      b.addEventListener('click', () => { chosenHour = h; radio(slotsBox, b); updateRecap(); document.getElementById('err-slot').textContent = ''; });
      slotsBox.append(b);
    });
    slotsBox.querySelector('.slot').tabIndex = 0;
  };
  days.forEach((d, i) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'day'; b.setAttribute('role', 'radio');
    b.setAttribute('aria-checked', 'false'); b.tabIndex = i === 0 ? 0 : -1;
    b.innerHTML = `<span>${dayFmt.format(d)}</span><small>${numFmt.format(d)}</small>`;
    b.setAttribute('aria-label', longFmt.format(d));
    b.addEventListener('click', () => { chosenDay = d; chosenHour = null; radio(daysBox, b); renderSlots(); updateRecap(); });
    daysBox.append(b);
  });
  daysBox.querySelector('.day').click();

  const call = document.getElementById('call-form');
  const err = (id, text) => {
    const f = document.getElementById(id);
    f.setAttribute('aria-invalid', text ? 'true' : 'false');
    document.getElementById('err-' + id).textContent = text;
    return !text;
  };
  call.addEventListener('submit', e => {
    e.preventDefault();
    const slotOk = !!chosenHour;
    document.getElementById('err-slot').textContent = slotOk ? '' : 'Choisissez une heure pour le rendez-vous.';
    const nomOk = err('c-nom', call['c-nom'].value.trim() ? '' : 'Indiquez votre nom.');
    const telOk = err('c-tel', call['c-tel'].value.replace(/\D/g, '').length >= 9 ? '' : 'Indiquez un numéro de téléphone pour qu\'on puisse vous appeler.');
    if (!slotOk) { slotsBox.querySelector('.slot').focus(); return; }
    if (!nomOk) { call['c-nom'].focus(); return; }
    if (!telOk) { call['c-tel'].focus(); return; }
    document.getElementById('call-recap').textContent = 'le ' + longFmt.format(chosenDay) + ' à ' + chosenHour;
    document.getElementById('call-tel').textContent = call['c-tel'].value.trim();
    document.getElementById('call-step').hidden = true;
    const done = document.getElementById('call-done');
    done.hidden = false;
    done.querySelector('h2').focus();
  });
}
