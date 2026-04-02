import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://aabqchdjgbexxrvwxrfc.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhYnFjaGRqZ2JleHhydnd4cmZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxNTA2NTcsImV4cCI6MjA5MDcyNjY1N30.BXU2L_mYu1SlpGotweFlqHNn8GCrDFMLP5HMfOAyaIY";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  console.log("=== Test 1: SELECT from quiz_results ===");
  const { data: d1, error: e1 } = await supabase.from("quiz_results").select("*").limit(5);
  if (e1) console.error("  ERROR:", JSON.stringify(e1, null, 2));
  else console.log("  OK, rows:", d1.length, d1);

  console.log("\n=== Test 2: INSERT into quiz_results ===");
  const { data: d2, error: e2 } = await supabase.from("quiz_results").insert([
    { user_name: "test_user", archetype_result: "สมุดบันทึกปกหนังทำมือ", scores_json: { I: 5, E: 3, T: 4, F: 6, S: 2, C: 7 } }
  ]).select();
  if (e2) console.error("  ERROR:", JSON.stringify(e2, null, 2));
  else console.log("  OK, inserted:", d2);

  console.log("\n=== Test 3: SELECT from guestbook ===");
  const { data: d3, error: e3 } = await supabase.from("guestbook").select("*").limit(5);
  if (e3) console.error("  ERROR:", JSON.stringify(e3, null, 2));
  else console.log("  OK, rows:", d3.length, d3);

  console.log("\n=== Test 4: INSERT into guestbook ===");
  const { data: d4, error: e4 } = await supabase.from("guestbook").insert([
    { user_name: "test_user", archetype: "สมุดบันทึกปกหนังทำมือ", message: "ทดสอบระบบสมุดเยี่ยม" }
  ]).select();
  if (e4) console.error("  ERROR:", JSON.stringify(e4, null, 2));
  else console.log("  OK, inserted:", d4);

  console.log("\n=== Test 5: SELECT quiz_results after insert ===");
  const { data: d5, error: e5 } = await supabase.from("quiz_results").select("archetype_result").limit(10);
  if (e5) console.error("  ERROR:", JSON.stringify(e5, null, 2));
  else console.log("  OK, rows:", d5.length, JSON.stringify(d5));

  console.log("\n=== All tests done ===");
}

test();
