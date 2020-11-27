export default {
  // Disable server-side rendering (https://go.nuxtjs.dev/ssr-mode)
  ssr: false,

  server: {
    port: 8081 // default: 3000
  },

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: 'mocube',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [
  ],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module'
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/bootstrap
    'bootstrap-vue/nuxt',
    '@nuxtjs/axios',
    '@nuxtjs/auth-next'
  ],

  axios: {
    baseURL: 'http://localhost:8080/api'
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
  },

  auth: {
    strategies: {
      local: {
        token: {
          name: "x-access-token",
          property: "accessToken",
          // required: true,
          type: ''
        },
        user: {
          property: false,
          // autoFetch: true
        },
        endpoints: {
          login: { url: '/auth/signin', method: 'post' },
          logout: { url: '/auth/signout', method: 'delete' },
          user: { url: '/test/user', method: 'get' }
        }
      }
    }
  }
}
