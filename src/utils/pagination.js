const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

function paginate(items, page = DEFAULT_PAGE, limit = DEFAULT_LIMIT) {
  // Validate and normalize inputs
  const normalizedPage = Math.max(1, parseInt(page, 10) || DEFAULT_PAGE);
  const parsedLimit = parseInt(limit, 10);
  const normalizedLimit = (!parsedLimit || parsedLimit <= 0)
    ? DEFAULT_LIMIT
    : Math.min(parsedLimit, MAX_LIMIT);
  
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
