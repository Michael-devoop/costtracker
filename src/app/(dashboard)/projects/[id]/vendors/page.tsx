export const dynamic = 'force-dynamic';

import { getVendors } from '@/lib/db';
import VendorsView from '@/components/vendors/VendorsView';

export default async function VendorsPage() {
  const vendors = await getVendors();
  return <VendorsView vendors={vendors} />;
}
