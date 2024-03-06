#!/usr/bin/env bash
set -euo pipefail
IFS=$'\n\t'

function get_baseline () {
  autocannon -c 20 -a 5000 --json \
    --title "baseline" \
    http://localhost:8000/images/photo-1534534573898-db5148bc8b0c.jpeg \
    http://localhost:8000/images/photo-1483389127117-b6a2102724ae.jpeg \
    http://localhost:8000/images/photo-1481114070102-72f9d11057dc.jpeg \
    http://localhost:8000/images/photo-1536323760109-ca8c07450053.jpeg \
    http://localhost:8000/images/photo-1517971053567-8bde93bc6a58.jpeg \
    http://localhost:8000/images/photo-1454165804606-c3d57bc86b40.jpeg \
    http://localhost:8000/images/photo-1551038247-3d9af20df552.jpeg \
    http://localhost:8000/images/photo-1575318634028-6a0cfcb60c59.jpeg \
    http://localhost:8000/images/photo-1495985812444-236d6a87bdd9.jpeg \
    http://localhost:8000/images/photo-1623192095456-bdc1aee26add.jpeg \
    http://localhost:8000/images/photo-1552581234-26160f608093.jpeg \
    http://localhost:8000/images/photo-1512486130939-2c4f79935e4f.jpeg \
    http://localhost:8000/images/photo-1531538606174-0f90ff5dce83.jpeg \
    http://localhost:8000/images/photo-1513804277545-af322c6d7f44.jpeg \
    http://localhost:8000/images/photo-1528759094033-e86a2379be5f.jpeg \
    http://localhost:8000/images/photo-1528297506728-9533d2ac3fa4.jpeg
}

get_baseline

