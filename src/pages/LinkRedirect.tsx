import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const LinkRedirect = () => {
  const location = useLocation();

  useEffect(() => {
    const lidParam = location.pathname.split("=")[1];
    if (!lidParam) {
      window.location.href = "/";
      return;
    }

    const lid = parseInt(lidParam);
    const savedResults = localStorage.getItem("webResults");
    
    if (savedResults) {
      const results = JSON.parse(savedResults);
      const result = results.find((r: any) => r.lid === lid);
      
      if (result && result.link) {
        window.location.href = result.link;
      } else {
        window.location.href = "/";
      }
    } else {
      window.location.href = "/";
    }
  }, [location]);

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
