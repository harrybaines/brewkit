"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreditCard, Languages, Moon, Palette, Sun, Upload } from "lucide-react"

export default function Settings() {
  return (
    <div className="flex flex-1 flex-col space-y-8 pb-40">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="integration">Integrations</TabsTrigger>
          <TabsTrigger value="misc">Misc</TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile" className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Personal Information</h2>

            <div className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h3 className="font-medium">Profile Picture</h3>
                      <p className="text-sm text-muted-foreground">
                        Your profile picture will be visible across the platform.
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src="/avatar-placeholder.jpg" alt="Profile" />
                        <AvatarFallback>HB</AvatarFallback>
                      </Avatar>
                      <Button size="sm" variant="outline" className="h-9 gap-1.5">
                        <Upload className="h-4 w-4" />
                        Change
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h3 className="font-medium">Display Name</h3>
                      <p className="text-sm text-muted-foreground">
                        This is your public display name.
                      </p>
                    </div>
                    <div className="w-[240px]">
                      <Input defaultValue="Harry Baines" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h3 className="font-medium">Email Address</h3>
                      <p className="text-sm text-muted-foreground">
                        This email is used for notifications and login.
                      </p>
                    </div>
                    <div className="w-[240px]">
                      <Input defaultValue="harry@example.com" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h3 className="font-medium">Password</h3>
                      <p className="text-sm text-muted-foreground">
                        Change your password to keep your account secure.
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Change Password
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Billing Settings */}
        <TabsContent value="billing" className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Billing Information</h2>

            <div className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h3 className="font-medium">Current Plan</h3>
                      <p className="text-sm text-muted-foreground">
                        You are currently on the Pro plan.
                      </p>
                    </div>
                    <Button>Upgrade Plan</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h3 className="font-medium">Payment Method</h3>
                      <p className="text-sm text-muted-foreground">
                        Manage your payment methods and billing history.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm">•••• 4242</span>
                      <Button variant="outline" size="sm">
                        Change
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h3 className="font-medium">Billing History</h3>
                      <p className="text-sm text-muted-foreground">
                        View and download your invoices.
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      View History
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Notification Preferences</h2>

            <div className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h3 className="font-medium">Email Notifications</h3>
                      <p className="text-sm text-muted-foreground">
                        Receive project updates via email.
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="email-notifications" defaultChecked />
                      <Label htmlFor="email-notifications" className="sr-only">Email Notifications</Label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h3 className="font-medium">Push Notifications</h3>
                      <p className="text-sm text-muted-foreground">
                        Receive push notifications for important updates.
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="push-notifications" defaultChecked />
                      <Label htmlFor="push-notifications" className="sr-only">Push Notifications</Label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h3 className="font-medium">Marketing Emails</h3>
                      <p className="text-sm text-muted-foreground">
                        Receive emails about new features and promotions.
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="marketing-emails" />
                      <Label htmlFor="marketing-emails" className="sr-only">Marketing Emails</Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Integration Settings */}
        <TabsContent value="integration" className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Connected Services</h2>

            <div className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h3 className="font-medium">Google Calendar</h3>
                      <p className="text-sm text-muted-foreground">
                        Sync project deadlines with your calendar.
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Connect
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h3 className="font-medium">Slack</h3>
                      <p className="text-sm text-muted-foreground">
                        Connected to Workspace: &quot;Company HQ&quot;
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Disconnect
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h3 className="font-medium">GitHub</h3>
                      <p className="text-sm text-muted-foreground">
                        Link your GitHub account for project tracking.
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Connect
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Misc Settings */}
        <TabsContent value="misc" className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Interface Settings</h2>

            <div className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h3 className="font-medium">Theme</h3>
                      <p className="text-sm text-muted-foreground">
                        Choose between light, dark, or system theme.
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="icon" variant="outline" className="h-8 w-8">
                        <Sun className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="outline" className="h-8 w-8">
                        <Moon className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="default" className="h-8 w-8">
                        <Palette className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h3 className="font-medium">Language</h3>
                      <p className="text-sm text-muted-foreground">
                        Select your preferred language.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Languages className="h-5 w-5 text-muted-foreground" />
                      <select className="rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background">
                        <option>English (US)</option>
                        <option>Spanish</option>
                        <option>French</option>
                        <option>German</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h3 className="font-medium">Compact Mode</h3>
                      <p className="text-sm text-muted-foreground">
                        Display more content with less spacing.
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="compact-mode" />
                      <Label htmlFor="compact-mode" className="sr-only">Compact Mode</Label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h3 className="font-medium">Sound Effects</h3>
                      <p className="text-sm text-muted-foreground">
                        Play sounds for notifications and actions.
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="sound-effects" defaultChecked />
                      <Label htmlFor="sound-effects" className="sr-only">Sound Effects</Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <h2 className="text-xl font-semibold my-4">Data & Privacy</h2>

            <div className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h3 className="font-medium">Analytics</h3>
                      <p className="text-sm text-muted-foreground">
                        Allow us to collect anonymous usage data to improve our service.
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="analytics" defaultChecked />
                      <Label htmlFor="analytics" className="sr-only">Analytics</Label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h3 className="font-medium">Data Export</h3>
                      <p className="text-sm text-muted-foreground">
                        Download a copy of all your data.
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Export Data
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}