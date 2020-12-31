const {createProxyMiddleware} = require("http-proxy-middleware");
console.log(createProxyMiddleware, typeof (createProxyMiddleware));
module.exports = function (app) {
    app.use(
        createProxyMiddleware("/api/", {
            target: "http://127.0.0.1:9301/",
            changeOrigin: true
        })
    );
};
