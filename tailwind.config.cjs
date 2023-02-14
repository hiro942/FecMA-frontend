/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{html,vue}'],
  theme: {
    extend: {},
  },
  plugins: [],
  corePlugins: {
    // 默认样式会和组件库冲突。手动复制官方preflight.css文件，修改响应冲突样式并引入
    // 文件地址：https://unpkg.com/browse/tailwindcss@3.2.4/src/css/preflight.css
    preflight: false,
  },
}
