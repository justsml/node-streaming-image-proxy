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
  db.exec(
    'CREATE INDEX product_photos_product_id ON product_photos (product_id)',
  )

  const insertCmd = db.prepare(
    'INSERT INTO product_photos VALUES (:product_id, :media_rank, :url)',
  )

  seedPhotos.map((productImg) => {
    insertCmd.run(productImg)
  })

  return db
}

const seedPhotos = [
  {
    product_id: 42,
    media_rank: 1,
    url: 'http://localhost:8000/images/photo-1534534573898-db5148bc8b0c.jpeg',
  },
  {
    product_id: 42,
    media_rank: 2,
    url: 'http://localhost:8000/images/photo-1483389127117-b6a2102724ae.jpeg',
  },
  {
    product_id: 614,
    media_rank: 1,
    url: 'http://localhost:8000/images/photo-1481114070102-72f9d11057dc.jpeg',
  },
  {
    product_id: 614,
    media_rank: 2,
    url: 'http://localhost:8000/images/photo-1536323760109-ca8c07450053.jpeg',
  },
  {
    product_id: 614,
    media_rank: 3,
    url: 'http://localhost:8000/images/photo-1517971053567-8bde93bc6a58.jpeg',
  },
  {
    product_id: 614,
    media_rank: 4,
    url: 'http://localhost:8000/images/photo-1454165804606-c3d57bc86b40.jpeg',
  },
  {
    product_id: 614,
    media_rank: 5,
    url: 'http://localhost:8000/images/photo-1551038247-3d9af20df552.jpeg',
  },
  {
    product_id: 314,
    media_rank: 1,
    url: 'http://localhost:8000/images/photo-1575318634028-6a0cfcb60c59.jpeg',
  },
  {
    product_id: 314,
    media_rank: 2,
    url: 'http://localhost:8000/images/photo-1495985812444-236d6a87bdd9.jpeg',
  },
  {
    product_id: 314,
    media_rank: 3,
    url: 'http://localhost:8000/images/photo-1623192095456-bdc1aee26add.jpeg',
  },
  {
    product_id: 314,
    media_rank: 4,
    url: 'http://localhost:8000/images/photo-1552581234-26160f608093.jpeg',
  },
  {
    product_id: 314,
    media_rank: 5,
    url: 'http://localhost:8000/images/photo-1512486130939-2c4f79935e4f.jpeg',
  },
  {
    product_id: 314,
    media_rank: 6,
    url: 'http://localhost:8000/images/photo-1531538606174-0f90ff5dce83.jpeg',
  },
  {
    product_id: 314,
    media_rank: 7,
    url: 'http://localhost:8000/images/photo-1513804277545-af322c6d7f44.jpeg',
  },
  {
    product_id: 314,
    media_rank: 8,
    url: 'http://localhost:8000/images/photo-1528759094033-e86a2379be5f.jpeg',
  },
  {
    product_id: 314,
    media_rank: 9,
    url: 'http://localhost:8000/images/photo-1528297506728-9533d2ac3fa4.jpeg',
  },
]
