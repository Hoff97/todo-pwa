module.exports = {
    staticFileGlobs: [
        'build/**/*.{js,html,css,png,jpg,gif,svg,eot,ttf,woff,ico,json}'
    ],
    swFilePath: './build/service-worker.js',
    stripPrefix: 'build/',
    importScripts: (['./service-worker-custom.js']),
    handleFetch: true,
    runtimeCaching: [
        {
            urlPattern: /^https:\/\/todo\.haskai.de\/static\/js/,
            handler: 'networkFirst'
        }
    ]
}