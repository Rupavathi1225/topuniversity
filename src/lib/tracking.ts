import { supabase } from "@/integrations/supabase/client";

interface UserInfo {
  ip_address: string;
  country: string;
  source: string;
  device: string;
  user_agent: string;
}

// Get or create session ID
export const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem("sessionId");
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    sessionStorage.setItem("sessionId", sessionId);
    sessionStorage.setItem("sessionStartTime", Date.now().toString());
  }
  return sessionId;
};

// Get user info from edge function
export const getUserInfo = async (): Promise<UserInfo | null> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-user-info`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      console.error("Failed to get user info");
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting user info:", error);
    return null;
  }
};

// Track or update session
export const trackSession = async (sessionId: string, userInfo: UserInfo | null) => {
  if (!userInfo) return;

  try {
    // Check if session exists
    const { data: existingSession } = await supabase
      .from("sessions")
      .select("*")
      .eq("session_id", sessionId)
      .single();

    if (existingSession) {
      // Update existing session
      await supabase
        .from("sessions")
        .update({
          page_views: existingSession.page_views + 1,
          last_active: new Date().toISOString(),
        })
        .eq("session_id", sessionId);
    } else {
      // Create new session
      await supabase.from("sessions").insert({
        session_id: sessionId,
        ip_address: userInfo.ip_address,
        country: userInfo.country,
        source: userInfo.source,
        device: userInfo.device,
        user_agent: userInfo.user_agent,
        page_views: 1,
        total_clicks: 0,
      });
    }
  } catch (error) {
    console.error("Error tracking session:", error);
  }
};

// Track click
export const trackClick = async (
  sessionId: string,
  lid: number,
  link: string,
  userInfo: UserInfo | null
) => {
  try {
    const sessionStartTime = parseInt(sessionStorage.getItem("sessionStartTime") || "0");
    const timeSpent = sessionStartTime ? Date.now() - sessionStartTime : 0;

    // Insert click log
    await supabase.from("click_logs").insert({
      session_id: sessionId,
      lid,
      link,
      time_spent: timeSpent,
      ip_address: userInfo?.ip_address,
      country: userInfo?.country,
      source: userInfo?.source,
      device: userInfo?.device,
      user_agent: userInfo?.user_agent,
    });

    // Update session click count
    const { data: session } = await supabase
      .from("sessions")
      .select("total_clicks")
      .eq("session_id", sessionId)
      .single();

    if (session) {
      await supabase
        .from("sessions")
        .update({
          total_clicks: session.total_clicks + 1,
          last_active: new Date().toISOString(),
        })
        .eq("session_id", sessionId);
    }
  } catch (error) {
    console.error("Error tracking click:", error);
  }
};
