# Node.js Streaming Proxy

## Description

This is a **reference quality** streaming proxy server that can be used to proxy content from a source URL to the browser.

It is written in TypeScript and uses Express.js as the web server.

```sh
npm i
npm start
```

## Overview

This project solves a common & poorly documented challenge: **using node.js to stream media from a (hidden) source URL to a browser or native clients.**

### The Scenario

Let's say we have an e-commerce site with **10's of millions of products.** Each product may have **up to 100 photos.** Bottom line: we need to **support a BILLION+ photos!**

Every week 80% of all **primary** photos are requested.
The vast majority of those 'additional' photos are rarely requested. Who really looks at the 88th photo of a product?

We need a streaming image proxy, that meets the following requirements:

### Requirements

- ✅ **Streaming** - For minimal memory usage.
- ✅ **Dynamic Resizing, Quality & Format** - To reduce client data over the wire.
- ✅ **Dynamic Buffering** - Optimize server load given many tiny reqs.
- ✅ Hide source URL details (protect vendor or partner names.)
- 💪 ~~Excellent~~ Better coding patterns!
- ❌ No sync/cron jobs.
- ❌ On-demand.
- ❌ No long-term caching. Avoid stale data.
- ❌ No need to store images locally.

### Ideas

A list of related things I've worked on previously - some might just might make sense to include in this project.

- [x] Few files.
- [x] Minimal dependencies.
- [ ] Image filters?
- [ ] Watermark?
- [ ] Credit?
- [ ] EXIF scrubbing?
- [ ] [Benchmarks.](#benchmarks)
- [ ] Video streaming? Byte chunking?
- [ ] Text streaming? (support for ChatGPT or similar services)?

### API Endpoints

- `/img/:product_id/:photo_index`
- `/img/:product_id/:photo_index/:resize`

### Example

- `/img/42/1` - returns the first image for product 42.
- `/img/42/1/200x200` - returns the first image for product 42 resized to 200x200.
- `/img/614/3` - returns the third image for product 614.
- `/img/614/3/50%` - returns the third image for product 614 resized to 50% of the original size.
- `/img/614/3/200w` - returns the third image for product 614 resized to 200 pixels wide.

## Notes

### Supporting Data

The following is a sample of the data that is used to support the API.

It's okay if you store your photos slightly differently, for example in a JSONB or Array column.
Only minor adjustments would be needed in the [ProductsApi](src/productsApi.ts) module.

> Two products with 2 and 5 images respectively.

| product_id | media_rank | url                    |
| ---------- | ---------- | ---------------------- |
| 42         | 1          | https://picsum.photos/1024 |
| 42         | 2          | https://picsum.photos/1024 |
| 614        | 1          | https://picsum.photos/1024 |
| 614        | 2          | https://picsum.photos/1024 |
| 614        | 3          | https://picsum.photos/1024 |
| 614        | 4          | https://picsum.photos/1024 |
| 614        | 5          | https://picsum.photos/1024 |

### Testing

<!-- 
To simulate slow networks, you can use the `throttle` package.

```sh
npm install throttle
```

```ts
import * as Throttle from 'throttle'
const maxSpeedInMBs = 0.5
const throttle = new Throttle(1024 * 1024 * maxSpeedInMBs) // throttle to 0.5MB/sec

// instead of returning the readStream directly,
return readStream.pipe(throttle)
``` 
-->

#### CLI Testing

```sh
curl -v http://localhost:3000/img/42/1
curl -v http://localhost:3000/img/42/1/200x200
curl -v http://localhost:3000/img/614/3
curl -v http://localhost:3000/img/614/3/50w
```

### Benchmarks

#### [TL;DR Show Results](#results-un-buffered)

First, start the server with logging disabled.

```sh
DISABLE_LOGGING=true npm run start
```

Next, use your favorite benchmarking tool to hammer away at your service.

> HTTP Benchmarking tools: [ab](https://httpd.apache.org/docs/2.4/programs/ab.html), [wrk](https://github.com/wg/wrk), [autocannon](https://github.com/mcollina/autocannon), [siege](https://www.joedog.org/siege-home/), [hey](https://github.com/rakyll/hey).

```sh
ab -n 1000 -c 100 http://localhost:3000/img/42/1
autocannon -c 100 -d 5 -p 10 http://localhost:3000/img/42/1/500x500
wrk -t12 -c400 -d30s http://localhost:3000/img/42/1
siege -c 100 -t 30s http://localhost:3000/img/42/1/200x200
hey -n 1000 -c 100 http://localhost:3000/img/42/1/1024w
```

#### Results: Un-buffered

_Note:_ Testing on a 2022 MacBook Air, M2, 24GB RAM.

When source images are [600px](https://picsum.photos/600) converting to `500px`, we can hit 80/reqs/sec.

```sh
ab -n 1000 -c 100 http://localhost:3000/img/614/3/500
# ...

Server Hostname:        localhost
Server Port:            3000

Document Path:          /img/614/3/500
Document Length:        17769 bytes

Concurrency Level:      100
Time taken for tests:   12.481 seconds
Complete requests:      1000
Failed requests:        996
   (Connect: 0, Receive: 0, Length: 996, Exceptions: 0)
Non-2xx responses:      3
Total transferred:      22338882 bytes
HTML transferred:       21483567 bytes
Requests per second:    80.12 [#/sec] (mean)
Time per request:       1248.060 [ms] (mean)
Time per request:       12.481 [ms] (mean, across all concurrent requests)
Transfer rate:          1747.94 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        4   58  94.2     27     563
Processing:   363 1033 248.0    991    2044
Waiting:      363  995 243.6    955    2022
Total:        430 1091 266.3   1037    2119

Percentage of the requests served within a certain time (ms)
  50%   1037
  66%   1202
  75%   1270
  80%   1320
  90%   1437
  95%   1553
  98%   1691
  99%   1780
 100%   2119 (longest request)
```

#### Results: Down-scaling to 150px

> Using source sizes of `1200px` and output at `150px`:

```bash
❯ ab -n 1000 -c 100 http://localhost:3000/img/614/3/150
# ...

Server Software:
Server Hostname:        localhost
Server Port:            3000

Document Path:          /img/614/3/150
Document Length:        5506 bytes

Concurrency Level:      100
Time taken for tests:   11.959 seconds
Complete requests:      1000
Failed requests:        998
   (Connect: 0, Receive: 0, Length: 998, Exceptions: 0)
Total transferred:      5878955 bytes
HTML transferred:       5023955 bytes
Requests per second:    83.62 [#/sec] (mean)
Time per request:       1195.900 [ms] (mean)
Time per request:       11.959 [ms] (mean, across all concurrent requests)
Transfer rate:          480.07 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        3   30  60.3     12     399
Processing:   623 1013 252.4    952    1993
Waiting:      615 1003 250.3    943    1969
Total:        640 1043 278.9    968    2119

Percentage of the requests served within a certain time (ms)
  50%    968
  66%   1068
  75%   1144
  80%   1196
  90%   1412
  95%   1707
  98%   1900
  99%   2019
 100%   2119 (longest request)
```
