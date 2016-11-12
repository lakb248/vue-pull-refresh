/* global describe, it, expect */
import Vue from 'vue';
import vuePullRefresh from '../src/vue-pull-refresh.vue';

describe('vue-pull-refresh.vue', () => {
    it('should have correct text', () => {
        expect(vuePullRefresh.data().text).toBe('Hello vuePullRefresh');
    });

    it('should render correct text', () => {
        const vm = new Vue({
            template: '<div><vue-pull-refresh></vue-pull-refresh></div>',
            components: {
                'vue-pull-refresh': vuePullRefresh
            }
        }).$mount();
        expect(vm.$el.querySelector('h2').textContent)
            .toBe('Hello vuePullRefresh');
    });
});
