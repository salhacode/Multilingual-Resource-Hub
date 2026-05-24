import { Pool } from 'pg'

const connectionString =
  process.env.DATABASE_URL ?? 'postgresql://postgres:postgres@localhost:5432/resource_hub'

const pool = new Pool({
  connectionString,
})

export default pool
