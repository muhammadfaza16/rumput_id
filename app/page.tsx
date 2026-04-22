import { getEmitenList, getIntelReports } from "@/lib/data";
import DashboardClient from "@/components/dashboard/DashboardClient";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  try {
    const emitenList = await getEmitenList();
    const intelList = await getIntelReports();
    return <DashboardClient initialEmiten={emitenList} initialIntel={intelList} />;
  } catch (error) {
    console.error("Dashboard Render Error:", error);
    return (
      <div style={{ padding: '100px', color: 'var(--accent)', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-display)' }}>TERMINAL ERROR</h2>
        <p style={{ color: 'white', marginTop: '10px' }}>Gagal memuat data dari satelit. Coba refresh beberapa saat lagi.</p>
      </div>
    );
  }
}
