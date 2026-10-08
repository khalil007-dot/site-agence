const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
document.documentElement.classList.add('js');

// Apparition au défilement (.rv) et chiffres qui défilent ([data-count])
const countUp = el => {
  const fin = +el.dataset.count, t0 = performance.now(), dur = 1100;
  const step = t => {
    const k = Math.min(1, (t - t0) / dur);
    el.textContent = Math.round(fin * (1 - Math.pow(1 - k, 3)));
    if (k < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
};
const rvs = document.querySelectorAll('.rv');
if (rvs.length && 'IntersectionObserver' in window && !reduceMotion) {
  const io = new IntersectionObserver(entries => entries.forEach(en => {
    if (!en.isIntersecting) return;
    en.target.classList.add('in');
    en.target.querySelectorAll('[data-count]').forEach(countUp);
    io.unobserve(en.target);
  }), { rootMargin: '0px 0px -8% 0px' });
  rvs.forEach(el => io.observe(el));
} else rvs.forEach(el => el.classList.add('in'));
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
    cta.href = '/devis' + (on.length ? '?service=' + on.map(t => t.dataset.id).join(',') : '');
    cta.setAttribute('aria-disabled', on.length ? 'false' : 'true');
  };
  toggles.forEach(t => t.addEventListener('click', () => {
    t.setAttribute('aria-pressed', t.getAttribute('aria-pressed') !== 'true');
    update();
  }));
  update();
}

// Accueil : auto-diagnostic de la section « problème »
const diag = document.getElementById('diag');
if (diag) {
  const pains = [...diag.querySelectorAll('.pain')];
  const n = document.getElementById('diag-n');
  const msg = document.getElementById('diag-msg');
  const MSG = [
    'Cochez les situations qui vous ressemblent.',
    "Un point à corriger. C'est souvent rapide, et ça se voit vite sur vos demandes.",
    'Deux points à corriger : votre site vous fait probablement perdre des clients chaque semaine.',
    'Trois points à corriger : vos concurrents récupèrent une partie de vos clients.',
    'Les quatre : votre site travaille contre vous. Bonne nouvelle, tout se corrige en même temps.',
  ];
  pains.forEach(b => b.addEventListener('click', () => {
    b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') !== 'true');
    const k = pains.filter(x => x.getAttribute('aria-pressed') === 'true').length;
    n.textContent = k;
    msg.textContent = MSG[k];
    diag.classList.toggle('has-score', k > 0);
  }));
}

// Accueil : comparateur bien référencé / mal référencé, avec une conclusion qui oriente le prospect
const calc = document.getElementById('seo-calc');
if (calc) {
  const $ = id => document.getElementById(id);
  const TOP = +calc.dataset.top, TAUX = +calc.dataset.taux / 100, PRIX = +calc.dataset.prix;
  const nb = (n, d = 0) => n.toLocaleString('fr-BE', { minimumFractionDigits: d, maximumFractionDigits: d });
  const pct = n => nb(n, n < 1 ? 2 : 1) + ' %';
  const cli = n => nb(n, n < 10 ? 1 : 0);
  const pick = q => calc.querySelector(`[data-q="${q}"][aria-pressed="true"]`);
  const update = () => {
    const rech = +pick('rech').dataset.v;
    const posBtn = pick('pos'), ctr = +posBtn.dataset.v;
    const val = Math.max(0, +$('calc-val').value || 0);
    const visYou = rech * ctr / 100, visTop = rech * TOP / 100;
    const cliYou = visYou * TAUX, cliTop = visTop * TAUX;
    const gapM = Math.max(0, (cliTop - cliYou) * val);
    $('c-pos').textContent = posBtn.dataset.l === 'Je ne sais pas' ? 'Position inconnue' : posBtn.dataset.l;
    $('c-ctr-you').textContent = pct(ctr); $('c-ctr-top').textContent = pct(TOP);
    $('c-vis-you').textContent = nb(Math.round(visYou)); $('c-vis-top').textContent = nb(Math.round(visTop));
    $('c-cli-you').textContent = cli(cliYou); $('c-cli-top').textContent = cli(cliTop);
    $('c-bar-you').style.width = Math.max(1.5, ctr / 27.6 * 100) + '%';
    $('c-bar-top').style.width = TOP / 27.6 * 100 + '%';
    $('c-gap-m').textContent = eur.format(Math.round(gapM)) + ' par mois';
    $('c-gap-y').textContent = gapM ? `soit environ ${eur.format(Math.round(gapM * 12 / 100) * 100)} par an` : 'Vous captez déjà votre part des clics.';
    // Nombre de clients en plus par mois pour rembourser le référencement
    const k = val ? Math.ceil(PRIX / val) : 0;
    const rent = k ? ` Notre référencement (${eur.format(PRIX)}/mois) est rentabilisé dès ${k} client${k > 1 ? 's' : ''} de plus par mois.` : '';
    const inconnu = posBtn.dataset.l === 'Je ne sais pas' ? " Quand on ne sait pas où l'on apparaît, c'est souvent qu'on n'est pas en première page." : '';
    let level, tag, txt, cta, ctaHref, cta2, cta2Href;
    if (ctr >= TOP) {
      level = 'ok'; tag = 'Vous êtes déjà bien placé';
      txt = "Votre marge de progrès est surtout après le clic : un site qui donne envie d'appeler, des avis visibles, un bouton WhatsApp. C'est là qu'on vous ferait gagner des clients.";
      cta = 'Améliorer mon site'; ctaHref = '/devis?service=site-vitrine'; cta2 = 'Audit gratuit'; cta2Href = '#audit';
    } else if (gapM >= PRIX * 3) {
      level = 'haut'; tag = 'Priorité haute';
      txt = `Vous laissez environ ${cli(cliTop - cliYou)} clients par mois à vos concurrents.${rent}${inconnu} Le mieux est d'en parler 30 minutes : on regarde vos mots-clés et qui vous passe devant.`;
      cta = 'Réserver un appel de 30 minutes'; ctaHref = '/devis?mode=appel'; cta2 = 'Audit gratuit'; cta2Href = '#audit';
    } else if (gapM >= PRIX) {
      level = 'moyen'; tag = 'Potentiel réel';
      txt = `Le gain couvre le coût du référencement, avec une marge.${rent}${inconnu} Commencez par l'audit gratuit pour le confirmer sur vos vrais mots-clés.`;
      cta = 'Recevoir mon audit gratuit'; ctaHref = '#audit'; cta2 = 'Devis référencement'; cta2Href = '/devis?service=seo';
    } else {
      level = 'faible'; tag = 'Gain limité pour le moment';
      txt = `Avec ce volume de recherches, un abonnement de référencement ne serait pas encore rentable.${inconnu} Une fiche Google soignée et un site clair suffisent souvent : c'est inclus dans notre site vitrine.`;
      cta = 'Devis site vitrine'; ctaHref = '/devis?service=site-vitrine'; cta2 = 'Audit gratuit'; cta2Href = '#audit';
    }
    $('c-verdict').dataset.level = level;
    $('c-tag').textContent = tag; $('c-txt').textContent = txt;
    $('c-cta').textContent = cta; $('c-cta').href = ctaHref;
    $('c-cta2').textContent = cta2; $('c-cta2').href = cta2Href;
  };
  calc.querySelectorAll('[data-q]').forEach(b => b.addEventListener('click', () => {
    calc.querySelectorAll(`[data-q="${b.dataset.q}"]`).forEach(x => x.setAttribute('aria-pressed', x === b));
    update();
  }));
  $('calc-val').addEventListener('input', update);
  update();
}

// À propos : portrait qui s'incline en suivant la souris
document.querySelectorAll('.tilt').forEach(el => {
  if (reduceMotion || !matchMedia('(hover: hover)').matches) return;
  el.addEventListener('pointermove', e => {
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
    el.style.transform = `perspective(900px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
    el.style.setProperty('--gx', (x + .5) * 100 + '%'); el.style.setProperty('--gy', (y + .5) * 100 + '%');
  });
  el.addEventListener('pointerleave', () => { el.style.transform = ''; });
});

// À propos : engagements qui se retournent
document.querySelectorAll('.flip').forEach(b => b.addEventListener('click', () => {
  b.setAttribute('aria-expanded', b.getAttribute('aria-expanded') !== 'true');
}));

// À propos : quiz « Le bon partenaire pour vous ? »
const quiz = document.getElementById('quiz');
if (quiz) {
  const qs = [...quiz.querySelectorAll('.quiz-q')];
  const $q = id => document.getElementById(id);
  const RES = {
    oui: ['On est faits pour travailler ensemble', "Vous cherchez exactement ce qu'on fait le mieux. Réservez 30 minutes : on regarde votre activité et ce qui vous ferait gagner des clients.", 'Réserver un appel', '/devis?mode=appel'],
    peut: ['Ça peut coller, parlons-en', "Sur certains points, on n'a pas la même idée du projet. Un appel de 30 minutes suffit pour voir si on peut vous aider, sans engagement.", 'Poser mes questions sur WhatsApp', null],
    non: ['Nous ne sommes probablement pas les bonnes personnes', "Et c'est très bien de le savoir maintenant. Si vous voulez quand même un avis sur votre projet, on vous répond volontiers.", 'Nous demander conseil', '/devis'],
  };
  const wa = document.querySelector('.wa-float')?.href || '/devis?mode=appel';
  qs.forEach(q => q.querySelectorAll('.quiz-opt').forEach(b => b.addEventListener('click', () => {
    q.querySelectorAll('.quiz-opt').forEach(x => x.setAttribute('aria-pressed', x === b));
    q.classList.add('done');
    const rep = qs.map(x => x.querySelector('[aria-pressed="true"]')).filter(Boolean);
    const fit = rep.filter(x => x.dataset.fit === '1').length;
    $q('quiz-bar').style.width = rep.length / qs.length * 100 + '%';
    $q('quiz-count').textContent = `${rep.length} réponse${rep.length > 1 ? 's' : ''} sur ${qs.length}`;
    if (rep.length < qs.length) return;
    const [titre, txt, cta, href] = RES[fit === qs.length ? 'oui' : fit >= 2 ? 'peut' : 'non'];
    quiz.dataset.res = fit === qs.length ? 'oui' : fit >= 2 ? 'peut' : 'non';
    $q('quiz-title').textContent = titre; $q('quiz-txt').textContent = txt;
    const c = $q('quiz-cta'); c.textContent = cta; c.href = href || wa; c.hidden = false;
    if (!href) { c.target = '_blank'; c.rel = 'noopener'; } else c.removeAttribute('target');
  })));
}

// Accueil : bouton pause de la bande de réalisations qui défile
document.querySelectorAll('.vitrine-pause').forEach(b => b.addEventListener('click', () => {
  const on = b.getAttribute('aria-pressed') !== 'true';
  b.setAttribute('aria-pressed', on);
  b.setAttribute('aria-label', on ? 'Reprendre le défilement' : 'Mettre en pause le défilement');
  b.closest('.vitrine').classList.toggle('paused', on);
}));

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

// D'où vient le prospect, ajouté à chaque demande : page du site d'où il arrive (ou site extérieur)
// et campagne (?utm_source=…). Sans cookie ni stockage : lu au moment de l'envoi.
function provenance() {
  const q = new URLSearchParams(location.search);
  const campagne = ['utm_source', 'utm_medium', 'utm_campaign'].map(k => q.get(k)).filter(Boolean).join(' / ');
  let venu = 'Accès direct';
  try {
    const r = document.referrer && new URL(document.referrer);
    if (r) venu = r.origin === location.origin ? 'Page ' + (r.pathname === '/' ? "d'accueil" : r.pathname) : 'Site extérieur : ' + r.hostname;
  } catch {}
  return { 'Venu de': venu, 'Campagne': campagne || '-' };
}

// Envoi d'un formulaire par e-mail (Web3Forms si une clé est dans src/data/reglages.json, sinon FormSubmit).
// Renvoie true si la demande est partie ; sinon affiche une erreur avec l'e-mail de contact.
async function envoyer(formEl, champs, errId) {
  const err = document.getElementById(errId);
  err.textContent = '';
  if (formEl.botcheck && formEl.botcheck.checked) return true; // robot de spam : on ne l'envoie pas
  // Si l'envoi échoue (ou si la clé n'est pas encore configurée), on propose d'envoyer
  // la même demande, déjà rédigée, par WhatsApp ou par e-mail : aucun prospect n'est perdu.
  const echec = () => {
    const texte = Object.entries(champs).filter(([k]) => k !== 'subject').map(([k, v]) => `${k} : ${v}`).join('\n');
    err.append("L'envoi automatique n'a pas fonctionné. Envoyez-nous la même demande, déjà rédigée, en un clic : ");
    const wa = document.querySelector('.wa-float');
    const liens = [];
    if (wa) {
      const l = document.createElement('a');
      l.href = wa.href.split('?')[0] + '?text=' + encodeURIComponent(champs.subject + '\n' + texte);
      l.target = '_blank'; l.rel = 'noopener'; l.textContent = 'par WhatsApp';
      liens.push(l);
    }
    const m = document.createElement('a');
    m.href = 'mailto:' + formEl.dataset.email + '?subject=' + encodeURIComponent(champs.subject) + '&body=' + encodeURIComponent(texte);
    m.textContent = 'par e-mail';
    liens.push(m);
    liens.forEach((l, i) => { l.className = 'link'; err.append(i ? ' ou ' : '', l); });
    err.append('.');
    return false;
  };
  // Avec une clé Web3Forms (réglages) on passe par Web3Forms, sinon par FormSubmit,
  // qui envoie directement à l'adresse e-mail du site (à activer une fois via l'e-mail reçu).
  const cle = formEl.dataset.cle;
  const url = cle ? 'https://api.web3forms.com/submit' : 'https://formsubmit.co/ajax/' + formEl.dataset.email;
  const corps = cle
    ? { access_key: cle, from_name: 'Formulaire du site', ...champs }
    : { _subject: champs.subject, _template: 'table', _captcha: 'false', ...champs };
  try {
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(corps),
    });
    const res = await r.json();
    return res.success === true || res.success === 'true' ? true : echec();
  } catch {
    return echec();
  }
}

// Devis en 3 étapes
const form = document.getElementById('quote-form');
if (form) {
  const steps = [...form.querySelectorAll('.step')];
  const marks = [...document.querySelectorAll('.progress li')];
  let current = 0;

  // « /devis?service=seo,logo » pré-coche les services
  (new URLSearchParams(location.search).get('service') || '').split(',').forEach(id => {
    const box = id && form.querySelector(`input[name="services"][value="${CSS.escape(id)}"]`);
    if (box) box.checked = true;
  });

  // Venu du bloc « Audit gratuit » : on reprend l'adresse du site et on le signale
  const q = new URLSearchParams(location.search);
  // Venu d'un onglet métier de l'accueil : le secteur commence la description du projet
  if (q.get('activite') && !form.msg.value) form.msg.value = q.get('activite') + ' : ';
  // Venu d'une formule (?formule=lancement) : ses services cochés, la formule rappelée
  const formule = JSON.parse(form.dataset.formules || '{}')[q.get('formule')];
  if (formule) {
    formule.services.forEach(id => { const box = form.querySelector(`input[name="services"][value="${id}"]`); if (box) box.checked = true; });
    if (!form.msg.value) form.msg.value = formule.texte.split(' :')[0] + ' : ';
    const note = document.getElementById('audit-note');
    note.textContent = formule.texte;
    note.hidden = false;
  }
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

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (current !== 2 || !validators[2]()) return;
    const btn = form.querySelector('button[type="submit"]');
    const texteBouton = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Envoi…';
    const chosen = [...form.querySelectorAll('input[name="services"]:checked')].map(i => i.nextElementSibling.textContent);
    const ok = await envoyer(form, {
      subject: 'Demande de devis : ' + form.nom.value.trim(),
      email: form.email.value.trim(),
      'Nom': form.nom.value.trim(),
      'Entreprise': form.entreprise.value.trim() || '-',
      'Téléphone': form.tel.value.trim() || '-',
      'Services': chosen.join(', '),
      'Secteur': q.get('activite') || '-',
      'Budget': form.budget.value,
      'Délai': form.delai.value,
      'Activité': form.msg.value.trim() || '-',
      'Site actuel': form.site.value.trim() || '-',
      'Audit gratuit demandé': q.get('audit') ? 'Oui' : 'Non',
      ...provenance(),
    }, 'err-envoi-devis');
    btn.disabled = false;
    btn.textContent = texteBouton;
    if (!ok) return;
    document.getElementById('recap').textContent = chosen.join(', ');
    document.getElementById('recap-mail').textContent = form.email.value.trim();
    steps.forEach(s => { s.hidden = true; });
    marks.forEach(m => { m.classList.add('done'); m.removeAttribute('aria-current'); });
    const done = document.getElementById('step-done');
    done.hidden = false;
    done.querySelector('h2').focus();
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
const gtabs = document.querySelector('.gtabs');
if (gtabs) tabs(gtabs);

// Formules : paiement en une fois ou en 3 fois
const bills = document.querySelectorAll('.bill');
bills.forEach(b => b.addEventListener('click', () => {
  bills.forEach(x => x.setAttribute('aria-pressed', x === b));
  const mode = b.dataset.bill;
  document.querySelectorAll('.price[data-once]').forEach(p => {
    p.querySelector('.pv').textContent = p.dataset[mode];
    p.querySelector('.pl').textContent = p.dataset[mode + 'L'];
  });
  // « au lieu de … » compare des prix payés en une fois : masqué en mode mensuel
  document.querySelectorAll('.was[data-once]').forEach(w => { w.hidden = mode === 'monthly'; });
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
    HOURS.forEach(h => {
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
  call.addEventListener('submit', async e => {
    e.preventDefault();
    const slotOk = !!chosenHour;
    document.getElementById('err-slot').textContent = slotOk ? '' : 'Choisissez une heure pour le rendez-vous.';
    const nomOk = err('c-nom', call['c-nom'].value.trim() ? '' : 'Indiquez votre nom.');
    const telOk = err('c-tel', call['c-tel'].value.replace(/\D/g, '').length >= 9 ? '' : 'Indiquez un numéro de téléphone pour qu\'on puisse vous appeler.');
    if (!slotOk) { slotsBox.querySelector('.slot').focus(); return; }
    if (!nomOk) { call['c-nom'].focus(); return; }
    if (!telOk) { call['c-tel'].focus(); return; }
    const btn = call.querySelector('button[type="submit"]');
    const texteBouton = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Envoi…';
    const ok = await envoyer(call, {
      subject: 'Rendez-vous téléphonique : ' + call['c-nom'].value.trim(),
      'Nom': call['c-nom'].value.trim(),
      'Téléphone': call['c-tel'].value.trim(),
      'Créneau demandé': 'le ' + longFmt.format(chosenDay) + ' à ' + chosenHour,
      'Sujet': call['c-sujet'].value.trim() || '-',
      ...provenance(),
    }, 'err-envoi-appel');
    btn.disabled = false;
    btn.textContent = texteBouton;
    if (!ok) return;
    document.getElementById('call-recap').textContent = 'le ' + longFmt.format(chosenDay) + ' à ' + chosenHour;
    document.getElementById('call-tel').textContent = call['c-tel'].value.trim();
    document.getElementById('call-step').hidden = true;
    const done = document.getElementById('call-done');
    done.hidden = false;
    done.querySelector('h2').focus();
  });
}

// Accueil : date de mise en ligne si on commence aujourd'hui (jours ouvrables, du lundi au vendredi)
const cal = document.querySelector('.cal[data-jours]');
if (cal) {
  const d = new Date();
  for (let n = +cal.dataset.jours; n > 0;) { d.setDate(d.getDate() + 1); if (d.getDay() % 6) n--; }
  const f = o => new Intl.DateTimeFormat('fr-BE', o).format(d);
  cal.querySelector('.cal-m').textContent = f({ month: 'long' });
  cal.querySelector('.cal-d').textContent = f({ weekday: 'long' });
  cal.querySelector('.cal-n').textContent = d.getDate();
  const t = document.getElementById('final-date');
  if (t) t.textContent = f({ weekday: 'long', day: 'numeric', month: 'long' });
}
