/**
 * Cobra-Framework tracking module
 *
 * Version 1.0.0
 * Author Tobias Wöstmann
 *
 */

import { join } from 'path';

export default function() {

    const { nuxt } = this;
    const nuxtConfig = nuxt.options;


    /**
     * Make sure the nuxt proxy option is enabled
     */
    if (!'proxy' in nuxtConfig) {
        throw new Error('please add `@nuxtjs/proxy` to your nuxt project');
    }


    /**
     * Add the tracking scripts as plugin to inject
     * the functions in the active vue context
     */
    this.addPlugin({
        src: join(__dirname, 'plugin.js'),
        fileName: 'cobra-framework/tracking.js',
        mode: 'client'
    });


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


    /**
     * List all component dirs
     */
    const componentDirs = [
        'src/partials/components'
    ];


    /**
     * Add all partials/components to the parent nuxt instance
     * All folders are separately to prevent a automatic prefix
     */
    this.nuxt.hook('components:dirs', dirs => {
        for (const componentDir of componentDirs) {
            dirs.push({
                path: join(__dirname, '../' + componentDir),
                level: 3,
                extensions: ['vue']
            });
        }
    });

}
