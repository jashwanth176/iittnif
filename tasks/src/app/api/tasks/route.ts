import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { createTaskSchema } from '@/lib/validations/task';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error('Fetch tasks error:', error);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate input
    const result = createTaskSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation error', details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { title, user_id, description } = result.data;

    const { data, error } = await supabase
      .from('tasks')
      .insert([{ title, user_id, description, status: 'pending' }])
      .select()
      .single();

    if (error) {
      if (error.code === '23505') { // Unique constraint error
        return NextResponse.json({ error: 'Task already exists' }, { status: 409 });
      }
      throw error;
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Create task error:', error);
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    );
  }
} 