/**
 * Valley Farm - Interactive Checkout Prototype Module
 * Multi-step demo checkout with form validation, order summary synchronization,
 * demo order reference generation, and confirmation view.
 */

window.ValleyCheckout = (function() {
  let checkoutStep = 1; // 1: Info & Address, 2: Slot & Payment, 3: Confirmation
  let lastOrderDetails = null;

  function init() {
    setupCheckoutListeners();
  }

  function openCheckout() {
    const summary = window.ValleyCart.getSummary();
    if (summary.itemCount === 0) {
      if (window.ValleyApp && window.ValleyApp.showToast) {
        window.ValleyApp.showToast("Your cart is empty! Add products before checking out.", "error");
      }
      return;
    }

    // Close cart drawer if open
    if (window.ValleyApp && window.ValleyApp.closeCartDrawer) {
      window.ValleyApp.closeCartDrawer();
    }

    checkoutStep = 1;
    renderCheckoutModal();
    const modal = document.getElementById("checkout-modal");
    if (modal) {
      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    }
  }

  function closeCheckout() {
    const modal = document.getElementById("checkout-modal");
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function renderCheckoutModal() {
    const body = document.getElementById("checkout-modal-body");
    if (!body) return;

    const summary = window.ValleyCart.getSummary();

    if (checkoutStep === 3 && lastOrderDetails) {
      renderConfirmationView(body);
      return;
    }

    body.innerHTML = `
      <div class="checkout-layout">
        <!-- Main Form Column -->
        <div class="checkout-form-col">
          <div class="checkout-steps-nav">
            <div class="step-indicator ${checkoutStep >= 1 ? 'is-active' : ''}">
              <span class="step-num">1</span>
              <span class="step-label">Delivery Info</span>
            </div>
            <div class="step-divider"></div>
            <div class="step-indicator ${checkoutStep >= 2 ? 'is-active' : ''}">
              <span class="step-num">2</span>
              <span class="step-label">Slot & Payment</span>
            </div>
          </div>

          <div class="checkout-demo-banner">
            <span class="banner-badge">Demo Store</span>
            <p>This is a frontend prototype. No real money or payment details are collected.</p>
          </div>

          <!-- Mobile Collapsible Order Summary Bar -->
          <div class="checkout-mobile-summary-bar">
            <div class="co-mob-summary-left">
              <span class="co-mob-cart-icon">🛒</span>
              <div class="co-mob-summary-meta">
                <span class="co-mob-lbl">Order Total:</span>
                <strong class="co-mob-val">₹${summary.total}</strong>
                <span class="co-mob-cnt">(${summary.itemCount} items)</span>
              </div>
            </div>
            <button type="button" class="co-mob-summary-toggle" id="co-mob-summary-toggle" aria-expanded="false">
              <span>View Items</span> <span class="co-arrow-icon">▾</span>
            </button>
          </div>

          <div class="checkout-mobile-summary-content" id="co-mob-summary-content" style="display: none;">
            <div class="co-mob-items-list">
              ${summary.items.map(item => `
                <div class="co-item-row">
                  <img src="${item.image}" alt="${item.name}" class="co-item-thumb" />
                  <div class="co-item-details">
                    <span class="co-item-name">${item.name}</span>
                    <span class="co-item-variant">${item.variantName} × ${item.quantity}</span>
                  </div>
                  <span class="co-item-price">₹${item.price * item.quantity}</span>
                </div>
              `).join('')}
            </div>
            <div class="co-pricing-table" style="margin-top: 10px;">
              <div class="co-price-row">
                <span>Items Subtotal</span>
                <span>₹${summary.subtotal}</span>
              </div>
              <div class="co-price-row">
                <span>Farm Chilled Delivery</span>
                <span>${summary.deliveryFee === 0 ? '<strong class="free-text">FREE</strong>' : `₹${summary.deliveryFee}`}</span>
              </div>
              ${summary.savings > 0 ? `
                <div class="co-price-row savings-row">
                  <span>Your Savings</span>
                  <span>-₹${summary.savings}</span>
                </div>
              ` : ''}
              <div class="co-price-row total-row">
                <strong>Total Amount</strong>
                <strong class="total-amount">₹${summary.total}</strong>
              </div>
            </div>
          </div>

          ${checkoutStep === 1 ? renderStep1Html() : renderStep2Html()}
        </div>

        <!-- Order Summary Sidebar -->
        <div class="checkout-summary-col">
          <div class="checkout-summary-card">
            <h3>Order Summary (${summary.itemCount} items)</h3>
            <div class="checkout-items-list">
              ${summary.items.map(item => `
                <div class="co-item-row">
                  <img src="${item.image}" alt="${item.name}" class="co-item-thumb" />
                  <div class="co-item-details">
                    <span class="co-item-name">${item.name}</span>
                    <span class="co-item-variant">${item.variantName} × ${item.quantity}</span>
                  </div>
                  <span class="co-item-price">₹${item.price * item.quantity}</span>
                </div>
              `).join('')}
            </div>

            <div class="co-pricing-table">
              <div class="co-price-row">
                <span>Items Subtotal</span>
                <span>₹${summary.subtotal}</span>
              </div>
              <div class="co-price-row">
                <span>Farm Chilled Delivery</span>
                <span>${summary.deliveryFee === 0 ? '<strong class="free-text">FREE</strong>' : `₹${summary.deliveryFee}`}</span>
              </div>
              ${summary.savings > 0 ? `
                <div class="co-price-row savings-row">
                  <span>Your Savings</span>
                  <span>-₹${summary.savings}</span>
                </div>
              ` : ''}
              <div class="co-price-row total-row">
                <strong>Total Amount</strong>
                <strong class="total-amount">₹${summary.total}</strong>
              </div>
            </div>

            <div class="co-guarantee-note">
              <span class="lock-icon">🔒</span>
              <span>100% Farm Fresh Quality Guarantee. Freshness protected in transit.</span>
            </div>
          </div>
        </div>
      </div>
    `;

    wireFormStepListeners();
  }

  function renderStep1Html() {
    return `
      <form id="checkout-step1-form" class="checkout-form" novalidate>
        <h3 class="form-section-title">1. Contact & Customer Details</h3>
        <div class="form-grid-2">
          <div class="form-group">
            <label for="co-fullname">Full Name *</label>
            <input type="text" id="co-fullname" required placeholder="e.g. Radhika Sharma" value="Priya Nair" />
            <span class="form-error" id="err-fullname"></span>
          </div>
          <div class="form-group">
            <label for="co-phone">Mobile Phone (for delivery SMS) *</label>
            <input type="tel" id="co-phone" required placeholder="10-digit mobile number" value="9876543210" maxlength="10" />
            <span class="form-error" id="err-phone"></span>
          </div>
        </div>

        <div class="form-group">
          <label for="co-email">Email Address (for order receipt) *</label>
          <input type="email" id="co-email" required placeholder="name@example.com" value="priya.nair@example.com" />
          <span class="form-error" id="err-email"></span>
        </div>

        <h3 class="form-section-title" style="margin-top: 1.5rem;">2. Delivery Address</h3>
        <div class="form-group">
          <label for="co-street">House / Flat / Building & Street Address *</label>
          <input type="text" id="co-street" required placeholder="Flat 402, Green Glen Layout, Outer Ring Road" value="Flat 402, Valley Meadows, 14th Main Road" />
          <span class="form-error" id="err-street"></span>
        </div>

        <div class="form-grid-2">
          <div class="form-group">
            <label for="co-city">City *</label>
            <input type="text" id="co-city" required placeholder="e.g. Bangalore" value="Bangalore" />
            <span class="form-error" id="err-city"></span>
          </div>
          <div class="form-group">
            <label for="co-pincode">Pincode *</label>
            <input type="text" id="co-pincode" required placeholder="6-digit pincode" value="560103" maxlength="6" />
            <span class="form-error" id="err-pincode"></span>
          </div>
        </div>

        <div class="checkout-btn-bar">
          <button type="button" class="btn btn-secondary" onclick="ValleyCheckout.closeCheckout()">Return to Cart</button>
          <button type="submit" class="btn btn-primary">Continue to Delivery Slot & Payment ➔</button>
        </div>
      </form>
    `;
  }

  function renderStep2Html() {
    return `
      <form id="checkout-step2-form" class="checkout-form" novalidate>
        <h3 class="form-section-title">3. Select Morning Harvest Delivery Slot</h3>
        <div class="delivery-slots-grid">
          <label class="slot-radio-card is-selected">
            <input type="radio" name="delivery-slot" value="Morning 7:00 AM - 9:30 AM" checked />
            <div class="slot-content">
              <strong>🌅 Morning Harvest (7:00 AM - 9:30 AM)</strong>
              <span>Recommended for eggs & poultry laid and cut today</span>
            </div>
          </label>
          <label class="slot-radio-card">
            <input type="radio" name="delivery-slot" value="Afternoon 12:30 PM - 3:00 PM" />
            <div class="slot-content">
              <strong>☀️ Afternoon Delivery (12:30 PM - 3:00 PM)</strong>
              <span>Cold-chain temperature refrigerated transit</span>
            </div>
          </label>
          <label class="slot-radio-card">
            <input type="radio" name="delivery-slot" value="Evening 5:30 PM - 8:00 PM" />
            <div class="slot-content">
              <strong>🌆 Evening Express (5:30 PM - 8:00 PM)</strong>
              <span>Convenient delivery after work hours</span>
            </div>
          </label>
        </div>

        <h3 class="form-section-title" style="margin-top: 1.5rem;">4. Demo Payment Method</h3>
        <div class="payment-methods-grid">
          <label class="payment-radio-card is-selected">
            <input type="radio" name="payment-method" value="UPI Instant (Demo)" checked />
            <div class="pay-method-info">
              <strong>Instant UPI / GPay / PhonePe / Paytm</strong>
              <span>Simulated zero-touch digital payment</span>
            </div>
          </label>
          <label class="payment-radio-card">
            <input type="radio" name="payment-method" value="Cash on Delivery" />
            <div class="pay-method-info">
              <strong>Cash / UPI on Farm Delivery</strong>
              <span>Pay our delivery personnel upon inspection</span>
            </div>
          </label>
          <label class="payment-radio-card">
            <input type="radio" name="payment-method" value="Credit/Debit Card (Demo)" />
            <div class="pay-method-info">
              <strong>Debit or Credit Card (Simulated)</strong>
              <span>Visa, Mastercard, RuPay</span>
            </div>
          </label>
        </div>

        <div class="checkout-btn-bar">
          <button type="button" class="btn btn-secondary" onclick="ValleyCheckout.setStep(1)">Back to Address</button>
          <button type="submit" class="btn btn-primary" id="place-order-btn">
            Place Demo Order • 100% Risk Free
          </button>
        </div>
      </form>
    `;
  }

  function renderConfirmationView(container) {
    const order = lastOrderDetails;
    container.innerHTML = `
      <div class="order-confirmation-card">
        <div class="conf-badge-circle">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#245C3A" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>

        <h2 class="conf-title">Demo Order Placed Successfully!</h2>
        <p class="conf-subtitle">Thank you, <strong>${order.name}</strong>. Your farm-fresh basket has been scheduled for preparation at our valley facility.</p>

        <div class="conf-reference-badge">
          <span>Order Reference:</span>
          <strong>${order.orderId}</strong>
        </div>

        <div class="conf-details-grid">
          <div class="conf-detail-box">
            <h4>🚚 Delivery Schedule</h4>
            <p><strong>${order.slot}</strong></p>
            <p class="subtle">Destination: ${order.street}, ${order.city} - ${order.pincode}</p>
          </div>
          <div class="conf-detail-box">
            <h4>💳 Payment Summary</h4>
            <p>Method: <strong>${order.paymentMethod}</strong></p>
            <p class="subtle">Total Paid: <strong>₹${order.total}</strong> (${order.items.length} items)</p>
          </div>
        </div>

        <div class="conf-items-table">
          <h4>Items In This Order</h4>
          <div class="conf-items-rows">
            ${order.items.map(item => `
              <div class="conf-item-row">
                <span>${item.quantity} × ${item.name} (${item.variantName})</span>
                <strong>₹${item.price * item.quantity}</strong>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="conf-notice">
          ℹ️ <strong>Demo Store Notice:</strong> This completes the end-to-end frontend shopping experience. Your cart has been safely cleared, and no real financial transaction occurred.
        </div>

        <div class="conf-actions-row">
          <button type="button" class="btn btn-primary" onclick="ValleyCheckout.closeCheckout()">Continue Shopping</button>
          <button type="button" class="btn btn-secondary" onclick="window.print()">Print Order Receipt</button>
        </div>
      </div>
    `;
  }

  function wireFormStepListeners() {
    const step1Form = document.getElementById("checkout-step1-form");
    if (step1Form) {
      step1Form.onsubmit = function(e) {
        e.preventDefault();
        if (validateStep1()) {
          checkoutStep = 2;
          renderCheckoutModal();
        }
      };
    }

    const step2Form = document.getElementById("checkout-step2-form");
    if (step2Form) {
      step2Form.onsubmit = function(e) {
        e.preventDefault();
        completeDemoOrder();
      };
    }

    // Mobile Order Summary Toggle
    const mobToggleBtn = document.getElementById("co-mob-summary-toggle");
    const mobContent = document.getElementById("co-mob-summary-content");
    if (mobToggleBtn && mobContent) {
      mobToggleBtn.onclick = function() {
        const isHidden = mobContent.style.display === "none";
        mobContent.style.display = isHidden ? "block" : "none";
        mobToggleBtn.setAttribute("aria-expanded", isHidden);
        mobToggleBtn.innerHTML = isHidden 
          ? `<span>Hide Items</span> <span class="co-arrow-icon">▴</span>` 
          : `<span>View Items</span> <span class="co-arrow-icon">▾</span>`;
      };
    }

    // Toggle radio cards active style
    const radioCards = document.querySelectorAll(".slot-radio-card, .payment-radio-card");
    radioCards.forEach(card => {
      const radio = card.querySelector("input[type=radio]");
      if (radio) {
        radio.onchange = () => {
          const groupName = radio.name;
          document.querySelectorAll(`input[name="${groupName}"]`).forEach(r => {
            r.closest("label").classList.toggle("is-selected", r.checked);
          });
        };
      }
    });
  }

  function validateStep1() {
    let isValid = true;
    const name = document.getElementById("co-fullname");
    const phone = document.getElementById("co-phone");
    const email = document.getElementById("co-email");
    const street = document.getElementById("co-street");
    const city = document.getElementById("co-city");
    const pincode = document.getElementById("co-pincode");

    // Clear errors
    document.querySelectorAll(".form-error").forEach(el => el.textContent = "");

    if (!name.value.trim() || name.value.trim().length < 2) {
      document.getElementById("err-fullname").textContent = "Please enter your full name.";
      isValid = false;
    }

    if (!phone.value.trim() || !/^\d{10}$/.test(phone.value.trim())) {
      document.getElementById("err-phone").textContent = "Please enter a valid 10-digit mobile number.";
      isValid = false;
    }

    if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
      document.getElementById("err-email").textContent = "Please enter a valid email address.";
      isValid = false;
    }

    if (!street.value.trim() || street.value.trim().length < 5) {
      document.getElementById("err-street").textContent = "Please enter your delivery street address.";
      isValid = false;
    }

    if (!city.value.trim()) {
      document.getElementById("err-city").textContent = "Please enter your delivery city.";
      isValid = false;
    }

    if (!pincode.value.trim() || !/^\d{6}$/.test(pincode.value.trim())) {
      document.getElementById("err-pincode").textContent = "Please enter a valid 6-digit postal code.";
      isValid = false;
    }

    return isValid;
  }

  function completeDemoOrder() {
    const summary = window.ValleyCart.getSummary();
    if (summary.items.length === 0) return;

    const name = document.getElementById("co-fullname")?.value || "Customer";
    const phone = document.getElementById("co-phone")?.value || "9876543210";
    const email = document.getElementById("co-email")?.value || "hello@example.com";
    const street = document.getElementById("co-street")?.value || "123 Farm Way";
    const city = document.getElementById("co-city")?.value || "Bangalore";
    const pincode = document.getElementById("co-pincode")?.value || "560001";

    const slot = document.querySelector('input[name="delivery-slot"]:checked')?.value || "Morning 7:00 AM - 9:30 AM";
    const payment = document.querySelector('input[name="payment-method"]:checked')?.value || "UPI Instant (Demo)";

    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const orderId = `VF-${new Date().getFullYear()}-${randomSuffix}`;

    lastOrderDetails = {
      orderId,
      name,
      phone,
      email,
      street,
      city,
      pincode,
      slot,
      paymentMethod: payment,
      total: summary.total,
      subtotal: summary.subtotal,
      deliveryFee: summary.deliveryFee,
      items: summary.items,
      placedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Clear cart upon successful order submission
    window.ValleyCart.clearCart();

    checkoutStep = 3;
    renderCheckoutModal();
  }

  function setStep(step) {
    checkoutStep = step;
    renderCheckoutModal();
  }

  function setupCheckoutListeners() {
    const closeBtn = document.getElementById("checkout-modal-close");
    const backdrop = document.getElementById("checkout-backdrop");
    if (closeBtn) closeBtn.onclick = closeCheckout;
    if (backdrop) backdrop.onclick = closeCheckout;

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeCheckout();
    });
  }

  return {
    init,
    openCheckout,
    closeCheckout,
    setStep
  };
})();
