import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "placeholder-anon-key";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-service-key";

// Client for browser / public use
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side admin client using service role key (bypasses RLS for admin operations)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

export interface StaffUser {
  id: string;
  email: string;
  role: "ADMIN" | "DISPATCHER" | "TECHNICIAN";
  fullName: string;
}

export async function verifyStaffSession(authHeader?: string | null): Promise<StaffUser | null> {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.replace("Bearer ", "");
  try {
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
    if (error || !user) return null;

    return {
      id: user.id,
      email: user.email || "staff@pestiq.com",
      role: (user.user_metadata?.role as any) || "DISPATCHER",
      fullName: user.user_metadata?.full_name || "PestIQ Staff",
    };
  } catch (err) {
    console.warn("Supabase staff verification warning:", err);
    return null;
  }
}
