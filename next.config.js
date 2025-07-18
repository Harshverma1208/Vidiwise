/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    workerThreads: false,
  },
  staticPageGenerationTimeout: 1000,
  webpack: (config, { webpack }) => {
    config.plugins.push(
      // mute errors for unused deps and prevent postgres from being bundled in edge runtime
      new webpack.IgnorePlugin({
        resourceRegExp:
          /(^@google-cloud\/spanner|^@mongodb-js\/zstd|^aws-crt|^aws4$|^pg-native$|^mongodb-client-encryption$|^@sap\/hana-client$|^@sap\/hana-client\/extension\/Stream$|^snappy$|^react-native-sqlite-storage$|^bson-ext$|^cardinal$|^kerberos$|^hdb-pool$|^sql.js$|^sqlite3$|^better-sqlite3$|^ioredis$|^typeorm-aurora-data-api-driver$|^pg-query-stream$|^oracledb$|^mysql$|^snappy\/package\.json$|^cloudflare:sockets$|^postgres$|^fs$|^os$)/,
      }),
    );

    config.module = {
      ...config.module,
      exprContextCritical: false,
    };

    // Fallback for problematic modules in edge runtime
    config.resolve = {
      ...config.resolve,
      fallback: {
        ...config.resolve?.fallback,
        fs: false,
        os: false,
        path: false,
        crypto: false,
      },
    };

    return config;
  },
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination:
          "https://www.youtube.com/api/stats/qoe?fmt=397&afmt=251&cpn=CxQ8-K9Z2AxRE_Rq&el=embedded&ns=yt&fexp=v1%2C23983296%2C21348%2C76094%2C54572%2C633%2C72822%2C230596%2C60173%2C24564%2C36318%2C6271%2C26443548%2C7111%2C36343%2C9954%2C1192%2C26496%2C6966%2C2%2C972%2C5717%2C2007%2C9072%2C20075%2C9077%2C2197%2C8588%2C381%2C1026%2C1103%2C21%2C911%2C3275%2C2746%2C101%2C51%2C2606%2C55%2C638%2C8%2C41%2C3%2C288%2C2%2C78%2C2693%2C932%2C9%2C831%2C450%2C177%2C5%2C1966%2C2090&cl=629828258&seq=7&docid=WIeJF3kL5ng&ei=ldE0ZpWtGoSf8QPmmZCwCg&event=streamingstats&plid=AAYXi3MAFCjUsDCK&referrer=https%3A%2F%2Fwww.youtube.com%2Fembed%2FWIeJF3kL5ng&qclc=ChBDeFE4LUs5WjJBeFJFX1JxEAc&cbrand=apple&cbr=Chrome&cbrver=124.0.0.0&c=WEB_EMBEDDED_PLAYER&cver=1.20240430.01.00&cplayer=UNIPLAYER&cos=Macintosh&cosver=10_15_7&cplatform=DESKTOP&bwe=287.547:2078981,291.181:1343635&bat=287.547:0.26:0,291.181:0.26:0&cmt=287.547:7.753,291.181:7.753&bh=287.547:122.248,291.181:122.248&bwm=291.181:2743:0.057",
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "cdn.britannica.com",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
      {
        protocol: "https",
        hostname: "t4.ftcdn.net",
      },
    ],
  },
};

export default config; 