/**
 * Valley Farm - Central Shopping Cart Module
 * Single source of truth for cart state, localStorage persistence, and price calculations.
 */

window.ValleyCart = (function() {
  const STORAGE_KEY = "valley_farm_cart_v1";
  let items = [];

  // Load from localStorage safely
  function loadCart() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          // Validate structure
          items = parsed.filter(item => 
            item && item.productId && item.variantId && typeof item.price === "number" && item.quantity > 0
          );
        }
      }
    } catch (e) {
      console.warn("Could not read cart from localStorage, initializing empty:", e);
      items = [];
    }
    notify();
  }

  // Save to localStorage safely
  function saveCart() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn("Could not save cart to localStorage:", e);
    }
    notify();
  }

  // Dispatch custom event to notify listeners
  function notify() {
    const summary = getSummary();
    const event = new CustomEvent("valley:cart-updated", { detail: summary });
    window.dispatchEvent(event);
  }

  /**
   * Add an item to the cart
   * @param {Object} product - Product object from VALLEY_DATA
   * @param {string} variantId - Selected variant ID
   * @param {number} quantity - Quantity to add (default 1)
   */
  function addItem(product, variantId, quantity = 1) {
    if (!product) return;
    const qty = Math.max(1, parseInt(quantity, 10) || 1);
    
    // Resolve variant
    const variant = (product.variants && product.variants.find(v => v.id === variantId)) || 
                    (product.variants && product.variants[0]) || 
                    { id: product.id + "-default", name: product.unit, price: product.basePrice, originalPrice: product.originalPrice };

    const existingIndex = items.findIndex(item => item.productId === product.id && item.variantId === variant.id);

    if (existingIndex > -1) {
      items[existingIndex].quantity += qty;
    } else {
      items.push({
        productId: product.id,
        variantId: variant.id,
        name: product.name,
        variantName: variant.name,
        unit: variant.unit || product.unit,
        price: variant.price,
        originalPrice: variant.originalPrice || null,
        image: product.image,
        category: product.category,
        quantity: qty
      });
    }

    saveCart();
    return { product, variant, quantity: qty };
  }

  /**
   * Update quantity of an item in the cart
   */
  function updateQuantity(productId, variantId, quantity) {
    const target = items.find(item => item.productId === productId && item.variantId === variantId);
    if (!target) return;

    const newQty = parseInt(quantity, 10);
    if (newQty <= 0) {
      removeItem(productId, variantId);
    } else {
      target.quantity = Math.min(20, newQty);
      saveCart();
    }
  }

  /**
   * Remove item from cart
   */
  function removeItem(productId, variantId) {
    items = items.filter(item => !(item.productId === productId && item.variantId === variantId));
    saveCart();
  }

  /**
   * Clear all items (e.g. on order completion)
   */
  function clearCart() {
    items = [];
    saveCart();
  }

  /**
   * Get complete summary calculation
   */
  function getSummary() {
    const config = window.VALLEY_DATA ? window.VALLEY_DATA.config : { freeDeliveryThreshold: 499, standardDeliveryFee: 40 };
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const deliveryFee = subtotal >= config.freeDeliveryThreshold || subtotal === 0 ? 0 : config.standardDeliveryFee;
    const amountToFreeDelivery = Math.max(0, config.freeDeliveryThreshold - subtotal);
    const freeDeliveryProgress = Math.min(100, Math.round((subtotal / config.freeDeliveryThreshold) * 100));
    const total = subtotal + deliveryFee;

    // Calculate total savings
    const savings = items.reduce((sum, item) => {
      if (item.originalPrice && item.originalPrice > item.price) {
        return sum + ((item.originalPrice - item.price) * item.quantity);
      }
      return sum;
    }, 0);

    return {
      items: [...items],
      itemCount,
      subtotal,
      deliveryFee,
      total,
      savings,
      amountToFreeDelivery,
      freeDeliveryProgress,
      isFreeDelivery: deliveryFee === 0 && subtotal > 0
    };
  }

  // Initialize
  loadCart();

  return {
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    getSummary,
    getItems: () => [...items]
  };
})();
