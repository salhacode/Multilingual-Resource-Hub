import { readFile, readdir } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import pool from '../db/pool.js'

const currentDirectory = dirname(fileURLToPath(import.meta.url))
const migrationsDirectory = join(currentDirectory, '..', 'db', 'migrations')

async function runMigrations() {
  const files = await readdir(migrationsDirectory)
  const sqlFiles = files.filter((file) => file.endsWith('.sql')).sort()

  if (sqlFiles.length === 0) {
    console.log('No migration files found.')
    return
  }

  for (const file of sqlFiles) {
    const filePath = join(migrationsDirectory, file)
    const sql = await readFile(filePath, 'utf-8')
    await pool.query(sql)
    console.log(`Applied migration: ${file}`)
  }
}

runMigrations()
  .then(async () => {
    await pool.end()
    console.log('Migrations completed successfully.')
  })
  .catch(async (error) => {
    await pool.end()
    console.error('Migration failed:', error.message)
    process.exit(1)
  })
