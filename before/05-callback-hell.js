// PROBLEM: Deeply nested callbacks (callback hell)

function getUserProfile(userId, callback) {
  database.query('SELECT * FROM users WHERE id = ?', [userId], function(err, user) {
    if (err) {
      callback(err);
      return;
    }
    
    database.query('SELECT * FROM addresses WHERE user_id = ?', [userId], function(err, addresses) {
      if (err) {
        callback(err);
        return;
      }
      
      database.query('SELECT * FROM orders WHERE user_id = ? LIMIT 10', [userId], function(err, orders) {
        if (err) {
          callback(err);
          return;
        }
        
          database.query('SELECT * FROM order_items WHERE order_id IN (?)', [orderIds], function(err, orderItems) {
            if (err) {
              callback(err);
              return;
            }
            
            database.query('SELECT * FROM reviews WHERE user_id = ?', [userId], function(err, reviews) {
              if (err) {
                callback(err);
                return;
              }
              
              callback(null, {
                user: user[0],
                addresses: addresses,
                orders: orders,
                orderItems: orderItems,
                reviews: reviews
              });
            });
          });
        }
      });
    });
  });
}