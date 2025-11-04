const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api/reports",
    createProxyMiddleware({
      target:
        process.env.REACT_APP_REPORTS_APP_API_URL || "http://localhost:8004",
      changeOrigin: true,
      pathRewrite: {
        "^/api/reports": "",
      },
      secure: true,
      logLevel: "debug",
    })
  );
};
