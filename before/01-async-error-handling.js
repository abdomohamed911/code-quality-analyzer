// PROBLEM: No error handling for async operations

async function fetchUserData(userId) {
  const response = await fetch(`/api/users/${userId}`);
  const data = await response.json();
  return data;
}

async function processOrder(orderId) {
  const order = await fetch(`/api/orders/${orderId}`).then(r => r.json());
  const user = await fetchUserData(order.userId);
  const payment = await fetch(`/api/payments/${orderId}`).then(r => r.json());
  
  await fetch(`/api/notifications`, {
    method: 'POST',
    body: JSON.stringify({ userId: user.id, message: 'Order processed' })
  });
  
  return { order, user, payment };
}

async function updateProfile(profileData) {
  await fetch('/api/profile', {
    method: 'PUT',
    body: JSON.stringify(profileData)
  });
  return true;
}