const { paginate, buildPaginationLinks, DEFAULT_PAGE, DEFAULT_LIMIT, MAX_LIMIT } = require('../../src/utils/pagination');

describe('Pagination Utility', () => {
  const sampleItems = Array.from({ length: 25 }, (_, i) => ({ id: i + 1 }));
  
  describe('paginate', () => {
    it('should return first page with default limit', () => {
      const result = paginate(sampleItems, 1);
      
      expect(result.data.length).toBe(DEFAULT_LIMIT);
      expect(result.pagination.page).toBe(1);
      expect(result.pagination.limit).toBe(DEFAULT_LIMIT);
    });
    
    it('should return correct page', () => {
      const result = paginate(sampleItems, 2, 10);
      
      expect(result.data.length).toBe(10);
      expect(result.data[0].id).toBe(11);
    });
    
    it('should calculate total pages correctly', () => {
      const result = paginate(sampleItems, 1, 10);
      
      expect(result.pagination.totalPages).toBe(3);
    });
    
    it('should set hasNextPage correctly', () => {
      const page1 = paginate(sampleItems, 1, 10);
      const page3 = paginate(sampleItems, 3, 10);
      
      expect(page1.pagination.hasNextPage).toBe(true);
      expect(page3.pagination.hasNextPage).toBe(false);
    });
    
    it('should set hasPrevPage correctly', () => {
      const page1 = paginate(sampleItems, 1, 10);
      const page2 = paginate(sampleItems, 2, 10);
      
      expect(page1.pagination.hasPrevPage).toBe(false);
      expect(page2.pagination.hasPrevPage).toBe(true);
    });
    
    it('should handle empty array', () => {
      const result = paginate([], 1, 10);
      
      expect(result.data.length).toBe(0);
      expect(result.pagination.totalItems).toBe(0);
      expect(result.pagination.totalPages).toBe(0);
    });
    
    it('should normalize invalid page to 1', () => {
      const result = paginate(sampleItems, -1, 10);
      
      expect(result.pagination.page).toBe(1);
    });
    
    it('should normalize invalid limit to default', () => {
      const result = paginate(sampleItems, 1, -1);
      
      expect(result.pagination.limit).toBe(DEFAULT_LIMIT);
    });
    
    it('should cap limit at MAX_LIMIT', () => {
      const result = paginate(sampleItems, 1, 1000);
      
      expect(result.pagination.limit).toBe(MAX_LIMIT);
    });
    
    it('should return empty array for page beyond total', () => {
      const result = paginate(sampleItems, 100, 10);
      
      expect(result.data.length).toBe(0);
    });
  });
  
  describe('buildPaginationLinks', () => {
    it('should build all links correctly', () => {
      const pagination = {
        page: 2,
        limit: 10,
        totalPages: 5,
        hasNextPage: true,
        hasPrevPage: true
      };
      
      const links = buildPaginationLinks('/api/tasks', pagination);
      
      expect(links.self).toContain('page=2');
      expect(links.first).toContain('page=1');
      expect(links.prev).toContain('page=1');
      expect(links.next).toContain('page=3');
      expect(links.last).toContain('page=5');
    });
    
    it('should not include prev link on first page', () => {
      const pagination = {
        page: 1,
        limit: 10,
        totalPages: 5,
        hasNextPage: true,
        hasPrevPage: false
      };
      
      const links = buildPaginationLinks('/api/tasks', pagination);
      
      expect(links.prev).toBeUndefined();
    });
    
    it('should not include next link on last page', () => {
      const pagination = {
        page: 5,
        limit: 10,
        totalPages: 5,
        hasNextPage: false,
        hasPrevPage: true
      };
      
      const links = buildPaginationLinks('/api/tasks', pagination);
      
      expect(links.next).toBeUndefined();
    });
  });
});
