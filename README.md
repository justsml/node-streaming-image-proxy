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

- [ ] Excellent coding patterns!
- [ ] Dynamic resizing!
- [ ] Few files.
- [ ] Minimal dependencies.
- [ ] Benchmarks.
- [ ] Video support.
- [ ] Text streaming (support for ChatGPT or similar services).

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

- `/img/:product_id/:rank`
- `/img/:product_id/:rank/:resize`

### Example

- `/img/42/1` - returns the first image for product 42.
- `/img/42/1/200x200` - returns the first image for product 42 resized to 200x200.
- `/img/614/3` - returns the third image for product 614.
- `/img/614/3/50%` - returns the third image for product 614 resized to 50% of the original size.
- `/img/614/3/200w` - returns the third image for product 614 resized to 200 pixels wide.

The server is designed to be as simple as possible. It uses the `http` and `https` modules to proxy requests to the source URL. It uses the `range` header to support streaming and the `content-type` header to support video playback.