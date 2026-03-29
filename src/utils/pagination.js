/**
 * Pagination Utility
 */

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

/**
 * Paginate an array of items
 * @param {Array} items - Items to paginate
 * @param {number} page - Page number (1-based)
 * @param {number} limit - Items per page
 * @returns {Object} Paginated result with data and metadata
 */
function paginate(items, page = DEFAULT_PAGE, limit = DEFAULT_LIMIT) {
  // Validate and normalize inputs
  const normalizedPage = Math.max(1, parseInt(page, 10) || DEFAULT_PAGE);
  const normalizedLimit = Math.min(MAX_LIMIT, Math.max(1, parseInt(limit, 10) || DEFAULT_LIMIT));
  
  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / normalizedLimit);
  
  // Calculate slice indices
  const startIndex = (normalizedPage - 1) * normalizedLimit;
  const endIndex = startIndex + normalizedLimit;
  
  const data = items.slice(startIndex, endIndex);
  
  return {
    data,
    pagination: {
      page: normalizedPage,
      limit: normalizedLimit,
      totalItems,
      totalPages,
      hasNextPage: normalizedPage < totalPages,
      hasPrevPage: normalizedPage > 1
    }
  };
}

/**
 * Build pagination links
 * @param {string} baseUrl - Base URL
 * @param {Object} pagination - Pagination metadata
 * @returns {Object} Pagination links
 */
function buildPaginationLinks(baseUrl, pagination) {
  const { page, limit, totalPages } = pagination;
  
  const links = {
    self: `${baseUrl}?page=${page}&limit=${limit}`,
    first: `${baseUrl}?page=1&limit=${limit}`
  };
  
  if (pagination.hasPrevPage) {
    links.prev = `${baseUrl}?page=${page - 1}&limit=${limit}`;
  }
  
  if (pagination.hasNextPage) {
    links.next = `${baseUrl}?page=${page + 1}&limit=${limit}`;
  }
  
  links.last = `${baseUrl}?page=${totalPages}&limit=${limit}`;
  
  return links;
}

module.exports = { paginate, buildPaginationLinks, DEFAULT_PAGE, DEFAULT_LIMIT, MAX_LIMIT };