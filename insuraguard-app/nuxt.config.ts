// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  
    
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/supabase'
  ],

  // Performance optimizations
  experimental: {
    payloadExtraction: false,
  },

  // Ensure CSS is loaded early
  css: ['~/assets/css/main.css'],

  tailwindcss: {
    cssPath: '~/assets/css/main.css',
    configPath: 'tailwind.config.js',
  },

  supabase: {
    redirect: false,
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      exclude: ['/', '/verify', '/privacy', '/terms', '/faq', '/contact', '/claim', '/dsar']
    }
  },

  runtimeConfig: {
    public: {
      siteUrl: process.env.SITE_URL || 'http://localhost:3000',
      supabaseUrl: process.env.SUPABASE_URL || 'https://gkgjckeqralugtncfwva.supabase.co',
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY || '',
      stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
      stripePrice0_12: process.env.STRIPE_PRICE_0_12 || '',
      stripePrice12_24: process.env.STRIPE_PRICE_12_24 || '',
      stripePrice24_36: process.env.STRIPE_PRICE_24_36 || '',
      stripePrice36_48: process.env.STRIPE_PRICE_36_48 || '',
      stripePriceExcess: process.env.STRIPE_PRICE_EXCESS || '',
      stripePriceAdmin: process.env.STRIPE_PRICE_ADMIN || '',
    },
    stripeSecretKey: process.env.STRIPE_SECRET_KEY || '',
    stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
    sendgridApiKey: process.env.SENDGRID_API_KEY || '',
  },

  app: {
    // Fix manifest import error
    buildAssetsDir: '/_nuxt/',
    head: {
      title: 'InsuraGuard - Insurance Backed Clean Energy Protection',
      htmlAttrs: {
        lang: 'en'
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { 
          name: 'description', 
          content: '10 year insurance backed guarantee for solar and battery storage systems. Protect your clean energy investment with InsuraGuard.' 
        },
        { name: 'format-detection', content: 'telephone=no' },
        { property: 'og:site_name', content: 'InsuraGuard' },
        { property: 'og:type', content: 'website' },
        { name: 'twitter:card', content: 'summary_large_image' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico?v=20251231' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'dns-prefetch', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap' }
      ]
    }
  },

  typescript: {
    strict: false,
    typeCheck: false
  },

  vite: {
    server: {
      hmr: {
        port: 24679
      }
    },
    vue: {
      script: {
        defineModel: true,
        propsDestructure: true
      },
      template: {
        transformAssetUrls: {}
      }
    },
    build: {
      target: 'esnext'
    },
    esbuild: {
      tsconfigRaw: {
        compilerOptions: {
          experimentalDecorators: true
        }
      }
    }
  },

  features: {
    inlineStyles: false
  },

  builder: 'vite',

  nitro: {
    logLevel: 3
  },

  ignore: [
    '**/*.test.*',
    '**/*.spec.*'
  ]
})
