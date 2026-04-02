-- ============================================================
-- FIX: global_stats RLS blocking trigger from quiz_results
-- ============================================================
-- ปัญหา: เมื่อ INSERT เข้า quiz_results → Trigger จะไป INSERT/UPDATE 
-- ตาราง global_stats → แต่ global_stats ไม่ได้เปิด policy สำหรับ INSERT/UPDATE
-- ทำให้ทั้ง transaction ล้มเหลว ข้อมูลไม่เข้าทั้งสองตาราง

-- วิธีแก้: ทำให้ trigger function ทำงานด้วยสิทธิ์ของเจ้าของ (SECURITY DEFINER)
-- เพื่อให้มันข้าม RLS ได้

-- 1. Drop trigger เก่า
DROP TRIGGER IF EXISTS on_quiz_result_insert ON public.quiz_results;

-- 2. Drop function เก่า
DROP FUNCTION IF EXISTS increment_archetype_count();

-- 3. สร้าง function ใหม่แบบ SECURITY DEFINER (จะรันด้วยสิทธิ์ owner ข้าม RLS ได้)
CREATE OR REPLACE FUNCTION increment_archetype_count()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.global_stats (archetype, count)
    VALUES (NEW.archetype_result, 1)
    ON CONFLICT (archetype) DO UPDATE
    SET count = global_stats.count + 1;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. สร้าง trigger ใหม่
CREATE TRIGGER on_quiz_result_insert
AFTER INSERT ON public.quiz_results
FOR EACH ROW
EXECUTE FUNCTION increment_archetype_count();

-- 5. เปิด Realtime สำหรับ quiz_results (ถ้ายังไม่ได้เปิด)
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.quiz_results;
EXCEPTION WHEN duplicate_object THEN
  -- ถ้าเพิ่มไปแล้วก็ข้ามได้
  NULL;
END;
$$;
