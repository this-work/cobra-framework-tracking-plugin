/**
 * Cobra-Framework tracking module
 *
 * Version 1.0.0
 * Author Tobias Wöstmann
 *
 */


export default function() {

    const { nuxt } = this;
    const nuxtConfig = nuxt.options;

    /**
     * List all extra proxy routes
     */
    const proxyRoutes = [
        { '/api/tracking/page/enter': '/actions/tracking/page-tracking/enter' },
        { '/api/tracking/page/leave': '/actions/tracking/page-tracking/leave' },
        { '/api/tracking/identity': '/actions/tracking/user-tracking' },
        { '/api/tracking/ping': '/actions/tracking/session-tracking/session-ping' },
        { '/api/tracking/download-event': 'actions/tracking/download-tracking' }
    ];


    /**
     * Add all extra proxy routes to the nuxt instance
     */
    for (const proxyRoute of proxyRoutes) {
        const proxyDefaults = nuxtConfig.proxy['/api'] || {};
        const proxyRouteName = Object.keys(proxyRoute)[0];
        const proxyRouteObject = {
            ...proxyDefaults,
            pathRewrite: proxyRoute
        };
        nuxtConfig['proxy'] = { [proxyRouteName]: proxyRouteObject, ...nuxtConfig['proxy'] };
    }

}
