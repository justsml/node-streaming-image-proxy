import Database from 'libsql'

export type Database = ReturnType<typeof Database>;

/**
 * A dummy local DB for testing
 */
export function connectDb(): Database {
  const db = new Database(':memory:')
  // db.pragma('journal_mode = WAL'); // Use when on disk

  db.exec(
    'CREATE TABLE product_photos (product_id INTEGER, media_rank INTEGER, url TEXT)',
  )

  const insertCmd = db.prepare(
    'INSERT INTO product_photos VALUES (:product_id, :media_rank, :url)',
  )

  seedPhotos.map((productImg) => {
    insertCmd.run({...productImg, url: `https://picsum.photos/400`})
  })

  console.debug('Database loaded & initialized')

  return db
}

const seedPhotos = [
  { product_id: 42, media_rank: 1, url: 'https://example.com/900/1' },
  { product_id: 42, media_rank: 2, url: 'https://example.com/900/2' },
  { product_id: 614, media_rank: 1, url: 'https://acme.example.com/614/1' },
  { product_id: 614, media_rank: 2, url: 'https://acme.example.com/614/2' },
  { product_id: 614, media_rank: 3, url: 'https://acme.example.com/614/3' },
  { product_id: 614, media_rank: 4, url: 'https://acme.example.com/614/4' },
  { product_id: 614, media_rank: 5, url: 'https://acme.example.com/614/5' },
]
