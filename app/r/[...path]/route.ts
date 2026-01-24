import { type NextRequest, NextResponse } from "next/server"
import { readFileSync, existsSync } from "fs"
import { join } from "path"

export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params
  const filePath = path.join("/")

  // Construct the registry file path
  const registryPath = join(process.cwd(), "public", "registry", filePath)

  // Check if file exists
  if (!existsSync(registryPath)) {
    return NextResponse.json({ error: "Component not found", path: filePath }, { status: 404 })
  }

  try {
    const content = readFileSync(registryPath, "utf-8")
    const json = JSON.parse(content)

    return NextResponse.json(json, {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=3600, s-maxage=86400",
        "Access-Control-Allow-Origin": "*",
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to read registry file" }, { status: 500 })
  }
}
