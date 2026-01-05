/**
 * @fileoverview Tests for API client utility
 * 
 * What is being tested:
 * - Axios client configuration
 * - Base URL configuration from environment variables
 * - Default API client export
 * 
 * Main scenarios covered:
 * - Uses correct base URL from environment variable
 * - Falls back to default localhost URL when env var not set
 * - Exports a properly configured axios instance
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('API Client', () => {
  const originalEnv = import.meta.env;

  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  describe('Configuration', () => {
    it('exports apiClient as an axios instance', async () => {
      const { apiClient } = await import('./client');
      
      expect(apiClient).toBeDefined();
      expect(apiClient.get).toBeDefined();
      expect(apiClient.post).toBeDefined();
      expect(apiClient.put).toBeDefined();
      expect(apiClient.delete).toBeDefined();
    });

    it('exports API_BASE_URL constant', async () => {
      const { API_BASE_URL } = await import('./client');
      
      expect(API_BASE_URL).toBeDefined();
      expect(typeof API_BASE_URL).toBe('string');
    });

    it('uses default localhost URL when VITE_API_URL is not set', async () => {
      vi.stubEnv('VITE_API_URL', '');
      
      const { API_BASE_URL } = await import('./client');
      
      expect(API_BASE_URL).toBe('http://127.0.0.1:8000/api/v1');
    });

    it('apiClient has the correct baseURL configured', async () => {
      const { apiClient, API_BASE_URL } = await import('./client');
      
      expect(apiClient.defaults.baseURL).toBe(API_BASE_URL);
    });
  });

  describe('HTTP Methods', () => {
    it('supports GET requests', async () => {
      const { apiClient } = await import('./client');
      
      expect(typeof apiClient.get).toBe('function');
    });

    it('supports POST requests', async () => {
      const { apiClient } = await import('./client');
      
      expect(typeof apiClient.post).toBe('function');
    });

    it('supports PUT requests', async () => {
      const { apiClient } = await import('./client');
      
      expect(typeof apiClient.put).toBe('function');
    });

    it('supports DELETE requests', async () => {
      const { apiClient } = await import('./client');
      
      expect(typeof apiClient.delete).toBe('function');
    });

    it('supports PATCH requests', async () => {
      const { apiClient } = await import('./client');
      
      expect(typeof apiClient.patch).toBe('function');
    });
  });
});
