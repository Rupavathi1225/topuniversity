import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSessionId, getUserInfo, trackClick } from "@/lib/tracking";

const LinkRedirect = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userCountry, setUserCountry] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      navigate("/");
      return;
    }

    const handleRedirect = async () => {
      const lid = parseInt(id);
      const savedResults = localStorage.getItem("webResults");
      
      if (savedResults) {
        const results = JSON.parse(savedResults);
        const result = results.find((r: any) => r.lid === lid);
        
        if (result) {
          const sessionId = getSessionId();
          const userInfo = await getUserInfo();
          
          let targetUrl = result.link;
          
          // Check country restrictions
          if (userInfo && result.allowedCountries && result.allowedCountries.length > 0) {
            const isCountryAllowed = result.isWorldwide || 
              result.allowedCountries.includes(userInfo.country);
            
            if (!isCountryAllowed && result.backlinkUrl) {
              targetUrl = result.backlinkUrl;
            }
          }
          
          // Track the click
          await trackClick(sessionId, lid, targetUrl, userInfo);
          
          // Open in new tab
          window.open(targetUrl, "_blank");
          setTimeout(() => navigate("/"), 100);
        } else {
          navigate("/");
        }
      } else {
        navigate("/");
      }
    };

    handleRedirect();
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
