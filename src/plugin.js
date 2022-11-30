/**
 * Cobra-Framework Vue 2 tracking plugin injections
 *
 * Version 1.0.1
 * Author Tobias Wöstmann
 *
 */

export default ({ app }, inject) => {

    const endpoints = {

        async pageEnter(entryId, pageUrl) {
            try {
                const { id } = await app.$axios.$post('/api/tracking/page/enter', {
                    'eventType': 'PageView',
                    'entryId': entryId,
                    'pageUrl': pageUrl
                });
                sessionStorage.setItem('trackingPageId', id);
                return id;
            } catch(err) {
                console.info('tracking blocked');
            }
        },

        async pageLeave( pageId = null ) {
            try {
                return await app.$axios.$post('/api/tracking/page/leave', {
                    'pageId': pageId
                });
            } catch(err) {
                console.info('tracking blocked');
            }
        },

        async download(url) {
            try {
                return await app.$axios.$post('/api/tracking/download-event', {
                    'downloadUrl': url
                });
            } catch(err) {
                console.info('tracking blocked');
            }
        },

        async identity() {
            try {
                const { systemUserId } = await app.$axios.$post('/api/tracking/identity');
                sessionStorage.setItem('trackingSystemUserId', systemUserId);
                return systemUserId;
            } catch(err) {
                console.info('tracking blocked');
            }
        },

        ping() {
            try {
                const data = new FormData();
                if (sessionStorage.getItem('trackingPageId')) {
                    data.append('pageId', sessionStorage.getItem('trackingPageId'));
                }
                return navigator.sendBeacon('/api/tracking/ping', data);
            } catch(err) {
                console.info('tracking blocked');
            }
        }

    };

    inject('tracking', endpoints);

    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState !== 'hidden') return;
        endpoints.ping();
    });

    endpoints.identity();

};
