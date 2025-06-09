export const zodErrorFormatter = (path: string[]) => {
  const field = path[path.length - 1]
  return field
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (l) => l.toUpperCase()) // capitalize
}
