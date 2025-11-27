import { onRequestOptions as __api_tarot_js_onRequestOptions } from "/home/felipe/tarot-reader/functions/api/tarot.js"
import { onRequestPost as __api_tarot_js_onRequestPost } from "/home/felipe/tarot-reader/functions/api/tarot.js"

export const routes = [
    {
      routePath: "/api/tarot",
      mountPath: "/api",
      method: "OPTIONS",
      middlewares: [],
      modules: [__api_tarot_js_onRequestOptions],
    },
  {
      routePath: "/api/tarot",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_tarot_js_onRequestPost],
    },
  ]