// PROBLEM: High cyclomatic complexity, hard to understand and test

function calculateDiscount(user, cart, currentDate, promotions) {
  let discount = 0;
  
  if (user) {
    if (user.isPremium) {
      discount += 10;
      if (user.yearsAsMember > 5) {
        discount += 5;
      }
    }
    
    if (user.birthday) {
      const birthday = new Date(user.birthday);
      if (birthday.getMonth() === currentDate.getMonth() && birthday.getDate() === currentDate.getDate()) {
        discount += 15;
      }
    }
    
    if (user.totalPurchases > 1000) {
      discount += 5;
      if (user.totalPurchases > 5000) {
        discount += 10;
      }
    }
  }
  
  if (cart) {
    if (cart.items) {
      let totalItems = 0;
      for (let i = 0; i < cart.items.length; i++) {
        totalItems += cart.items[i].quantity;
      }
      if (totalItems > 10) {
        discount += 5;
      }
      if (totalItems > 20) {
        discount += 5;
      }
      
      let cartTotal = 0;
      for (let i = 0; i < cart.items.length; i++) {
        cartTotal += cart.items[i].price * cart.items[i].quantity;
      }
      if (cartTotal > 100) {
        discount += 5;
      }
      if (cartTotal > 500) {
        discount += 10;
      }
    }
  }
  
  if (promotions) {
    for (let i = 0; i < promotions.length; i++) {
      if (promotions[i].active) {
        if (new Date(promotions[i].startDate) <= currentDate && new Date(promotions[i].endDate) >= currentDate) {
          discount += promotions[i].discountPercent;
        }
      }
    }
  }
  
  return Math.min(discount, 50); // Cap at 50%
}