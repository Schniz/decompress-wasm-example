import { NextResponse } from "next/server";

export const config = { runtime: "edge" };

export default async (req) => {
  console.log([...req.headers]);
  const url = new URL("/api/gzipped", req.nextUrl);

  return NextResponse.json({
    "contains Hello World when header exists": await fetch(url)
      .then((r) => r.text())
      .then((text) => text.includes("Hello World")),
    "contains Hello World when header missing": await fetch(url, {
      headers: { "x-no-encoding-header": "1" },
    })
      .then((r) => r.text())
      .then((text) => text.includes("Hello World")),
  });
};
