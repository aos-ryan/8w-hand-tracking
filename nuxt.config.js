import path from 'path'
import fs from 'fs'

export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'aframe-hand-tracking',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    script: [
      { src: '//cdn.8thwall.com/web/aframe/8frame-1.3.0.min.js' },
      { src: '//cdn.8thwall.com/web/xrextras/xrextras.js' },
      { src: '//apps.8thwall.com/xrweb?appKey=' + process.env.API_8W },
    ],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [{ src: '~/plugins/vue.js' }, { src: '~/plugins/aframe.js' }],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: ['@nuxtjs/dotenv'],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},
  server: {
    host: '0.0.0.0',
    port: 3443,
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'dev.key')),
      cert: fs.readFileSync(path.resolve(__dirname, 'dev.crt')),
    },
  },
}
