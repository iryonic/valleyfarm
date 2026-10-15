/**
 * Valley Farm - Main Application Controller
 * Handles header interactions, search modal, cart drawer UI, account panel,
 * mobile navigation drawer, newsletter validation, toast messages, and footer accordions.
 */

window.ValleyApp = (function() {
  function init() {
    initDynamicYear();
    initCartDrawerUI();
    initSearchModal();
    initAccountDrawer();
    initMobileNav();
    initNewsletterForm();
    initFooterAccordions();
    initToastContainer();
    initNavLinks();

    // Listen to cart updates
    window.addEventListener("valley:cart-updated", function(e) {
      updateCartBadge(e.detail);
      renderCartDrawer(e.detail);
    });

    // Initial cart render
    const initialSummary = window.ValleyCart.getSummary();
    updateCartBadge(initialSummary);
    renderCartDrawer(initialSummary);
  }

  function initDynamicYear() {
    const yearEl = document.getElementById("current-year");
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }
  }

  /* ==========================================================================
     CART BADGE & CART DRAWER
     ========================================================================== */
  function updateCartBadge(summary) {
    const badges = document.querySelectorAll(".nav-cart-badge");
    badges.forEach(b => {
      b.textContent = summary.itemCount;
      b.classList.toggle("is-visible", summary.itemCount > 0);
    });
  }

  function renderCartDrawer(summary) {
    const listContainer = document.getElementById("cart-drawer-items");
    const countBadge = document.getElementById("cart-drawer-count");
    const subtotalEl = document.getElementById("cart-subtotal-val");
    const deliveryEl = document.getElementById("cart-delivery-val");
    const totalEl = document.getElementById("cart-total-val");
    const emptyState = document.getElementById("cart-drawer-empty");
    const filledState = document.getElementById("cart-drawer-filled");
    const progressFill = document.getElementById("free-delivery-progress-fill");
    const progressText = document.getElementById("free-delivery-progress-text");

    if (countBadge) countBadge.textContent = `${summary.itemCount} items`;
    if (subtotalEl) subtotalEl.textContent = `₹${summary.subtotal}`;
    if (deliveryEl) {
      deliveryEl.innerHTML = summary.deliveryFee === 0 
        ? `<strong class="free-text">FREE</strong>` 
        : `₹${summary.deliveryFee}`;
    }
    if (totalEl) totalEl.textContent = `₹${summary.total}`;

    // Delivery progress bar
    if (progressFill && progressText) {
      progressFill.style.width = `${summary.freeDeliveryProgress}%`;
      if (summary.isFreeDelivery) {
        progressText.innerHTML = `🎉 <strong>Congratulations!</strong> You unlocked FREE Farm Delivery.`;
      } else {
        progressText.innerHTML = `Add <strong>₹${summary.amountToFreeDelivery}</strong> more for <strong>FREE Farm Delivery</strong>`;
      }
    }

    if (summary.itemCount === 0) {
      if (emptyState) emptyState.style.display = "flex";
      if (filledState) filledState.style.display = "none";
      if (listContainer) {
        listContainer.style.display = "none";
        listContainer.innerHTML = "";
      }
      return;
    }

    if (emptyState) emptyState.style.display = "none";
    if (filledState) filledState.style.display = "block";
    if (listContainer) {
      listContainer.style.display = "flex";
    }

    let html = "";
    summary.items.forEach(item => {
      html += `
        <div class="cart-drawer-item" data-product-id="${item.productId}" data-variant-id="${item.variantId}">
          <img src="${item.image}" alt="${item.name}" class="cart-item-img" />
          <div class="cart-item-info">
            <h4 class="cart-item-title">${item.name}</h4>
            <span class="cart-item-variant">${item.variantName}</span>
            <div class="cart-item-pricing">
              <span class="cart-item-unit-price">₹${item.price}</span>
              ${item.originalPrice ? `<span class="cart-item-orig-price">₹${item.originalPrice}</span>` : ""}
            </div>
          </div>

          <div class="cart-item-controls">
            <button type="button" class="cart-item-remove-btn" 
              title="Remove item" 
              onclick="ValleyCart.removeItem('${item.productId}', '${item.variantId}')">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>

            <div class="custom-qty-selector mini">
              <button type="button" class="qty-btn minus-btn" 
                onclick="ValleyCart.updateQuantity('${item.productId}', '${item.variantId}', ${item.quantity - 1})">-</button>
              <span class="qty-display">${item.quantity}</span>
              <button type="button" class="qty-btn plus-btn" 
                onclick="ValleyCart.updateQuantity('${item.productId}', '${item.variantId}', ${item.quantity + 1})">+</button>
            </div>
          </div>
        </div>
      `;
    });

    listContainer.innerHTML = html;
  }

  function initCartDrawerUI() {
    const drawer = document.getElementById("cart-drawer");
    const backdrop = document.getElementById("cart-drawer-backdrop");
    const closeBtn = document.getElementById("cart-drawer-close-btn");
    const continueBtn = document.getElementById("cart-continue-shopping-btn");
    const checkoutBtn = document.getElementById("cart-checkout-btn");
    const emptyShopBtn = document.getElementById("cart-empty-shop-btn");

    // Open triggers in header
    const cartTriggers = document.querySelectorAll(".trigger-cart-drawer");
    cartTriggers.forEach(t => t.onclick = (e) => {
      e.preventDefault();
      openCartDrawer();
    });

    if (closeBtn) closeBtn.onclick = closeCartDrawer;
    if (backdrop) backdrop.onclick = closeCartDrawer;
    if (continueBtn) continueBtn.onclick = closeCartDrawer;
    if (emptyShopBtn) emptyShopBtn.onclick = () => {
      closeCartDrawer();
      const target = document.getElementById("fresh-picks-section");
      if (target) target.scrollIntoView({ behavior: "smooth" });
    };

    if (checkoutBtn) {
      checkoutBtn.onclick = () => {
        closeCartDrawer();
        if (window.ValleyCheckout) {
          window.ValleyCheckout.openCheckout();
        }
      };
    }

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && drawer && drawer.classList.contains("is-open")) {
        closeCartDrawer();
      }
    });
  }

  function openCartDrawer() {
    const drawer = document.getElementById("cart-drawer");
    if (!drawer) return;
    drawer.classList.add("is-open");
    drawer.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeCartDrawer() {
    const drawer = document.getElementById("cart-drawer");
    if (!drawer) return;
    drawer.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  /* ==========================================================================
     SEARCH MODAL
     ========================================================================== */
  function initSearchModal() {
    const modal = document.getElementById("search-modal");
    const input = document.getElementById("search-input-field");
    const resultsContainer = document.getElementById("search-results-list");
    const clearBtn = document.getElementById("search-clear-btn");
    const closeBtn = document.getElementById("search-modal-close");
    const backdrop = document.getElementById("search-backdrop");
    const triggers = document.querySelectorAll(".trigger-search-modal");

    if (!modal || !input || !resultsContainer) return;

    triggers.forEach(t => {
      t.onclick = (e) => {
        e.preventDefault();
        openSearchModal();
      };
    });

    if (closeBtn) closeBtn.onclick = closeSearchModal;
    if (backdrop) backdrop.onclick = closeSearchModal;

    if (clearBtn) {
      clearBtn.onclick = () => {
        input.value = "";
        clearBtn.style.display = "none";
        renderSearchResults("");
        input.focus();
      };
    }

    input.addEventListener("input", (e) => {
      const q = e.target.value.trim();
      if (clearBtn) clearBtn.style.display = q.length > 0 ? "block" : "none";
      renderSearchResults(q);
    });

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("is-open")) {
        closeSearchModal();
      }
    });

    function renderSearchResults(query) {
      if (!query || query.length === 0) {
        resultsContainer.innerHTML = `
          <div class="search-suggestions-box">
            <h4>Popular Farm Searches</h4>
            <div class="search-tag-cloud">
              <button type="button" class="search-tag-chip" onclick="ValleyApp.quickSearch('Eggs')">Brown Eggs</button>
              <button type="button" class="search-tag-chip" onclick="ValleyApp.quickSearch('Chicken Breast')">Chicken Breast</button>
              <button type="button" class="search-tag-chip" onclick="ValleyApp.quickSearch('Chicks')">Day-Old Chicks</button>
              <button type="button" class="search-tag-chip" onclick="ValleyApp.quickSearch('Honey')">Raw Honey</button>
              <button type="button" class="search-tag-chip" onclick="ValleyApp.quickSearch('Tray')">30 Egg Tray</button>
            </div>
          </div>
        `;
        return;
      }

      const q = query.toLowerCase();
      const matches = window.VALLEY_DATA.products.filter(p => {
        return p.name.toLowerCase().includes(q) ||
               p.category.toLowerCase().includes(q) ||
               p.categoryName.toLowerCase().includes(q) ||
               p.unit.toLowerCase().includes(q) ||
               p.shortDesc.toLowerCase().includes(q);
      });

      if (matches.length === 0) {
        resultsContainer.innerHTML = `
          <div class="search-empty-box">
            <span class="empty-icon">🔍</span>
            <h3>No harvest matching "${query}"</h3>
            <p>Try searching for eggs, chicken, honey, chicks, or browse our categories below.</p>
            <div class="search-tag-cloud" style="margin-top:1rem;">
              <button type="button" class="search-tag-chip" onclick="ValleyApp.quickSearch('Eggs')">View Eggs</button>
              <button type="button" class="search-tag-chip" onclick="ValleyApp.quickSearch('Chicken')">View Chicken</button>
            </div>
          </div>
        `;
        return;
      }

      let html = `<div class="search-results-grid">`;
      matches.forEach(product => {
        html += `
          <div class="search-result-row">
            <img src="${product.image}" alt="${product.name}" class="search-result-thumb" />
            <div class="search-result-details">
              <span class="search-result-cat">${product.categoryName}</span>
              <strong class="search-result-title">${product.name}</strong>
              <span class="search-result-price">₹${product.basePrice} <span class="unit">/ ${product.unit}</span></span>
            </div>
            <div class="search-result-actions">
              <button type="button" class="btn btn-secondary btn-sm" onclick="ValleyApp.closeSearchModal(); ValleyProducts.openQuickView('${product.id}')">Details</button>
              <button type="button" class="btn btn-primary btn-sm" onclick="ValleyCart.addItem(window.VALLEY_DATA.getProductById('${product.id}'), null, 1); ValleyApp.showToast('Added ${product.name} to cart!', 'success');">Add to Cart</button>
            </div>
          </div>
        `;
      });
      html += `</div>`;
      resultsContainer.innerHTML = html;
    }
  }

  function openSearchModal() {
    const modal = document.getElementById("search-modal");
    const input = document.getElementById("search-input-field");
    if (!modal) return;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    if (input) {
      setTimeout(() => input.focus(), 100);
    }
  }

  function closeSearchModal() {
    const modal = document.getElementById("search-modal");
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function quickSearch(term) {
    const input = document.getElementById("search-input-field");
    if (input) {
      input.value = term;
      input.dispatchEvent(new Event("input"));
    }
  }

  /* ==========================================================================
     ACCOUNT DRAWER / DROPDOWN
     ========================================================================== */
  function initAccountDrawer() {
    const drawer = document.getElementById("account-drawer");
    const backdrop = document.getElementById("account-backdrop");
    const closeBtn = document.getElementById("account-drawer-close");
    const triggers = document.querySelectorAll(".trigger-account-drawer");

    triggers.forEach(t => {
      t.onclick = (e) => {
        e.preventDefault();
        openAccountDrawer();
      };
    });

    if (closeBtn) closeBtn.onclick = closeAccountDrawer;
    if (backdrop) backdrop.onclick = closeAccountDrawer;

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && drawer && drawer.classList.contains("is-open")) {
        closeAccountDrawer();
      }
    });
  }

  function openAccountDrawer() {
    const drawer = document.getElementById("account-drawer");
    if (!drawer) return;
    drawer.classList.add("is-open");
    drawer.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeAccountDrawer() {
    const drawer = document.getElementById("account-drawer");
    if (!drawer) return;
    drawer.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  /* ==========================================================================
     MOBILE NAVIGATION DRAWER
     ========================================================================== */
  function initMobileNav() {
    const drawer = document.getElementById("mobile-nav-drawer");
    const toggleBtn = document.getElementById("mobile-menu-toggle-btn");
    const closeBtn = document.getElementById("mobile-nav-close-btn");
    const backdrop = document.getElementById("mobile-nav-backdrop");
    const links = drawer?.querySelectorAll(".mobile-nav-link");

    if (toggleBtn) {
      toggleBtn.onclick = () => {
        drawer?.classList.add("is-open");
        document.body.style.overflow = "hidden";
      };
    }

    function closeMobileNav() {
      drawer?.classList.remove("is-open");
      document.body.style.overflow = "";
    }

    if (closeBtn) closeBtn.onclick = closeMobileNav;
    if (backdrop) backdrop.onclick = closeMobileNav;

    links?.forEach(link => {
      link.onclick = () => {
        closeMobileNav();
      };
    });
  }

  /* ==========================================================================
     HEADER NAVIGATION SMOOTH LINKS
     ========================================================================== */
  function initNavLinks() {
    const links = document.querySelectorAll("a[data-category-target]");
    links.forEach(link => {
      link.onclick = (e) => {
        e.preventDefault();
        const cat = link.getAttribute("data-category-target");
        if (window.ValleyProducts) {
          window.ValleyProducts.filterCategory(cat);
        }
        const target = document.getElementById("fresh-picks-section");
        if (target) {
          target.scrollIntoView({ behavior: "smooth" });
        }
      };
    });
  }

  /* ==========================================================================
     NEWSLETTER SUBSCRIPTION FORM
     ========================================================================== */
  function initNewsletterForm() {
    const form = document.getElementById("newsletter-form");
    const emailInput = document.getElementById("newsletter-email");
    const msgEl = document.getElementById("newsletter-feedback-msg");
    const submitBtn = document.getElementById("newsletter-submit-btn");

    if (!form || !emailInput || !msgEl) return;

    form.onsubmit = function(e) {
      e.preventDefault();
      const email = emailInput.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!email || !emailRegex.test(email)) {
        msgEl.className = "newsletter-msg is-error";
        msgEl.textContent = "Please enter a valid email address.";
        emailInput.focus();
        return;
      }

      // Simulate success
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Subscribing...";
      }

      setTimeout(() => {
        msgEl.className = "newsletter-msg is-success";
        msgEl.textContent = "✓ Welcome to Valley Farm! You are subscribed to morning harvest offers.";
        emailInput.value = "";
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = "Subscribed";
        }
      }, 500);
    };
  }

  /* ==========================================================================
     FOOTER ACCORDIONS (MOBILE)
     ========================================================================== */
  function initFooterAccordions() {
    const headers = document.querySelectorAll(".footer-acc-trigger, .footer-accordion-header");
    headers.forEach(header => {
      header.onclick = function() {
        const expanded = header.getAttribute("aria-expanded") === "true";
        const content = header.nextElementSibling;
        
        // Toggle this accordion
        header.setAttribute("aria-expanded", !expanded);
        if (content) {
          content.classList.toggle("is-open", !expanded);
        }
      };
    });
  }

  /* ==========================================================================
     TOAST NOTIFICATIONS
     ========================================================================== */
  let toastContainer = null;
  function initToastContainer() {
    toastContainer = document.getElementById("vf-toast-container");
    if (!toastContainer) {
      toastContainer = document.createElement("div");
      toastContainer.id = "vf-toast-container";
      toastContainer.className = "vf-toast-container";
      document.body.appendChild(toastContainer);
    }
  }

  function showToast(message, type = "success") {
    if (!toastContainer) initToastContainer();

    const toast = document.createElement("div");
    toast.className = `vf-toast is-${type}`;
    toast.innerHTML = `
      <span class="toast-icon">${type === 'success' ? '✓' : '⚠️'}</span>
      <span class="toast-message">${message}</span>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("is-visible");
    }, 10);

    setTimeout(() => {
      toast.classList.remove("is-visible");
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  return {
    init,
    openCartDrawer,
    closeCartDrawer,
    openSearchModal,
    closeSearchModal,
    quickSearch,
    openAccountDrawer,
    closeAccountDrawer,
    showToast
  };
})();
