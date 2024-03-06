#!/usr/bin/env bash

# MacBook Air M2 2022

./load-test.sh --mode benchmark \
  --title 'Node20: Stream Only, No Resize' \
  > results/mac-air-m2-2022/node20-api-image-stream-no-resize.json

./load-test.sh --mode benchmark \
  --size 200w \
  --title 'Node20: Resize 200w' \
  > results/mac-air-m2-2022/node20-api-image-stream-200w.json

./load-test.sh --mode benchmark \
  --size 200w \
  --title 'Node20: Resize 200w 80q' --quality 80 \
  > results/mac-air-m2-2022/node20-api-image-stream-200w-80q.json

./load-test.sh --mode benchmark \
  --size 600w \
  --title 'Node20: Resize 600w' \
  > results/mac-air-m2-2022/node20-api-image-stream-600w.json

./load-test.sh --mode benchmark \
  --size 600w \
  --title 'Node20: Resize 600w 80q' --quality 80 \
  > results/mac-air-m2-2022/node20-api-image-stream-600w-80q.json

./load-test.sh --mode benchmark \
  --size 1200w \
  --title 'Node20: Resize 1200w' \
  > results/mac-air-m2-2022/node20-api-image-stream-1200w.json

./load-test.sh --mode benchmark \
  --size 1200w \
  --title 'Node20: Resize 1200w 80q' --quality 80 \
  > results/mac-air-m2-2022/node20-api-image-stream-1200w-80q.json



./load-test.sh --mode benchmark \
  --size 200w \
  --title 'Node20: Resize 200w 80q webp' --quality 80 --format webp \
  > results/mac-air-m2-2022/node20-api-image-stream-200w-80q-webp.json

./load-test.sh --mode benchmark \
  --size 600w \
  --title 'Node20: Resize 600w 80q webp' --quality 80 --format webp \
  > results/mac-air-m2-2022/node20-api-image-stream-600w-80q-webp.json

./load-test.sh --mode benchmark \
  --size 1200w \
  --title 'Node20: Resize 1200w 80q webp' --quality 80 --format webp \
  > results/mac-air-m2-2022/node20-api-image-stream-1200w-80q-webp.json
