/**
 * Valley Farm - Sliders & Interactive Carousels Module
 * Handles Hero Banner Slider (image-only with responsive <picture>),
 * Product horizontal scrollers, Brand Reels slider, and Testimonial slider with touch support.
 */

window.ValleySliders = (function() {
  // Hero Slider State
  let heroCurrentIndex = 0;
  let heroAutoTimer = null;
  const HERO_INTERVAL = 6000;
  let heroTouchStartX = 0;
  let heroTouchEndX = 0;

  // Testimonial Slider State
  let testCurrentIndex = 0;

  function init() {
    initHeroSlider();
    initReelsSection();
    initTestimonialsSlider();
    initScrollButtons();
  }

  /* ==========================================================================
     HERO BANNER SLIDER (IMAGE ONLY, RESPONSIVE PICTURE)
     ========================================================================== */
  function initHeroSlider() {
    const slider = document.getElementById("hero-banner-slider");
    if (!slider) return;

    const slides = slider.querySelectorAll(".hero-slide");
    const dotsContainer = document.getElementById("hero-slider-dots");
    const prevBtn = document.getElementById("hero-prev-btn");
    const nextBtn = document.getElementById("hero-next-btn");

    if (slides.length === 0) return;

    // Build dots
    if (dotsContainer) {
      dotsContainer.innerHTML = "";
      slides.forEach((_, idx) => {
        const dot = document.createElement("button");
        dot.className = `slider-dot ${idx === 0 ? 'is-active' : ''}`;
        dot.setAttribute("aria-label", `Go to slide ${idx + 1}`);
        dot.onclick = () => goToHeroSlide(idx);
        dotsContainer.appendChild(dot);
      });
    }

    function updateSlideClasses() {
      slides.forEach((slide, idx) => {
        slide.classList.toggle("is-active", idx === heroCurrentIndex);
      });
      if (dotsContainer) {
        const dots = dotsContainer.querySelectorAll(".slider-dot");
        dots.forEach((dot, idx) => {
          dot.classList.toggle("is-active", idx === heroCurrentIndex);
        });
      }
    }

    function goToHeroSlide(index) {
      heroCurrentIndex = (index + slides.length) % slides.length;
      updateSlideClasses();
      restartHeroTimer();
    }

    function nextHeroSlide() {
      goToHeroSlide(heroCurrentIndex + 1);
    }

    function prevHeroSlide() {
      goToHeroSlide(heroCurrentIndex - 1);
    }

    if (prevBtn) prevBtn.onclick = prevHeroSlide;
    if (nextBtn) nextBtn.onclick = nextHeroSlide;

    // Autoplay timer
    function startHeroTimer() {
      stopHeroTimer();
      heroAutoTimer = setInterval(nextHeroSlide, HERO_INTERVAL);
    }

    function stopHeroTimer() {
      if (heroAutoTimer) {
        clearInterval(heroAutoTimer);
        heroAutoTimer = null;
      }
    }

    function restartHeroTimer() {
      stopHeroTimer();
      startHeroTimer();
    }

    slider.addEventListener("mouseenter", stopHeroTimer);
    slider.addEventListener("mouseleave", startHeroTimer);
    slider.addEventListener("focusin", stopHeroTimer);
    slider.addEventListener("focusout", startHeroTimer);

    // Touch swipe support
    slider.addEventListener("touchstart", (e) => {
      heroTouchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    slider.addEventListener("touchend", (e) => {
      heroTouchEndX = e.changedTouches[0].screenX;
      handleHeroSwipe();
    }, { passive: true });

    function handleHeroSwipe() {
      const diff = heroTouchStartX - heroTouchEndX;
      if (Math.abs(diff) > 45) {
        if (diff > 0) {
          nextHeroSlide(); // Swiped left -> next
        } else {
          prevHeroSlide(); // Swiped right -> prev
        }
      }
    }

    // Initial state
    updateSlideClasses();
    startHeroTimer();
  }

  /* ==========================================================================
     BRAND REELS SECTION & VIDEO MODAL
     ========================================================================== */
  function initReelsSection() {
    const container = document.getElementById("reels-track");
    if (!container || !window.VALLEY_DATA) return;

    const reels = window.VALLEY_DATA.reels;
    let html = "";

    reels.forEach(reel => {
      const product = window.VALLEY_DATA.getProductById(reel.productId);
      html += `
        <div class="vf-reel-card" data-reel-id="${reel.id}">
          <div class="reel-media-wrapper" onclick="ValleySliders.openReelModal('${reel.id}')">
            <img src="${reel.poster}" alt="${reel.title}" class="reel-poster-img" loading="lazy" />
            <div class="reel-play-overlay">
              <div class="reel-play-pill">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#173D2A">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
                <span>${reel.duration}</span>
              </div>
            </div>
            <div class="reel-views-pill">👁 ${reel.views}</div>
            <div class="reel-title-overlay">
              <h4 class="reel-headline">${reel.title}</h4>
              <p class="reel-caption">${reel.caption}</p>
            </div>
          </div>

          <!-- Product Attached To Reel -->
          ${product ? `
            <div class="reel-product-bar">
              <img src="${product.image}" alt="${product.name}" class="reel-product-thumb" />
              <div class="reel-product-info">
                <strong class="reel-product-name">${product.name}</strong>
                <span class="reel-product-price">₹${product.basePrice}</span>
              </div>
              <button type="button" class="btn btn-reel-cart" 
                aria-label="Add ${product.name} to cart"
                title="Add to cart"
                onclick="ValleySliders.addReelProductToCart('${product.id}')">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
              </button>
            </div>
          ` : ''}
        </div>
      `;
    });

    container.innerHTML = html;
  }

  function addReelProductToCart(productId) {
    const product = window.VALLEY_DATA.getProductById(productId);
    if (!product) return;
    window.ValleyCart.addItem(product, product.variants[0]?.id, 1);
    if (window.ValleyApp && window.ValleyApp.showToast) {
      window.ValleyApp.showToast(`Added ${product.name} to cart!`, "success");
    }
    if (window.ValleyApp && window.ValleyApp.openCartDrawer) {
      window.ValleyApp.openCartDrawer();
    }
  }

  function openReelModal(reelId) {
    const reel = window.VALLEY_DATA.reels.find(r => r.id === reelId);
    if (!reel) return;

    const modal = document.getElementById("reel-video-modal");
    const body = document.getElementById("reel-modal-body");
    if (!modal || !body) return;

    const product = window.VALLEY_DATA.getProductById(reel.productId);

    body.innerHTML = `
      <div class="reel-modal-content">
        <div class="reel-stage">
          <img src="${reel.poster}" alt="${reel.title}" class="reel-stage-poster" />
          <div class="reel-simulated-player">
            <div class="reel-player-badge">
              <span class="pulsing-red-dot"></span> LIVE FROM THE VALLEY
            </div>
            <div class="reel-player-center-play">
              <div class="play-circle-large">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="#245C3A">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
              </div>
            </div>
            <div class="reel-player-progress-bar">
              <div class="progress-fill"></div>
            </div>
          </div>
        </div>

        <div class="reel-modal-sidebar">
          <div class="sidebar-header">
            <span class="reel-tag">Farm Moment</span>
            <h3>${reel.title}</h3>
            <p>${reel.caption}</p>
          </div>

          <div class="reel-metrics-row">
            <span>❤️ ${reel.likes} likes</span>
            <span>👁 ${reel.views} views</span>
            <span>⏱ ${reel.duration} clip</span>
          </div>

          ${product ? `
            <div class="reel-modal-product-card">
              <span class="featured-label">Featured Farm Product</span>
              <div class="reel-card-inner">
                <img src="${product.image}" alt="${product.name}" />
                <div>
                  <h4>${product.name}</h4>
                  <p class="price">₹${product.basePrice} <span class="unit">/ ${product.unit}</span></p>
                </div>
              </div>
              <div class="reel-card-buttons">
                <button type="button" class="btn btn-primary" onclick="ValleySliders.addReelProductToCart('${product.id}'); ValleySliders.closeReelModal();">
                  Add to Cart • ₹${product.basePrice}
                </button>
                <button type="button" class="btn btn-secondary" onclick="ValleySliders.closeReelModal(); ValleyProducts.openQuickView('${product.id}');">
                  View Details
                </button>
              </div>
            </div>
          ` : ''}
        </div>
      </div>
    `;

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeReelModal() {
    const modal = document.getElementById("reel-video-modal");
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  /* ==========================================================================
     TESTIMONIALS SLIDER
     ========================================================================== */
  function initTestimonialsSlider() {
    const container = document.getElementById("testimonials-track");
    if (!container || !window.VALLEY_DATA) return;

    const testimonials = window.VALLEY_DATA.testimonials;
    let html = "";

    testimonials.forEach((item, idx) => {
      html += `
        <div class="vf-testimonial-card ${idx === 0 ? 'is-active' : ''}" data-index="${idx}">
          <div class="card-quote-mark">“</div>
          <div class="testimonial-stars" aria-label="${item.rating} out of 5 stars">
            ${Array(item.rating).fill('★').join('')}
          </div>
          <p class="testimonial-quote">${item.quote}</p>
          <div class="testimonial-footer">
            <div class="testimonial-avatar">${item.avatarInitial}</div>
            <div class="testimonial-author">
              <strong>${item.name}</strong>
              <span>${item.location} • <span class="verified-buyer">✓ Verified Customer</span></span>
              <div class="testimonial-tag">Purchased: ${item.productTag}</div>
            </div>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;

    const prevBtn = document.getElementById("test-prev-btn");
    const nextBtn = document.getElementById("test-next-btn");

    function updateTestimonialView() {
      const cards = container.querySelectorAll(".vf-testimonial-card");
      cards.forEach((card, idx) => {
        card.classList.toggle("is-active", idx === testCurrentIndex);
      });
    }

    if (prevBtn) {
      prevBtn.onclick = () => {
        testCurrentIndex = (testCurrentIndex - 1 + testimonials.length) % testimonials.length;
        updateTestimonialView();
      };
    }

    if (nextBtn) {
      nextBtn.onclick = () => {
        testCurrentIndex = (testCurrentIndex + 1) % testimonials.length;
        updateTestimonialView();
      };
    }
  }

  /* ==========================================================================
     HORIZONTAL SCROLL BUTTONS
     ========================================================================== */
  function initScrollButtons() {
    // Category rail scroll
    const catRail = document.getElementById("category-rail-container");
    const catPrev = document.getElementById("cat-rail-prev");
    const catNext = document.getElementById("cat-rail-next");
    if (catRail && catPrev && catNext) {
      catPrev.onclick = () => catRail.scrollBy({ left: -240, behavior: "smooth" });
      catNext.onclick = () => catRail.scrollBy({ left: 240, behavior: "smooth" });
    }

    // Featured products scroll
    const prodTrack = document.getElementById("featured-products-grid");
    const prodPrev = document.getElementById("prod-scroll-prev");
    const prodNext = document.getElementById("prod-scroll-next");
    if (prodTrack && prodPrev && prodNext) {
      prodPrev.onclick = () => prodTrack.scrollBy({ left: -340, behavior: "smooth" });
      prodNext.onclick = () => prodTrack.scrollBy({ left: 340, behavior: "smooth" });
    }

    // Reels track scroll
    const reelTrack = document.getElementById("reels-track");
    const reelPrev = document.getElementById("reels-prev-btn");
    const reelNext = document.getElementById("reels-next-btn");
    if (reelTrack && reelPrev && reelNext) {
      reelPrev.onclick = () => reelTrack.scrollBy({ left: -300, behavior: "smooth" });
      reelNext.onclick = () => reelTrack.scrollBy({ left: 300, behavior: "smooth" });
    }

    // Modal close hooks
    const closeBtn = document.getElementById("reel-modal-close-btn");
    const backdrop = document.getElementById("reel-modal-backdrop");
    if (closeBtn) closeBtn.onclick = closeReelModal;
    if (backdrop) backdrop.onclick = closeReelModal;

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeReelModal();
    });
  }

  return {
    init,
    openReelModal,
    closeReelModal,
    addReelProductToCart
  };
})();
