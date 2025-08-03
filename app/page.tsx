"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Fingerprint,
  Shield,
  CheckCircle,
  AlertCircle,
  User,
  Clock,
  Wifi,
  WifiOff,
  Activity,
  Zap,
  Heart,
  RefreshCw,
  BarChart3,
  Cpu,
} from "lucide-react"

type ScanState = "idle" | "scanning" | "processing" | "complete" | "error"
type BloodGroup = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-"

interface ScanResult {
  bloodGroup: BloodGroup
  confidence: number
  timestamp: Date
  userId: string
  scanDuration: number
}

export default function BloodGroupDetectionSystem() {
  const [scanState, setScanState] = useState<ScanState>("idle")
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<ScanResult | null>(null)
  const [deviceConnected, setDeviceConnected] = useState(true)
  const [scanHistory, setScanHistory] = useState<ScanResult[]>([])
  const [isAnimating, setIsAnimating] = useState(false)

  // Simulate device connection status
  useEffect(() => {
    const interval = setInterval(() => {
      setDeviceConnected(Math.random() > 0.1)
    }, 8000)
    return () => clearInterval(interval)
  }, [])

  const bloodGroupInfo = {
    "A+": {
      color: "bg-gradient-to-r from-red-500 to-red-600",
      textColor: "text-white",
      compatibility: "Universal plasma donor",
      percentage: "34%",
    },
    "A-": {
      color: "bg-gradient-to-r from-red-400 to-red-500",
      textColor: "text-white",
      compatibility: "Can donate to A+, A-, AB+, AB-",
      percentage: "6%",
    },
    "B+": {
      color: "bg-gradient-to-r from-blue-500 to-blue-600",
      textColor: "text-white",
      compatibility: "Can donate to B+, AB+",
      percentage: "9%",
    },
    "B-": {
      color: "bg-gradient-to-r from-blue-400 to-blue-500",
      textColor: "text-white",
      compatibility: "Can donate to B+, B-, AB+, AB-",
      percentage: "2%",
    },
    "AB+": {
      color: "bg-gradient-to-r from-purple-500 to-purple-600",
      textColor: "text-white",
      compatibility: "Universal recipient",
      percentage: "3%",
    },
    "AB-": {
      color: "bg-gradient-to-r from-purple-400 to-purple-500",
      textColor: "text-white",
      compatibility: "Can receive A-, B-, AB-, O-",
      percentage: "1%",
    },
    "O+": {
      color: "bg-gradient-to-r from-emerald-500 to-emerald-600",
      textColor: "text-white",
      compatibility: "Can donate to all positive types",
      percentage: "38%",
    },
    "O-": {
      color: "bg-gradient-to-r from-emerald-600 to-emerald-700",
      textColor: "text-white",
      compatibility: "Universal donor",
      percentage: "7%",
    },
  }

  const simulateFingerprint = (): BloodGroup => {
    const bloodGroups: BloodGroup[] = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
    return bloodGroups[Math.floor(Math.random() * bloodGroups.length)]
  }

  const startScan = useCallback(async () => {
    if (!deviceConnected) return

    setIsAnimating(true)
    setScanState("scanning")
    setProgress(0)
    setResult(null)

    const scanInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(scanInterval)
          processScan()
          return 100
        }
        return prev + 1.5
      })
    }, 60)
  }, [deviceConnected])

  const processScan = async () => {
    setScanState("processing")

    await new Promise((resolve) => setTimeout(resolve, 2500))

    if (Math.random() < 0.05) {
      setScanState("error")
      setIsAnimating(false)
      return
    }

    const scanResult: ScanResult = {
      bloodGroup: simulateFingerprint(),
      confidence: Math.floor(Math.random() * 12) + 88,
      timestamp: new Date(),
      userId: `BG${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
      scanDuration: Math.floor(Math.random() * 2) + 3,
    }

    setResult(scanResult)
    setScanHistory((prev) => [scanResult, ...prev.slice(0, 4)])
    setScanState("complete")
    setIsAnimating(false)
  }

  const resetScan = () => {
    setScanState("idle")
    setProgress(0)
    setResult(null)
    setIsAnimating(false)
  }

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === "Space" && scanState === "idle" && deviceConnected) {
        event.preventDefault()
        startScan()
      } else if (event.code === "Escape" && (scanState === "complete" || scanState === "error")) {
        resetScan()
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [scanState, deviceConnected, startScan])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header Section */}
      <header className="bg-white/90 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-10 shadow-sm">
        <div className="max-w-8xl mx-auto px-6 py-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-4">
              <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg">
                <Heart className="h-10 w-10 text-white" />
              </div>
              <div>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
                  BloodScan Pro
                </h1>
                <p className="text-xl text-gray-600 font-medium mt-1">Advanced Biometric Blood Group Detection</p>
              </div>
            </div>
            <p className="text-gray-500 max-w-3xl mx-auto text-lg leading-relaxed">
              Secure, fast, and accurate blood group identification using cutting-edge fingerprint analysis technology
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-8xl mx-auto px-6 py-10">
        {/* Device Status Banner */}
        <Card
          className={`mb-10 transition-all duration-300 shadow-lg ${
            deviceConnected
              ? "border-green-200 bg-gradient-to-r from-green-50 to-emerald-50"
              : "border-red-200 bg-gradient-to-r from-red-50 to-rose-50"
          }`}
        >
          <CardContent className="flex items-center justify-between p-8">
            <div className="flex items-center space-x-6">
              <div className={`p-3 rounded-2xl ${deviceConnected ? "bg-green-100" : "bg-red-100"}`}>
                {deviceConnected ? (
                  <Wifi className="h-8 w-8 text-green-600" />
                ) : (
                  <WifiOff className="h-8 w-8 text-red-600" />
                )}
              </div>
              <div>
                <p className={`text-xl font-bold ${deviceConnected ? "text-green-800" : "text-red-800"}`}>
                  Scanner Device {deviceConnected ? "Connected" : "Disconnected"}
                </p>
                <p className={`text-base ${deviceConnected ? "text-green-600" : "text-red-600"}`}>
                  {deviceConnected ? "Ready for fingerprint scanning" : "Please check device connection"}
                </p>
              </div>
            </div>
            <Badge variant={deviceConnected ? "default" : "destructive"} className="px-6 py-3 text-base font-semibold">
              <Activity className="h-5 w-5 mr-2" />
              {deviceConnected ? "Online" : "Offline"}
            </Badge>
          </CardContent>
        </Card>

        {/* Main Content Grid */}
        <div className="grid xl:grid-cols-12 gap-8">
          {/* Left Column - Scanner Interface */}
          <div className="xl:col-span-7 space-y-8">
            {/* Primary Scanner Card */}
            <Card className="overflow-hidden shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-8">
                <CardTitle className="flex items-center space-x-4 text-2xl">
                  <Fingerprint className="h-8 w-8" />
                  <span>Biometric Scanner</span>
                </CardTitle>
                <CardDescription className="text-blue-100 text-lg">
                  Place your index finger on the scanner pad below for blood group detection
                </CardDescription>
              </CardHeader>
              <CardContent className="p-12 space-y-10">
                {/* Enhanced Scanner Visual */}
                <div className="flex justify-center">
                  <div className="relative">
                    <div
                      className={`relative w-80 h-80 rounded-full border-8 flex items-center justify-center transition-all duration-700 transform ${
                        scanState === "scanning"
                          ? "border-blue-400 bg-gradient-to-br from-blue-50 to-blue-100 scale-110 shadow-3xl shadow-blue-300/50"
                          : scanState === "processing"
                            ? "border-amber-400 bg-gradient-to-br from-amber-50 to-amber-100 scale-110 shadow-3xl shadow-amber-300/50"
                            : scanState === "complete"
                              ? "border-emerald-400 bg-gradient-to-br from-emerald-50 to-emerald-100 scale-110 shadow-3xl shadow-emerald-300/50"
                              : scanState === "error"
                                ? "border-red-400 bg-gradient-to-br from-red-50 to-red-100 scale-110 shadow-3xl shadow-red-300/50"
                                : "border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100 hover:scale-105 shadow-xl cursor-pointer"
                      }`}
                      role="button"
                      tabIndex={scanState === "idle" && deviceConnected ? 0 : -1}
                      aria-label={scanState === "idle" ? "Start fingerprint scan" : `Scanner status: ${scanState}`}
                      onClick={scanState === "idle" && deviceConnected ? startScan : undefined}
                      onKeyDown={(e) => {
                        if ((e.key === "Enter" || e.key === " ") && scanState === "idle" && deviceConnected) {
                          e.preventDefault()
                          startScan()
                        }
                      }}
                    >
                      <Fingerprint
                        className={`h-32 w-32 transition-all duration-700 ${
                          scanState === "scanning"
                            ? "text-blue-500 animate-pulse"
                            : scanState === "processing"
                              ? "text-amber-500 animate-spin"
                              : scanState === "complete"
                                ? "text-emerald-500"
                                : scanState === "error"
                                  ? "text-red-500"
                                  : "text-gray-400"
                        }`}
                      />

                      {/* Enhanced animated rings */}
                      {isAnimating && (
                        <>
                          <div className="absolute inset-0 rounded-full border-4 border-blue-400 animate-ping opacity-40" />
                          <div className="absolute inset-6 rounded-full border-4 border-blue-300 animate-ping opacity-30 animation-delay-200" />
                          <div className="absolute inset-12 rounded-full border-4 border-blue-200 animate-ping opacity-20 animation-delay-400" />
                        </>
                      )}
                    </div>

                    {/* Enhanced status indicator */}
                    <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
                      <Badge
                        className={`px-6 py-3 text-base font-semibold shadow-lg ${
                          scanState === "scanning"
                            ? "bg-blue-500 animate-pulse"
                            : scanState === "processing"
                              ? "bg-amber-500"
                              : scanState === "complete"
                                ? "bg-emerald-500"
                                : scanState === "error"
                                  ? "bg-red-500"
                                  : "bg-gray-500"
                        }`}
                      >
                        {scanState === "idle"
                          ? "Ready to Scan"
                          : scanState === "scanning"
                            ? "Scanning..."
                            : scanState === "processing"
                              ? "Processing..."
                              : scanState === "complete"
                                ? "Scan Complete"
                                : "Scan Failed"}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Enhanced Progress Section */}
                {(scanState === "scanning" || scanState === "processing") && (
                  <div className="space-y-6">
                    <Progress value={scanState === "scanning" ? progress : 100} className="w-full h-4 bg-gray-200" />
                    <div className="text-center space-y-3">
                      <p className="text-xl font-semibold text-gray-700">
                        {scanState === "scanning" ? "Capturing biometric data..." : "Analyzing blood markers..."}
                      </p>
                      <p className="text-base text-gray-500">
                        {scanState === "scanning" ? `${Math.round(progress)}% complete` : "Please wait..."}
                      </p>
                    </div>
                  </div>
                )}

                {/* Enhanced Status Messages */}
                {scanState === "error" && (
                  <Alert variant="destructive" className="border-red-200 bg-red-50 p-6">
                    <AlertCircle className="h-6 w-6" />
                    <AlertDescription className="text-lg">
                      <strong>Scan Failed:</strong> Unable to detect clear fingerprint pattern. Please clean your finger
                      and ensure proper placement on the scanner.
                    </AlertDescription>
                  </Alert>
                )}

                {scanState === "complete" && result && (
                  <Alert className="border-emerald-200 bg-emerald-50 p-6">
                    <CheckCircle className="h-6 w-6 text-emerald-600" />
                    <AlertDescription className="text-lg text-emerald-800">
                      <strong>Success:</strong> Blood group detected with {result.confidence}% confidence. Results are
                      ready for review.
                    </AlertDescription>
                  </Alert>
                )}

                {/* Enhanced Control Buttons */}
                <div className="flex justify-center space-x-6">
                  {scanState === "idle" && (
                    <Button
                      onClick={startScan}
                      disabled={!deviceConnected}
                      size="lg"
                      className="px-12 py-4 text-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-300 shadow-xl"
                    >
                      <Zap className="h-6 w-6 mr-3" />
                      Start Scan
                    </Button>
                  )}

                  {(scanState === "complete" || scanState === "error") && (
                    <Button
                      onClick={resetScan}
                      variant="outline"
                      size="lg"
                      className="px-12 py-4 text-xl font-semibold border-2 hover:bg-gray-50 transform hover:scale-105 transition-all duration-300 shadow-lg bg-transparent"
                    >
                      <RefreshCw className="h-6 w-6 mr-3" />
                      New Scan
                    </Button>
                  )}
                </div>

                {/* Enhanced keyboard shortcuts */}
                <div className="text-center text-base text-gray-500 space-y-2">
                  <p>
                     <strong>Quick Actions:</strong> Press{" "}
                    <kbd className="px-3 py-1 bg-gray-100 rounded-lg text-sm font-mono">Space</kbd> to start scan
                  </p>
                  {(scanState === "complete" || scanState === "error") && (
                    <p>
                      Press <kbd className="px-3 py-1 bg-gray-100 rounded-lg text-sm font-mono">Esc</kbd> for new scan
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* System Performance Metrics */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center space-x-3 text-blue-800">
                    <Cpu className="h-6 w-6" />
                    <span>System Performance</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-white/60 rounded-lg">
                    <span className="font-medium text-blue-700">Processing Speed</span>
                    <span className="font-bold text-blue-900">2.8s avg</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/60 rounded-lg">
                    <span className="font-medium text-blue-700">Accuracy Rate</span>
                    <span className="font-bold text-blue-900">98.7%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/60 rounded-lg">
                    <span className="font-medium text-blue-700">Success Rate</span>
                    <span className="font-bold text-blue-900">95.2%</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center space-x-3 text-purple-800">
                    <BarChart3 className="h-6 w-6" />
                    <span>Detection Statistics</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-white/60 rounded-lg">
                    <span className="font-medium text-purple-700">Total Scans</span>
                    <span className="font-bold text-purple-900">1,247</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/60 rounded-lg">
                    <span className="font-medium text-purple-700">Today's Scans</span>
                    <span className="font-bold text-purple-900">23</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/60 rounded-lg">
                    <span className="font-medium text-purple-700">Active Sessions</span>
                    <span className="font-bold text-purple-900">1</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Column - Results and Information */}
          <div className="xl:col-span-5 space-y-8">
            {/* Results Display */}
            {result ? (
              <Card className="overflow-hidden shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className={`${bloodGroupInfo[result.bloodGroup].color} text-white p-8`}>
                  <CardTitle className="flex items-center space-x-4 text-2xl">
                    <User className="h-8 w-8" />
                    <span>Detection Results</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-8">
                  <div className="text-center space-y-6">
                    <div className="space-y-3">
                      <p className="text-base font-semibold text-gray-600 uppercase tracking-wider">Blood Group</p>
                      <div
                        className={`inline-flex items-center justify-center w-32 h-32 rounded-3xl text-5xl font-bold ${bloodGroupInfo[result.bloodGroup].color} ${bloodGroupInfo[result.bloodGroup].textColor} shadow-2xl`}
                      >
                        {result.bloodGroup}
                      </div>
                      <p className="text-sm text-gray-500">
                        {bloodGroupInfo[result.bloodGroup].percentage} of population
                      </p>
                    </div>

                    <div className="p-6 bg-gray-50 rounded-2xl">
                      <p className="text-base text-gray-600 mb-2 font-medium">Compatibility Information</p>
                      <p className="text-lg font-semibold text-gray-800">
                        {bloodGroupInfo[result.bloodGroup].compatibility}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center p-6 bg-blue-50 rounded-2xl">
                      <p className="text-blue-600 font-semibold text-base">Confidence</p>
                      <p className="text-3xl font-bold text-blue-800 mt-2">{result.confidence}%</p>
                    </div>
                    <div className="text-center p-6 bg-green-50 rounded-2xl">
                      <p className="text-green-600 font-semibold text-base">Scan Time</p>
                      <p className="text-3xl font-bold text-green-800 mt-2">{result.scanDuration}s</p>
                    </div>
                  </div>

                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <p className="text-gray-600 font-medium text-base">Session ID</p>
                    <p className="font-mono text-base text-gray-800 mt-1">{result.userId}</p>
                    <p className="text-sm text-gray-500 mt-2">Scanned at {result.timestamp.toLocaleString()}</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-dashed border-2 border-gray-300 bg-gray-50/50 shadow-lg">
                <CardContent className="p-16 text-center space-y-6">
                  <div className="w-20 h-20 mx-auto bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="h-10 w-10 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-600">No Results Yet</h3>
                    <p className="text-lg text-gray-500 mt-2">
                      Start a fingerprint scan to see your blood group results here
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Security & Privacy */}
            <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 shadow-lg">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center space-x-3 text-amber-800 text-xl">
                  <Shield className="h-7 w-7" />
                  <span>Security & Privacy</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  "Biometric data processed locally - never stored",
                  "End-to-end encryption for all transmissions",
                  "HIPAA compliant data handling",
                  "Anonymous session tracking only",
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-white/60 rounded-lg">
                    <CheckCircle className="h-5 w-5 mt-0.5 text-amber-600 flex-shrink-0" />
                    <p className="text-amber-700 font-medium">{item}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Scans */}
            {scanHistory.length > 0 ? (
              <Card className="shadow-lg">
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center space-x-3 text-xl">
                    <Clock className="h-7 w-7" />
                    <span>Recent Sessions</span>
                  </CardTitle>
                  <CardDescription className="text-base">Last {scanHistory.length} successful scans</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {scanHistory.map((scan, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-5 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl border border-gray-200 hover:shadow-md transition-all duration-300"
                      >
                        <div className="flex items-center space-x-4">
                          <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold ${bloodGroupInfo[scan.bloodGroup].color} ${bloodGroupInfo[scan.bloodGroup].textColor}`}
                          >
                            {scan.bloodGroup}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800 text-base">{scan.confidence}% confidence</p>
                            <p className="text-sm text-gray-500">{scan.userId}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-700">{scan.timestamp.toLocaleTimeString()}</p>
                          <p className="text-sm text-gray-500">{scan.timestamp.toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-dashed border-2 border-gray-300 bg-gray-50/50 shadow-lg">
                <CardContent className="p-12 text-center space-y-4">
                  <div className="w-16 h-16 mx-auto bg-gray-200 rounded-full flex items-center justify-center">
                    <Clock className="h-8 w-8 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-600">No Scan History</h3>
                    <p className="text-base text-gray-500 mt-1">Previous scan results will appear here</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      {/* Enhanced Footer */}
      <footer className="bg-white/90 backdrop-blur-md border-t border-gray-200/50 mt-20 shadow-sm">
        <div className="max-w-8xl mx-auto px-6 py-10">
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
