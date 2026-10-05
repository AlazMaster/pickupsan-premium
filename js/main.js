/* Pickupsan Premium — sayfa betikleri */
var WHATSAPP = '905070633068';

/* Seri bilgileri (metinleri buradan düzenleyebilirsiniz) */
var SERIES = [
  { code: 'PCS-Q', name: 'Panelvan', specs: [['Yan yapı', 'Kapalı panel'], ['Tavan', '450 kg taşıma'], ['Erişim', '3 yönden']] },
  { code: 'PCS-C', name: 'Camlı', specs: [['Yan yapı', 'Camlı, dışa açılır kapak'], ['Havalandırma', 'Yan kapaklarla'], ['Erişim', '3 yönden']] },
  { code: 'PCS-K', name: 'Dolaplı', specs: [['Yan yapı', 'Dışa açılır kapak'], ['İç düzen', 'Dolap bölmeleri'], ['Erişim', '3 yönden']] }
];

/* Menü */
var head = document.querySelector('.head'), mbtn = document.querySelector('.menu-btn');
var wa = document.querySelector('.wa');
function onScroll() { head.classList.toggle('solid', scrollY > 60 || document.body.classList.contains('menu-open')); wa.classList.toggle('show', scrollY > innerHeight * .7); }
addEventListener('scroll', onScroll, { passive: true }); onScroll();
mbtn.addEventListener('click', function () {
  var o = document.body.classList.toggle('menu-open'); mbtn.setAttribute('aria-expanded', o);
  document.body.style.overflow = o ? 'hidden' : ''; onScroll();
});
document.querySelectorAll('.overlay a').forEach(function (a) {
  a.addEventListener('click', function () { document.body.classList.remove('menu-open'); document.body.style.overflow = ''; mbtn.setAttribute('aria-expanded', false); });
});

/* Kaydırınca belirme */
var io = new IntersectionObserver(function (es) {
  es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: .15 });
document.querySelectorAll('.rv').forEach(function (el) { io.observe(el); });

/* Sayılar */
document.querySelectorAll('[data-count]').forEach(function (el) {
  var to = +el.dataset.count;
  new IntersectionObserver(function (es, o) {
    if (!es[0].isIntersecting) return; o.disconnect();
    var t0 = null;
    (function step(t) { t0 = t0 || t; var p = Math.min((t - t0) / 1800, 1); el.textContent = Math.round(to * (1 - Math.pow(1 - p, 4))); if (p < 1) requestAnimationFrame(step); })(performance.now());
  }, { threshold: .6 }).observe(el);
});

/* Showroom */
var slides = document.querySelectorAll('.slide'), tabs = document.querySelectorAll('.sr-tab'), cur = 0, timer;
function renderInfo(i) {
  var s = SERIES[i];
  document.getElementById('srTitle').innerHTML = '<small>' + s.code + '</small>' + s.name;
  document.getElementById('srSpecs').innerHTML = s.specs.map(function (x) { return '<div><dt>' + x[0] + '</dt><dd>' + x[1] + '</dd></div>'; }).join('');
  document.getElementById('srNum').textContent = '0' + (i + 1);
  document.getElementById('srGhost').textContent = s.code;
}
function go(i) {
  i = (i + slides.length) % slides.length; if (i === cur) return;
  slides[cur].classList.remove('on'); slides[cur].classList.add('out');
  var prev = slides[cur]; setTimeout(function () { prev.classList.remove('out'); }, 1000);
  slides[i].classList.add('on'); cur = i;
  tabs.forEach(function (t, k) { t.classList.toggle('on', k === i); });
  /* ilerleme çizgisini yeniden başlat */
  tabs[i].classList.remove('on'); void tabs[i].offsetWidth; tabs[i].classList.add('on');
  renderInfo(i); restart();
}
function restart() { clearInterval(timer); timer = setInterval(function () { go(cur + 1); }, 7000); }
tabs.forEach(function (t) { t.addEventListener('click', function () { go(+t.dataset.i); }); });
document.querySelectorAll('.sr-nav button').forEach(function (b) { b.addEventListener('click', function () { go(cur + +b.dataset.step); }); });
var sroom = document.querySelector('.showroom');
sroom.addEventListener('mouseenter', function () { clearInterval(timer); sroom.classList.add('paused'); });
sroom.addEventListener('mouseleave', function () { sroom.classList.remove('paused'); restart(); });
renderInfo(0); restart();
/* dokunmatik kaydırma */
var tx = 0; var stage = document.getElementById('stage');
stage.addEventListener('touchstart', function (e) { tx = e.touches[0].clientX; }, { passive: true });
stage.addEventListener('touchend', function (e) { var d = e.changedTouches[0].clientX - tx; if (Math.abs(d) > 40) go(cur + (d < 0 ? 1 : -1)); });

/* Paralaks bant */
var par = document.querySelector('[data-parallax]');
addEventListener('scroll', function () {
  var r = par.parentElement.getBoundingClientRect();
  if (r.bottom < 0 || r.top > innerHeight) return;
  var p = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;
  par.style.transform = 'translate3d(0,' + (p * -80).toFixed(1) + 'px,0)';
}, { passive: true });

/* Görüntüleyici (galeri ve model sayfaları ortak) */
var lb = document.createElement('div'); lb.className = 'lb';
lb.innerHTML = '<button class="x" aria-label="Kapat">✕</button><button class="p" aria-label="Önceki">←</button><img alt=""><span class="lb__n"></span><button class="n" aria-label="Sonraki">→</button>';
document.body.appendChild(lb);
var li = lb.querySelector('img'), ln = lb.querySelector('.lb__n'), list = [], k = 0;
function show(i) { k = (i + list.length) % list.length; li.src = list[k].src; li.alt = list[k].alt || ''; ln.textContent = (k + 1) + ' / ' + list.length; }
function openLb(arr, i) { list = arr; show(i); lb.classList.add('open'); document.body.style.overflow = 'hidden'; }
function closeLb() { lb.classList.remove('open'); if (!mg.classList.contains('open')) document.body.style.overflow = ''; }
lb.querySelector('.x').onclick = closeLb;
lb.querySelector('.p').onclick = function () { show(k - 1); };
lb.querySelector('.n').onclick = function () { show(k + 1); };
lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
var lx = 0;
lb.addEventListener('touchstart', function (e) { lx = e.touches[0].clientX; }, { passive: true });
lb.addEventListener('touchend', function (e) { var d = e.changedTouches[0].clientX - lx; if (Math.abs(d) > 40) show(k + (d < 0 ? 1 : -1)); });

var mosaic = [].slice.call(document.querySelectorAll('.mosaic a'));
var mosaicList = mosaic.map(function (a) { return { src: a.href, alt: a.querySelector('img').alt }; });
mosaic.forEach(function (a, i) { a.addEventListener('click', function (e) { e.preventDefault(); openLb(mosaicList, i); }); });

/* Model galerisi */
function waLink(v) { return 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent('Merhaba, ' + v + ' için kabin fiyatı almak istiyorum.'); }
var mg = document.createElement('div'); mg.className = 'mg'; mg.setAttribute('role', 'dialog'); mg.setAttribute('aria-modal', 'true');
mg.innerHTML = '<div class="mg__bar"><div class="mg__t" lang="en"><small></small><b></b></div><span class="mg__c"></span>' +
  '<a class="btn btn--ghost mg__wa" target="_blank" rel="noopener">Bu model için fiyat sor</a><button class="mg__x" aria-label="Kapat">✕</button></div>' +
  '<div class="mg__body"><div class="mg__grid"></div><div class="mg__end"><p>Aracınıza uygun kabini birlikte seçelim.</p><a class="btn btn--solid mg__wa" target="_blank" rel="noopener">WhatsApp\'tan fiyat al</a></div></div>';
document.body.appendChild(mg);
var mgGrid = mg.querySelector('.mg__grid');
function openModel(a) {
  var slug = a.dataset.m, n = MODELLER[slug], v = a.dataset.v, arr = [], html = '';
  for (var i = 1; i <= n; i++) {
    var id = (i < 10 ? '0' : '') + i, base = 'images/modeller/' + slug + '/' + id;
    arr.push({ src: base + '.webp', alt: v + ' kabin ' + i });
    html += '<button style="--d:' + Math.min(i, 12) * 40 + 'ms"><img src="' + base + '-k.webp" alt="' + v + ' kabin ' + i + '" loading="lazy"></button>';
  }
  mg.querySelector('.mg__t small').textContent = a.querySelector('small').textContent;
  mg.querySelector('.mg__t b').textContent = a.querySelector('b').textContent;
  mg.querySelector('.mg__c').textContent = n + ' fotoğraf';
  mg.querySelectorAll('.mg__wa').forEach(function (w) { w.href = waLink(v); });
  mgGrid.innerHTML = html;
  mgGrid.querySelectorAll('button').forEach(function (b, i) { b.onclick = function () { openLb(arr, i); }; });
  mg.querySelector('.mg__body').scrollTop = 0;
  mg.classList.add('open'); document.body.style.overflow = 'hidden';
  history.pushState({ m: slug }, '', '#' + slug);
}
function closeModel(fromPop) { if (!mg.classList.contains('open')) return; mg.classList.remove('open'); document.body.style.overflow = ''; if (!fromPop && history.state && history.state.m) history.back(); }
mg.querySelector('.mg__x').onclick = function () { closeModel(); };
addEventListener('popstate', function () { closeLb(); closeModel(true); });

document.querySelectorAll('#fitList a').forEach(function (a) {
  if (a.dataset.m && MODELLER[a.dataset.m]) {
    a.href = '#' + a.dataset.m;
    a.addEventListener('click', function (e) { e.preventDefault(); openModel(a); });
  } else { a.href = waLink(a.dataset.v); a.target = '_blank'; a.rel = 'noopener'; }
});
/* Bağlantı ile doğrudan açma: index.html#toyota-hilux */
var startM = location.hash.slice(1), startA = startM && document.querySelector('#fitList a[data-m="' + startM + '"]');
if (startA) { history.replaceState(null, '', location.pathname); openModel(startA); }

addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    if (lb.classList.contains('open')) closeLb(); else if (mg.classList.contains('open')) closeModel();
    if (document.body.classList.contains('menu-open')) mbtn.click();
  }
  if (!lb.classList.contains('open')) return;
  if (e.key === 'ArrowLeft') show(k - 1); if (e.key === 'ArrowRight') show(k + 1);
});

document.getElementById('yr').textContent = new Date().getFullYear();
