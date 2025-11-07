import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Trash2, Edit, Plus, ExternalLink, LogOut, BarChart3 } from "lucide-react";
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
import { supabase } from "@/integrations/supabase/client";

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
  allowedCountries?: string[];
  isWorldwide?: boolean;
  backlinkUrl?: string;
}

interface LandingContent {
  title: string;
  description: string;
}

interface ClickLog {
  id: string;
  lid: number;
  link: string;
  session_id: string;
  click_time: string;
  time_spent: number;
  ip_address?: string;
  country?: string;
  source?: string;
  device?: string;
  user_agent?: string;
  page_views?: number;
}

interface SessionData {
  id: string;
  session_id: string;
  ip_address?: string;
  country?: string;
  source?: string;
  device?: string;
  page_views: number;
  total_clicks: number;
  first_visit: string;
  last_active: string;
}

const Admin = () => {
  const navigate = useNavigate();
  const [landingContent, setLandingContent] = useState<LandingContent>({
    title: "",
    description: ""
  });
  const [searchButtons, setSearchButtons] = useState<SearchButton[]>([]);
  const [webResults, setWebResults] = useState<WebResultData[]>([]);
  const [clickLogs, setClickLogs] = useState<ClickLog[]>([]);
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>("all");
  const [selectedSource, setSelectedSource] = useState<string>("all");
  
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
  const [newResultCountries, setNewResultCountries] = useState<string[]>([]);
  const [newResultWorldwide, setNewResultWorldwide] = useState(true);
  const [newResultBacklink, setNewResultBacklink] = useState("");

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

    // Load click logs and sessions from database
    loadClickLogs();
    loadSessions();
  }, []);

  const loadClickLogs = async () => {
    const { data, error } = await supabase
      .from("click_logs")
      .select("*")
      .order("click_time", { ascending: false });
    
    if (error) {
      console.error("Error loading click logs:", error);
      toast.error("Failed to load click logs");
    } else {
      setClickLogs(data || []);
    }
  };

  const loadSessions = async () => {
    const { data, error } = await supabase
      .from("sessions")
      .select("*")
      .order("last_active", { ascending: false });
    
    if (error) {
      console.error("Error loading sessions:", error);
    } else {
      setSessions(data || []);
    }
  };

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
          <TabsList className="grid w-full max-w-3xl mx-auto grid-cols-4 mb-8">
            <TabsTrigger value="landing">Landing Content</TabsTrigger>
            <TabsTrigger value="buttons">Search Buttons</TabsTrigger>
            <TabsTrigger value="results">Web Results</TabsTrigger>
            <TabsTrigger value="tracking">
              <BarChart3 className="h-4 w-4 mr-2" />
              Tracking
            </TabsTrigger>
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

                <div className="flex items-center space-x-2">
                  <Switch
                    id="worldwide"
                    checked={newResultWorldwide}
                    onCheckedChange={setNewResultWorldwide}
                  />
                  <Label htmlFor="worldwide">Worldwide Access</Label>
                </div>

                {!newResultWorldwide && (
                  <div>
                    <Label>Backlink URL (for restricted countries)</Label>
                    <Input
                      value={newResultBacklink}
                      onChange={(e) => setNewResultBacklink(e.target.value)}
                      placeholder="https://worldwide-alternative.com"
                      className="mt-2"
                    />
                  </div>
                )}

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

          <TabsContent value="tracking" className="max-w-7xl mx-auto">
            <Card className="p-6 border-primary">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">Analytics Dashboard</h2>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      loadClickLogs();
                      loadSessions();
                      toast.success("Data refreshed");
                    }}
                  >
                    Refresh
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={async () => {
                      await supabase.from("click_logs").delete().neq("id", "00000000-0000-0000-0000-000000000000");
                      await supabase.from("sessions").delete().neq("id", "00000000-0000-0000-0000-000000000000");
                      setClickLogs([]);
                      setSessions([]);
                      toast.success("All logs cleared");
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear All
                  </Button>
                </div>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <Card className="p-6">
                  <p className="text-sm text-muted-foreground mb-2">Total Sessions</p>
                  <p className="text-4xl font-bold text-primary">{sessions.length}</p>
                  <p className="text-xs text-muted-foreground mt-1">Unique visitors tracked</p>
                </Card>
                <Card className="p-6">
                  <p className="text-sm text-muted-foreground mb-2">Page Views</p>
                  <p className="text-4xl font-bold text-primary">
                    {sessions.reduce((sum, s) => sum + s.page_views, 0)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Total pages viewed</p>
                </Card>
                <Card className="p-6">
                  <p className="text-sm text-muted-foreground mb-2">Total Clicks</p>
                  <p className="text-4xl font-bold text-primary">{clickLogs.length}</p>
                  <p className="text-xs text-muted-foreground mt-1">Buttons and links clicked</p>
                </Card>
              </div>

              {/* Filters */}
              <div className="mb-6 p-4 bg-muted/50 rounded-lg">
                <h3 className="font-semibold mb-4">Filters</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Country</Label>
                    <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="All Countries" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Countries</SelectItem>
                        {Array.from(new Set(sessions.map(s => s.country).filter(Boolean))).map(country => (
                          <SelectItem key={country} value={country!}>{country}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Source</Label>
                    <Select value={selectedSource} onValueChange={setSelectedSource}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="All Sources" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Sources</SelectItem>
                        {Array.from(new Set(sessions.map(s => s.source).filter(Boolean))).map(source => (
                          <SelectItem key={source} value={source!}>{source}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Sessions Table */}
              {sessions.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No tracking data yet. Start browsing to see analytics here.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b-2 border-border bg-muted/50">
                        <th className="text-left p-3 text-sm font-semibold">Session ID</th>
                        <th className="text-left p-3 text-sm font-semibold">IP Address</th>
                        <th className="text-left p-3 text-sm font-semibold">Country</th>
                        <th className="text-left p-3 text-sm font-semibold">Source</th>
                        <th className="text-left p-3 text-sm font-semibold">Device</th>
                        <th className="text-left p-3 text-sm font-semibold">Page Views</th>
                        <th className="text-left p-3 text-sm font-semibold">Clicks</th>
                        <th className="text-left p-3 text-sm font-semibold">Related Searches</th>
                        <th className="text-left p-3 text-sm font-semibold">Last Active</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sessions
                        .filter(s => selectedCountry === 'all' || s.country === selectedCountry)
                        .filter(s => selectedSource === 'all' || s.source === selectedSource)
                        .map((session) => {
                          const sessionClicks = clickLogs.filter(log => log.session_id === session.session_id);
                          const relatedSearches = Array.from(new Set(sessionClicks.map(c => c.lid)));
                          
                          return (
                            <tr key={session.id} className="border-b border-border hover:bg-muted/30">
                              <td className="p-3">
                                <span className="text-xs font-mono bg-primary/10 px-2 py-1 rounded">
                                  {session.session_id.substring(0, 8)}...
                                </span>
                              </td>
                              <td className="p-3 text-sm">{session.ip_address || 'N/A'}</td>
                              <td className="p-3">
                                <span className="text-sm bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2 py-1 rounded">
                                  {session.country || 'Unknown'}
                                </span>
                              </td>
                              <td className="p-3">
                                <span className="text-sm bg-purple-500/10 text-purple-600 dark:text-purple-400 px-2 py-1 rounded">
                                  {session.source || 'direct'}
                                </span>
                              </td>
                              <td className="p-3">
                                <span className="text-sm">
                                  {session.device === 'Mobile' ? '📱' : '💻'} {session.device || 'Unknown'}
                                </span>
                              </td>
                              <td className="p-3 text-center">
                                <span className="text-sm font-semibold">{session.page_views}</span>
                              </td>
                              <td className="p-3 text-center">
                                <span className="text-sm font-semibold bg-green-500/10 text-green-600 dark:text-green-400 px-2 py-1 rounded">
                                  {sessionClicks.length}
                                </span>
                              </td>
                              <td className="p-3">
                                <div className="flex flex-wrap gap-1">
                                  {relatedSearches.length > 0 ? (
                                    relatedSearches.slice(0, 3).map(lid => (
                                      <span key={lid} className="text-xs bg-accent px-2 py-0.5 rounded">
                                        {lid}
                                      </span>
                                    ))
                                  ) : (
                                    <span className="text-xs text-muted-foreground">None</span>
                                  )}
                                  {relatedSearches.length > 3 && (
                                    <span className="text-xs text-muted-foreground">+{relatedSearches.length - 3}</span>
                                  )}
                                </div>
                              </td>
                              <td className="p-3 text-sm text-muted-foreground">
                                {new Date(session.last_active).toLocaleString()}
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
