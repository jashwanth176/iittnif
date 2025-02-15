import { PATCH } from '../route';
import { supabase } from '@/lib/supabase';
import { NextRequest } from 'next/server';

describe('Complete Task API Route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should mark a task as completed', async () => {
    const taskId = '123';
    const mockTask = {
      id: taskId,
      title: 'Test Task',
      status: 'completed'
    };

    (supabase.from as jest.Mock).mockReturnValue({
      update: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: mockTask,
              error: null
            })
          })
        })
      })
    });

    const request = new NextRequest('http://localhost:3000/api/tasks/123/complete');
    const params = Promise.resolve({ id: taskId });
    
    const response = await PATCH(request, { params });
    const data = await response.json();

    expect(data).toEqual(mockTask);
    expect(supabase.from).toHaveBeenCalledWith('tasks');
  });

  it('should handle errors appropriately', async () => {
    const taskId = '123';
    
    (supabase.from as jest.Mock).mockReturnValue({
      update: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: null,
              error: new Error('Task not found')
            })
          })
        })
      })
    });

    const request = new NextRequest('http://localhost:3000/api/tasks/123/complete');
    const params = Promise.resolve({ id: taskId });
    
    const response = await PATCH(request, { params });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({ error: 'Failed to complete task' });
  });
}); 