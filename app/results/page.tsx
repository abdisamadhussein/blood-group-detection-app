"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Search, Download, Filter, Calendar, User } from "lucide-react"

interface ScanResult {
  id: string
  patientName: string
  bloodGroup: string
  confidence: number
  timestamp: Date
  sessionId: string
  status: "completed" | "pending" | "failed"
}

export default function ResultsPage() {
  const [results, setResults] = useState<ScanResult[]>([])
  const [filteredResults, setFilteredResults] = useState<ScanResult[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterBloodGroup, setFilterBloodGroup] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockResults: ScanResult[] = [
      {
        id: "1",
        patientName: "John Doe",
        bloodGroup: "A+",
        confidence: 96,
        timestamp: new Date("2024-01-15T10:30:00"),
        sessionId: "BG7K2M8N",
        status: "completed",
      },
      {
        id: "2",
        patientName: "Jane Smith",
        bloodGroup: "O-",
        confidence: 94,
        timestamp: new Date("2024-01-15T11:45:00"),
        sessionId: "BG9P3Q7R",
        status: "completed",
      },
      {
        id: "3",
        patientName: "Mike Johnson",
        bloodGroup: "B+",
        confidence: 98,
        timestamp: new Date("2024-01-15T14:20:00"),
        sessionId: "BG5T8W2X",
        status: "completed",
      },
      {
        id: "4",
        patientName: "Sarah Wilson",
        bloodGroup: "AB+",
        confidence: 91,
        timestamp: new Date("2024-01-15T15:10:00"),
        sessionId: "BG1Y4Z6A",
        status: "completed",
      },
    ]
    setResults(mockResults)
    setFilteredResults(mockResults)
  }, [])

  // Filter results based on search and filters
  useEffect(() => {
    const filtered = results.filter((result) => {
      const matchesSearch =
        result.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.sessionId.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesBloodGroup = filterBloodGroup === "all" || result.bloodGroup === filterBloodGroup
      const matchesStatus = filterStatus === "all" || result.status === filterStatus

      return matchesSearch && matchesBloodGroup && matchesStatus
    })

    setFilteredResults(filtered)
  }, [results, searchTerm, filterBloodGroup, filterStatus])

  const bloodGroupColors = {
    "A+": "bg-red-500",
    "A-": "bg-red-400",
    "B+": "bg-blue-500",
    "B-": "bg-blue-400",
    "AB+": "bg-purple-500",
    "AB-": "bg-purple-400",
    "O+": "bg-green-500",
    "O-": "bg-green-600",
  }

  const exportResults = () => {
    // Implement CSV export functionality
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Patient Name,Blood Group,Confidence,Date,Session ID,Status\n" +
      filteredResults
        .map(
          (result) =>
            `${result.patientName},${result.bloodGroup},${result.confidence}%,${result.timestamp.toLocaleDateString()},${result.sessionId},${result.status}`,
        )
        .join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "blood_scan_results.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-lg">
              <FileText className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-purple-900 to-pink-900 bg-clip-text text-transparent mb-4">
            Scan Results
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            View and manage all blood group detection results. Search, filter, and export data as needed.
          </p>
        </div>

        {/* Filters and Search */}
        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Search & Filter</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by name or session ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Blood Group</label>
                <Select value={filterBloodGroup} onValueChange={setFilterBloodGroup}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Blood Groups</SelectItem>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Actions</label>
                <Button onClick={exportResults} className="w-full bg-transparent" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Table */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle>Scan Results ({filteredResults.length})</CardTitle>
            <CardDescription>All blood group detection results with detailed information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredResults.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">No Results Found</h3>
                  <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                </div>
              ) : (
                filteredResults.map((result) => (
                  <Card key={result.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                              <User className="h-6 w-6 text-gray-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg">{result.patientName}</h3>
                              <p className="text-gray-500 text-sm">Session: {result.sessionId}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-center">
                              <div
                                className={`w-16 h-16 rounded-xl ${bloodGroupColors[result.bloodGroup as keyof typeof bloodGroupColors]} text-white flex items-center justify-center text-xl font-bold`}
                              >
                                {result.bloodGroup}
                              </div>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Confidence</p>
                              <p className="text-2xl font-bold text-green-600">{result.confidence}%</p>
                            </div>
                          </div>
                        </div>
                        <div className="text-right space-y-2">
                          <Badge
                            variant={
                              result.status === "completed"
                                ? "default"
                                : result.status === "pending"
                                  ? "secondary"
                                  : "destructive"
                            }
                          >
                            {result.status}
                          </Badge>
                          <div className="flex items-center text-gray-500 text-sm">
                            <Calendar className="h-4 w-4 mr-1" />
                            {result.timestamp.toLocaleDateString()} {result.timestamp.toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
