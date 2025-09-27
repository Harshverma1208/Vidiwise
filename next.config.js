/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
process.env.SKIP_ENV_VALIDATION = 'true';
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
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: blob:; connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com https://api.youtube.com https://youtube.com; frame-src 'self' https://www.youtube.com;",
          },
        ],
      },
    ];
  },
  webpack: (config, { webpack, isServer }) => {
    // Configure fallbacks for Node.js modules - apply to both client and server
    config.resolve = {
      ...config.resolve,
      fallback: {
        ...config.resolve?.fallback,
        fs: false,
        os: false,
        path: false,
        crypto: false,
        net: false,
        tls: false,
        stream: false,
        util: false,
        url: false,
        assert: false,
        http: false,
        https: false,
        zlib: false,
        querystring: false,
        buffer: false,
        events: false,
        process: false,
      },
    };

    // Server-side configurations
    if (isServer) {
      config.plugins.push(
        // Ignore problematic modules that shouldn't be bundled
        new webpack.IgnorePlugin({
          resourceRegExp:
            /(^@google-cloud\/spanner|^@mongodb-js\/zstd|^aws-crt|^aws4$|^pg-native$|^mongodb-client-encryption$|^@sap\/hana-client$|^@sap\/hana-client\/extension\/Stream$|^snappy$|^react-native-sqlite-storage$|^bson-ext$|^cardinal$|^kerberos$|^hdb-pool$|^sql.js$|^sqlite3$|^better-sqlite3$|^ioredis$|^typeorm-aurora-data-api-driver$|^pg-query-stream$|^oracledb$|^mysql$|^snappy\/package\.json$|^cloudflare:sockets$)/,
        }),
      );
    } else {
      // Client-side configurations
      config.externals = config.externals || [];
      config.externals.push('pg', 'drizzle-orm/node-postgres', 'drizzle-orm/node-postgres/migrator');
      
      // Additional plugins for client-side to ignore server-only modules
      config.plugins.push(
        new webpack.IgnorePlugin({
          resourceRegExp: /^pg$/,
        }),
        new webpack.IgnorePlugin({
          resourceRegExp: /^crypto$/,
        }),
      );
    }

    config.module = {
      ...config.module,
      exprContextCritical: false,
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