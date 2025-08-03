"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Shield,
  Users,
  Activity,
  BarChart3,
  Settings,
  Database,
  Cpu,
  Wifi,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
} from "lucide-react"
import { trpc } from "@/lib/trpc/client"

export default function DashboardPage() {
  const [systemStatus, setSystemStatus] = useState({
    cpu: 45,
    memory: 62,
    storage: 78,
    network: 98,
  })

  const { data: statusData, isLoading, refetch } = trpc.status.system.useQuery()

  // Simulate real-time updates for system metrics
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemStatus((prev) => ({
        cpu: Math.max(20, Math.min(80, prev.cpu + (Math.random() - 0.5) * 10)),
        memory: Math.max(30, Math.min(90, prev.memory + (Math.random() - 0.5) * 8)),
        storage: prev.storage,
        network: Math.max(85, Math.min(100, prev.network + (Math.random() - 0.5) * 5)),
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const recentActivity = [
    { id: 1, action: "Blood scan completed", user: "Dr. Smith", time: "2 minutes ago", status: "success" },
    { id: 2, action: "Patient registered", user: "Nurse Johnson", time: "5 minutes ago", status: "info" },
    { id: 3, action: "System backup completed", user: "System", time: "1 hour ago", status: "success" },
    { id: 4, action: "Failed scan attempt", user: "Dr. Wilson", time: "2 hours ago", status: "warning" },
    { id: 5, action: "Database maintenance", user: "Admin", time: "3 hours ago", status: "info" },
  ]

  if (isLoading) {
    return (
      <div className="container mx-auto px-6 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-6 py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-4">
            System Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Monitor system performance, manage operations, and oversee blood group detection activities.
          </p>
        </div>
        <Button onClick={() => refetch()} variant="outline" className="flex items-center space-x-2">
          <RefreshCw className="h-4 w-4" />
          <span>Refresh</span>
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Scans</p>
                <p className="text-3xl font-bold text-blue-600">
                  {statusData?.data.statistics.totalScans?.toLocaleString() || "0"}
                </p>
              </div>
              <BarChart3 className="h-12 w-12 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Today's Scans</p>
                <p className="text-3xl font-bold text-green-600">{statusData?.data.statistics.todayScans || "0"}</p>
              </div>
              <Activity className="h-12 w-12 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Patients</p>
                <p className="text-3xl font-bold text-purple-600">
                  {statusData?.data.statistics.activePatients || "0"}
                </p>
              </div>
              <Users className="h-12 w-12 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Success Rate</p>
                <p className="text-3xl font-bold text-emerald-600">{statusData?.data.statistics.successRate || "0"}%</p>
              </div>
              <CheckCircle className="h-12 w-12 text-emerald-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* System Status */}
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Cpu className="h-5 w-5" />
                  <span>System Performance</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">CPU Usage</span>
                      <span className="text-sm text-gray-500">{systemStatus.cpu}%</span>
                    </div>
                    <Progress value={systemStatus.cpu} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Memory Usage</span>
                      <span className="text-sm text-gray-500">{systemStatus.memory}%</span>
                    </div>
                    <Progress value={systemStatus.memory} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Storage</span>
                      <span className="text-sm text-gray-500">{systemStatus.storage}%</span>
                    </div>
                    <Progress value={systemStatus.storage} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Network</span>
                      <span className="text-sm text-gray-500">{systemStatus.network}%</span>
                    </div>
                    <Progress value={systemStatus.network} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5" />
                  <span>Recent Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{activity.action}</p>
                        <p className="text-xs text-gray-500">by {activity.user}</p>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant={
                            activity.status === "success"
                              ? "default"
                              : activity.status === "warning"
                                ? "destructive"
                                : "secondary"
                          }
                        >
                          {activity.status}
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="h-5 w-5" />
                  <span>Database Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span>Connection Status</span>
                  <Badge className="bg-green-500">Connected</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span>Total Records</span>
                  <span className="font-semibold">{statusData?.data.statistics.totalScans || "0"}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span>Last Backup</span>
                  <span className="font-semibold">2 hours ago</span>
                </div>
                <Button className="w-full">
                  <Database className="h-4 w-4 mr-2" />
                  Backup Database
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Wifi className="h-5 w-5" />
                  <span>FastAPI Backend Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span>API Status</span>
                  <Badge
                    className={statusData?.data.fastApiBackend.status === "healthy" ? "bg-green-500" : "bg-red-500"}
                  >
                    {statusData?.data.fastApiBackend.status === "healthy" ? "Online" : "Offline"}
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span>Response Time</span>
                  <span className="font-semibold">{statusData?.data.fastApiBackend.responseTime || 0}ms</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span>Last Checked</span>
                  <span className="font-semibold">
                    {statusData?.data.fastApiBackend.lastChecked
                      ? new Date(statusData.data.fastApiBackend.lastChecked).toLocaleTimeString()
                      : "Never"}
                  </span>
                </div>
                <Button variant="outline" className="w-full bg-transparent">
                  <Activity className="h-4 w-4 mr-2" />
                  Test Connection
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Blood Group Distribution</span>
              </CardTitle>
              <CardDescription>Distribution of detected blood groups from all scans</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {statusData?.data.bloodGroupDistribution?.map((group) => (
                  <div key={group.bloodGroup} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded text-white text-sm font-bold flex items-center justify-center">
                        {group.bloodGroup}
                      </div>
                      <span className="font-medium">{group.bloodGroup}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-32">
                        <Progress value={Number.parseFloat(group.percentage)} className="h-2" />
                      </div>
                      <span className="text-sm text-gray-500 w-12">{group.percentage}%</span>
                      <span className="text-sm font-medium w-16">{group.count}</span>
                    </div>
                  </div>
                )) || <div className="text-center py-8 text-gray-500">No blood group data available yet</div>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>System Configuration</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full justify-start">
                  <Cpu className="h-4 w-4 mr-2" />
                  Scanner Calibration
                </Button>
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <Database className="h-4 w-4 mr-2" />
                  Database Settings
                </Button>
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <Shield className="h-4 w-4 mr-2" />
                  Security Settings
                </Button>
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  User Management
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5" />
                  <span>System Alerts</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm font-medium text-yellow-800">Storage Warning</p>
                  <p className="text-xs text-yellow-600">Storage is 78% full. Consider cleanup.</p>
                </div>
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm font-medium text-green-800">System Healthy</p>
                  <p className="text-xs text-green-600">All systems operating normally.</p>
                </div>
                {statusData?.data.recentErrors && statusData.data.recentErrors.length > 0 && (
                  <div className="space-y-2">
                    {statusData.data.recentErrors.map((error) => (
                      <div key={error.id} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm font-medium text-red-800">{error.action}</p>
                        <p className="text-xs text-red-600">{error.details}</p>
                        <p className="text-xs text-red-500 mt-1">{new Date(error.timestamp).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
