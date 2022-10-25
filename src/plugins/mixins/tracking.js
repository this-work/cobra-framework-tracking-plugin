export default {
    beforeRouteEnter(to, from, next) {
        next(async ctx => {
            const { $tracking, data, id } = ctx;
            const entryId = id ?? data?.id ?? data.find(Boolean)?.id ?? null;
            await $tracking.pageEnter(entryId, to.fullPath);
        });
    },
    async beforeRouteUpdate(to, from, next) {
        this.$tracking.pageLeave(sessionStorage.getItem('trackingPageId'));
        const entryId = this?.id ?? this.data?.id ?? this.data.find(Boolean)?.id ?? null;
        await this.$tracking.pageEnter(entryId, to.fullPath);

        next();
    },
    async beforeRouteLeave(to, from, next) {
        this.$tracking.pageLeave(sessionStorage.getItem('trackingPageId'));

        next();
    }
};
