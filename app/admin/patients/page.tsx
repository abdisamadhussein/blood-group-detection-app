"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Users, Search, Plus, Eye, Mail, Phone, Activity } from "lucide-react"
import Link from "next/link"
import { trpc } from "@/lib/trpc/client"

export default function PatientsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(0)
  const limit = 10

  const {
    data: patientsData,
    isLoading,
    refetch,
  } = trpc.patients.list.useQuery({
    limit,
    offset: currentPage * limit,
    search: searchTerm || undefined,
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(0)
    refetch()
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-6 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading patients...</p>
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
            Patient Management
          </h1>
          <p className="text-lg text-gray-600">View and manage registered patients in the system.</p>
        </div>
        <Button asChild className="bg-green-600 hover:bg-green-700">
          <Link href="/admin/register" className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Register New Patient</span>
          </Link>
        </Button>
      </div>

      {/* Search and Stats */}
      <div className="grid lg:grid-cols-4 gap-6 mb-8">
        <div className="lg:col-span-3">
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <form onSubmit={handleSearch} className="flex space-x-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search patients by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button type="submit">Search</Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{patientsData?.pagination.total || 0}</div>
            <div className="text-sm text-gray-600">Total Patients</div>
          </CardContent>
        </Card>
      </div>

      {/* Patients List */}
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Registered Patients</span>
          </CardTitle>
          <CardDescription>{patientsData?.pagination.total || 0} patients registered in the system</CardDescription>
        </CardHeader>
        <CardContent>
          {patientsData?.data && patientsData.data.length > 0 ? (
            <div className="space-y-4">
              {patientsData.data.map((patient) => (
                <div
                  key={patient.id}
                  className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-center space-x-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{patient.name}</h3>
                      <div className="flex items-center space-x-4 mt-1">
                        <div className="flex items-center space-x-1 text-sm text-gray-600">
                          <Mail className="h-3 w-3" />
                          <span>{patient.email}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-sm text-gray-600">
                          <Phone className="h-3 w-3" />
                          <span>{patient.phone}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-blue-600">{patient.scanCount}</div>
                      <div className="text-xs text-gray-500">Scans</div>
                    </div>

                    <div className="text-center">
                      <div className="text-sm text-gray-600">{new Date(patient.createdAt).toLocaleDateString()}</div>
                      <div className="text-xs text-gray-500">Registered</div>
                    </div>

                    <Badge variant="secondary" className="flex items-center space-x-1">
                      <Activity className="h-3 w-3" />
                      <span>Active</span>
                    </Badge>

                    <Button variant="outline" size="sm" asChild className="flex items-center space-x-1 bg-transparent">
                      <Link href={`/admin/scan?patientId=${patient.id}`}>
                        <Eye className="h-3 w-3" />
                        <span>Scan</span>
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}

              {/* Pagination */}
              {patientsData.pagination.hasMore && (
                <div className="flex justify-center pt-6">
                  <Button onClick={() => setCurrentPage((prev) => prev + 1)} variant="outline">
                    Load More Patients
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Patients Found</h3>
              <p className="text-gray-500 mb-6">
                {searchTerm ? "No patients match your search criteria." : "No patients have been registered yet."}
              </p>
              <Button asChild className="bg-green-600 hover:bg-green-700">
                <Link href="/admin/register">
                  <Plus className="h-4 w-4 mr-2" />
                  Register First Patient
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
