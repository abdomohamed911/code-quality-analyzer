/**
 * Improved async error handling with proper try-catch blocks,
 * error type checking, and meaningful error messages
 */

class ApiError extends Error {
  constructor(message, statusCode, details = null) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.details = details;
  }
}

/**
 * Fetches user data with proper error handling
 * @param {string} userId - User identifier
 * @returns {Promise<Object>} User data
 * @throws {ApiError} If fetch fails or response is not OK
 */
async function fetchUserData(userId) {
  try {
    if (!userId) {
      throw new ApiError('User ID is required', 400);
    }

    const response = await fetch(`/api/users/${userId}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new ApiError(`User not found: ${userId}`, 404);
      }
      throw new ApiError(`Failed to fetch user: ${response.statusText}`, response.status);
    }
    
    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Network error while fetching user', 0, { cause: error });
  }
}

/**
 * Processes an order with comprehensive error handling
 * @param {string} orderId - Order identifier
 * @returns {Promise<Object>} Processing result
 */
async function processOrder(orderId) {
  try {
    if (!orderId) {
      throw new ApiError('Order ID is required', 400);
    }

    // Fetch order details
    const orderResponse = await fetch(`/api/orders/${orderId}`);
    if (!orderResponse.ok) {
      throw new ApiError(`Failed to fetch order: ${orderResponse.statusText}`, orderResponse.status);
    }
    const order = await orderResponse.json();

    // Fetch user data (already has error handling)
    const user = await fetchUserData(order.userId);

    // Fetch payment info
    const paymentResponse = await fetch(`/api/payments/${orderId}`);
    if (!paymentResponse.ok) {
      throw new ApiError(`Failed to fetch payment: ${paymentResponse.statusText}`, paymentResponse.status);
    }
    const payment = await paymentResponse.json();

    // Send notification (non-critical, don't fail the whole operation)
    try {
      await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: user.id, 
          message: 'Order processed' 
        })
      });
    } catch (notificationError) {
      console.error('Failed to send notification (non-critical):', notificationError.message);
      // Continue execution - notification failure shouldn't fail the order
    }

    return { order, user, payment };
  } catch (error) {
    console.error(`Order processing failed for ${orderId}:`, error.message);
    throw error;
  }
}

/**
 * Updates user profile with validation and error handling
 * @param {Object} profileData - Profile update data
 * @returns {Promise<boolean>} Success status
 */
async function updateProfile(profileData) {
  try {
    if (!profileData || Object.keys(profileData).length === 0) {
      throw new ApiError('Profile data is required', 400);
    }

    const response = await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileData)
    });

    if (!response.ok) {
      throw new ApiError(`Profile update failed: ${response.statusText}`, response.status);
    }

    return true;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Failed to update profile', 0, { cause: error });
  }
}