module.exports={
  publicPath:'./',
  // 允许跨域
  devServer: {
    allowedHosts: ["all"],
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
};