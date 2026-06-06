// Eagerly import every logo so entries can reference one by key (the filename
// without extension). Drop new files into these folders and they resolve
// automatically — no manual import needed.
const companyFiles = import.meta.glob('../assets/companies/*.{png,jpg,jpeg,svg,webp,avif}', {
  eager: true,
  import: 'default',
}) as Record<string, string>

const projectFiles = import.meta.glob('../assets/projects/*.{png,jpg,jpeg,svg,webp,avif}', {
  eager: true,
  import: 'default',
}) as Record<string, string>

function index(files: Record<string, string>): Record<string, string> {
  const out: Record<string, string> = {}
  for (const [path, url] of Object.entries(files)) {
    const key = path.split('/').pop()!.replace(/\.[^.]+$/, '')
    out[key] = url
  }
  return out
}

const companies = index(companyFiles)
const projects = index(projectFiles)

export function companyLogo(key: string): string | undefined {
  return companies[key]
}

export function projectLogo(key: string): string | undefined {
  return projects[key]
}
