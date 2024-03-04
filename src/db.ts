import Database from 'libsql'

export type Database = ReturnType<typeof Database>

/**
 * A dummy local DB for testing
 */
export function connectDb(): Database {
  const db = new Database(':memory:')
  // db.pragma('journal_mode = WAL'); // Use when on disk
  seedDb(db)

  console.debug('Database loaded & initialized')

  return db
}

function seedDb(db: Database) {
  db.exec(
    'CREATE TABLE product_photos (product_id INTEGER, media_rank INTEGER, url TEXT)',
  )

  const insertCmd = db.prepare(
    'INSERT INTO product_photos VALUES (:product_id, :media_rank, :url)',
  )

  seedPhotos.map((productImg) => {
    insertCmd.run({ ...productImg })
  })

  return db
}

const seedPhotos = [
  { product_id: 42, media_rank: 1, url: 'https://picsum.photos/1024' },
  { product_id: 42, media_rank: 2, url: 'https://picsum.photos/1024' },
  {
    product_id: 614,
    media_rank: 1,
    url: 'https://source.unsplash.com/random/900x700/?office',
  },
  {
    product_id: 614,
    media_rank: 2,
    url: 'https://source.unsplash.com/random/600x400/?office',
  },
  {
    product_id: 614,
    media_rank: 3,
    url: 'https://source.unsplash.com/random/600x400/?office',
  },
  {
    product_id: 614,
    media_rank: 4,
    url: 'https://source.unsplash.com/random/600x400/?office',
  },
  {
    product_id: 614,
    media_rank: 5,
    url: 'https://source.unsplash.com/random/600x400/?office',
  },
]
