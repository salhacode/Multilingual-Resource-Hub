import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { Pool } from 'pg'

// Load the single repo-root `.env` without requiring `node --env-file` (no extra deps).
const envPath = join(process.cwd(), '.env')
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq <= 0) continue
    const key = trimmed.slice(0, eq).trim()
    let value = trimmed.slice(eq + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    if (process.env[key] === undefined) {
      process.env[key] = value
    }
  }
}

const connectionString =
  process.env.DATABASE_URL ??
  'postgresql://postgres:postgres@127.0.0.1:5432/resource_hub'

// Most hosted Postgres providers (Neon, Supabase, Render, Railway, RDS) require SSL.
// Enable it automatically when the connection points anywhere other than localhost.
const isLocalConnection = /@(localhost|127\.0\.0\.1|::1)[:/]/.test(connectionString)
const needsSsl =
  !isLocalConnection || /sslmode=require/i.test(connectionString)

const pool = new Pool({
  connectionString,
  ssl: needsSsl ? { rejectUnauthorized: false } : false,
})

export default pool
