import { getEmitenList, getIntelReports } from "@/lib/data";
import DashboardClient from "@/components/dashboard/DashboardClient";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const emitenList = await getEmitenList();
  const intelList = await getIntelReports();

  return <DashboardClient initialEmiten={emitenList} initialIntel={intelList} />;
}
