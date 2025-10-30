import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const LinkRedirect = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      navigate("/");
      return;
    }

    const lid = parseInt(id);
    const savedResults = localStorage.getItem("webResults");
    
    if (savedResults) {
      const results = JSON.parse(savedResults);
      const result = results.find((r: any) => r.lid === lid);
      
      if (result && result.link) {
        // Track the click
        const sessionId = sessionStorage.getItem("sessionId") || "unknown";
        const sessionStartTime = parseInt(sessionStorage.getItem("sessionStartTime") || "0");
        const clickTime = Date.now();
        const timeSpent = sessionStartTime ? clickTime - sessionStartTime : 0;
        
        const clickLog = {
          lid,
          link: result.link,
          sessionId,
          clickTime,
          timeSpent,
          timeSpentFormatted: `${Math.floor(timeSpent / 1000)}s`
        };
        
        // Save to click logs
        const existingLogs = JSON.parse(localStorage.getItem("clickLogs") || "[]");
        existingLogs.push(clickLog);
        localStorage.setItem("clickLogs", JSON.stringify(existingLogs));
        
        console.log("Click tracked:", clickLog);
        
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
