// Version Negotiator for CLI Plugin Framework
// Handles semver-based version compatibility and feature negotiation

import type { 
  CLILibrary, 
  VersionRange, 
  VersionCompatibility, 
  CLIFeature,
  VersionFeatureMap 
} from "../types"

/** Parsed semantic version */
interface ParsedVersion {
  major: number
  minor: number
  patch: number
  prerelease?: string
  build?: string
}

/** Version range operator */
type RangeOperator = "=" | ">" | ">=" | "<" | "<=" | "^" | "~"

/** Parsed version range */
interface ParsedRange {
  operator: RangeOperator
  version: ParsedVersion
}

/**
 * Parse a semantic version string
 */
export function parseVersion(version: string): ParsedVersion {
  const cleanVersion = version.replace(/^[v=]/, "").trim()
  
  // Match semver pattern: major.minor.patch[-prerelease][+build]
  const match = cleanVersion.match(
    /^(\d+)\.(\d+)\.(\d+)(?:-([a-zA-Z0-9.-]+))?(?:\+([a-zA-Z0-9.-]+))?$/
  )
  
  if (!match) {
    throw new Error(`Invalid version format: ${version}`)
  }
  
  return {
    major: parseInt(match[1], 10),
    minor: parseInt(match[2], 10),
    patch: parseInt(match[3], 10),
    prerelease: match[4],
    build: match[5],
  }
}

/**
 * Compare two versions
 * Returns: -1 if a < b, 0 if a = b, 1 if a > b
 */
export function compareVersions(a: ParsedVersion, b: ParsedVersion): number {
  // Compare major
  if (a.major !== b.major) return a.major < b.major ? -1 : 1
  
  // Compare minor
  if (a.minor !== b.minor) return a.minor < b.minor ? -1 : 1
  
  // Compare patch
  if (a.patch !== b.patch) return a.patch < b.patch ? -1 : 1
  
  // Prerelease versions have lower precedence
  if (a.prerelease && !b.prerelease) return -1
  if (!a.prerelease && b.prerelease) return 1
  if (a.prerelease && b.prerelease) {
    return a.prerelease < b.prerelease ? -1 : a.prerelease > b.prerelease ? 1 : 0
  }
  
  return 0
}

/**
 * Parse a version range string
 */
export function parseRange(range: string): ParsedRange[] {
  const ranges: ParsedRange[] = []
  
  // Split on spaces for multiple conditions (AND)
  const parts = range.trim().split(/\s+/)
  
  for (const part of parts) {
    // Check for range operators
    const match = part.match(/^([><=^~]*)(.+)$/)
    if (!match) continue
    
    let operator: RangeOperator = "="
    const op = match[1] || "="
    
    switch (op) {
      case ">=": operator = ">="; break
      case ">": operator = ">"; break
      case "<=": operator = "<="; break
      case "<": operator = "<"; break
      case "^": operator = "^"; break
      case "~": operator = "~"; break
      default: operator = "="; break
    }
    
    try {
      ranges.push({
        operator,
        version: parseVersion(match[2]),
      })
    } catch {
      // Skip invalid versions
    }
  }
  
  return ranges
}

/**
 * Check if a version satisfies a single range condition
 */
function satisfiesCondition(version: ParsedVersion, condition: ParsedRange): boolean {
  const cmp = compareVersions(version, condition.version)
  
  switch (condition.operator) {
    case "=":
      return cmp === 0
    case ">":
      return cmp > 0
    case ">=":
      return cmp >= 0
    case "<":
      return cmp < 0
    case "<=":
      return cmp <= 0
    case "^":
      // Compatible with version (major must match, minor/patch can be higher)
      if (condition.version.major === 0) {
        // For 0.x.x, minor must match
        return (
          version.major === condition.version.major &&
          version.minor === condition.version.minor &&
          version.patch >= condition.version.patch
        )
      }
      return (
        version.major === condition.version.major &&
        (version.minor > condition.version.minor ||
          (version.minor === condition.version.minor &&
            version.patch >= condition.version.patch))
      )
    case "~":
      // Approximately equivalent (patch-level changes allowed)
      return (
        version.major === condition.version.major &&
        version.minor === condition.version.minor &&
        version.patch >= condition.version.patch
      )
    default:
      return false
  }
}

/**
 * Check if a version satisfies a range
 */
export function satisfiesRange(version: string, range: VersionRange): boolean {
  try {
    const parsed = parseVersion(version)
    const conditions = parseRange(range)
    
    // All conditions must be satisfied (AND logic)
    return conditions.every((condition) => satisfiesCondition(parsed, condition))
  } catch {
    return false
  }
}

/**
 * Version Negotiator class
 */
export class VersionNegotiator {
  private versionFeatures: Map<CLILibrary, VersionFeatureMap[]> = new Map()
  private shimRegistry: Map<string, string[]> = new Map()

  constructor() {
    // Initialize with default feature maps
    this.initializeDefaultFeatures()
  }

  /**
   * Initialize default feature maps for supported libraries
   */
  private initializeDefaultFeatures(): void {
    // Ink v6.x features
    this.versionFeatures.set("ink", [
      {
        version: "6.6.0",
        features: [
          "useInput",
          "useStdin",
          "useStdout",
          "useFocus",
          "flexbox",
          "colors16",
          "colors256",
          "unicode",
          "boxDrawing",
        ],
      },
      {
        version: "6.7.0",
        features: [
          "useInput",
          "useStdin",
          "useStdout",
          "useFocus",
          "useFocusManager",
          "measureElement",
          "flexbox",
          "colors16",
          "colors256",
          "trueColor",
          "unicode",
          "boxDrawing",
        ],
      },
      {
        version: "6.8.0",
        features: [
          "useInput",
          "useStdin",
          "useStdout",
          "useFocus",
          "useFocusManager",
          "measureElement",
          "staticOutput",
          "flexbox",
          "colors16",
          "colors256",
          "trueColor",
          "unicode",
          "mouse",
          "boxDrawing",
        ],
      },
    ])

    // Pastel v4.x features (future)
    this.versionFeatures.set("pastel", [
      {
        version: "4.0.0",
        features: [
          "useInput",
          "flexbox",
          "colors16",
          "colors256",
          "trueColor",
          "unicode",
          "boxDrawing",
        ],
      },
    ])
  }

  /**
   * Register feature support for a library version
   */
  registerVersion(library: CLILibrary, version: string, features: CLIFeature[]): void {
    const existing = this.versionFeatures.get(library) || []
    const versionIndex = existing.findIndex((v) => v.version === version)
    
    if (versionIndex >= 0) {
      existing[versionIndex] = { version, features }
    } else {
      existing.push({ version, features })
      // Sort by version
      existing.sort((a, b) => compareVersions(parseVersion(a.version), parseVersion(b.version)))
    }
    
    this.versionFeatures.set(library, existing)
  }

  /**
   * Register shims needed for version compatibility
   */
  registerShim(fromVersion: string, toVersion: string, shims: string[]): void {
    const key = `${fromVersion}->${toVersion}`
    this.shimRegistry.set(key, shims)
  }

  /**
   * Negotiate the best compatible version
   */
  negotiate(
    library: CLILibrary,
    requestedRange: VersionRange,
    availableVersion: string
  ): VersionCompatibility {
    const warnings: string[] = []
    const requiredShims: string[] = []
    const missingFeatures: CLIFeature[] = []

    // Check if available version satisfies the requested range
    const compatible = satisfiesRange(availableVersion, requestedRange)

    if (!compatible) {
      // Try to find what shims might help
      const requestedParsed = parseRange(requestedRange)
      if (requestedParsed.length > 0) {
        const requestedVersion = `${requestedParsed[0].version.major}.${requestedParsed[0].version.minor}.${requestedParsed[0].version.patch}`
        const shimKey = `${requestedVersion}->${availableVersion}`
        const shims = this.shimRegistry.get(shimKey)
        if (shims) {
          requiredShims.push(...shims)
          warnings.push(`Version mismatch: requested ${requestedRange}, available ${availableVersion}. Shims may help.`)
        } else {
          warnings.push(`Version mismatch: requested ${requestedRange}, available ${availableVersion}. No shims available.`)
        }
      }
    }

    // Check for missing features
    const libraryVersions = this.versionFeatures.get(library) || []
    const requestedFeatures = this.getFeaturesForVersionInternal(libraryVersions, requestedRange)
    const availableFeatures = this.getFeaturesForVersionInternal(libraryVersions, availableVersion)

    for (const feature of requestedFeatures) {
      if (!availableFeatures.includes(feature)) {
        missingFeatures.push(feature)
      }
    }

    if (missingFeatures.length > 0) {
      warnings.push(`Missing features in ${availableVersion}: ${missingFeatures.join(", ")}`)
    }

    return {
      compatible,
      negotiatedVersion: availableVersion,
      warnings: warnings.length > 0 ? warnings : undefined,
      requiredShims: requiredShims.length > 0 ? requiredShims : undefined,
      missingFeatures: missingFeatures.length > 0 ? missingFeatures : undefined,
    }
  }

  /**
   * Get features for a specific version
   */
  private getFeaturesForVersionInternal(
    versions: VersionFeatureMap[],
    versionOrRange: string
  ): CLIFeature[] {
    // Find the best matching version
    for (let i = versions.length - 1; i >= 0; i--) {
      if (satisfiesRange(versions[i].version, versionOrRange)) {
        return versions[i].features
      }
    }
    
    // If no exact match, return features from the highest compatible version
    for (let i = versions.length - 1; i >= 0; i--) {
      try {
        const vParsed = parseVersion(versions[i].version)
        const ranges = parseRange(versionOrRange)
        if (ranges.length > 0) {
          const cmp = compareVersions(vParsed, ranges[0].version)
          if (cmp >= 0) {
            return versions[i].features
          }
        }
      } catch {
        continue
      }
    }
    
    return []
  }

  /**
   * Get features available for a library at a specific version
   */
  getFeaturesForVersion(library: CLILibrary, version: string): CLIFeature[] {
    const versions = this.versionFeatures.get(library) || []
    return this.getFeaturesForVersionInternal(versions, version)
  }

  /**
   * Check if a feature is available for a library at a specific version
   */
  isFeatureAvailable(library: CLILibrary, version: string, feature: CLIFeature): boolean {
    const features = this.getFeaturesForVersion(library, version)
    return features.includes(feature)
  }

  /**
   * Get required shims for version gap
   */
  getRequiredShims(fromVersion: string, toVersion: string): string[] {
    const key = `${fromVersion}->${toVersion}`
    return this.shimRegistry.get(key) || []
  }

  /**
   * Get all registered versions for a library
   */
  getRegisteredVersions(library: CLILibrary): string[] {
    const versions = this.versionFeatures.get(library) || []
    return versions.map((v) => v.version)
  }
}

// Export singleton instance
export const versionNegotiator = new VersionNegotiator()

// Export utility functions
export { parseVersion, compareVersions, satisfiesRange }
