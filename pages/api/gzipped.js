import { createGzip } from "zlib";

export default (req, res) => {
  const gzip = createGzip();
  if (req.headers["x-no-encoding-header"] !== "1") {
    res.setHeader("Content-Encoding", "gzip");
  }
  res.setHeader("Content-Type", "text/plain");

  console.log("req", req.headers, "res", res.headers);

  gzip.pipe(res);

  for (let i = 0; i < 100; i++) {
    gzip.write("Hello World\n");
  }

  gzip.end();
};
