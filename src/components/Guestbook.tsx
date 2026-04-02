"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";
import { ArchetypeName, archetypeDetails } from "@/lib/scoring";
import { Feather, Send, BookOpen, Clock, Loader2 } from "lucide-react";

interface GuestbookMessage {
  id: string;
  user_name: string;
  archetype: ArchetypeName;
  message: string;
  created_at: string;
}

export default function Guestbook({ currentArchetype, currentUserName = "" }: { currentArchetype?: ArchetypeName | null, currentUserName?: string }) {
  const [messages, setMessages] = useState<GuestbookMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nameInput, setNameInput] = useState(currentUserName);
  
  // Realtime subscription setup
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from("guestbook")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(50);

        if (error) {
          console.error("Supabase Guestbook Error:", error);
        } else if (data) {
          setMessages(data as GuestbookMessage[]);
        }
      } catch (e) {
        console.error("Error fetching guestbook:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    const channel = supabase
      .channel("public:guestbook")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "guestbook" },
        (payload) => {
          setMessages((prev) => [payload.new as GuestbookMessage, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !nameInput.trim()) return;

    // Use a default archetype if user hasn't taken the quiz
    const arcForMsg = currentArchetype || "สมุดบันทึกปกหนังทำมือ";
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("guestbook").insert([
        {
          user_name: nameInput,
          archetype: arcForMsg,
          message: newMessage.trim()
        }
      ]);

      if (error) throw error;
      setNewMessage("");
    } catch (err) {
      console.error("Failed to post message:", err);
      alert("ไม่สามารถฝากข้อความได้ในขณะนี้");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return "เพิ่งเขียนเมื่อสักครู่";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} นาทีที่แล้ว`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} ชั่วโมงที่แล้ว`;
    return `${Math.floor(diffInSeconds / 86400)} วันที่แล้ว`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-16 px-4">
      <div className="flex flex-col items-center mb-10">
        <BookOpen className="w-8 h-8 text-brand-gold mb-4" />
        <h2 className="text-3xl md:text-4xl font-serif text-brand-charcoal text-center drop-shadow-sm">สมุดเยี่ยมเยือน</h2>
        <div className="w-24 h-[1px] bg-brand-gold/40 mt-4 mb-2"></div>
        <p className="font-serif italic text-brand-charcoal/60 text-center">"จดบันทึกความรู้สึกของคุณทิ้งไว้ ให้ผู้มาเยือนคนถัดไปได้รับรู้"</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative items-start">
        {/* Form container */}
        <div className="lg:col-span-5 sticky top-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#f0e6d2] p-8 rounded-tr-[2rem] rounded-bl-[2rem] border border-[#d4af37]/30 shadow-[5px_5px_15px_rgba(0,0,0,0.05),-5px_-5px_15px_rgba(255,255,255,0.5)] relative overflow-hidden"
          >
            {/* Paper texture overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNmZmYiLz48cmVjdCB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSIjMDAwIiBvcGFjaXR5PSIuMSIvPjwvc3ZnPg==')]" />
            
            <h3 className="font-serif text-xl border-b border-brand-charcoal/10 pb-4 mb-6 flex items-center gap-2">
              <Feather className="w-5 h-5 text-brand-charcoal/60" />
              จรดปากกาเขียนข้อความ
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
              <div>
                <label className="block font-sans text-xs uppercase tracking-widest text-brand-charcoal/60 mb-2">นามปากกา (Name)</label>
                <input 
                  type="text" 
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="ชื่อของคุณ..."
                  className="w-full bg-transparent border-b border-brand-charcoal/30 focus:border-brand-gold py-2 px-1 font-serif outline-none transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block font-sans text-xs uppercase tracking-widest text-brand-charcoal/60 mb-2">ข้อความ (Message)</label>
                <textarea 
                  value={newMessage}
                  onChange={(e) => {
                    if (e.target.value.length <= 200) {
                      setNewMessage(e.target.value);
                    }
                  }}
                  placeholder="ความรู้สึก ทัศนคติ หรือความลับที่คุณอยากฝากไว้..."
                  className="w-full h-32 bg-white/50 border border-brand-charcoal/10 rounded-sm p-4 font-serif text-brand-charcoal outline-none focus:border-brand-gold/50 focus:bg-white/80 transition-all resize-none shadow-inner"
                  required
                />
                <div className="text-right mt-1 font-sans text-[10px] text-brand-charcoal/40">
                  {newMessage.length} / 200
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting || !newMessage.trim() || !nameInput.trim()}
                className="w-full py-4 bg-brand-charcoal text-brand-light flex items-center justify-center gap-2 font-sans uppercase tracking-[0.2em] text-xs hover:bg-brand-charcoal/90 disabled:opacity-50 transition-colors shadow-lg group relative overflow-hidden"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    <span>ประทับตราฝากไว้</span>
                  </>
                )}
                <div className="absolute inset-0 border border-brand-gold/20 scale-[0.95] group-hover:scale-[0.98] transition-transform pointer-events-none" />
              </button>
            </form>
          </motion.div>
        </div>

        {/* Messages List Container */}
        <div className="lg:col-span-7 relative">
          <div className="absolute left-8 lg:left-12 top-0 bottom-0 w-[1px] bg-gradient-to-b from-brand-gold/0 via-brand-gold/40 to-brand-gold/0" />
          
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 text-brand-gold animate-spin" />
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-20 text-brand-charcoal/50 font-serif italic">
              สมุดเล่มนี้ยังว่างเปล่า... คุณจะเป็นคนแรกที่เขียนหรือไม่?
            </div>
          ) : (
            <div className="space-y-8 pb-10">
              <AnimatePresence>
                {messages.map((msg, idx) => {
                  const detail = archetypeDetails[msg.archetype] || archetypeDetails["สมุดบันทึกปกหนังทำมือ"];
                  
                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 20, rotate: -2 }}
                      animate={{ opacity: 1, y: 0, rotate: 0 }}
                      transition={{ 
                        duration: 0.8, 
                        delay: Math.min(idx * 0.1, 1), 
                        type: "spring" 
                      }}
                      className="relative pl-16 lg:pl-24 pr-4"
                    >
                      {/* Timeline dot */}
                      <div className="absolute left-[29px] lg:left-[45px] top-6 w-3 h-3 rounded-full bg-brand-light border-2 border-brand-gold z-10 shadow-[0_0_10px_rgba(212,175,55,0.5)]" />
                      
                      {/* Connecting line */}
                      <div className="absolute left-[34px] lg:left-[50px] top-[28px] w-8 lg:w-12 h-[1px] bg-brand-gold/40" />

                      <div className="bg-white p-6 md:p-8 rounded-sm shadow-[0_4px_20px_-5px_rgba(0,0,0,0.05),0_0_0_1px_rgba(42,42,42,0.03)] border-l-4 border-l-brand-gold relative group hover:-translate-y-1 transition-transform duration-500">
                        
                        {/* Avatar / Icon */}
                        <div className="absolute -top-5 -right-5 md:-right-6 w-12 h-12 rounded-full border-2 border-white shadow-lg bg-brand-charcoal/5 overflow-hidden">
                          <img src={detail.image} alt={msg.archetype} className="w-full h-full object-cover" />
                        </div>

                        <div className="mb-4">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-serif font-bold text-brand-charcoal text-lg">{msg.user_name}</span>
                            <span className="text-brand-charcoal/30">•</span>
                            <span className="font-sans text-[10px] text-brand-gold uppercase tracking-wider bg-brand-gold/5 px-2 py-0.5 rounded-full border border-brand-gold/20">
                              {msg.archetype}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-brand-charcoal/40 font-sans text-xs">
                            <Clock className="w-3 h-3" />
                            {getRelativeTime(msg.created_at)}
                          </div>
                        </div>

                        <p className="font-serif text-brand-charcoal/80 leading-relaxed italic text-sm md:text-base">
                          "{msg.message}"
                        </p>
                        
                        <div className="absolute bottom-4 right-4 opacity-5 pointer-events-none shrink-0 group-hover:opacity-10 transition-opacity">
                          <BookOpen className="w-12 h-12 text-brand-charcoal" />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
