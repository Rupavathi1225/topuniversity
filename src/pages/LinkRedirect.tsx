import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const LinkRedirect = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      navigate("/");
      return;
    }

    const trackClick = async () => {
      const lid = parseInt(id);
      const savedResults = localStorage.getItem("webResults");
      
      if (savedResults) {
        const results = JSON.parse(savedResults);
        const result = results.find((r: any) => r.lid === lid);
        
        if (result && result.link) {
          // Track the click in database
          const sessionId = sessionStorage.getItem("sessionId") || "unknown";
          const sessionStartTime = parseInt(sessionStorage.getItem("sessionStartTime") || "0");
          const timeSpent = sessionStartTime ? Date.now() - sessionStartTime : 0;
          
          // Save to database
          const { error } = await supabase
            .from("click_logs")
            .insert({
              session_id: sessionId,
              lid,
              link: result.link,
              time_spent: timeSpent
            });
          
          if (error) {
            console.error("Error tracking click:", error);
          } else {
            console.log("Click tracked successfully");
          }
          
          // Open in new tab to avoid iframe restrictions
          window.open(result.link, "_blank");
          // Navigate back to home after opening
          setTimeout(() => navigate("/"), 100);
        } else {
          navigate("/");
        }
      } else {
        navigate("/");
      }
    };

    trackClick();
  }, [id, navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-primary mb-4">Redirecting...</h1>
        <p className="text-muted-foreground">Please wait while we redirect you</p>
      </div>
    </div>
  );
};

export default LinkRedirect;
