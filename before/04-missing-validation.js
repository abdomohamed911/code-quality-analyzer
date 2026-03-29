// PROBLEM: No input validation leads to unexpected behavior

function createUser(userData) {
  return {
    id: Math.random().toString(36).substr(2),
    name: userData.name,
    email: userData.email,
    age: userData.age,
    role: userData.role || 'user'
  };
}

function calculatePrice(items, discount) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total += items[i].price * items[i].quantity;
  }
  return total - (total * discount);
}

function formatDate(dateString) {
  const parts = dateString.split('-');
  return `${parts[1]}/${parts[2]}/${parts[0]}`;
}

function searchUsers(users, query) {
  return users.filter(u => u.name.includes(query));
}