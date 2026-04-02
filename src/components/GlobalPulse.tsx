"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";
import { archetypeDetails, ArchetypeName } from "@/lib/scoring";
import { Crown, Loader2, Sparkles, BarChart3, Users } from "lucide-react";

interface PulseStats {
  archetype: ArchetypeName;
  count: number;
  percentage: number;
}

export default function GlobalPulse({ currentArchetype }: { currentArchetype?: ArchetypeName | null }) {
  const [stats, setStats] = useState<PulseStats[]>([]);
  const [totalSouls, setTotalSouls] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch all results to calculate counts
        const { data, error } = await supabase
          .from("quiz_results")
          .select("archetype_result");

        if (error) {
          console.error("Supabase GlobalPulse Error:", error);
          // Don't throw, let it fall through and show 0s
        }

        const counts: Record<string, number> = {};
        let total = 0;

        if (data) {
          data.forEach((row) => {
            const arc = row.archetype_result as ArchetypeName;
            counts[arc] = (counts[arc] || 0) + 1;
            total++;
          });
        }

        // Initialize with 0 for all archetypes if none exist yet
        const allArchetypes = Object.keys(archetypeDetails) as ArchetypeName[];
        
        const pulseData: PulseStats[] = allArchetypes.map((arc) => {
          const count = counts[arc] || 0;
          return {
            archetype: arc,
            count,
            percentage: total > 0 ? (count / total) * 100 : 0
          };
        });

        pulseData.sort((a, b) => b.count - a.count);

        setStats(pulseData);
        setTotalSouls(total);
      } catch (err) {
        console.error("Error fetching stats:", err);
        // Fallback to 0 if caught an exception
        const allArchetypes = Object.keys(archetypeDetails) as ArchetypeName[];
        setStats(allArchetypes.map(arc => ({ archetype: arc, count: 0, percentage: 0 })));
      } finally {
        setLoading(false);
      }
    };

    fetchStats();

    // Set up Realtime listener for live updates
    const channel = supabase
      .channel("public:quiz_results")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "quiz_results" },
        (payload) => {
          const newArc = payload.new.archetype_result as ArchetypeName;
          setStats((prev) => {
            let found = false;
            const updated = prev.map((s) => {
              if (s.archetype === newArc) {
                found = true;
                return { ...s, count: s.count + 1 };
              }
              return s;
            });
            
            // Recalculate percentages
            const newTotal = totalSouls + 1;
            setTotalSouls(newTotal);
            
            return updated.map(s => ({
              ...s,
              percentage: newTotal > 0 ? (s.count / newTotal) * 100 : 0
            })).sort((a, b) => b.count - a.count);
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [totalSouls]);

  if (loading) {
    return (
      <div className="w-full flex justify-center py-12">
        <Loader2 className="w-8 h-8 text-brand-gold animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto my-16 px-4">
      {/* Header section */}
      <div className="flex flex-col items-center mb-10 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative flex items-center justify-center w-24 h-24 rounded-full border border-brand-gold/50 bg-brand-charcoal/5 mb-6"
        >
          <div className="absolute inset-2 border border-brand-charcoal/20 border-dashed rounded-full animate-[spin_30s_linear_infinite]" />
          <div className="flex flex-col items-center justify-center">
            <Users className="w-6 h-6 text-brand-gold mb-1" />
            <span className="font-serif text-brand-charcoal font-bold text-xl">{totalSouls}</span>
          </div>
        </motion.div>
        
        <h2 className="text-2xl md:text-3xl font-serif text-brand-charcoal flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-brand-gold" />
           สถิติจิตวิญญาณแห่งร้านของเก่า
          <Sparkles className="w-5 h-5 text-brand-gold" />
        </h2>
        <p className="font-sans text-brand-charcoal/60 text-sm mt-3 uppercase tracking-[0.2em]">
          Global Spiritual Pulse
        </p>
      </div>

      {/* Bars configuration */}
      <div className="space-y-5">
        {stats.map((stat, idx) => {
          const detail = archetypeDetails[stat.archetype];
          const isHighest = idx === 0 && stat.count > 0;
          const isUser = currentArchetype === stat.archetype;

          return (
            <motion.div
              key={stat.archetype}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              className={`relative flex flex-col p-4 md:p-5 rounded-sm border transition-colors ${
                isUser ? "bg-brand-gold/10 border-brand-gold shadow-[0_0_15px_rgba(212,175,55,0.2)]" : "bg-brand-light border-brand-charcoal/10"
              }`}
            >
              {isUser && (
                <div className="absolute -left-[1px] top-0 bottom-0 w-1 bg-brand-gold rounded-l-sm" />
              )}
              
              <div className="flex items-center justify-between mb-3 z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full border border-brand-gold/30 overflow-hidden bg-brand-charcoal/5 shrink-0">
                    <img src={detail.image} alt={stat.archetype} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className={`font-serif text-sm md:text-base ${isUser ? 'text-brand-gold font-bold' : 'text-brand-charcoal'}`}>
                      {stat.archetype}
                      {isHighest && <Crown className="inline-block w-4 h-4 ml-2 text-brand-gold -mt-1" />}
                      {isUser && <span className="ml-2 font-sans text-[10px] bg-brand-gold/20 text-brand-gold px-2 py-0.5 rounded-full uppercase tracking-wider">You</span>}
                    </h4>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-serif text-brand-charcoal font-bold">{stat.count} <span className="text-xs font-normal text-brand-charcoal/50">วิญญาณ</span></div>
                  <div className="font-sans text-[10px] text-brand-charcoal/50">{stat.percentage.toFixed(1)}%</div>
                </div>
              </div>

              {/* Progress Bar Background */}
              <div className="w-full h-1.5 bg-brand-charcoal/5 rounded-full overflow-hidden z-10">
                {/* Progress Bar Fill */}
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: `${stat.percentage}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, ease: "easeOut", delay: idx * 0.1 + 0.3 }}
                  className={`h-full ${isUser ? 'bg-brand-gold' : 'bg-brand-charcoal/30'}`}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
