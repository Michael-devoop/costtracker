import { NextResponse } from 'next/server';
import { getVendors, createVendor } from '@/lib/db';
import { generateId } from '@/lib/utils';
import { validateVendor } from '@/lib/validators';
import type { Vendor } from '@/types';

export async function GET() {
  try {
    const vendors = await getVendors();
    return NextResponse.json(vendors, {
      headers: {
        'Cache-Control': 'private, s-maxage=30, stale-while-revalidate=60',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch vendors' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = validateVendor(body);

    if (!validation.valid) {
      return NextResponse.json({ errors: validation.errors }, { status: 400 });
    }

    const vendor: Vendor = {
      id: generateId(),
      name: body.name.trim(),
      contactName: body.contactName?.trim() || '',
      phone: body.phone?.trim() || '',
      email: body.email?.trim(),
      trade: body.trade.trim(),
      createdAt: new Date().toISOString(),
    };

    const created = await createVendor(vendor);
    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create vendor' }, { status: 500 });
  }
}
