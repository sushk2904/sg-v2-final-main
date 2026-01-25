"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import { User, Bell, Shield, Key, Building2 } from "lucide-react"

export default function SettingsPage() {
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setLoading(false)
    toast({
      title: "Settings saved",
      description: "Your settings have been updated successfully.",
    })
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account and application preferences
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile" className="gap-2">
            <User className="w-4 h-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="w-4 h-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="ai" className="gap-2">
            <Shield className="w-4 h-4" />
            AI Settings
          </TabsTrigger>
          <TabsTrigger value="api" className="gap-2">
            <Key className="w-4 h-4" />
            API Keys
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your account details and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="John" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Doe" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="john@company.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Job Title</Label>
                <Input id="role" placeholder="Senior Recruiter" />
              </div>
              <Separator />
              <Button onClick={handleSave} disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Organization
              </CardTitle>
              <CardDescription>
                Your organization settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Acme Corporation</p>
                  <p className="text-sm text-muted-foreground">Enterprise Plan</p>
                </div>
                <Badge>Owner</Badge>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Team Members</p>
                  <p className="text-sm text-muted-foreground">5 active users</p>
                </div>
                <Button variant="outline" size="sm">Manage Team</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>
                Configure when you receive email notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>New Candidate Analysis</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when a candidate analysis is complete
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Questionnaire Completed</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when a candidate completes their questionnaire
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Weekly Reports</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive weekly summary of hiring intelligence
                  </p>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>High CRI Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when a candidate scores above 80 CRI
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Analysis Settings</CardTitle>
              <CardDescription>
                Configure how AI analyzes candidates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-generate Questionnaire</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically create questionnaire after resume analysis
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>GitHub Deep Analysis</Label>
                  <p className="text-sm text-muted-foreground">
                    Analyze code quality and contribution patterns
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Include Confidence Scores</Label>
                  <p className="text-sm text-muted-foreground">
                    Show confidence indicators for all AI signals
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Responsible AI
              </CardTitle>
              <CardDescription>
                These settings cannot be changed to ensure ethical AI use
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between opacity-60">
                <div className="space-y-0.5">
                  <Label>No Personality Inference</Label>
                  <p className="text-sm text-muted-foreground">
                    AI will never predict personality traits
                  </p>
                </div>
                <Switch checked disabled />
              </div>
              <Separator />
              <div className="flex items-center justify-between opacity-60">
                <div className="space-y-0.5">
                  <Label>Human Oversight Required</Label>
                  <p className="text-sm text-muted-foreground">
                    All hiring decisions require human approval
                  </p>
                </div>
                <Switch checked disabled />
              </div>
              <Separator />
              <div className="flex items-center justify-between opacity-60">
                <div className="space-y-0.5">
                  <Label>Explainable Signals</Label>
                  <p className="text-sm text-muted-foreground">
                    All AI signals include explanations
                  </p>
                </div>
                <Switch checked disabled />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>
                Manage API keys for integrations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Production API Key</p>
                    <p className="text-sm text-muted-foreground font-mono">
                      sk_live_****************************
                    </p>
                  </div>
                  <Button variant="outline" size="sm">Regenerate</Button>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Development API Key</p>
                    <p className="text-sm text-muted-foreground font-mono">
                      sk_test_****************************
                    </p>
                  </div>
                  <Button variant="outline" size="sm">Regenerate</Button>
                </div>
              </div>
              <Separator />
              <div>
                <h4 className="font-medium mb-2">Webhook URL</h4>
                <div className="flex gap-2">
                  <Input 
                    placeholder="https://your-app.com/webhook" 
                    className="font-mono text-sm"
                  />
                  <Button variant="outline">Save</Button>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Receive real-time updates when analysis is complete
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
