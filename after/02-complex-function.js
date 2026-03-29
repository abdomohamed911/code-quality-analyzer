const MAX_DISCOUNT_PERCENT = 50;

function calculateDiscount(user, cart, currentDate, promotions) {
  const discounts = [
    getUserBasedDiscounts(user, currentDate),
    getCartBasedDiscounts(cart),
    getPromotionalDiscounts(promotions, currentDate)
  ];
  
  const totalDiscount = discounts.reduce((sum, d) => sum + d, 0);
  return Math.min(totalDiscount, MAX_DISCOUNT_PERCENT);
}

function getUserBasedDiscounts(user, currentDate) {
  if (!user) return 0;
  
  let discount = 0;
  
  discount += getMembershipDiscount(user);
  discount += getBirthdayDiscount(user, currentDate);
  discount += getLoyaltyDiscount(user);
  
  return discount;
}

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

function getBirthdayDiscount(user, currentDate) {
  if (!user.birthday) return 0;
  
  const birthday = new Date(user.birthday);
  const isBirthdayToday = (
    birthday.getMonth() === currentDate.getMonth() &&
    birthday.getDate() === currentDate.getDate()
  );
  
  return isBirthdayToday ? 15 : 0;
}

function getLoyaltyDiscount(user) {
  const { totalPurchases = 0 } = user;
  
  if (totalPurchases > 5000) return 15;
  if (totalPurchases > 1000) return 5;
  return 0;
}

function getCartBasedDiscounts(cart) {
  if (!cart?.items) return 0;
  
  let discount = 0;
  
  discount += getQuantityDiscount(cart.items);
  discount += getCartValueDiscount(cart.items);
  
  return discount;
}

function getQuantityDiscount(items) {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  
  if (totalItems > 20) return 10;
  if (totalItems > 10) return 5;
  return 0;
}

function getCartValueDiscount(items) {
  const cartTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  if (cartTotal > 500) return 10;
  if (cartTotal > 100) return 5;
  return 0;
}

function getPromotionalDiscounts(promotions, currentDate) {
  if (!promotions) return 0;
  
  return promotions
    .filter(isPromotionActive(currentDate))
    .reduce((sum, promo) => sum + promo.discountPercent, 0);
}

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
