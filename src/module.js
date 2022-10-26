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
