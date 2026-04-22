import { getEmitenList, getIntelReports } from "@/lib/data";
import DashboardClient from "@/components/dashboard/DashboardClient";

export default async function DashboardPage() {
  const emitenList = await getEmitenList();
  const intelList = await getIntelReports();

  return <DashboardClient initialEmiten={emitenList} initialIntel={intelList} />;
}
