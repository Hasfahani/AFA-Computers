/* ============================================================
   AFA Computers — Custom JavaScript
   Language toggle, mobile menu, product filters, animations
   ============================================================ */

(function () {
    'use strict';

    // ---- Language Toggle ----
    var langBtn = document.getElementById('lang-toggle');
    var html = document.documentElement;

    if (langBtn) {
        // Check for saved language preference
        var savedLang = localStorage.getItem('afa-lang');
        if (savedLang === 'ar') {
            html.setAttribute('lang', 'ar');
            html.setAttribute('dir', 'rtl');
            langBtn.setAttribute('aria-label', 'Switch to English');
        }

        langBtn.addEventListener('click', function () {
            var current = html.getAttribute('lang');
            if (current === 'en') {
                html.setAttribute('lang', 'ar');
                html.setAttribute('dir', 'rtl');
                langBtn.setAttribute('aria-label', 'Switch to English');
                localStorage.setItem('afa-lang', 'ar');
            } else {
                html.setAttribute('lang', 'en');
                html.setAttribute('dir', 'ltr');
                langBtn.setAttribute('aria-label', 'Switch to Arabic');
                localStorage.setItem('afa-lang', 'en');
            }
        });
    }

    // ---- Mobile Menu ----
    var menuBtn = document.getElementById('mobile-menu-btn');
    var mainNav = document.getElementById('main-nav');

    if (menuBtn && mainNav) {
        menuBtn.addEventListener('click', function () {
            var isOpen = mainNav.classList.toggle('open');
            menuBtn.classList.toggle('active');
            menuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            menuBtn.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
        });

        // Close menu when a link is clicked
        var navLinks = mainNav.querySelectorAll('a');
        for (var i = 0; i < navLinks.length; i++) {
            navLinks[i].addEventListener('click', function () {
                mainNav.classList.remove('open');
                menuBtn.classList.remove('active');
                menuBtn.setAttribute('aria-expanded', 'false');
            });
        }

        // Close menu on outside click
        document.addEventListener('click', function (e) {
            if (!mainNav.contains(e.target) && !menuBtn.contains(e.target) && mainNav.classList.contains('open')) {
                mainNav.classList.remove('open');
                menuBtn.classList.remove('active');
                menuBtn.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // ---- Product Category Filter ----
    var tabBtns = document.querySelectorAll('.tab-btn');
    var productCards = document.querySelectorAll('.product-card');

    for (var t = 0; t < tabBtns.length; t++) {
        tabBtns[t].addEventListener('click', function () {
            var tab = this.getAttribute('data-tab');

            // Update active tab
            for (var j = 0; j < tabBtns.length; j++) {
                tabBtns[j].classList.remove('active');
                tabBtns[j].setAttribute('aria-selected', 'false');
            }
            this.classList.add('active');
            this.setAttribute('aria-selected', 'true');

            // Filter products
            for (var k = 0; k < productCards.length; k++) {
                var card = productCards[k];
                var match = tab === 'all' || card.getAttribute('data-category') === tab;
                card.classList.toggle('hidden', !match);
            }
        });
    }

    // ---- Back to Top ----
    var backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 500) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }, { passive: true });
    }

    // ---- Header scroll shadow ----
    var header = document.getElementById('header');
    if (header) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 10) {
                header.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
            } else {
                header.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)';
            }
        }, { passive: true });
    }

    // ---- Scroll animations (Intersection Observer) ----
    if ('IntersectionObserver' in window) {
        var animatedElements = document.querySelectorAll(
            '.service-card, .trust-item, .product-card, .step, .testimonial-card, .faq-item, .build-content, .contact-card, .contact-form-wrap'
        );

        for (var a = 0; a < animatedElements.length; a++) {
            animatedElements[a].classList.add('fade-up');
        }

        var observer = new IntersectionObserver(function (entries) {
            for (var e = 0; e < entries.length; e++) {
                if (entries[e].isIntersecting) {
                    entries[e].target.classList.add('visible');
                    observer.unobserve(entries[e].target);
                }
            }
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -40px 0px'
        });

        for (var b = 0; b < animatedElements.length; b++) {
            observer.observe(animatedElements[b]);
        }
    }

    // ---- Smooth scrolling for anchor links (fallback for older browsers) ----
    var anchorLinks = document.querySelectorAll('a[href^="#"]');
    for (var s = 0; s < anchorLinks.length; s++) {
        anchorLinks[s].addEventListener('click', function (e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#' || targetId === '#top') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }
            var target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                var headerHeight = document.getElementById('header') ? document.getElementById('header').offsetHeight : 0;
                var top = target.getBoundingClientRect().top + window.scrollY - headerHeight;
                window.scrollTo({ top: top, behavior: 'smooth' });
            }
        });
    }

    // ---- Product image zoom (simple lightbox) ----
    var zoomBtns = document.querySelectorAll('.product-zoom');
    for (var z = 0; z < zoomBtns.length; z++) {
        zoomBtns[z].addEventListener('click', function (e) {
            e.preventDefault();
            var imgSrc = this.getAttribute('href');
            if (!imgSrc) return;

            // Create overlay
            var overlay = document.createElement('div');
            overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.85);z-index:100001;display:flex;align-items:center;justify-content:center;cursor:pointer;padding:24px;';

            var img = document.createElement('img');
            img.src = imgSrc;
            img.alt = 'Product image';
            img.style.cssText = 'max-width:100%;max-height:90vh;border-radius:8px;box-shadow:0 4px 24px rgba(0,0,0,0.3);';

            overlay.appendChild(img);
            document.body.appendChild(overlay);

            // Close on click
            overlay.addEventListener('click', function () {
                document.body.removeChild(overlay);
            });

            // Close on Escape
            var closeOnEscape = function (evt) {
                if (evt.key === 'Escape') {
                    if (overlay.parentNode) {
                        document.body.removeChild(overlay);
                    }
                    document.removeEventListener('keydown', closeOnEscape);
                }
            };
            document.addEventListener('keydown', closeOnEscape);
        });
    }

})();
