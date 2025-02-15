import { GET, POST } from '../route';
import { supabase } from '@/lib/supabase';
import { NextRequest } from 'next/server';

// Add a base URL constant that can be configured via environment variable
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

describe('Tasks API Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/tasks', () => {
    it('should return tasks sorted by creation date', async () => {
      const mockTasks = [
        { id: '1', title: 'Task 1', created_at: '2024-03-20' },
        { id: '2', title: 'Task 2', created_at: '2024-03-21' }
      ];

      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnValue({
          order: jest.fn().mockResolvedValue({ data: mockTasks, error: null })
        })
      });

      const response = await GET();
      const data = await response.json();

      expect(data).toEqual(mockTasks);
      expect(supabase.from).toHaveBeenCalledWith('tasks');
    });

    it('should handle errors appropriately', async () => {
      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnValue({
          order: jest.fn().mockResolvedValue({ 
            data: null, 
            error: new Error('Database error') 
          })
        })
      });

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ error: 'Failed to fetch tasks' });
    });
  });

  describe('POST /api/tasks', () => {
    it('should create a new task', async () => {
      const newTask = {
        title: 'New Task',
        user_id: 'user123',
        description: 'Task description'
      };

      const mockResponse = {
        id: '1',
        ...newTask,
        status: 'pending',
        created_at: new Date().toISOString()
      };

      (supabase.from as jest.Mock).mockReturnValue({
        insert: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: mockResponse,
              error: null
            })
          })
        })
      });

      const request = new NextRequest(`${BASE_URL}/api/tasks`, {
        method: 'POST',
        body: JSON.stringify(newTask)
      });

      const response = await POST(request);
      const data = await response.json();

      expect(data).toEqual(mockResponse);
      expect(supabase.from).toHaveBeenCalledWith('tasks');
    });
  });
}); 