export const DEFAULT_HUNK_REPO_PATH = "/home/tyrellshawn/Github/vendor/hunk"

export const HUNK_SOURCE_FILES = [
  "src/opentui/HunkDiffView.tsx",
  "src/opentui/HunkReviewStream.tsx",
  "src/opentui/HunkDiffBody.tsx",
  "src/opentui/HunkFileNav.tsx",
  "src/opentui/HunkDiffFileHeader.tsx",
  "src/opentui/model.ts",
  "src/opentui/types.ts",
] as const

export function resolveHunkFilePath(repoPath: string, relative: string) {
  return `${repoPath}/${relative}`
}

export function resolveAllHunkFiles(repoPath: string = DEFAULT_HUNK_REPO_PATH) {
  return HUNK_SOURCE_FILES.map((f) => ({
    relative: f,
    absolute: resolveHunkFilePath(repoPath, f),
  }))
}
