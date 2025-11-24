import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get the authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    // Verify the admin
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error("Unauthorized");
    }

    // Check if user is admin
    const { data: roleData, error: roleError } = await supabaseClient
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .single();

    if (roleError || !roleData) {
      throw new Error("Insufficient permissions");
    }

    const { userId } = await req.json();

    if (!userId) {
      throw new Error("User ID is required");
    }

    // Create an impersonation session token
    const { data, error } = await supabaseClient.auth.admin.generateLink({
      type: 'magiclink',
      email: '', // We'll get the email from the user
    });

    // Get target user email
    const { data: targetUser, error: userError } = await supabaseClient.auth.admin.getUserById(userId);
    
    if (userError || !targetUser) {
      throw new Error("Target user not found");
    }

    // Generate a magic link for the target user
    const { data: linkData, error: linkError } = await supabaseClient.auth.admin.generateLink({
      type: 'magiclink',
      email: targetUser.user.email || '',
    });

    if (linkError) throw linkError;

    // Log the impersonation
    await supabaseClient
      .from("admin_audit_log")
      .insert({
        admin_id: user.id,
        action: "impersonate_user",
        target_user_id: userId,
        details: { 
          timestamp: new Date().toISOString(),
          target_email: targetUser.user.email
        }
      });

    return new Response(
      JSON.stringify({ 
        success: true, 
        impersonationUrl: linkData.properties.action_link 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
    );
  }
});