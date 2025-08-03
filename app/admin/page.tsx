"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Heart,
  Shield,
  Fingerprint,
  Users,
  Activity,
  BarChart3,
  ArrowRight,
  CheckCircle,
  Zap,
  Database,
} from "lucide-react"
import Link from "next/link"

export default function AdminHomePage() {
  const features = [
    {
      icon: Fingerprint,
      title: "Biometric Analysis",
      description: "Advanced fingerprint scanning technology for accurate blood group detection",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: Shield,
      title: "HIPAA Compliant",
      description: "Secure data handling with end-to-end encryption and privacy protection",
      color: "from-green-500 to-green-600",
    },
    {
      icon: Zap,
      title: "Real-time Processing",
      description: "Fast AI-powered analysis with results in under 3 seconds",
      color: "from-yellow-500 to-yellow-600",
    },
    {
      icon: Database,
      title: "Comprehensive Records",
      description: "Complete patient management and scan history tracking",
      color: "from-purple-500 to-purple-600",
    },
  ]

  const quickActions = [
    {
      title: "Register New Patient",
      description: "Add a new patient to the system",
      href: "/admin/register",
      icon: Users,
      color: "bg-green-600 hover:bg-green-700",
    },
    {
      title: "Start Blood Scan",
      description: "Begin fingerprint analysis for blood group detection",
      href: "/admin/scan",
      icon: Activity,
      color: "bg-blue-600 hover:bg-blue-700",
    },
    {
      title: "View Dashboard",
      description: "Monitor system performance and analytics",
      href: "/admin/dashboard",
      icon: BarChart3,
      color: "bg-purple-600 hover:bg-purple-700",
    },
  ]

  return (
    <div className="container mx-auto px-6 py-12">
      {/* Header Section */}
      <div className="text-center mb-16">
        <div className="flex items-center justify-center mb-6">
          <div className="p-6 bg-gradient-to-r from-red-600 to-pink-600 rounded-3xl shadow-2xl">
            <Heart className="h-16 w-16 text-white" />
          </div>
        </div>
        <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-red-900 to-pink-900 bg-clip-text text-transparent mb-6">
          BloodScan Pro Admin Portal
        </h1>
        <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
          Advanced IoT-based blood group detection system using biometric fingerprint analysis. Manage patients, perform
          scans, and monitor system performance from this centralized admin interface.
        </p>
        <div className="flex items-center justify-center space-x-4 mt-8">
          <Badge className="px-4 py-2 text-base bg-green-100 text-green-800">
            <CheckCircle className="h-4 w-4 mr-2" />
            System Online
          </Badge>
          <Badge variant="outline" className="px-4 py-2 text-base">
            Version 1.0.0
          </Badge>
        </div>
      </div>

      {/* Project Overview */}
      <Card className="mb-12 shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8">
          <CardTitle className="text-3xl flex items-center space-x-4">
            <Shield className="h-8 w-8" />
            <span>About This Project</span>
          </CardTitle>
          <CardDescription className="text-indigo-100 text-lg">
            Final Year Computer Science Engineering Project - Academic Research
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-800">Project Objectives</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Develop IoT-based blood group detection using fingerprint biometrics</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Implement machine learning algorithms for pattern recognition</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Create secure patient management system with HIPAA compliance</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Build real-time monitoring and analytics dashboard</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-800">Technical Stack</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Frontend</h4>
                  <p className="text-sm text-blue-600">Next.js, TypeScript, Tailwind CSS</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Backend</h4>
                  <p className="text-sm text-green-600">tRPC, Prisma, SQLite</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold text-purple-800 mb-2">AI/ML</h4>
                  <p className="text-sm text-purple-600">FastAPI, Python, TensorFlow</p>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <h4 className="font-semibold text-orange-800 mb-2">IoT</h4>
                  <p className="text-sm text-orange-600">Fingerprint Sensors, Arduino</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Features */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Key Features</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card
                key={index}
                className="shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <CardContent className="p-6 text-center">
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${feature.color} mb-4`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-800">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Quick Actions</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {quickActions.map((action, index) => {
            const Icon = action.icon
            return (
              <Card
                key={index}
                className="shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <Icon className="h-8 w-8 text-gray-600" />
                    <ArrowRight className="h-5 w-5 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-800">{action.title}</h3>
                  <p className="text-gray-600 mb-6">{action.description}</p>
                  <Button asChild className={`w-full ${action.color} text-white`}>
                    <Link href={action.href}>Get Started</Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* System Status */}
      <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6">
          <CardTitle className="text-2xl flex items-center space-x-3">
            <Activity className="h-6 w-6" />
            <span>System Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600 mb-2">98.7%</div>
              <div className="text-sm text-green-700">System Uptime</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">2.8s</div>
              <div className="text-sm text-blue-700">Avg Scan Time</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600 mb-2">95.2%</div>
              <div className="text-sm text-purple-700">Success Rate</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-3xl font-bold text-orange-600 mb-2">1,247</div>
              <div className="text-sm text-orange-700">Total Scans</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
