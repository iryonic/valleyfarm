/**
 * Valley Farm - Products & Catalog Rendering Module
 * Handles product card markup, independent quantity/variant selectors,
 * quick view modal, and category filtering.
 */

window.ValleyProducts = (function() {
  let currentCategory = "all";
  let currentSort = "featured";

  // Cache of selected variants and quantities per card on screen: { [productId]: { variantId, qty } }
  const cardState = {};

  function init() {
    renderCategoryRail();
    renderCatalog();
    setupEventListeners();
  }

  /**
   * Render circular category navigation rail
   */
  function renderCategoryRail() {
    const container = document.getElementById("category-rail-container");
    if (!container || !window.VALLEY_DATA) return;

    const categories = window.VALLEY_DATA.categories;
    let html = `
      <button class="category-circle-item ${currentCategory === 'all' ? 'is-active' : ''}" data-category="all">
        <div class="category-circle-avatar all-cat-avatar">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16A34A" stroke-width="2">
            <rect x="3" y="3" width="7" height="7" rx="1"/>
            <rect x="14" y="3" width="7" height="7" rx="1"/>
            <rect x="14" y="14" width="7" height="7" rx="1"/>
            <rect x="3" y="14" width="7" height="7" rx="1"/>
          </svg>
        </div>
        <span class="category-circle-label">All Items</span>
      </button>
    `;

    categories.forEach(cat => {
      const isActive = currentCategory === cat.slug;
      html += `
        <button class="category-circle-item ${isActive ? 'is-active' : ''}" data-category="${cat.slug}" aria-label="View ${cat.name}">
          <div class="category-circle-avatar">
            <img src="${cat.image}" alt="${cat.name}" loading="lazy" />
          </div>
          <span class="category-circle-label">${cat.name}</span>
        </button>
      `;
    });

    container.innerHTML = html;
  }

  /**
   * Render product cards based on active category & sort order
   */
  function renderCatalog() {
    const grid = document.getElementById("featured-products-grid");
    const countEl = document.getElementById("catalog-count-badge");
    if (!grid || !window.VALLEY_DATA) return;

    let products = window.VALLEY_DATA.getProductsByCategory(currentCategory);

    // Sort
    products = [...products];
    if (currentSort === "price-low") {
      products.sort((a, b) => a.basePrice - b.basePrice);
    } else if (currentSort === "price-high") {
      products.sort((a, b) => b.basePrice - a.basePrice);
    } else if (currentSort === "rating") {
      products.sort((a, b) => b.rating - a.rating);
    }

    if (countEl) {
      countEl.textContent = `${products.length} Products Found`;
    }

    if (products.length === 0) {
      grid.innerHTML = `
        <div class="catalog-empty-state">
          <div class="empty-icon-wrap">🌿</div>
          <h3>No products found in this category</h3>
          <p>Try exploring another collection or viewing all products.</p>
          <button class="btn btn-primary" onclick="ValleyProducts.filterCategory('all')">View All Products</button>
        </div>
      `;
      return;
    }

    let html = "";
    products.forEach(product => {
      // Initialize card state if not present
      if (!cardState[product.id]) {
        cardState[product.id] = {
          variantId: product.variants && product.variants[0] ? product.variants[0].id : null,
          qty: 1
        };
      }

      const state = cardState[product.id];
      const selectedVariant = product.variants ? product.variants.find(v => v.id === state.variantId) || product.variants[0] : null;
      const currentPrice = selectedVariant ? selectedVariant.price : product.basePrice;
      const currentOriginalPrice = selectedVariant ? selectedVariant.originalPrice : product.originalPrice;

      html += `
        <article class="vf-product-card" data-product-id="${product.id}" id="card-${product.id}">
          <div class="card-media-wrap" onclick="ValleyProducts.openQuickView('${product.id}')" title="Quick View ${product.name}">
            <img src="${product.image}" alt="${product.name}" class="product-card-img" loading="lazy" />
            ${product.badge ? `<span class="product-card-badge">${product.badge}</span>` : ""}
            <button class="quick-view-btn" aria-label="Quick preview for ${product.name}">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
              <span>Quick View</span>
            </button>
          </div>

          <div class="card-content">
            <div class="card-meta">
              <span class="card-category-tag">${product.categoryName}</span>
              <span class="card-rating">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#F8D878" stroke="#252922" stroke-width="1.5">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
                ${product.rating} <span class="rating-count">(${product.reviewsCount})</span>
              </span>
            </div>

            <h3 class="product-title" onclick="ValleyProducts.openQuickView('${product.id}')">${product.name}</h3>
            <p class="product-unit-info">${selectedVariant ? selectedVariant.unit || selectedVariant.name : product.unit}</p>

            ${product.variants && product.variants.length > 1 ? `
              <div class="variant-pill-selector" role="radiogroup" aria-label="Select variant for ${product.name}">
                ${product.variants.map(v => `
                  <button type="button" 
                    class="variant-pill ${v.id === state.variantId ? 'is-selected' : ''}" 
                    data-product-id="${product.id}" 
                    data-variant-id="${v.id}"
                    onclick="ValleyProducts.selectVariant('${product.id}', '${v.id}')">
                    ${v.name}
                  </button>
                `).join('')}
              </div>
            ` : ''}

            <div class="card-price-row">
              <div class="price-stack">
                <span class="price-current">₹${currentPrice}</span>
                ${currentOriginalPrice ? `<span class="price-original">₹${currentOriginalPrice}</span>` : ""}
              </div>
              
              <!-- Custom Quantity Selector -->
              <div class="custom-qty-selector" aria-label="Quantity for ${product.name}">
                <button type="button" class="qty-btn minus-btn" 
                  aria-label="Decrease quantity" 
                  onclick="ValleyProducts.changeCardQty('${product.id}', -1)">-</button>
                <span class="qty-display" id="qty-val-${product.id}">${state.qty}</span>
                <button type="button" class="qty-btn plus-btn" 
                  aria-label="Increase quantity" 
                  onclick="ValleyProducts.changeCardQty('${product.id}', 1)">+</button>
              </div>
            </div>

            <div class="card-actions-row">
              <button type="button" class="btn btn-add-cart" onclick="ValleyProducts.addToCartFromCard('${product.id}')">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="9" cy="21" r="1"/>
                  <circle cx="20" cy="21" r="1"/>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                </svg>
                <span>Add to Cart</span>
              </button>
              <button type="button" class="btn btn-quick-buy" onclick="ValleyProducts.quickBuyFromCard('${product.id}')">
                Quick Buy
              </button>
            </div>
          </div>
        </article>
      `;
    });

    grid.innerHTML = html;
  }

  /**
   * Select a variant for a specific card
   */
  function selectVariant(productId, variantId) {
    if (!cardState[productId]) {
      cardState[productId] = { variantId, qty: 1 };
    } else {
      cardState[productId].variantId = variantId;
    }
    renderCatalog();
  }

  /**
   * Change quantity on a card
   */
  function changeCardQty(productId, delta) {
    if (!cardState[productId]) {
      cardState[productId] = { variantId: null, qty: 1 };
    }
    const current = cardState[productId].qty || 1;
    const next = Math.max(1, Math.min(20, current + delta));
    cardState[productId].qty = next;
    
    const display = document.getElementById(`qty-val-${productId}`);
    if (display) {
      display.textContent = next;
    }
  }

  /**
   * Add to cart from product card
   */
  function addToCartFromCard(productId) {
    const product = window.VALLEY_DATA.getProductById(productId);
    if (!product) return;

    const state = cardState[productId] || { variantId: product.variants[0]?.id, qty: 1 };
    window.ValleyCart.addItem(product, state.variantId, state.qty);

    if (window.ValleyApp && window.ValleyApp.showToast) {
      const variant = product.variants?.find(v => v.id === state.variantId);
      const label = variant ? `${product.name} (${variant.name})` : product.name;
      window.ValleyApp.showToast(`Added ${state.qty} × ${label} to your cart!`, "success");
    }

    if (window.ValleyApp && window.ValleyApp.openCartDrawer) {
      window.ValleyApp.openCartDrawer();
    }

    // Reset card qty back to 1 for next add
    cardState[productId].qty = 1;
    const display = document.getElementById(`qty-val-${productId}`);
    if (display) display.textContent = "1";
  }

  /**
   * Quick Buy from product card (add & directly open checkout flow)
   */
  function quickBuyFromCard(productId) {
    const product = window.VALLEY_DATA.getProductById(productId);
    if (!product) return;

    const state = cardState[productId] || { variantId: product.variants[0]?.id, qty: 1 };
    window.ValleyCart.addItem(product, state.variantId, state.qty);

    if (window.ValleyCheckout) {
      window.ValleyCheckout.openCheckout();
    } else if (window.ValleyApp) {
      window.ValleyApp.openCartDrawer();
    }
  }

  /**
   * Filter catalog by category
   */
  function filterCategory(categorySlug) {
    currentCategory = categorySlug;
    
    // Update category rail buttons active class
    const railButtons = document.querySelectorAll(".category-circle-item");
    railButtons.forEach(btn => {
      btn.classList.toggle("is-active", btn.getAttribute("data-category") === categorySlug);
    });

    // Update filter tab pills if present
    const filterPills = document.querySelectorAll(".filter-tab-pill");
    filterPills.forEach(pill => {
      pill.classList.toggle("is-active", pill.getAttribute("data-category") === categorySlug);
    });

    renderCatalog();
  }

  /**
   * Open Quick View Modal
   */
  function openQuickView(productId) {
    const product = window.VALLEY_DATA.getProductById(productId);
    if (!product) return;

    const modal = document.getElementById("quick-view-modal");
    const container = document.getElementById("quick-view-body");
    if (!modal || !container) return;

    let selectedVariantId = product.variants && product.variants[0] ? product.variants[0].id : null;
    let quickQty = 1;

    function renderModalContent() {
      const currentVariant = product.variants ? product.variants.find(v => v.id === selectedVariantId) || product.variants[0] : null;
      const price = currentVariant ? currentVariant.price : product.basePrice;
      const originalPrice = currentVariant ? currentVariant.originalPrice : product.originalPrice;

      container.innerHTML = `
        <div class="qv-modal-grid">
          <div class="qv-media-col">
            <div class="qv-img-frame">
              <img src="${product.image}" alt="${product.name}" class="qv-image" />
              ${product.badge ? `<span class="product-card-badge">${product.badge}</span>` : ""}
            </div>
            <div class="qv-storage-tip">
              <strong>💡 Farm Storage Advice:</strong>
              <p>${product.storageTip || "Keep chilled in cool conditions."}</p>
            </div>
          </div>

          <div class="qv-details-col">
            <div class="qv-header">
              <span class="card-category-tag">${product.categoryName}</span>
              <h2 class="qv-title">${product.name}</h2>
              <div class="qv-rating-row">
                <span class="card-rating">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#F8D878" stroke="#252922" stroke-width="1.5">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                  ${product.rating}
                </span>
                <span class="qv-verified-tag">✓ Verified Valley Harvest</span>
                <span class="qv-reviews">(${product.reviewsCount} customer reviews)</span>
              </div>
            </div>

            <div class="qv-price-box">
              <div class="price-stack">
                <span class="price-current large">₹${price}</span>
                ${originalPrice ? `<span class="price-original large">₹${originalPrice}</span>` : ""}
                ${originalPrice ? `<span class="discount-pill">Save ₹${originalPrice - price}</span>` : ""}
              </div>
              <span class="tax-note">Inclusive of all local farm taxes & fresh chilling</span>
            </div>

            <p class="qv-description">${product.fullDesc}</p>

            ${product.highlights && product.highlights.length > 0 ? `
              <div class="qv-highlights-block">
                <h4>Farm Fresh Highlights</h4>
                <ul>
                  ${product.highlights.map(h => `<li><span class="check-icon">✓</span> ${h}</li>`).join('')}
                </ul>
              </div>
            ` : ''}

            ${product.variants && product.variants.length > 1 ? `
              <div class="qv-variant-section">
                <label class="qv-label">Select Pack Size / Quantity:</label>
                <div class="variant-pill-selector large">
                  ${product.variants.map(v => `
                    <button type="button" 
                      class="variant-pill ${v.id === selectedVariantId ? 'is-selected' : ''}" 
                      id="qv-var-${v.id}">
                      <strong>${v.name}</strong>
                      <span>₹${v.price}</span>
                    </button>
                  `).join('')}
                </div>
              </div>
            ` : ''}

            <div class="qv-purchase-controls">
              <div class="qv-qty-wrap">
                <label class="qv-label">Quantity:</label>
                <div class="custom-qty-selector large">
                  <button type="button" class="qty-btn minus-btn" id="qv-minus">-</button>
                  <span class="qty-display" id="qv-qty-val">${quickQty}</span>
                  <button type="button" class="qty-btn plus-btn" id="qv-plus">+</button>
                </div>
              </div>

              <div class="qv-buttons-row">
                <button type="button" class="btn btn-add-cart large" id="qv-add-btn">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="9" cy="21" r="1"/>
                    <circle cx="20" cy="21" r="1"/>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                  </svg>
                  <span>Add to Cart • ₹${price * quickQty}</span>
                </button>
                <button type="button" class="btn btn-quick-buy large" id="qv-buy-btn">
                  Quick Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
      `;

      // Wire modal variant buttons
      if (product.variants) {
        product.variants.forEach(v => {
          const btn = document.getElementById(`qv-var-${v.id}`);
          if (btn) {
            btn.onclick = () => {
              selectedVariantId = v.id;
              renderModalContent();
            };
          }
        });
      }

      // Wire modal qty
      const minus = document.getElementById("qv-minus");
      const plus = document.getElementById("qv-plus");
      if (minus) {
        minus.onclick = () => {
          quickQty = Math.max(1, quickQty - 1);
          renderModalContent();
        };
      }
      if (plus) {
        plus.onclick = () => {
          quickQty = Math.min(20, quickQty + 1);
          renderModalContent();
        };
      }

      // Wire modal add to cart
      const addBtn = document.getElementById("qv-add-btn");
      if (addBtn) {
        addBtn.onclick = () => {
          window.ValleyCart.addItem(product, selectedVariantId, quickQty);
          closeQuickView();
          if (window.ValleyApp && window.ValleyApp.showToast) {
            window.ValleyApp.showToast(`Added ${quickQty} × ${product.name} to cart!`, "success");
          }
          if (window.ValleyApp && window.ValleyApp.openCartDrawer) {
            window.ValleyApp.openCartDrawer();
          }
        };
      }

      // Wire modal quick buy
      const buyBtn = document.getElementById("qv-buy-btn");
      if (buyBtn) {
        buyBtn.onclick = () => {
          window.ValleyCart.addItem(product, selectedVariantId, quickQty);
          closeQuickView();
          if (window.ValleyCheckout) {
            window.ValleyCheckout.openCheckout();
          }
        };
      }
    }

    renderModalContent();
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeQuickView() {
    const modal = document.getElementById("quick-view-modal");
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function setupEventListeners() {
    // Sort dropdown
    const sortSelect = document.getElementById("catalog-sort-select");
    if (sortSelect) {
      sortSelect.addEventListener("change", function(e) {
        currentSort = e.target.value;
        renderCatalog();
      });
    }

    // Category rail click delegation
    const rail = document.getElementById("category-rail-container");
    if (rail) {
      rail.addEventListener("click", function(e) {
        const item = e.target.closest(".category-circle-item");
        if (item) {
          const cat = item.getAttribute("data-category");
          filterCategory(cat);
          // Smooth scroll to catalog
          const target = document.getElementById("fresh-picks-section");
          if (target) {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }
      });
    }

    // Modal close triggers
    const closeBtn = document.getElementById("quick-view-close-btn");
    const backdrop = document.getElementById("quick-view-backdrop");
    if (closeBtn) closeBtn.onclick = closeQuickView;
    if (backdrop) backdrop.onclick = closeQuickView;

    window.addEventListener("keydown", function(e) {
      if (e.key === "Escape") {
        closeQuickView();
      }
    });
  }

  return {
    init,
    renderCatalog,
    selectVariant,
    changeCardQty,
    addToCartFromCard,
    quickBuyFromCard,
    filterCategory,
    openQuickView,
    closeQuickView
  };
})();
