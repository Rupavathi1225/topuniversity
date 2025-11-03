import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WebResultData {
  id: string;
  lid: number;
  name: string;
  link: string;
  title: string;
  description: string;
  logoUrl: string;
  isSponsored: boolean;
  webResultPage: string;
}

const WebResult = () => {
  const location = useLocation();
  const [results, setResults] = useState<WebResultData[]>([]);
  const [sponsoredResults, setSponsoredResults] = useState<WebResultData[]>([]);
  const [regularResults, setRegularResults] = useState<WebResultData[]>([]);

  const pageNumber = location.pathname.split("=")[1] || "1";

  useEffect(() => {
    const savedResults = localStorage.getItem("webResults");
    if (savedResults) {
      const parsed: WebResultData[] = JSON.parse(savedResults);
      const filtered = parsed.filter(r => r.webResultPage === pageNumber);
      setResults(filtered);
      setSponsoredResults(filtered.filter(r => r.isSponsored));
      setRegularResults(filtered.filter(r => !r.isSponsored));
    } else {
      // Default data
      const defaultResults: WebResultData[] = [
        {
          id: "1",
          lid: 1,
          name: "MIT Official",
          link: "https://mit.edu",
          title: "Massachusetts Institute of Technology",
          description: "Leading research university with top engineering and technology programs",
          logoUrl: "",
          isSponsored: true,
          webResultPage: "1"
        },
        {
          id: "2",
          lid: 2,
          name: "Stanford",
          link: "https://stanford.edu",
          title: "Stanford University",
          description: "Premier institution for innovation and entrepreneurship",
          logoUrl: "",
          isSponsored: false,
          webResultPage: "1"
        }
      ];
      setResults(defaultResults.filter(r => r.webResultPage === pageNumber));
      setSponsoredResults(defaultResults.filter(r => r.isSponsored && r.webResultPage === pageNumber));
      setRegularResults(defaultResults.filter(r => !r.isSponsored && r.webResultPage === pageNumber));
    }
  }, [pageNumber]);

  const ResultItem = ({ result, isSponsored }: { result: WebResultData; isSponsored?: boolean }) => (
    <div className="py-6 space-y-3">
      {isSponsored && (
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center">
            <span className="text-xs">Ad</span>
          </div>
          <span className="text-xs text-muted-foreground">Sponsored</span>
        </div>
      )}
      
      {result.logoUrl && (
        <div className="w-8 h-8 bg-muted rounded-full" />
      )}
      
      <div className="space-y-2">
        <a 
          href={result.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xl font-medium text-foreground hover:underline cursor-pointer block"
        >
          {result.title}
        </a>
        <p className="text-sm text-muted-foreground">{result.name}</p>
        <p className="text-foreground leading-relaxed">{result.description}</p>
        <a
          href={`/lid/${result.lid}`}
          className="text-sm text-primary hover:underline"
        >
          topuniversityterritian/lid={result.lid}
        </a>
      </div>
      
      {isSponsored && (
        <Button
          size="sm"
          className="bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={() => window.open(result.link, "_blank")}
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          Visit Website
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-primary">TopUniversityTerritian</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {sponsoredResults.length > 0 && (
          <section className="mb-12">
            <h2 className="text-lg font-semibold mb-6">Sponsored Results</h2>
            <div className="bg-card border border-border rounded-lg px-6">
              {sponsoredResults.map((result, index) => (
                <div key={result.id}>
                  <ResultItem result={result} isSponsored />
                  {index < sponsoredResults.length - 1 && <div className="border-t border-border" />}
                </div>
              ))}
            </div>
          </section>
        )}

        {regularResults.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold mb-6">Web Results</h2>
            <div className="space-y-1">
              {regularResults.map((result) => (
                <ResultItem key={result.id} result={result} />
              ))}
            </div>
          </section>
        )}

        {results.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No results found for this page.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default WebResult;
