/**
 * m-completed-courses
 */

import { common, spacing, theme, background } from '@this/cobra-framework/src/plugins/mixins';

export default {

    name: 'm-completed-courses',

    mixins: [
        ...common,
        spacing,
        theme,
        background
    ],

    data() {
        return {
            courses: [],
            fetching: true
        };
    },

    async fetch() {
        setTimeout(async () => {
            this.courses = await this.$axios.$get('api/v1/' + this.$i18n.locale + '/completedCourses/' + this.$auth.user.id);
            this.fetching = false;
        }, 500);
    },

    methods: {
        formattedCompletionDate(timestamp) {
            const date = new Date(timestamp);
            return date.toLocaleDateString(this.$i18n.locales.find(language => language.code === this.$i18n.locale));
        },
        certificateLink(courseKey) {
            const courseId = courseKey.split('-')[1];
            return '/user/certificate?courseId=' + courseId;
        }
    }
};
