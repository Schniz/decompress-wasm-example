// @ts-check

// @ts-ignore
import wasm from "../../vendor/compressor/pkg/compressor_bg.wasm?module";
import initCompressor, {
  gunzip_stream,
} from "../../vendor/compressor/pkg/compressor";

const compressor$ = initCompressor(wasm);

export const config = { runtime: "edge" };

export default async (req) => {
  await compressor$;

  const url = new URL("/api/gzipped", req.nextUrl);
  const uncompressedData = await fetch(url, {
    headers: { "x-no-encoding-header": "1" },
  });

  const value = gunzip_stream(uncompressedData.body);
  return new Response(value);
};
