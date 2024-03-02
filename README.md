# Node.js Streaming Proxy

## Description

This is a **reference quality** streaming proxy server that can be used to proxy content from a source URL to the browser.

It is written in TypeScript and uses Express.js as the web server.

```sh
npm i
npm start
```

## Design

Let's say we have an e-commerce site with **10's of millions of products.** Each product may have **up to 100 photos.** Bottom line: we need to support a BILLION+ photos!

We don't want to store all of these photos on our server. Instead, we want to lookup the desired URL in our DB & start streaming the image from the server to the browser. Which has a bonus effect of hiding any vendor or partner names from source URLs.

- [x] ~~Excellent~~ Better coding patterns!
- [x] Dynamic resizing!
- [ ] Dynamic buffering!
- [x] Few files.
- [x] Minimal dependencies.
- [ ] [Benchmarks.](#benchmarks)
- [ ] Video streaming? Byte chunking?
- [ ] Text streaming (support for ChatGPT or similar services)?

### Supporting Data

> Two products with 2 and 5 images respectively.

| product_id | media_rank | url |
|------------|------------|-----|
| 42        | 1  | example.com/900/1 |
| 42        | 2  | example.com/900/2 |
| 614       | 1  | acme.example.com/614/1 |
| 614       | 2  | acme.example.com/614/2 |
| 614       | 3  | acme.example.com/614/3 |
| 614       | 4  | acme.example.com/614/4 |
| 614       | 5  | acme.example.com/614/5 |

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

### Testing

To simulate slow networks, you can use the `throttle` package.

```sh
npm install throttle
```

```ts
import * as Throttle from 'throttle';
const maxSpeedInMBs = 0.5;
const throttle = new Throttle(1024 * 1024 * maxSpeedInMBs); // throttle to 0.5MB/sec

// instead of returning the readStream directly,
return readStream.pipe(throttle);
```

#### CLI Testing

```sh
curl -v http://localhost:3000/img/42/1
curl -v http://localhost:3000/img/42/1/200x200
curl -v http://localhost:3000/img/614/3
curl -v http://localhost:3000/img/614/3/50w
```

### Benchmarks

Test using your favorite benchmarking tool: [ab](https://httpd.apache.org/docs/2.4/programs/ab.html), [wrk](https://github.com/wg/wrk), [autocannon](https://github.com/mcollina/autocannon), [siege](https://www.joedog.org/siege-home/), [hey](https://github.com/rakyll/hey).

```sh
ab -n 1000 -c 100 http://localhost:3000/img/42/1
autocannon -c 100 -d 5 -p 10 http://localhost:3000/img/42/1/500x500
wrk -t12 -c400 -d30s http://localhost:3000/img/42/1
siege -c 100 -t 30s http://localhost:3000/img/42/1/200x200
hey -n 1000 -c 100 http://localhost:3000/img/42/1/1024w
```

#### Results: Un-buffered

Using a 2022 MacBook Air, M2 chip, 24GB RAM.

When source images are limited to [600px](https://picsum.photos/600) we can hit 80/reqs/sec.

If the image size doubles to [1200px](https://picsum.photos/1200), the throughput drops to roughly 26-30/reqs/sec.

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

#### Downscaling Results

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
