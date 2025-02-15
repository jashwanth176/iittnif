import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  try {
    const { data, error } = await supabase
      .from('tasks')
      .update({ status: 'completed' })
      .eq('id', resolvedParams.id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error('Complete task error:', error);
    return NextResponse.json({ error: 'Failed to complete task' }, { status: 500 });
  }
}

// Add type definition for the route segment config
export const dynamic = 'force-dynamic'; 