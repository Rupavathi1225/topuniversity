import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ChevronRight } from "lucide-react";

interface SearchButton {
  id: string;
  title: string;
  link: string;
  order: number;
  webResultPage: string;
}

interface LandingContent {
  title: string;
  description: string;
}

const Landing = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState<LandingContent>({
    title: "Top University Territian - Your Academic Journey Starts Here",
    description: "Discover the best universities worldwide. Whether you're looking for undergraduate programs, graduate studies, or professional development opportunities, we help you find the perfect institution to achieve your academic goals."
  });
  const [buttons, setButtons] = useState<SearchButton[]>([]);

  useEffect(() => {
    const savedContent = localStorage.getItem("landingContent");
    if (savedContent) {
      setContent(JSON.parse(savedContent));
    }

    const savedButtons = localStorage.getItem("searchButtons");
    if (savedButtons) {
      const parsed = JSON.parse(savedButtons);
      setButtons(parsed.sort((a: SearchButton, b: SearchButton) => a.order - b.order));
    } else {
      const defaultButtons: SearchButton[] = [
        { id: "1", title: "Top Engineering Universities", link: "", order: 1, webResultPage: "1" },
        { id: "2", title: "Medical School Rankings", link: "", order: 2, webResultPage: "2" },
        { id: "3", title: "Business Schools Worldwide", link: "", order: 3, webResultPage: "3" },
        { id: "4", title: "Liberal Arts Colleges", link: "", order: 4, webResultPage: "4" },
        { id: "5", title: "Research Universities", link: "", order: 5, webResultPage: "5" }
      ];
      setButtons(defaultButtons);
      localStorage.setItem("searchButtons", JSON.stringify(defaultButtons));
    }
  }, []);

  const handleButtonClick = (button: SearchButton) => {
    if (button.link) {
      window.open(button.link, "_blank");
    } else {
      navigate(`/wr=${button.webResultPage}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-primary">TopUniversityTerritian</h1>
            <Search className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
            {content.title}
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {content.description}
          </p>

          <div className="pt-8">
            <h3 className="text-sm uppercase tracking-wider text-muted-foreground mb-6">
              Related categories
            </h3>
            
            <div className="space-y-4">
              {buttons.map((button) => (
                <button
                  key={button.id}
                  onClick={() => handleButtonClick(button)}
                  className="w-full max-w-2xl mx-auto flex items-center justify-between px-6 py-4 bg-card border border-transparent rounded-lg hover:border-primary hover:bg-card/80 transition-all group"
                >
                  <span className="text-foreground text-left">{button.title}</span>
                  <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Landing;
