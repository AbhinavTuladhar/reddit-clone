/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,
  // webpack(config) {
  //   config.module.rules.push({
  //     test: /\.js$/,
  //     use: {
  //       loader: '@swc/loader',
  //       options: {
  //         jsc: {
  //           parser: {
  //             syntax: 'ecmascript',
  //             jsx: true
  //           },
  //           transform: {
  //             react: true
  //           }
  //         }
  //       }
  //     }
  //   });
  //   return config;
  // }
}

module.exports = nextConfig
