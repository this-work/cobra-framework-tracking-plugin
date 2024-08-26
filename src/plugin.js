/**
 * Cobra-Framework Vue 2 tracking plugin injections
 *
 * Version 1.0.1
 * Author Tobias Wöstmann
 *
 */

import { completeUnit } from '@this/cobra-framework-companion-plugin/src/plugins/vanilla/status-helper';

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

    document.addEventListener('playlist-completed', async ({ detail }) => {
        try {
            await app.$axios.$post('/api/tracking/chapter/completion', {
                'playlistId': detail.id,
                'siteId': app.i18n.localeProperties.siteId,
                'completed': true,
                [sessionStorage.getItem('csrfTokenName')]: sessionStorage.getItem('csrfTokenValue')
            });
        } catch (err) {
            console.log(err);
        }
    });

    document.addEventListener('playlist-completed', async ({ detail }) => {
        completeCourse(app, detail.id);
    });

    document.addEventListener('quiz-attempt', async ({ detail }) => {
        try {
            await app.$axios.$post('/api/tracking/quiz/attempt', {
                [sessionStorage.getItem('csrfTokenName')]: sessionStorage.getItem('csrfTokenValue'),
                'quizId': detail.id,
                'siteId': app.i18n.localeProperties.siteId,
                ...detail
            });
        } catch (err) {
            console.log(err);
        }
    });

    document.addEventListener('quiz-attempt', async ({ detail }) => {
        if (detail.evaluationResult) {
            completeCourse(app, detail.id);
        }
    });

    endpoints.identity();

};

async function completeCourse(app, id) {
    const courseList = await app.$axios.$get('api/courselist');
    const completedPlaylists = sessionStorage.getItem('completed').split(',');

    const courseListArray = Object.entries(courseList);

    const filteredCourseListArray = courseListArray.filter(([key, value]) => {
        if (!Array.isArray(value)) {
            return parseInt(value) === parseInt(id)
        }
        return value.includes(parseInt(id))
    });

    if (filteredCourseListArray.length > 0) {

        const completedCourseListArray = filteredCourseListArray.filter(([key, value]) => {
            if (!Array.isArray(value)) {
                return completedPlaylists.includes(value + '')
            }
            return value.every(v => completedPlaylists.includes(v + ''));
        });

        if (completedCourseListArray.length > 0) {
            for (const completedCourse of Object.keys(Object.fromEntries(completedCourseListArray))) {

                completeUnit(completedCourse);

                try {
                    await app.$axios.$post('/api/tracking/course/completion', {
                        'courseId': completedCourse,
                        'siteId': app.i18n.localeProperties.siteId,
                        'completed': true,
                        [sessionStorage.getItem('csrfTokenName')]: sessionStorage.getItem('csrfTokenValue')
                    });
                } catch (err) {
                    console.log(err);
                }

            }
        }
    }

}
