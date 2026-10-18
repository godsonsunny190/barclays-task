/**
 * Barclays — main script
 */

(function () {
  'use strict';

  /* ---------- Header + back to top + Lenis ---------- */
  var header = document.getElementById('header');
  var backToTop = document.getElementById('backToTop');

  var lenis = null;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      autoRaf: true,
      duration: 1.2,
      easing: function (t) {
        return Math.min(1, 1.001 - Math.pow(2, -10 * t));
      },
      smoothWheel: true,
      touchMultiplier: 1.5,
      infinite: false
    });
    window.lenis = lenis;

    lenis.on('scroll', function (e) {
      var scrolled = (e.scroll || window.scrollY) > 40;
      if (header) header.classList.toggle('header--scrolled', scrolled);
      if (backToTop) backToTop.classList.toggle('back-to-top--visible', scrolled);
    });
  } else {
    window.addEventListener('scroll', function () {
      var scrolled = window.scrollY > 40;
      if (header) header.classList.toggle('header--scrolled', scrolled);
      if (backToTop) backToTop.classList.toggle('back-to-top--visible', scrolled);
    });
  }

  if (backToTop) {
    backToTop.addEventListener('click', function (e) {
      e.preventDefault();
      if (lenis) {
        lenis.scrollTo(0, { duration: 1.2 });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  /* ---------- Smooth Anchor Links via Lenis ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var href = anchor.getAttribute('href');
      if (href && href !== '#' && href.startsWith('#')) {
        var targetEl = document.querySelector(href);
        if (targetEl) {
          e.preventDefault();
          if (lenis) {
            lenis.scrollTo(targetEl, { offset: -70, duration: 1.2 });
          } else {
            targetEl.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }
    });
  });

  /* ---------- Tabs ---------- */
  var tabBtns = document.querySelectorAll('.tabs__btn');
  var tabPanels = document.querySelectorAll('.tabs__panel');

  tabBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var tabKey = btn.getAttribute('data-tab');
      var targetId = 'panel-' + tabKey;

      tabBtns.forEach(function (b) {
        b.classList.remove('tabs__btn--active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('tabs__btn--active');
      btn.setAttribute('aria-selected', 'true');

      tabPanels.forEach(function (panel) {
        if (panel.id === targetId) {
          panel.hidden = false;
          // Trigger smooth fade & rise
          setTimeout(function () {
            panel.classList.add('tabs__panel--active');
          }, 20);
        } else {
          panel.classList.remove('tabs__panel--active');
          panel.hidden = true;
        }
      });
    });
  });

  /* ---------- Search modal ---------- */
  var searchModal = document.getElementById('searchModal');
  var searchBtn = document.getElementById('searchBtn');
  var searchInput = document.getElementById('searchInput');

  function openSearch() {
    searchModal.classList.add('search--open');
    if (lenis) lenis.stop();
    setTimeout(function () { searchInput.focus(); }, 100);
  }

  function closeSearch() {
    searchModal.classList.remove('search--open');
    if (lenis) lenis.start();
  }

  searchBtn.addEventListener('click', openSearch);
  searchModal.addEventListener('click', function (e) {
    if (e.target === searchModal) { closeSearch(); }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeSearch(); }
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      openSearch();
    }
  });

  /* ---------- Mobile drawer ---------- */
  var menuBtn = document.getElementById('menuBtn');
  var mobileDrawer = document.getElementById('mobileDrawer');
  var drawerOverlay = document.getElementById('drawerOverlay');
  var closeDrawer = document.getElementById('closeDrawer');

  function openDrawer() {
    mobileDrawer.classList.add('drawer--open');
    drawerOverlay.classList.add('overlay--open');
    if (lenis) lenis.stop();
  }

  function closeDrawerFn() {
    mobileDrawer.classList.remove('drawer--open');
    drawerOverlay.classList.remove('overlay--open');
    if (lenis) lenis.start();
  }

  menuBtn.addEventListener('click', openDrawer);
  closeDrawer.addEventListener('click', closeDrawerFn);
  drawerOverlay.addEventListener('click', closeDrawerFn);

  /* ---------- Cookie banner ---------- */
  var cookieBanner = document.getElementById('cookieBanner');

  function hideCookie() {
    cookieBanner.classList.remove('cookie--show');
  }

  setTimeout(function () { cookieBanner.classList.add('cookie--show'); }, 1200);
  document.getElementById('cookieAccept').addEventListener('click', hideCookie);
  document.getElementById('cookieManage').addEventListener('click', hideCookie);

  /* ---------- Reveal on scroll ---------- */
  function checkReveal() {
    document.querySelectorAll('.reveal:not(.reveal--visible)').forEach(function (el) {
      var rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight + 100) {
        el.classList.add('reveal--visible');
      }
    });
  }

  // Trigger immediately so visible elements never stay hidden
  checkReveal();

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal--visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px 120px 0px' });

    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
  }

  window.addEventListener('scroll', checkReveal, { passive: true });
  setTimeout(checkReveal, 200);
  setTimeout(checkReveal, 600);

  /* ---------- Animated counters ---------- */
  function animateCount(el) {
    var target = parseFloat(el.dataset.target);
    var suffix = el.dataset.suffix || '';
    var decimal = parseInt(el.dataset.decimal || '0', 10);
    var duration = 1800;
    var start = null;

    function step(ts) {
      if (!start) { start = ts; }
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * eased).toLocaleString('en-US', {
        maximumFractionDigits: decimal,
        minimumFractionDigits: decimal
      }) + suffix;
      if (p < 1) { requestAnimationFrame(step); }
    }

    requestAnimationFrame(step);
  }

  var statIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        statIO.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  document.querySelectorAll('.stat-card__value').forEach(function (el) { statIO.observe(el); });

  /* ---------- Swiper Sliders ---------- */
  if (typeof Swiper !== 'undefined') {
    // Hero Swiper
    if (document.getElementById('heroSwiper')) {
      new Swiper('#heroSwiper', {
        loop: true,
        speed: 750,
        effect: 'fade',
        fadeEffect: {
          crossFade: true
        },
        autoplay: {
          delay: 5500,
          disableOnInteraction: false,
          pauseOnMouseEnter: true
        },
        pagination: {
          el: '.hero-swiper__pagination',
          clickable: true
        },
        navigation: {
          nextEl: '.hero-swiper__next',
          prevEl: '.hero-swiper__prev'
        },
        keyboard: {
          enabled: true,
          onlyInViewport: true
        }
      });
    }
  }
})();
