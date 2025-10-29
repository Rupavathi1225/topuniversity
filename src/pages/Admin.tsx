import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Trash2, Edit, Plus, ExternalLink, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SearchButton {
  id: string;
  title: string;
  link: string;
  order: number;
  webResultPage: string;
}

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

interface LandingContent {
  title: string;
  description: string;
}

const Admin = () => {
  const navigate = useNavigate();
  const [landingContent, setLandingContent] = useState<LandingContent>({
    title: "",
    description: ""
  });
  const [searchButtons, setSearchButtons] = useState<SearchButton[]>([]);
  const [webResults, setWebResults] = useState<WebResultData[]>([]);
  
  const [newButtonTitle, setNewButtonTitle] = useState("");
  const [newButtonLink, setNewButtonLink] = useState("");
  const [newButtonOrder, setNewButtonOrder] = useState("");
  const [newButtonPage, setNewButtonPage] = useState("1");

  const [newResultName, setNewResultName] = useState("");
  const [newResultLink, setNewResultLink] = useState("");
  const [newResultTitle, setNewResultTitle] = useState("");
  const [newResultDescription, setNewResultDescription] = useState("");
  const [newResultLogo, setNewResultLogo] = useState("");
  const [newResultSponsored, setNewResultSponsored] = useState(false);
  const [newResultPage, setNewResultPage] = useState("1");

  const [editingResult, setEditingResult] = useState<string | null>(null);

  useEffect(() => {
    const savedContent = localStorage.getItem("landingContent");
    if (savedContent) {
      setLandingContent(JSON.parse(savedContent));
    }

    const savedButtons = localStorage.getItem("searchButtons");
    if (savedButtons) {
      setSearchButtons(JSON.parse(savedButtons));
    }

    const savedResults = localStorage.getItem("webResults");
    if (savedResults) {
      setWebResults(JSON.parse(savedResults));
    }
  }, []);

  const saveLandingContent = () => {
    localStorage.setItem("landingContent", JSON.stringify(landingContent));
    toast.success("Landing page content saved");
  };

  const addSearchButton = () => {
    if (!newButtonTitle) {
      toast.error("Please enter a button title");
      return;
    }

    const newButton: SearchButton = {
      id: Date.now().toString(),
      title: newButtonTitle,
      link: newButtonLink,
      order: parseInt(newButtonOrder) || searchButtons.length + 1,
      webResultPage: newButtonPage
    };

    const updated = [...searchButtons, newButton].sort((a, b) => a.order - b.order);
    setSearchButtons(updated);
    localStorage.setItem("searchButtons", JSON.stringify(updated));
    
    setNewButtonTitle("");
    setNewButtonLink("");
    setNewButtonOrder("");
    setNewButtonPage("1");
    toast.success("Search button added");
  };

  const deleteSearchButton = (id: string) => {
    const updated = searchButtons.filter(b => b.id !== id);
    setSearchButtons(updated);
    localStorage.setItem("searchButtons", JSON.stringify(updated));
    toast.success("Search button deleted");
  };

  const addWebResult = () => {
    if (!newResultName || !newResultTitle || !newResultLink) {
      toast.error("Please fill all required fields");
      return;
    }

    // Auto-assign next lid number
    const maxLid = webResults.length > 0 ? Math.max(...webResults.map(r => r.lid)) : 0;
    const nextLid = maxLid + 1;

    const newResult: WebResultData = {
      id: Date.now().toString(),
      lid: nextLid,
      name: newResultName,
      link: newResultLink,
      title: newResultTitle,
      description: newResultDescription,
      logoUrl: newResultLogo,
      isSponsored: newResultSponsored,
      webResultPage: newResultPage
    };

    const updated = [...webResults, newResult];
    setWebResults(updated);
    localStorage.setItem("webResults", JSON.stringify(updated));
    
    setNewResultName("");
    setNewResultLink("");
    setNewResultTitle("");
    setNewResultDescription("");
    setNewResultLogo("");
    setNewResultSponsored(false);
    setNewResultPage("1");
    toast.success(`Web result added with lid=${nextLid}`);
  };

  const deleteWebResult = (id: string) => {
    const updated = webResults.filter(r => r.id !== id);
    setWebResults(updated);
    localStorage.setItem("webResults", JSON.stringify(updated));
    toast.success("Web result deleted");
  };

  const updateWebResult = (id: string, data: Partial<WebResultData>) => {
    const updated = webResults.map(r => r.id === id ? { ...r, ...data } : r);
    setWebResults(updated);
    localStorage.setItem("webResults", JSON.stringify(updated));
    toast.success("Web result updated");
    setEditingResult(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Admin Panel</h1>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate("/")}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View Site
              </Button>
              <Button size="sm" variant="outline">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="landing" className="w-full">
          <TabsList className="grid w-full max-w-3xl mx-auto grid-cols-3 mb-8">
            <TabsTrigger value="landing">Landing Content</TabsTrigger>
            <TabsTrigger value="buttons">Search Buttons</TabsTrigger>
            <TabsTrigger value="results">Web Results</TabsTrigger>
          </TabsList>

          <TabsContent value="landing" className="max-w-3xl mx-auto">
            <Card className="p-6 border-primary">
              <h2 className="text-2xl font-semibold mb-6">Edit Landing Page Content</h2>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={landingContent.title}
                    onChange={(e) => setLandingContent({ ...landingContent, title: e.target.value })}
                    placeholder="Enter page title"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={landingContent.description}
                    onChange={(e) => setLandingContent({ ...landingContent, description: e.target.value })}
                    placeholder="Enter page description"
                    rows={5}
                    className="mt-2"
                  />
                </div>

                <Button onClick={saveLandingContent} className="w-full">
                  Save Changes
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="buttons" className="max-w-3xl mx-auto">
            <Card className="p-6 border-primary">
              <h2 className="text-2xl font-semibold mb-6">Manage Search Buttons</h2>
              
              <div className="space-y-4 mb-8">
                <div>
                  <Label>Button title</Label>
                  <Input
                    value={newButtonTitle}
                    onChange={(e) => setNewButtonTitle(e.target.value)}
                    placeholder="Enter button title"
                    className="mt-2"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Link (optional)</Label>
                    <Input
                      value={newButtonLink}
                      onChange={(e) => setNewButtonLink(e.target.value)}
                      placeholder="https://example.com or leave empty for /webresult"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>Order Position</Label>
                    <Input
                      type="number"
                      value={newButtonOrder}
                      onChange={(e) => setNewButtonOrder(e.target.value)}
                      placeholder="1, 2, 3..."
                      className="mt-2"
                    />
                  </div>
                </div>

                <div>
                  <Label>Web Result Page</Label>
                  <Select value={newButtonPage} onValueChange={setNewButtonPage}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">wr=1</SelectItem>
                      <SelectItem value="2">wr=2</SelectItem>
                      <SelectItem value="3">wr=3</SelectItem>
                      <SelectItem value="4">wr=4</SelectItem>
                      <SelectItem value="5">wr=5</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={addSearchButton} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Button
                </Button>
              </div>

              <div className="space-y-3">
                {searchButtons.sort((a, b) => a.order - b.order).map((button) => (
                  <div
                    key={button.id}
                    className="flex items-center justify-between p-4 bg-card border border-border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-muted px-2 py-1 rounded">#{button.order}</span>
                        <p className="font-medium">{button.title}</p>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {button.link || `/wr=${button.webResultPage}`}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteSearchButton(button.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="results" className="max-w-4xl mx-auto">
            <Card className="p-6 border-primary">
              <h2 className="text-2xl font-semibold mb-6">Manage Web Results</h2>
              
              <div className="space-y-4 mb-8 pb-8 border-b border-border">
                <h3 className="font-medium">Add New Result</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Name</Label>
                    <Input
                      value={newResultName}
                      onChange={(e) => setNewResultName(e.target.value)}
                      placeholder="e.g., Example.com"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>Link</Label>
                    <Input
                      value={newResultLink}
                      onChange={(e) => setNewResultLink(e.target.value)}
                      placeholder="https://example.com"
                      className="mt-2"
                    />
                  </div>
                </div>

                <div>
                  <Label>Title</Label>
                  <Input
                    value={newResultTitle}
                    onChange={(e) => setNewResultTitle(e.target.value)}
                    placeholder="Result title"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={newResultDescription}
                    onChange={(e) => setNewResultDescription(e.target.value)}
                    placeholder="Result description"
                    rows={3}
                    className="mt-2"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Logo URL</Label>
                    <Input
                      value={newResultLogo}
                      onChange={(e) => setNewResultLogo(e.target.value)}
                      placeholder="https://example.com/logo.png (optional)"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>Web Result Page</Label>
                    <Select value={newResultPage} onValueChange={setNewResultPage}>
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">wr=1</SelectItem>
                        <SelectItem value="2">wr=2</SelectItem>
                        <SelectItem value="3">wr=3</SelectItem>
                        <SelectItem value="4">wr=4</SelectItem>
                        <SelectItem value="5">wr=5</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="sponsored"
                    checked={newResultSponsored}
                    onCheckedChange={setNewResultSponsored}
                  />
                  <Label htmlFor="sponsored">Sponsored</Label>
                </div>

                <Button onClick={addWebResult} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Result
                </Button>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Existing Results</h3>
                {webResults.map((result) => (
                  <div
                    key={result.id}
                    className="p-4 bg-card border border-border rounded-lg space-y-3"
                  >
                    {editingResult === result.id ? (
                      <div className="space-y-3">
                        <Input
                          defaultValue={result.title}
                          onBlur={(e) => updateWebResult(result.id, { title: e.target.value })}
                        />
                        <Input
                          defaultValue={result.link}
                          onBlur={(e) => updateWebResult(result.id, { link: e.target.value })}
                        />
                        <Button size="sm" onClick={() => setEditingResult(null)}>Done</Button>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              {result.isSponsored && (
                                <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded">
                                  Sponsored
                                </span>
                              )}
                              <span className="text-xs bg-muted px-2 py-0.5 rounded">
                                wr={result.webResultPage}
                              </span>
                              <span className="text-xs bg-accent px-2 py-0.5 rounded">
                                lid={result.lid}
                              </span>
                            </div>
                            <h4 className="font-medium text-primary">{result.title}</h4>
                            <p className="text-sm text-muted-foreground">{result.name}</p>
                            <p className="text-sm mt-2">{result.description}</p>
                            <a
                              href={result.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-primary hover:underline mt-1 inline-block"
                            >
                              {result.link}
                            </a>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setEditingResult(result.id)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => deleteWebResult(result.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
