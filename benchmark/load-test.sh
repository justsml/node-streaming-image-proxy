#!/usr/bin/env bash
set -euo pipefail
IFS=$'\n\t'

# Script to load test the API

# Usage
# ./load-test.sh <command> <title>

title="Image API"
mode=""
size=""
quality=""
format=""

function usage () {
  echo "Usage: ./load-test.sh --size <size> --title <title> --quality <quality> --format <format>"
  
  echo "Commands:"
  echo "  benchmark: Load test the API"
  echo "  baseline: Get baseline for the API"

  echo "Options:"
  echo "  --size: Size of the image"
  echo "  --title: Title of the test"
  echo "  --quality: Quality of the image"
  echo "  --format: Format of the image"
  
  echo "Example:"

  echo "  ./load-test.sh baseline"
  echo "  ./load-test.sh benchmark --size 200w --title 'Resize 200w'"
  echo "  ./load-test.sh benchmark --size 500w --quality 70 --title 'Resize 500w, Quality 70'"
  echo "  ./load-test.sh benchmark --size 500w --quality 70 --format webp --title 'Resize 500w, Quality 70, Format webp'"

  exit 1
}

function benchmark_api() {
  resize="$(get_api_url_suffix)"
  autocannon -c 20 -a 5000 --json \
    --title "$title" \
    "http://localhost:3000/img/314/1/$resize" \
    "http://localhost:3000/img/314/2/$resize" \
    "http://localhost:3000/img/314/3/$resize" \
    "http://localhost:3000/img/314/4/$resize" \
    "http://localhost:3000/img/314/5/$resize" \
    "http://localhost:3000/img/314/6/$resize" \
    "http://localhost:3000/img/314/7/$resize" \
    "http://localhost:3000/img/314/8/$resize" \
    "http://localhost:3000/img/314/9/$resize" \
    "http://localhost:3000/img/614/1/$resize" \
    "http://localhost:3000/img/614/2/$resize" \
    "http://localhost:3000/img/614/3/$resize" \
    "http://localhost:3000/img/614/4/$resize" \
    "http://localhost:3000/img/614/5/$resize" \
    "http://localhost:3000/img/42/1/$resize" \
    "http://localhost:3000/img/42/2/$resize"
}


function get_api_url_suffix () {
  suffix=""
  if [[ -n "$size" ]]; then
    suffix="$suffix$size"
  fi
  if [[ -n "$quality" && -n "$format" ]]; then
    echo "$suffix?quality=$quality&format=$format"
  elif [[ -n "$quality" ]]; then
    echo "$suffix?quality=$quality"
  elif [[ -n "$format" ]]; then
    echo "$suffix?format=$format"
  else
    echo "$suffix"
  fi
}




# Parse command line arguments
while [[ $# -gt 0 ]]; do
  case "$1" in
    --mode)
      mode=${2:-"benchmark"}
      shift 2
      ;;
    --size)
      size=$2
      shift 2
      ;;
    --title)
      title=$2
      shift 2
      ;;
    --quality)
      quality=$2
      shift 2
      ;;
    --format)
      format=$2
      shift 2
      ;;
    *)
      usage
      ;;
  esac
done

benchmark_api
