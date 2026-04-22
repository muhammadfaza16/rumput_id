import { getSektorSummary } from "@/lib/data";
import { SEKTOR_LIST, PROPHECY_COLORS } from "@/data/mock";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function SektorPage() {
  const sektorData = await getSektorSummary();

  return (
    <div className="layout">
      <main className="main" style={{ maxWidth: "900px", margin: "0 auto" }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: "10px", color: "var(--text-muted)", letterSpacing: "0.15em", marginBottom: "6px" }}>CLASSIFIED / SEKTOR</div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "20px", color: "var(--text-primary)", marginBottom: "4px" }}>
          Peta Sektor BEI
        </h1>
        <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "24px", maxWidth: "600px" }}>
          Overview seluruh sektor di Bursa Efek Indonesia berdasarkan data fundamental dan intel lapangan.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "12px" }}>
          {sektorData.map((sektor: any, i: number) => {
            const config = SEKTOR_LIST.find(s => s.nama === sektor.sektor);
            const slug = config?.slug || sektor.sektor.toLowerCase().replace(/\s+/g, '-');

            return (
              <Link key={i} href={`/sektor/${slug}`} style={{ textDecoration: "none" }}>
                <div className="card-glow" style={{ padding: "20px", transition: "all 0.2s ease", cursor: "pointer" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                    <div>
                      <div style={{ fontFamily: "var(--font-display)", fontSize: "14px", color: "var(--text-primary)", marginBottom: "2px" }}>
                        {sektor.sektor}
                      </div>
                      {config?.teori && (
                        <div style={{ fontFamily: "var(--font-display)", fontSize: "9px", color: "var(--accent)", opacity: 0.7 }}>{config.teori}</div>
                      )}
                    </div>
                    <span style={{ fontFamily: "var(--font-data)", fontSize: "20px", color: "var(--accent)" }}>{sektor.count}</span>
                  </div>

                  {/* Metrics */}
                  <div style={{ display: "flex", gap: "16px", marginBottom: "12px" }}>
                    <div>
                      <div style={{ fontFamily: "var(--font-display)", fontSize: "8px", color: "var(--text-muted)", letterSpacing: "0.1em" }}>AVG PBV</div>
                      <div style={{ fontFamily: "var(--font-data)", fontSize: "14px", color: sektor.avgPbv < 1 ? "#00FF88" : "var(--text-primary)" }}>{sektor.avgPbv.toFixed(1)}x</div>
                    </div>
                    <div>
                      <div style={{ fontFamily: "var(--font-display)", fontSize: "8px", color: "var(--text-muted)", letterSpacing: "0.1em" }}>AVG ROE</div>
                      <div style={{ fontFamily: "var(--font-data)", fontSize: "14px", color: sektor.avgRoe > 15 ? "#00FF88" : "var(--text-primary)" }}>{sektor.avgRoe.toFixed(1)}%</div>
                    </div>
                  </div>

                  {/* Prophecy Distribution Bar */}
                  <div style={{ display: "flex", height: "4px", borderRadius: "2px", overflow: "hidden", gap: "1px" }}>
                    {sektor.holdCount > 0 && <div style={{ flex: sektor.holdCount, background: PROPHECY_COLORS["HOLD KERAS"].text }} />}
                    {sektor.akuisisiCount > 0 && <div style={{ flex: sektor.akuisisiCount, background: PROPHECY_COLORS["POTENSI AKUISISI"].text }} />}
                    {sektor.jebakanCount > 0 && <div style={{ flex: sektor.jebakanCount, background: PROPHECY_COLORS["JEBAKAN BATMAN"].text }} />}
                    {sektor.hindariCount > 0 && <div style={{ flex: sektor.hindariCount, background: PROPHECY_COLORS["HINDARI TOTAL"].text }} />}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px" }}>
                    <span style={{ fontSize: "9px", color: "#00FF88" }}>Hold {sektor.holdCount}</span>
                    <span style={{ fontSize: "9px", color: "#FF4466" }}>Hindari {sektor.hindariCount}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
