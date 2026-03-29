/**
 * Utility functions with proper naming conventions
 */

/**
 * Processes data based on the specified calculation type
 * @param {Array} dataItems - Array of data items with status and value properties
 * @param {string} calculationType - Type of calculation ('active', 'total', 'count')
 * @returns {*} Calculation result based on type
 */
function processDataByType(dataItems, calculationType) {
  switch (calculationType) {
    case 'active':
      return dataItems
        .filter(item => item.status === 'active')
        .map(item => item.name);
    
    case 'total':
      return dataItems
        .filter(item => item.status === 'completed')
        .reduce((sum, item) => sum + item.value, 0);
    
    case 'count':
    default:
      return dataItems.length;
  }
}

/**
 * Data fetcher with state management
 */
class DataFetcher {
  /**
   * @param {string} dataUrl - URL to fetch data from
   */
  constructor(dataUrl) {
    this.dataUrl = dataUrl;
    this.state = 'idle'; // idle, loading, success, error
  }
  
  /**
   * Fetches data from the configured URL
   * @returns {Promise<Object>} Parsed JSON response
   * @throws {Error} If fetch fails
   */
  async fetchData() {
    this.state = 'loading';
    
    try {
      const response = await fetch(this.dataUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      
      this.state = 'success';
      return await response.json();
    } catch (error) {
      this.state = 'error';
      throw error;
    }
  }
  
  /**
   * Checks if currently loading
   * @returns {boolean}
   */
  get isLoading() {
    return this.state === 'loading';
  }
}

/**
 * Returns the maximum of two numbers
 * @param {number} firstValue - First number
 * @param {number} secondValue - Second number
 * @returns {number} The larger of the two values
 */
function getMaxValue(firstValue, secondValue) {
  return firstValue > secondValue ? firstValue : secondValue;
}

/**
 * Filters array elements based on predicate function
 * @param {Array} items - Array to filter
 * @param {Function} predicate - Filter function
 * @returns {Array} Filtered array
 */
function filterItems(items, predicate) {
  return items.filter(predicate);
}

// Note: In production, prefer native Array.filter() over custom implementation
// This is shown for educational purposes

module.exports = {
  processDataByType,
  DataFetcher,
  getMaxValue,
  filterItems
};