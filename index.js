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
                    Math.random() < 0.5 ? resolve() : reject();
                }, 1000);
            });
        }
    }
});
