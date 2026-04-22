import { getEmiten, getIntelReports } from "@/lib/data";
import { PROPHECY_COLORS, PROPHECY_DESC } from "@/data/mock";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

function ScoreBar({ score, label, color }: { score: number; label: string; color?: string }) {
  const barColor = color || (score >= 60 ? "#00FF88" : score >= 40 ? "#FFAA00" : "#FF4466");
  return (
    <div style={{ marginBottom: "12px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
        <span style={{ fontFamily: "var(--font-display)", fontSize: "10px", color: "var(--text-muted)", letterSpacing: "0.05em" }}>{label}</span>
        <span style={{ fontFamily: "var(--font-data)", fontSize: "12px", color: barColor }}>{Math.round(score)}/100</span>
      </div>
      <div style={{ height: "6px", background: "rgba(255,255,255,0.06)", borderRadius: "3px", overflow: "hidden" }}>
        <div style={{ width: `${score}%`, height: "100%", background: barColor, borderRadius: "3px", transition: "width 0.6s ease" }} />
      </div>
    </div>
  );
}

function MetricBox({ label, value, note, color }: { label: string; value: string; note?: string; color?: string }) {
  return (
    <div style={{ padding: "12px", background: "var(--bg-secondary)", borderRadius: "8px", border: "1px solid var(--border-subtle)" }}>
      <div style={{ fontFamily: "var(--font-display)", fontSize: "9px", color: "var(--text-muted)", letterSpacing: "0.1em", marginBottom: "4px" }}>{label}</div>
      <div style={{ fontFamily: "var(--font-data)", fontSize: "18px", color: color || "var(--text-primary)" }}>{value}</div>
      {note && <div style={{ fontFamily: "var(--font-display)", fontSize: "9px", color: color || "var(--text-muted)", marginTop: "2px" }}>{note}</div>}
    </div>
  );
}

export default async function EmitenDetailPage({ params }: { params: Promise<{ ticker: string }> }) {
  const { ticker } = await params;
  const emiten = await getEmiten(ticker.toUpperCase());
  
  if (!emiten) return notFound();

  const intelList = await getIntelReports(ticker.toUpperCase());

  const prophecyLabel = (emiten.prophecy_label || emiten.prophecy || "POTENSI AKUISISI") as keyof typeof PROPHECY_COLORS;
  const prophecyStyle = PROPHECY_COLORS[prophecyLabel] || PROPHECY_COLORS["HINDARI TOTAL"];
  const fundScore = emiten.fundamental_score || emiten.fundScore || 50;
  const intelScore = emiten.intel_score || emiten.intelScore || 50;
  const prophecyScore = emiten.prophecy_score || ((fundScore + intelScore) / 2);

  const shareholders = emiten.shareholders || [];
  const directors = emiten.directors || [];
  const commissioners = emiten.commissioners || [];

  return (
    <div className="layout">
      <main className="main" style={{ maxWidth: "900px", margin: "0 auto" }}>
        {/* Back nav */}
        <Link href="/" style={{ fontFamily: "var(--font-display)", fontSize: "11px", color: "var(--text-muted)", textDecoration: "none", display: "block", marginBottom: "16px" }}>
          ← BACK TO SCREENER
        </Link>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: "16px", marginBottom: "24px", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: "200px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px" }}>
              <span style={{ fontFamily: "var(--font-data)", fontSize: "28px", fontWeight: "bold", color: "var(--accent)" }}>{emiten.ticker}</span>
              {emiten.papan_pencatatan && (
                <span style={{ fontFamily: "var(--font-display)", fontSize: "9px", padding: "2px 8px", borderRadius: "3px", border: "1px solid var(--border-default)", color: "var(--text-muted)" }}>
                  {emiten.papan_pencatatan}
                </span>
              )}
            </div>
            <div style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: "4px" }}>{emiten.nama}</div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
              {emiten.sektor}{emiten.sub_sektor ? ` · ${emiten.sub_sektor}` : ''}
            </div>
          </div>

          {/* Price */}
          {emiten.last_price && (
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: "var(--font-data)", fontSize: "24px", color: "var(--text-primary)" }}>
                Rp {new Intl.NumberFormat("id-ID").format(emiten.last_price)}
              </div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "10px", color: "var(--text-muted)" }}>LAST PRICE</div>
            </div>
          )}
        </div>

        {/* ── THE PROPHECY ── */}
        <div className="card-glow" style={{ padding: "24px", marginBottom: "20px", border: `1px solid ${prophecyStyle.border}`, boxShadow: prophecyStyle.glow }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: "10px", color: "var(--text-muted)", letterSpacing: "0.15em", marginBottom: "12px" }}>THE PROPHECY</div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: "22px", fontWeight: "bold", color: prophecyStyle.text, marginBottom: "6px" }}>
            ◆ {prophecyLabel}
          </div>
          <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "20px", maxWidth: "500px" }}>
            {PROPHECY_DESC[prophecyLabel] || "Analisis belum tersedia."}
          </div>

          <ScoreBar score={fundScore} label="FUNDAMENTAL SCORE" color={prophecyStyle.text} />
          <ScoreBar score={intelScore} label="INTEL SCORE" />
          <div style={{ height: "1px", background: "var(--border-subtle)", margin: "12px 0" }} />
          <ScoreBar score={prophecyScore} label="PROPHECY SCORE (50/50)" color={prophecyStyle.text} />
        </div>

        {/* ── FUNDAMENTAL SNAPSHOT ── */}
        <div style={{ fontFamily: "var(--font-display)", fontSize: "10px", color: "var(--text-muted)", letterSpacing: "0.15em", marginBottom: "12px" }}>FUNDAMENTAL SNAPSHOT</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "8px", marginBottom: "24px" }}>
          <MetricBox label="PBV" value={emiten.pbv != null ? `${emiten.pbv.toFixed(2)}x` : "—"}
            note={emiten.pbv != null ? (emiten.pbv < 1 ? "▲ undervalued" : emiten.pbv > 5 ? "▼ mahal" : "● wajar") : undefined}
            color={emiten.pbv != null ? (emiten.pbv < 1 ? "#00FF88" : emiten.pbv > 5 ? "#FF4466" : undefined) : undefined} />
          <MetricBox label="PER" value={emiten.per != null ? `${emiten.per.toFixed(2)}x` : "—"}
            note={emiten.per != null ? (emiten.per < 10 ? "▲ murah" : emiten.per > 30 ? "▼ mahal" : "● wajar") : undefined}
            color={emiten.per != null ? (emiten.per < 10 ? "#00FF88" : emiten.per > 30 ? "#FF4466" : undefined) : undefined} />
          <MetricBox label="ROE" value={emiten.roe != null ? `${emiten.roe.toFixed(1)}%` : "—"}
            note={emiten.roe != null ? (emiten.roe > 15 ? "▲ bagus" : emiten.roe < 0 ? "▼ rugi" : "● moderate") : undefined}
            color={emiten.roe != null ? (emiten.roe > 15 ? "#00FF88" : emiten.roe < 0 ? "#FF4466" : undefined) : undefined} />
          <MetricBox label="EPS" value={emiten.eps != null ? `Rp ${new Intl.NumberFormat("id-ID").format(emiten.eps)}` : "—"} />
          <MetricBox label="DER" value={emiten.der != null ? `${emiten.der.toFixed(2)}x` : "—"}
            note={emiten.der != null && emiten.npl == null ? (emiten.der < 1 ? "▲ sehat" : emiten.der > 2 ? "▼ tinggi" : "● wajar") : (emiten.npl != null ? "bank" : undefined)} />
          {emiten.npl != null && (
            <MetricBox label="NPL" value={`${emiten.npl.toFixed(1)}%`}
              note={emiten.npl < 2 ? "▲ sehat" : emiten.npl > 5 ? "▼ bahaya" : "● moderate"}
              color={emiten.npl < 2 ? "#00FF88" : emiten.npl > 5 ? "#FF4466" : "#FFAA00"} />
          )}
        </div>

        {/* ── SHAREHOLDERS ── */}
        {shareholders.length > 0 && (
          <>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "10px", color: "var(--text-muted)", letterSpacing: "0.15em", marginBottom: "12px" }}>PEMEGANG SAHAM</div>
            <div className="card-glow" style={{ padding: "16px", marginBottom: "24px" }}>
              {shareholders.map((sh: any, i: number) => {
                const pct = sh.pct || 0;
                return (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: i < shareholders.length - 1 ? "12px" : 0 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "12px", color: "var(--text-primary)", marginBottom: "4px" }}>{sh.name}</div>
                      <div style={{ height: "4px", background: "rgba(255,255,255,0.06)", borderRadius: "2px", overflow: "hidden" }}>
                        <div style={{ width: `${pct}%`, height: "100%", background: "var(--accent)", borderRadius: "2px", opacity: 0.7 }} />
                      </div>
                    </div>
                    <span style={{ fontFamily: "var(--font-data)", fontSize: "14px", color: "var(--accent)", minWidth: "60px", textAlign: "right" }}>
                      {pct.toFixed(2)}%
                    </span>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* ── BOARD ── */}
        {(directors.length > 0 || commissioners.length > 0) && (
          <>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "10px", color: "var(--text-muted)", letterSpacing: "0.15em", marginBottom: "12px" }}>BOARD OF DIRECTORS & COMMISSIONERS</div>
            <div className="card-glow" style={{ padding: "16px", marginBottom: "24px" }}>
              {directors.map((d: any, i: number) => (
                <div key={`d-${i}`} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "1px solid var(--border-subtle)" }}>
                  <span style={{ fontSize: "12px", color: "var(--text-primary)" }}>👤 {d.name}</span>
                  <span style={{ fontSize: "10px", color: "var(--text-muted)", fontFamily: "var(--font-display)" }}>{d.position}</span>
                </div>
              ))}
              {commissioners.map((c: any, i: number) => (
                <div key={`c-${i}`} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: i < commissioners.length - 1 ? "1px solid var(--border-subtle)" : "none" }}>
                  <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>🏛 {c.name}</span>
                  <span style={{ fontSize: "10px", color: "var(--text-muted)", fontFamily: "var(--font-display)" }}>{c.position}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── COMPANY INFO ── */}
        {(emiten.alamat || emiten.website || emiten.telepon) && (
          <>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "10px", color: "var(--text-muted)", letterSpacing: "0.15em", marginBottom: "12px" }}>COMPANY INFO</div>
            <div className="card-glow" style={{ padding: "16px", marginBottom: "24px", display: "grid", gridTemplateColumns: "80px 1fr", gap: "8px", fontSize: "12px" }}>
              {emiten.alamat && <><span style={{ color: "var(--text-muted)" }}>Alamat</span><span style={{ color: "var(--text-secondary)" }}>{emiten.alamat}</span></>}
              {emiten.telepon && <><span style={{ color: "var(--text-muted)" }}>Telp</span><span style={{ color: "var(--text-secondary)" }}>{emiten.telepon}</span></>}
              {emiten.website && <><span style={{ color: "var(--text-muted)" }}>Web</span><a href={`https://${emiten.website}`} target="_blank" rel="noopener" style={{ color: "var(--accent)" }}>{emiten.website}</a></>}
              {emiten.email && <><span style={{ color: "var(--text-muted)" }}>Email</span><span style={{ color: "var(--text-secondary)" }}>{emiten.email}</span></>}
            </div>
          </>
        )}

        {/* ── INTEL FEED ── */}
        <div style={{ fontFamily: "var(--font-display)", fontSize: "10px", color: "var(--text-muted)", letterSpacing: "0.15em", marginBottom: "12px" }}>INTEL LAPANGAN ({intelList.length})</div>
        {intelList.length === 0 ? (
          <div className="card-glow" style={{ padding: "24px", textAlign: "center" }}>
            <div style={{ fontSize: "14px", color: "var(--text-muted)" }}>Belum ada intel untuk emiten ini.</div>
            <Link href="/lapor" style={{ color: "var(--accent)", fontFamily: "var(--font-display)", fontSize: "12px" }}>+ KIRIM LAPORAN INTEL</Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {intelList.map((intel: any, i: number) => (
              <div key={i} className="intel-card">
                <div className="intel-header">
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span className="intel-categ">{intel.kategori}</span>
                    <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>{intel.lokasi} · {intel.kota}</span>
                  </div>
                  <span className="intel-time">{intel.waktu}</span>
                </div>
                <div className="intel-catatan">&ldquo;{intel.catatan}&rdquo;</div>
                <div className="intel-footer">
                  <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>— {intel.nick || "Analis Anonim"}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
