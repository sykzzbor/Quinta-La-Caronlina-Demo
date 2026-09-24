import next from "eslint-config-next";

const config = [
  ...next,
  {
    // Las skills instaladas traen fixtures de ejemplo que no son código del sitio.
    ignores: [".next/**", "node_modules/**", "out/**", ".claude/**"],
  },
  {
    rules: {
      // Las fotos se generan en tres anchos ya optimizados en /public/img y se
      // sirven con srcset propio: next/image no aporta nada acá y agrega runtime.
      "@next/next/no-img-element": "off",
    },
  },
];

export default config;
