const webpack = require("webpack");
module.exports = function override(config) {
    const fallback = config.resolve.fallback || {};
    Object.assign(fallback, {
        crypto: require.resolve("crypto-browserify"),
        stream: require.resolve("stream-browserify"),
        assert: require.resolve("assert"),
        http: require.resolve("stream-http"),
        https: require.resolve("https-browserify"),
        os: require.resolve("os-browserify"),
        path: require.resolve("path-browserify"),
        zlib: require.resolve("browserify-zlib"),
        url: require.resolve("url"),
        fs: false,
    });

    // Get rid of hash for js files
    config.output.filename = "static/js/[name].js";
    config.output.chunkFilename = "static/js/[name].chunk.js";

    // Get rid of hash for css files
    const miniCssExtractPlugin = config.plugins.find(
        (element) => element.constructor.name === "MiniCssExtractPlugin"
    );
    miniCssExtractPlugin.options.filename = "static/css/[name].css";
    miniCssExtractPlugin.options.chunkFilename = "static/css/[name].css";

    config.optimization.runtimeChunk = false;
    config.optimization.splitChunks = {
        cacheGroups: {
            default: false,
        },
    };

    config.resolve.fallback = fallback;
    config.plugins = (config.plugins || []).concat([
        new webpack.ProvidePlugin({
            process: "process/browser",
            Buffer: ["buffer", "Buffer"],
        }),
        new webpack.optimize.LimitChunkCountPlugin({
            maxChunks: 1,
        }),
    ]);
    return config;
};
