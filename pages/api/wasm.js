// @ts-check

// @ts-ignore
import wasm from "../../vendor/compressor/pkg/compressor_bg.wasm?module";
import initCompressor, { gunzip } from "../../vendor/compressor/pkg/compressor";
import { NextResponse } from "next/server";

const compressor$ = initCompressor(wasm);

export const config = { runtime: "edge" };

export default async (req) => {
  await compressor$;

  const url = new URL("/api/gzipped", req.nextUrl);
  const uncompressedData = await fetch(url, {
    headers: { "x-no-encoding-header": "1" },
  }).then((r) => r.arrayBuffer());

  const value = gunzip(new Uint8Array(uncompressedData));

  return NextResponse.json({
    beforeSize: uncompressedData.byteLength,
    afterSize: value.length,
    "after: 100 first bytes": value.slice(0, 100),
  });
};
