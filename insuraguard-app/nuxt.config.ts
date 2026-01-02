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
      title: 'InsuraGuard - Insurance-Backed Guarantee for Clean Energy Systems',
      htmlAttrs: {
        lang: 'en'
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { 
          name: 'description', 
          content: '10-year insurance-backed guarantee protection if your installer ceases to trade. Register your solar PV, battery storage, or clean energy system in minutes. Trusted by homeowners across the UK.' 
        },
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'keywords', content: 'solar panel insurance, battery storage guarantee, clean energy protection, installer insurance, solar PV warranty, renewable energy insurance UK' },
        { property: 'og:site_name', content: 'InsuraGuard' },
        { property: 'og:title', content: 'InsuraGuard - Insurance Protection for Clean Energy Systems' },
        { property: 'og:description', content: '10-year guarantee protection for your clean energy installation. Register in minutes, protected for a decade.' },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://insuraguard.co.uk' },
        { property: 'og:image', content: 'https://insuraguard.co.uk/hero.webp' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'InsuraGuard - Clean Energy Insurance Protection' },
        { name: 'twitter:description', content: '10-year insurance-backed guarantee for solar and battery systems. Register in minutes.' },
        { name: 'twitter:image', content: 'https://insuraguard.co.uk/hero.webp' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico?v=20251231' },
        { rel: 'canonical', href: 'https://insuraguard.co.uk' },
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
