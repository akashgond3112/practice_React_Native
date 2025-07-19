/**
 * Super minimal React test to verify Jest setup
 */

import React from 'react';

describe('React is working', () => {
  it('should be defined', () => {
    expect(React).toBeDefined();
  });
  
  it('should have createElement function', () => {
    expect(typeof React.createElement).toBe('function');
  });
});
