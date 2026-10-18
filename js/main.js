(function(){
  var header = document.getElementById('header');
  var backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', function(){
    if(window.scrollY > 40){ header.classList.add('scrolled'); backToTop.classList.add('visible'); }
    else { header.classList.remove('scrolled'); backToTop.classList.remove('visible'); }
  });
  backToTop.addEventListener('click', function(){ window.scrollTo({top:0, behavior:'smooth'}); });
  var tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach(function(btn){ btn.addEventListener('click', function(){ tabBtns.forEach(function(b){ b.classList.remove('active'); }); btn.classList.add('active'); }); });
  var searchModal = document.getElementById('searchModal');
  var searchBtn = document.getElementById('searchBtn');
  var searchInput = document.getElementById('searchInput');
  searchBtn.addEventListener('click', function(){ searchModal.classList.add('open'); setTimeout(function(){ searchInput.focus(); }, 100); });
  searchModal.addEventListener('click', function(e){ if(e.target === searchModal) searchModal.classList.remove('open'); });
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape') searchModal.classList.remove('open');
    if((e.metaKey || e.ctrlKey) && e.key === 'k'){ e.preventDefault(); searchModal.classList.add('open'); setTimeout(function(){ searchInput.focus(); }, 100); }
  });
  var menuBtn = document.getElementById('menuBtn');
  var mobileDrawer = document.getElementById('mobileDrawer');
  var drawerOverlay = document.getElementById('drawerOverlay');
  var closeDrawer = document.getElementById('closeDrawer');
  function openDrawer(){ mobileDrawer.classList.add('open'); drawerOverlay.classList.add('open'); }
  function closeDrawerFn(){ mobileDrawer.classList.remove('open'); drawerOverlay.classList.remove('open'); }
  menuBtn.addEventListener('click', openDrawer);
  closeDrawer.addEventListener('click', closeDrawerFn);
  drawerOverlay.addEventListener('click', closeDrawerFn);
  var cookieBanner = document.getElementById('cookieBanner');
  var cookieAccept = document.getElementById('cookieAccept');
  var cookieManage = document.getElementById('cookieManage');
  setTimeout(function(){ cookieBanner.classList.add('show'); }, 1200);
  function hideCookie(){ cookieBanner.classList.remove('show'); }
  cookieAccept.addEventListener('click', hideCookie);
  cookieManage.addEventListener('click', hideCookie);
  var reveals = document.querySelectorAll('.reveal');
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(entry, i){
      if(entry.isIntersecting){ setTimeout(function(){ entry.target.classList.add('visible'); }, i * 60); io.unobserve(entry.target); }
    });
  }, { threshold: 0.12 });
  reveals.forEach(function(el){ io.observe(el); });
  function animateCount(el){
    var target = parseFloat(el.dataset.target);
    var suffix = el.dataset.suffix || '';
    var decimal = parseInt(el.dataset.decimal || '0');
    var duration = 1800, start = null;
    function step(ts){
      if(!start) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * eased).toLocaleString('en-US', {maximumFractionDigits:decimal, minimumFractionDigits:decimal}) + suffix;
      if(p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var statNums = document.querySelectorAll('.stat-num');
  var statIO = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){ if(entry.isIntersecting){ animateCount(entry.target); statIO.unobserve(entry.target); } });
  }, { threshold: 0.4 });
  statNums.forEach(function(el){ statIO.observe(el); });
  // Functional featured-story slider: dots update the copy and background image.
  var slides = [
    { eyebrow: 'Featured Insight · Cover Story', title: 'Two years in, this is what the nature-positive market needs to mature', description: 'As biodiversity markets evolve from ambition to implementation, our analysts map the structural gaps — and the instruments that can close them.', image: 'assets/images/img-01.jpg', alt: 'London financial district skyline at dusk' },
    { eyebrow: 'Markets · Research', title: 'Building resilience in a changing global economy', description: 'Explore the forces reshaping financial markets and the practical strategies helping businesses prepare for what comes next.', image: 'assets/images/img-06.jpg', alt: 'Modern financial district architecture' },
    { eyebrow: 'Sustainability · Perspective', title: 'Turning long-term climate goals into measurable progress', description: 'Discover how investment, innovation, and collaboration can accelerate the transition to a more sustainable future.', image: 'assets/images/img-07.jpg', alt: 'Sustainable modern city' },
    { eyebrow: 'People · Ideas', title: 'The ideas and partnerships shaping tomorrow', description: 'Meet the people connecting capital, communities, and opportunity to create lasting impact around the world.', image: 'assets/images/img-08.jpg', alt: 'Contemporary city and business district' }
  ];
  var dots = document.querySelectorAll('.hero-slider-controls .dot');
  var currentDot = 0;
  var heroImage = document.getElementById('heroImage');
  var heroEyebrow = document.getElementById('heroEyebrow');
  var heroTitle = document.getElementById('heroTitle');
  var heroDescription = document.getElementById('heroDescription');
  var sliderTimer;
  function showSlide(index) {
    currentDot = (index + slides.length) % slides.length;
    var slide = slides[currentDot];
    heroEyebrow.textContent = slide.eyebrow;
    heroTitle.textContent = slide.title;
    heroDescription.textContent = slide.description;
    heroImage.src = slide.image;
    heroImage.alt = slide.alt;
    dots.forEach(function(dot, i) {
      dot.classList.toggle('active', i === currentDot);
      dot.setAttribute('aria-pressed', i === currentDot ? 'true' : 'false');
    });
  }
  function startSliderTimer() {
    window.clearInterval(sliderTimer);
    sliderTimer = window.setInterval(function() { showSlide(currentDot + 1); }, 6000);
  }
  dots.forEach(function(dot, i) {
    dot.addEventListener('click', function() { showSlide(i); startSliderTimer(); });
  });
  var hero = document.querySelector('.hero');
  if (hero) {
    hero.addEventListener('mouseenter', function() { window.clearInterval(sliderTimer); });
    hero.addEventListener('mouseleave', startSliderTimer);
    hero.addEventListener('focusin', function() { window.clearInterval(sliderTimer); });
    hero.addEventListener('focusout', startSliderTimer);
    startSliderTimer();
  }

  // Functional horizontal business-card carousel with previous/next controls.
  var businessCarousel = document.querySelector('.business-carousel');
  document.querySelectorAll('[data-scroll]').forEach(function(button) {
    button.addEventListener('click', function() {
      if (!businessCarousel) return;
      var direction = button.getAttribute('data-scroll') === 'next' ? 1 : -1;
      var card = businessCarousel.querySelector('.div-card');
      var amount = card ? card.getBoundingClientRect().width + 20 : 300;
      businessCarousel.scrollBy({ left: direction * amount, behavior: 'smooth' });
    });
  });
})();
