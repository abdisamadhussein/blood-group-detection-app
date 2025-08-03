"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Heart,
  Fingerprint,
  Shield,
  Zap,
  Users,
  CheckCircle,
  ArrowRight,
  Cpu,
  Database,
  Wifi,
  Activity,
  Target,
  BookOpen,
  Award,
} from "lucide-react"
import { useAuth } from "@/lib/auth"

export default function HomePage() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()

  const handleAdminAccess = () => {
    if (isAuthenticated) {
      router.push("/admin")
    } else {
      router.push("/login")
    }
  }

  const features = [
    {
      icon: Fingerprint,
      title: "Biometric Analysis",
      description: "Advanced fingerprint pattern recognition using machine learning algorithms",
      color: "from-blue-500 to-indigo-600",
    },
    {
      icon: Zap,
      title: "Real-time Processing",
      description: "Instant blood group detection with 98.7% accuracy in under 3 seconds",
      color: "from-emerald-500 to-teal-600",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "HIPAA compliant with end-to-end encryption and local data processing",
      color: "from-purple-500 to-pink-600",
    },
    {
      icon: Database,
      title: "IoT Integration",
      description: "Seamless hardware integration with cloud-based data management",
      color: "from-orange-500 to-red-600",
    },
  ]

  const technologies = [
    { name: "Next.js 15", category: "Frontend Framework" },
    { name: "TypeScript", category: "Programming Language" },
    { name: "tRPC", category: "API Layer" },
    { name: "Prisma", category: "Database ORM" },
    { name: "FastAPI", category: "ML Backend" },
    { name: "Python", category: "Machine Learning" },
    { name: "SQLite", category: "Database" },
    { name: "Tailwind CSS", category: "Styling" },
  ]

  const objectives = [
    "Develop a non-invasive blood group detection system using biometric data",
    "Implement machine learning algorithms for pattern recognition",
    "Create a secure, HIPAA-compliant healthcare application",
    "Integrate IoT devices with cloud-based processing",
    "Achieve 95%+ accuracy in blood group identification",
    "Provide real-time results with minimal processing time",
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white/90 backdrop-blur-md">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10" />
        <div className="relative max-w-7xl mx-auto px-6 py-20">
          <div className="text-center space-y-8">
            <div className="flex items-center justify-center mb-8">
              <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl shadow-2xl">
                <Heart className="h-16 w-16 text-white" />
              </div>
            </div>

            <div className="space-y-6">
              <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
                BloodScan Pro
              </h1>
              <p className="text-2xl md:text-3xl text-gray-600 font-medium">IoT-Based Blood Group Detection System</p>
              <p className="text-xl text-gray-500 max-w-4xl mx-auto leading-relaxed">
                Revolutionary biometric technology that identifies blood groups through fingerprint analysis, combining
                machine learning, IoT integration, and secure healthcare data management.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
              <Button
                onClick={handleAdminAccess}
                size="lg"
                className="px-12 py-6 text-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-300 shadow-xl"
              >
                <Activity className="h-6 w-6 mr-3" />
                Access Admin Panel
                <ArrowRight className="h-6 w-6 ml-3" />
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="px-12 py-6 text-xl font-semibold border-2 hover:bg-gray-50 transform hover:scale-105 transition-all duration-300 shadow-lg bg-transparent"
              >
                <Link href="/about">
                  <BookOpen className="h-6 w-6 mr-3" />
                  Learn More
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Project Overview */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">What is BloodScan Pro?</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              A cutting-edge final year project that revolutionizes blood group detection through innovative biometric
              analysis and IoT technology integration.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8">
                  <CardTitle className="flex items-center space-x-3 text-2xl">
                    <Target className="h-8 w-8" />
                    <span>Project Objectives</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="space-y-4">
                    {objectives.map((objective, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <CheckCircle className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
                        <p className="text-gray-700 font-medium">{objective}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-8">
              <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-8">
                  <CardTitle className="flex items-center space-x-3 text-2xl">
                    <Award className="h-8 w-8" />
                    <span>Academic Context</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center p-4 bg-purple-50 rounded-xl">
                      <p className="text-purple-600 font-semibold">Project Type</p>
                      <p className="text-purple-800 font-bold text-lg">Final Year Thesis</p>
                    </div>
                    <div className="text-center p-4 bg-pink-50 rounded-xl">
                      <p className="text-pink-600 font-semibold">Field</p>
                      <p className="text-pink-800 font-bold text-lg">Computer Science</p>
                    </div>
                    <div className="text-center p-4 bg-indigo-50 rounded-xl">
                      <p className="text-indigo-600 font-semibold">Focus Area</p>
                      <p className="text-indigo-800 font-bold text-lg">Biomedical IoT</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-xl">
                      <p className="text-blue-600 font-semibold">Year</p>
                      <p className="text-blue-800 font-bold text-lg">2025</p>
                    </div>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                    <p className="text-gray-600 font-medium">Research Focus</p>
                    <p className="text-gray-800 font-bold text-lg mt-1">Machine Learning in Healthcare Applications</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-20 bg-white/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Key Features & Innovation</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Advanced technology stack combining biometrics, machine learning, and IoT for healthcare innovation
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card
                  key={index}
                  className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                >
                  <CardHeader className="text-center p-8">
                    <div
                      className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 shadow-lg`}
                    >
                      <Icon className="h-10 w-10 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="px-8 pb-8">
                    <p className="text-gray-600 text-center leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Technology Stack</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built with modern, industry-standard technologies for scalability and performance
            </p>
          </div>

          <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
            <CardContent className="p-12">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {technologies.map((tech, index) => (
                  <div
                    key={index}
                    className="text-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl hover:shadow-lg transition-all duration-300"
                  >
                    <Badge variant="secondary" className="mb-3 text-sm font-medium">
                      {tech.category}
                    </Badge>
                    <p className="font-bold text-lg text-gray-900">{tech.name}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* System Architecture */}
      <section className="py-20 bg-white/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">System Architecture</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive system design integrating frontend, backend, and machine learning components
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6">
                <CardTitle className="flex items-center space-x-3">
                  <Cpu className="h-6 w-6" />
                  <span>Frontend Layer</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-700">Next.js 15 with App Router</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-700">TypeScript for type safety</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-700">Tailwind CSS styling</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-700">Responsive design</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-6">
                <CardTitle className="flex items-center space-x-3">
                  <Database className="h-6 w-6" />
                  <span>Backend Layer</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                    <span className="text-gray-700">tRPC for type-safe APIs</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                    <span className="text-gray-700">Prisma ORM</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                    <span className="text-gray-700">SQLite database</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                    <span className="text-gray-700">Authentication system</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6">
                <CardTitle className="flex items-center space-x-3">
                  <Wifi className="h-6 w-6" />
                  <span>ML & IoT Layer</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span className="text-gray-700">FastAPI backend</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span className="text-gray-700">Python ML algorithms</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span className="text-gray-700">Biometric processing</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span className="text-gray-700">IoT device integration</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Card className="border-0 shadow-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <CardContent className="p-12 space-y-8">
              <div className="space-y-4">
                <h2 className="text-4xl font-bold">Ready to Experience the Future?</h2>
                <p className="text-xl text-blue-100">
                  Explore the admin panel to see the blood group detection system in action
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button
                  onClick={handleAdminAccess}
                  size="lg"
                  variant="secondary"
                  className="px-12 py-6 text-xl font-semibold bg-white text-blue-600 hover:bg-gray-100 transform hover:scale-105 transition-all duration-300"
                >
                  <Users className="h-6 w-6 mr-3" />
                  Access Admin Panel
                </Button>

                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="px-12 py-6 text-xl font-semibold border-2 border-white text-white hover:bg-white hover:text-blue-600 transform hover:scale-105 transition-all duration-300 bg-transparent"
                >
                  <Link href="/contact">
                    <Heart className="h-6 w-6 mr-3" />
                    Get in Touch
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white/90 backdrop-blur-md border-t border-gray-200/50 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center space-x-3 text-gray-700">
              <Heart className="h-6 w-6" />
              <span className="text-xl font-semibold">BloodScan Pro - IoT-Based Blood Group Detection System</span>
            </div>
            <p className="text-base text-gray-600">
              Final Year Project • Computer Science Engineering • Academic Research
            </p>
            <div className="flex justify-center space-x-8 text-sm text-gray-500">
              <span>Thesis Project 2025</span>
              <span>•</span>
              <span>Biometric Analysis & IoT Integration</span>
              <span>•</span>
              <span>Machine Learning Implementation</span>
            </div>
            <div className="pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Developed as part of undergraduate thesis research in biomedical engineering and IoT systems
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
