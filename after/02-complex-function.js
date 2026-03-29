/**
 * Discount Calculation Module
 * Refactored for readability, testability, and maintainability
 */

const MAX_DISCOUNT_PERCENT = 50;

/**
 * Calculates total discount for a user's cart
 * @param {Object} user - User object
 * @param {Object} cart - Shopping cart object
 * @param {Date} currentDate - Current date for time-based discounts
 * @param {Array} promotions - Active promotions array
 * @returns {number} Total discount percentage (capped at MAX_DISCOUNT_PERCENT)
 */
function calculateDiscount(user, cart, currentDate, promotions) {
  const discounts = [
    getUserBasedDiscounts(user, currentDate),
    getCartBasedDiscounts(cart),
    getPromotionalDiscounts(promotions, currentDate)
  ];
  
  const totalDiscount = discounts.reduce((sum, d) => sum + d, 0);
  return Math.min(totalDiscount, MAX_DISCOUNT_PERCENT);
}

/**
 * Calculates discounts based on user properties
 * @param {Object} user - User object
 * @param {Date} currentDate - Current date
 * @returns {number} User-based discount percentage
 */
function getUserBasedDiscounts(user, currentDate) {
  if (!user) return 0;
  
  let discount = 0;
  
  discount += getMembershipDiscount(user);
  discount += getBirthdayDiscount(user, currentDate);
  discount += getLoyaltyDiscount(user);
  
  return discount;
}

/**
 * Calculates membership-based discount
 * @param {Object} user - User object
 * @returns {number} Membership discount percentage
 */
function getMembershipDiscount(user) {
  let discount = 0;
  
  if (user.isPremium) {
    discount += 10;
    if (user.yearsAsMember > 5) {
      discount += 5;
    }
  }
  
  return discount;
}

/**
 * Calculates birthday discount if applicable
 * @param {Object} user - User object
 * @param {Date} currentDate - Current date
 * @returns {number} Birthday discount percentage
 */
function getBirthdayDiscount(user, currentDate) {
  if (!user.birthday) return 0;
  
  const birthday = new Date(user.birthday);
  const isBirthdayToday = (
    birthday.getMonth() === currentDate.getMonth() &&
    birthday.getDate() === currentDate.getDate()
  );
  
  return isBirthdayToday ? 15 : 0;
}

/**
 * Calculates loyalty discount based on purchase history
 * @param {Object} user - User object
 * @returns {number} Loyalty discount percentage
 */
function getLoyaltyDiscount(user) {
  const { totalPurchases = 0 } = user;
  
  if (totalPurchases > 5000) return 15;
  if (totalPurchases > 1000) return 5;
  return 0;
}

/**
 * Calculates discounts based on cart contents
 * @param {Object} cart - Shopping cart object
 * @returns {number} Cart-based discount percentage
 */
function getCartBasedDiscounts(cart) {
  if (!cart?.items) return 0;
  
  let discount = 0;
  
  discount += getQuantityDiscount(cart.items);
  discount += getCartValueDiscount(cart.items);
  
  return discount;
}

/**
 * Calculates quantity-based discount
 * @param {Array} items - Cart items array
 * @returns {number} Quantity discount percentage
 */
function getQuantityDiscount(items) {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  
  if (totalItems > 20) return 10;
  if (totalItems > 10) return 5;
  return 0;
}

/**
 * Calculates cart value-based discount
 * @param {Array} items - Cart items array
 * @returns {number} Value discount percentage
 */
function getCartValueDiscount(items) {
  const cartTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  if (cartTotal > 500) return 10;
  if (cartTotal > 100) return 5;
  return 0;
}

/**
 * Calculates discounts from active promotions
 * @param {Array} promotions - Promotions array
 * @param {Date} currentDate - Current date
 * @returns {number} Promotional discount percentage
 */
function getPromotionalDiscounts(promotions, currentDate) {
  if (!promotions) return 0;
  
  return promotions
    .filter(isPromotionActive(currentDate))
    .reduce((sum, promo) => sum + promo.discountPercent, 0);
}

/**
 * Creates a filter function to check if promotion is active
 * @param {Date} currentDate - Current date
 * @returns {Function} Filter function
 */
function isPromotionActive(currentDate) {
  return (promotion) => {
    if (!promotion.active) return false;
    
    const startDate = new Date(promotion.startDate);
    const endDate = new Date(promotion.endDate);
    
    return currentDate >= startDate && currentDate <= endDate;
  };
}

module.exports = {
  calculateDiscount,
  MAX_DISCOUNT_PERCENT,
  // Export sub-functions for testing
  getUserBasedDiscounts,
  getCartBasedDiscounts,
  getPromotionalDiscounts
};