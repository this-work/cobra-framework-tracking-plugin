/**
 * Cobra-Framework Vue 2 tracking plugin injections
 *
 * Version 1.0.0
 * Author Tobias Wöstmann
 *
 */

export default ({ app }, inject) => {

    const endpoints = {

        async pageEnter(entryId, pageUrl) {
            const { id } = await app.$axios.$post('/api/tracking/page/enter', {
                'eventType': 'PageView',
                'entryId': entryId,
                'pageUrl': pageUrl
            });
            sessionStorage.setItem('trackingPageId', id);
            return id;
        },

        async pageLeave( pageId = null ) {
            return await app.$axios.$post('/api/tracking/page/leave', {
                'pageId': pageId
            });
        },

        async download(url) {
            return await app.$axios.$post('/api/tracking/download-event', {
                'downloadUrl': url
            });
        },

        async identity() {
            const { systemUserId } = await app.$axios.$post('/api/tracking/identity');
            sessionStorage.setItem('trackingSystemUserId', systemUserId);
            return systemUserId;
        },

        ping() {
            const data = new FormData();
            if (sessionStorage.getItem('trackingPageId')) {
                data.append('pageId', sessionStorage.getItem('trackingPageId'));
            }
            return navigator.sendBeacon('/api/tracking/ping', data);
        }

    };

    inject('tracking', endpoints);

    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState !== 'hidden') return;
        endpoints.ping();
    });

    endpoints.identity();

};
