import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { firstName, lastName, email, phone, dateOfBirth, gender, address, emergencyContact, emergencyPhone } = body

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !dateOfBirth || !gender) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if patient already exists
    const existingPatient = await prisma.patient.findUnique({
      where: { email },
    })

    if (existingPatient) {
      return NextResponse.json({ error: "Patient with this email already exists" }, { status: 409 })
    }

    // Create new patient
    const patient = await prisma.patient.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        dateOfBirth: new Date(dateOfBirth),
        gender,
        address,
        emergencyContact,
        emergencyPhone,
      },
    })

    // Log the registration
    await prisma.systemLog.create({
      data: {
        action: "Patient registered",
        details: `New patient: ${firstName} ${lastName} (${email})`,
        level: "info",
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        id: patient.id,
        name: `${patient.firstName} ${patient.lastName}`,
        email: patient.email,
        registrationDate: patient.createdAt,
      },
    })
  } catch (error) {
    console.error("Patient registration API error:", error)
    return NextResponse.json({ error: "Internal server error during registration" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

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
          dateOfBirth: true,
          gender: true,
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

    return NextResponse.json({
      success: true,
      data: patients.map((patient) => ({
        id: patient.id,
        name: `${patient.firstName} ${patient.lastName}`,
        email: patient.email,
        phone: patient.phone,
        dateOfBirth: patient.dateOfBirth,
        gender: patient.gender,
        registrationDate: patient.createdAt,
        totalScans: patient._count.scanResults,
      })),
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    })
  } catch (error) {
    console.error("Get patients API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
