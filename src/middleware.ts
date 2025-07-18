/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type NextRequest, NextResponse } from "next/server";
import { type InferSelectModel } from "drizzle-orm";
import { type profiles } from "./server/db/schema";

type Profile = InferSelectModel<typeof profiles>;

export const config = {
  matcher: [
    "/((?!api/|_next/|_static/|_vercel|icons|images|[\\w-]+\\.\\w+).*)",
    "/"
  ]
};

export default async function middleware(req: NextRequest) {
  // console.log("runing middleware")
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
  const hostname = req.headers.get("host");
  // console.log(hostname)
  // const reqPathName = req.nextUrl.pathname;
  const url = req.nextUrl;

  const hostedDomain = process.env.NEXT_PUBLIC_BASE_URL?.replace(
    /http:\/\/|https:\/\//,
    "",
  ) || "localhost:3000";

  const hostedDomains = [hostedDomain, `www.${hostedDomain}`];
  // special case for Vercel preview deployment URLs
  // if (
    
  //   hostname.endsWith(`${process.env.NEXT_PUBLIC_VERCEL_DEPLOYMENT_SUFFIX}`)
  // ) {
  //   hostname = `${hostname.split("---")[0]}.${
  //     process.env.NEXT_PUBLIC_ROOT_DOMAIN
  //   }`;
  // }

  const searchParams = req.nextUrl.searchParams.toString();
  // Get the pathname of the request (e.g. /, /about, /blog/first-post)
  const path = `${url.pathname}${
    searchParams.length > 0 ? `?${searchParams}` : ""
  }`;

  // rewrites for app pages
  // if (hostname == `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) {
  //   // const session = await getToken({ req });
  //   // if (!session && path !== "/login") {
  //   //   return NextResponse.redirect(new URL("/login", req.url));
  //   // } else if (session && path == "/login") {
  //   //   return NextResponse.redirect(new URL("/", req.url));
  //   // }
  //   console.log("ran 1")
  //   return NextResponse.rewrite(
  //     // new URL(`/app${path === "/" ? "" : path}`, req.url),
  //     new URL(`${path === "/" ? `/${hostname}` : path}`, req.url),
  //   );
  // }
  // For development, always allow localhost and main domain
  if(hostname == `localhost:3000` || hostname == process.env.NEXT_PUBLIC_ROOT_DOMAIN || hostname == `www.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}` || hostname?.includes('localhost')){
    // console.log("public url")
    return NextResponse.next();
  } 

  // For custom domains, we would handle domain routing here
  // For now, just pass through during development
  return NextResponse.next();

  // return NextResponse.next();
} 