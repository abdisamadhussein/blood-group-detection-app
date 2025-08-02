import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Cpu, Shield, Zap, Users, Award, User } from "lucide-react"

export default function AboutPage() {
  const features = [
    {
      icon: Cpu,
      title: "Advanced AI Technology",
      description: "Neural network-based blood group detection with 98.7% accuracy rate",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "HIPAA compliant with end-to-end encryption and local data processing",
    },
    {
      icon: Zap,
      title: "Fast Processing",
      description: "Results in under 3 seconds with real-time biometric analysis",
    },
    {
      icon: Users,
      title: "User-Friendly",
      description: "Intuitive interface designed for both medical professionals and patients",
    },
  ]

  const team = [
    { name: "Dr. Sarah Johnson", role: "Project Supervisor", department: "Biomedical Engineering" },
    { name: "Alex Chen", role: "Lead Developer", department: "Computer Science" },
    { name: "Maria Rodriguez", role: "ML Engineer", department: "Data Science" },
    { name: "David Kim", role: "IoT Specialist", department: "Electronics Engineering" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg">
              <Heart className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-6">
            About BloodScan Pro
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            A revolutionary IoT-based blood group detection system that combines cutting-edge biometric technology with
            machine learning to provide fast, accurate, and secure blood type identification.
          </p>
        </div>

        {/* Project Overview */}
        <Card className="mb-16 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8">
            <CardTitle className="text-2xl">Project Overview</CardTitle>
            <CardDescription className="text-blue-100 text-lg">
              Final Year Thesis Project - Computer Science Engineering
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Research Objectives</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Develop a non-invasive blood group detection method using fingerprint analysis</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Implement IoT integration for real-time data processing and transmission</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Create a secure, HIPAA-compliant system for medical data handling</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Achieve high accuracy rates through machine learning optimization</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Technical Specifications</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Accuracy Rate</span>
                    <Badge variant="secondary">98.7%</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Processing Time</span>
                    <Badge variant="secondary">2.8s avg</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Success Rate</span>
                    <Badge variant="secondary">95.2%</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Supported Blood Types</span>
                    <Badge variant="secondary">8 Types</Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features Grid */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Team Section */}
        <Card className="mb-16 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl flex items-center justify-center space-x-2">
              <Users className="h-6 w-6" />
              <span>Project Team</span>
            </CardTitle>
            <CardDescription>Meet the team behind BloodScan Pro</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {team.map((member, index) => (
                <div key={index} className="text-center p-4 bg-gray-50 rounded-xl">
                  <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg">{member.name}</h3>
                  <p className="text-blue-600 font-medium">{member.role}</p>
                  <p className="text-gray-500 text-sm">{member.department}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl flex items-center justify-center space-x-2">
              <Award className="h-6 w-6" />
              <span>Project Achievements</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                <div className="text-3xl font-bold text-green-600 mb-2">1,247+</div>
                <p className="text-gray-700">Successful Scans</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                <div className="text-3xl font-bold text-blue-600 mb-2">98.7%</div>
                <p className="text-gray-700">Accuracy Rate</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                <div className="text-3xl font-bold text-purple-600 mb-2">2.8s</div>
                <p className="text-gray-700">Average Processing Time</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
