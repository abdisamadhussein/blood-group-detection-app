import { initTRPC, TRPCError } from "@trpc/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import superjson from "superjson"

const t = initTRPC.create({
  transformer: superjson,
})

export const router = t.router
export const publicProcedure = t.procedure

// Input validation schemas
const predictionInputSchema = z.object({
  patientId: z.string().min(1, "Patient ID is required"),
  fingerprintData: z.object({
    imageData: z.string(),
    quality: z.number().min(0).max(100),
    timestamp: z.string(),
  }),
})

const statusInputSchema = z.object({
  sessionId: z.string().optional(),
  patientId: z.string().optional(),
})

const paginationSchema = z.object({
  limit: z.number().min(1).max(100).default(10),
  offset: z.number().min(0).default(0),
  patientId: z.string().optional(),
})

// FastAPI backend configuration
const FASTAPI_BASE_URL = process.env.FASTAPI_URL || "http://localhost:8000"

export const appRouter = router({
  // Blood group prediction procedure
  prediction: router({
    // Create new prediction using FastAPI backend
    create: publicProcedure.input(predictionInputSchema).mutation(async ({ input }) => {
      try {
        const { patientId, fingerprintData } = input

        // Verify patient exists
        const patient = await prisma.patient.findUnique({
          where: { id: patientId },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        })

        if (!patient) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Patient not found",
          })
        }

        // Generate session ID
        const sessionId = `BG${Math.random().toString(36).substr(2, 8).toUpperCase()}`

        // Create initial scan record with pending status
        const initialScanResult = await prisma.scanResult.create({
          data: {
            patientId,
            sessionId,
            status: "processing",
            fingerprintData: JSON.stringify(fingerprintData),
          },
        })

        try {
          // Call FastAPI prediction endpoint
          const predictionResponse = await fetch(`${FASTAPI_BASE_URL}/api/prediction`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              session_id: sessionId,
              fingerprint_image: fingerprintData.imageData,
              quality_score: fingerprintData.quality,
              timestamp: fingerprintData.timestamp,
              patient_metadata: {
                id: patient.id,
                name: `${patient.firstName} ${patient.lastName}`,
                email: patient.email,
              },
            }),
          })

          if (!predictionResponse.ok) {
            const errorData = await predictionResponse.json().catch(() => ({}))
            throw new Error(
              `FastAPI error: ${predictionResponse.status} - ${errorData.detail || predictionResponse.statusText}`,
            )
          }

          const predictionData = await predictionResponse.json()

          // Update scan result with prediction data
          const updatedScanResult = await prisma.scanResult.update({
            where: { id: initialScanResult.id },
            data: {
              bloodGroup: predictionData.blood_group,
              confidence: predictionData.confidence,
              scanDuration: predictionData.processing_time,
              status: "completed",
              apiResponse: JSON.stringify(predictionData),
            },
            include: {
              patient: {
                select: {
                  firstName: true,
                  lastName: true,
                  email: true,
                },
              },
            },
          })

          // Log successful prediction
          await prisma.systemLog.create({
            data: {
              action: "Blood group prediction completed",
              details: `Patient: ${patient.firstName} ${patient.lastName}, Result: ${predictionData.blood_group}, Confidence: ${predictionData.confidence}%, Session: ${sessionId}`,
              level: "info",
            },
          })

          return {
            success: true,
            data: {
              sessionId: updatedScanResult.sessionId,
              bloodGroup: updatedScanResult.bloodGroup,
              confidence: updatedScanResult.confidence,
              scanDuration: updatedScanResult.scanDuration,
              timestamp: updatedScanResult.createdAt,
              patient: {
                name: `${updatedScanResult.patient.firstName} ${updatedScanResult.patient.lastName}`,
                email: updatedScanResult.patient.email,
              },
              apiMetadata: {
                processingTime: predictionData.processing_time,
                algorithmVersion: predictionData.algorithm_version || "1.0",
                qualityScore: predictionData.quality_assessment || fingerprintData.quality,
                modelAccuracy: predictionData.model_accuracy || 98.5,
              },
            },
          }
        } catch (apiError) {
          // Update scan result with error status
          await prisma.scanResult.update({
            where: { id: initialScanResult.id },
            data: {
              status: "failed",
              errorMessage: apiError instanceof Error ? apiError.message : "Unknown API error",
            },
          })

          throw apiError
        }
      } catch (error) {
        // Log the error
        await prisma.systemLog.create({
          data: {
            action: "Blood group prediction failed",
            details: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
            level: "error",
          },
        })

        if (error instanceof TRPCError) {
          throw error
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Internal server error during prediction",
        })
      }
    }),

    // Get predictions with pagination
    list: publicProcedure.input(paginationSchema).query(async ({ input }) => {
      try {
        const { limit, offset, patientId } = input
        const where = patientId ? { patientId } : {}

        const [results, total] = await Promise.all([
          prisma.scanResult.findMany({
            where,
            include: {
              patient: {
                select: {
                  firstName: true,
                  lastName: true,
                  email: true,
                },
              },
            },
            orderBy: {
              createdAt: "desc",
            },
            take: limit,
            skip: offset,
          }),
          prisma.scanResult.count({ where }),
        ])

        return {
          success: true,
          data: results.map((result) => ({
            id: result.id,
            sessionId: result.sessionId,
            bloodGroup: result.bloodGroup,
            confidence: result.confidence,
            scanDuration: result.scanDuration,
            status: result.status,
            timestamp: result.createdAt,
            patient: {
              name: `${result.patient.firstName} ${result.patient.lastName}`,
              email: result.patient.email,
            },
          })),
          pagination: {
            total,
            limit,
            offset,
            hasMore: offset + limit < total,
          },
        }
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch predictions",
        })
      }
    }),
  }),

  // Status checking procedures using FastAPI backend
  status: router({
    // Get system status including FastAPI backend health
    system: publicProcedure.query(async () => {
      try {
        const [totalScans, todayScans, activePatients, systemLogs] = await Promise.all([
          prisma.scanResult.count(),
          prisma.scanResult.count({
            where: {
              createdAt: {
                gte: new Date(new Date().setHours(0, 0, 0, 0)),
              },
            },
          }),
          prisma.patient.count(),
          prisma.systemLog.findMany({
            where: {
              level: "error",
              createdAt: {
                gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
              },
            },
            take: 5,
            orderBy: {
              createdAt: "desc",
            },
          }),
        ])

        // Check FastAPI backend health
        const fastApiStatus = await checkFastAPIHealth()

        // Get blood group distribution
        const bloodGroupStats = await prisma.scanResult.groupBy({
          by: ["bloodGroup"],
          where: {
            status: "completed",
            bloodGroup: { not: null },
          },
          _count: {
            bloodGroup: true,
          },
        })

        // Calculate success rate
        const completedScans = await prisma.scanResult.count({
          where: { status: "completed" },
        })
        const successRate = totalScans > 0 ? ((completedScans / totalScans) * 100).toFixed(1) : "100"

        return {
          success: true,
          data: {
            system: {
              status: fastApiStatus.status === "healthy" ? "operational" : "degraded",
              uptime: process.uptime(),
              timestamp: new Date().toISOString(),
              version: "1.0.0",
            },
            statistics: {
              totalScans,
              todayScans,
              activePatients,
              completedScans,
              errorCount: systemLogs.length,
              successRate,
            },
            fastApiBackend: fastApiStatus,
            bloodGroupDistribution: bloodGroupStats.map((stat) => ({
              bloodGroup: stat.bloodGroup,
              count: stat._count.bloodGroup,
              percentage: totalScans > 0 ? ((stat._count.bloodGroup / totalScans) * 100).toFixed(1) : "0",
            })),
            recentErrors: systemLogs.map((log) => ({
              id: log.id,
              action: log.action,
              details: log.details,
              timestamp: log.createdAt,
            })),
          },
        }
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get system status",
        })
      }
    }),

    // Get specific scan status from FastAPI backend
    scan: publicProcedure.input(statusInputSchema).query(async ({ input }) => {
      try {
        const { sessionId, patientId } = input

        if (!sessionId && !patientId) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Either sessionId or patientId is required",
          })
        }

        // First check local database
        const where = sessionId
          ? { sessionId }
          : { patientId, createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } }

        const scanResult = await prisma.scanResult.findFirst({
          where,
          include: {
            patient: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        })

        if (!scanResult) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Scan result not found",
          })
        }

        // If scan is still processing, check FastAPI backend for real-time status
        let realTimeStatus = null
        if (scanResult.status === "processing" && scanResult.sessionId) {
          try {
            const statusResponse = await fetch(`${FASTAPI_BASE_URL}/api/status/${scanResult.sessionId}`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            })

            if (statusResponse.ok) {
              realTimeStatus = await statusResponse.json()

              // Update local database if status has changed
              if (realTimeStatus.status === "completed" && realTimeStatus.blood_group) {
                await prisma.scanResult.update({
                  where: { id: scanResult.id },
                  data: {
                    bloodGroup: realTimeStatus.blood_group,
                    confidence: realTimeStatus.confidence,
                    scanDuration: realTimeStatus.processing_time,
                    status: "completed",
                    apiResponse: JSON.stringify(realTimeStatus),
                  },
                })
              } else if (realTimeStatus.status === "failed") {
                await prisma.scanResult.update({
                  where: { id: scanResult.id },
                  data: {
                    status: "failed",
                    errorMessage: realTimeStatus.error_message || "Processing failed",
                  },
                })
              }
            }
          } catch (apiError) {
            console.error("Failed to fetch real-time status from FastAPI:", apiError)
          }
        }

        return {
          success: true,
          data: {
            sessionId: scanResult.sessionId,
            status: realTimeStatus?.status || scanResult.status,
            bloodGroup: realTimeStatus?.blood_group || scanResult.bloodGroup,
            confidence: realTimeStatus?.confidence || scanResult.confidence,
            scanDuration: realTimeStatus?.processing_time || scanResult.scanDuration,
            timestamp: scanResult.createdAt,
            patient: {
              name: `${scanResult.patient.firstName} ${scanResult.patient.lastName}`,
              email: scanResult.patient.email,
            },
            processingDetails: realTimeStatus
              ? {
                  currentStep: realTimeStatus.current_step || "Processing",
                  estimatedTimeRemaining: realTimeStatus.estimated_time_remaining || 0,
                  progress: realTimeStatus.progress_percentage || 0,
                }
              : null,
          },
        }
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get scan status",
        })
      }
    }),

    // Get FastAPI backend metrics
    apiMetrics: publicProcedure.query(async () => {
      try {
        const metricsResponse = await fetch(`${FASTAPI_BASE_URL}/api/metrics`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (!metricsResponse.ok) {
          throw new Error(`Failed to fetch FastAPI metrics: ${metricsResponse.statusText}`)
        }

        const metrics = await metricsResponse.json()

        return {
          success: true,
          data: {
            apiVersion: metrics.version || "1.0.0",
            totalRequests: metrics.total_requests || 0,
            averageResponseTime: metrics.average_response_time || 0,
            successRate: metrics.success_rate || 100,
            activeConnections: metrics.active_connections || 0,
            queueSize: metrics.queue_size || 0,
            supportedBloodGroups: metrics.supported_blood_groups || ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
            algorithmAccuracy: metrics.algorithm_accuracy || 98.5,
            modelVersion: metrics.model_version || "1.0",
            lastUpdated: metrics.last_updated || new Date().toISOString(),
          },
        }
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Failed to fetch FastAPI metrics",
          data: {
            apiVersion: "Unknown",
            totalRequests: 0,
            averageResponseTime: 0,
            successRate: 0,
            activeConnections: 0,
            queueSize: 0,
            supportedBloodGroups: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
            algorithmAccuracy: 0,
            modelVersion: "Unknown",
            lastUpdated: new Date().toISOString(),
          },
        }
      }
    }),
  }),

  // Patient management procedures
  patients: router({
    // Create new patient
    create: publicProcedure
      .input(
        z.object({
          firstName: z.string().min(1, "First name is required"),
          lastName: z.string().min(1, "Last name is required"),
          email: z.string().email("Invalid email address"),
          phone: z.string().min(1, "Phone number is required"),
          dateOfBirth: z.string().transform((str) => new Date(str)),
          gender: z.enum(["male", "female", "other"]),
          address: z.string().optional(),
          emergencyContact: z.string().optional(),
          emergencyPhone: z.string().optional(),
        }),
      )
      .mutation(async ({ input }) => {
        try {
          const patient = await prisma.patient.create({
            data: input,
          })

          await prisma.systemLog.create({
            data: {
              action: "Patient registered",
              details: `New patient: ${patient.firstName} ${patient.lastName} (${patient.email})`,
              level: "info",
            },
          })

          return {
            success: true,
            data: {
              id: patient.id,
              firstName: patient.firstName,
              lastName: patient.lastName,
              email: patient.email,
              createdAt: patient.createdAt,
            },
          }
        } catch (error: any) {
          if (error.code === "P2002") {
            throw new TRPCError({
              code: "CONFLICT",
              message: "Email address already exists",
            })
          }

          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create patient",
          })
        }
      }),

    // Get patients with pagination
    list: publicProcedure
      .input(
        z.object({
          limit: z.number().min(1).max(100).default(10),
          offset: z.number().min(0).default(0),
          search: z.string().optional(),
        }),
      )
      .query(async ({ input }) => {
        try {
          const { limit, offset, search } = input

          const where = search
            ? {
                OR: [
                  { firstName: { contains: search, mode: "insensitive" as const } },
                  { lastName: { contains: search, mode: "insensitive" as const } },
                  { email: { contains: search, mode: "insensitive" as const } },
                ],
              }
            : {}

          const [patients, total] = await Promise.all([
            prisma.patient.findMany({
              where,
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
                createdAt: true,
                _count: {
                  select: {
                    scanResults: true,
                  },
                },
              },
              orderBy: {
                createdAt: "desc",
              },
              take: limit,
              skip: offset,
            }),
            prisma.patient.count({ where }),
          ])

          return {
            success: true,
            data: patients.map((patient) => ({
              id: patient.id,
              name: `${patient.firstName} ${patient.lastName}`,
              email: patient.email,
              phone: patient.phone,
              scanCount: patient._count.scanResults,
              createdAt: patient.createdAt,
            })),
            pagination: {
              total,
              limit,
              offset,
              hasMore: offset + limit < total,
            },
          }
        } catch (error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to fetch patients",
          })
        }
      }),
  }),
})

// Check FastAPI backend health
async function checkFastAPIHealth() {
  const startTime = Date.now()

  try {
    const response = await fetch(`${FASTAPI_BASE_URL}/api/health`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      signal: AbortSignal.timeout(5000), // 5 second timeout
    })

    const responseTime = Date.now() - startTime

    if (response.ok) {
      const healthData = await response.json()
      return {
        status: "healthy" as const,
        responseTime,
        lastChecked: new Date().toISOString(),
        version: healthData.version || "1.0.0",
        uptime: healthData.uptime || 0,
        activeConnections: healthData.active_connections || 0,
        queueSize: healthData.queue_size || 0,
        memoryUsage: healthData.memory_usage || "Unknown",
        cpuUsage: healthData.cpu_usage || "Unknown",
      }
    } else {
      return {
        status: "unhealthy" as const,
        responseTime,
        lastChecked: new Date().toISOString(),
        error: `HTTP ${response.status}: ${response.statusText}`,
      }
    }
  } catch (error) {
    return {
      status: "unhealthy" as const,
      responseTime: Date.now() - startTime,
      lastChecked: new Date().toISOString(),
      error: error instanceof Error ? error.message : "Connection failed",
    }
  }
}

export type AppRouter = typeof appRouter
