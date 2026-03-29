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

class DataFetcher {
  
  constructor(dataUrl) {
    this.dataUrl = dataUrl;
    this.state = 'idle'; // idle, loading, success, error
  }
  
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
  
  get isLoading() {
    return this.state === 'loading';
  }
}

function getMaxValue(firstValue, secondValue) {
  return firstValue > secondValue ? firstValue : secondValue;
}

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
