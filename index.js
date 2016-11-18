import Vue from 'vue';
import vuePullRefresh from './src/vue-pull-refresh.vue';

new Vue({
    el: '#container',
    components: {
        'vue-pull-refresh': vuePullRefresh
    },
    data() {
        return {};
    },
    methods: {
        onRefresh() {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    reject();
                }, 1000);
            });
        }
    }
});
