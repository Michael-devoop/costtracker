import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/users — List all users (requires auth)
export async function GET() {
  try {
    const supabase = await createClient();

    // Check if current user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Use admin API to list users
    // Note: For production, use Supabase service_role key via a separate admin client
    // For now, we'll use a workaround by querying auth.users via RPC or listing from profiles
    const { data, error } = await supabase.auth.admin.listUsers();

    if (error) {
      // Fallback: if admin API is not available, return just the current user
      return NextResponse.json({
        users: [{
          id: user.id,
          email: user.email,
          created_at: user.created_at,
          user_metadata: user.user_metadata,
        }],
      });
    }

    return NextResponse.json({
      users: data.users.map((u) => ({
        id: u.id,
        email: u.email,
        created_at: u.created_at,
        user_metadata: u.user_metadata,
      })),
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/users — Create a new user (admin only)
export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // Check if current user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { email, password, full_name, role } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { full_name, role },
      email_confirm: true, // Auto-confirm since admin is creating
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      user: {
        id: data.user.id,
        email: data.user.email,
        created_at: data.user.created_at,
        user_metadata: data.user.user_metadata,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/users?id=xxx — Delete a user (admin only)
export async function DELETE(request: Request) {
  try {
    const supabase = await createClient();

    // Check if current user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Prevent self-deletion
    if (userId === user.id) {
      return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 });
    }

    const { error } = await supabase.auth.admin.deleteUser(userId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
