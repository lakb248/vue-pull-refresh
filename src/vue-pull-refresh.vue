<template>
    <div class="pull-down-container">
        <div class="pull-down-header" v-bind:style="{'height': pullDown.height + 'px'}">
            <div class="pull-down-content">
                <i class="pull-down-content--icon" v-bind:class="iconClass"></i>
                <span class="pull-down-content--label">{{label}}</span>
            </div>
        </div>
        <slot></slot>
    </div>
</template>

<script>
    const STATUS_ERROR = -1;
    const STATUS_START = 0;
    const STATUS_READY = 1;
    const STATUS_REFRESH = 2;
    const LABELS = ['数据异常', '下拉刷新数据', '松开刷新数据', '数据刷新中...'];
    let resetPullDown = pullDown => {
        pullDown.height = 0;
        pullDown.status = STATUS_START;
    };

    export default {
        props: ['onRefresh'],
        data() {
            return {
                pullDown: {
                    status: 0,
                    height: 0
                }
            };
        },
        computed: {
            label() {
                return LABELS[this.pullDown.status + 1];
            },
            iconClass() {
                if (this.pullDown.status === STATUS_REFRESH) {
                    return 'pull-down-refresh';
                } else {
                    return '';
                }
            }
        },
        mounted() {
            this.$nextTick(() => {
                var el = this.$el;
                var pullDownHeader = el.querySelector('.pull-down-header');
                var icon = pullDownHeader.querySelector('.pull-down-content--icon');

                // store of touch position, include start position and distance
                var touchPosition = {
                    start: 0,
                    distance: 0
                };

                // bind touchstart event to store start position of touch
                el.addEventListener('touchstart', e => {
                    touchPosition.start = e.touches.item(0).pageY;
                });

                // bind touchmove event, do the following things:
                //
                el.addEventListener('touchmove', e => {
                    var distance = e.touches.item(0).pageY - touchPosition.start;
                    distance = distance > 180 ? 180: distance;
                    touchPosition.distance = distance;
                    this.pullDown.height = distance;
                    if (distance > 60) {
                        this.pullDown.status = STATUS_READY;
                        icon.style.transform = 'rotate(180deg)';
                    } else {
                        this.pullDown.status = STATUS_START;
                        icon.style.transform = 'rotate(' + distance / 60 * 180 + 'deg)';
                    }
                });

                // bind touchend event
                el.addEventListener('touchend', e => {
                    pullDownHeader.style.transition = 'height .2s ease';
                    // icon.style.transition = 'transform .2s ease';
                    if (touchPosition.distance > 60) {
                        this.pullDown.height = 60;
                        this.pullDown.status = STATUS_REFRESH;
                        // trigger refresh callback
                        if (this.onRefresh && typeof this.onRefresh === 'function') {
                            var res = this.onRefresh();
                            // if onRefresh return promise
                            if (res && res.then && typeof res.then === 'function') {
                                res.then(result => {
                                    resetPullDown(this.pullDown);
                                }, error => {});
                            } else {
                                resetPullDown(this.pullDown);
                            }
                        } else {
                            setTimeout(() => {
                                resetPullDown(this.pullDown);
                            }, 5000);
                        }
                    } else {
                        resetPullDown(this.pullDown);
                    }
                    touchPosition.distance = 0;
                    touchPosition.start = 0;
                });
                // remove transition when transitionend
                pullDownHeader.addEventListener('transitionend', () => {
                    pullDownHeader.style.transition = '';
                });
            });
        }
    };
</script>

<style lang="sass">
    .pull-down-header {
        width: 100%;
        height: 0px;
        overflow: hidden;
        position: relative;
        background-color: #2c3133;
    }
    .pull-down-content {
        position: absolute;
        bottom: 10px;
        left: 50%;
        height: 40px;
        width: 120px;
        margin-left: -60px;
        color: #d5d5d5;
        text-align: center;
        font-family: "noto-thin", "Helvetica Neue", Helvetica, Arial, sans-serif;
        font-size: 14px;
        &--icon {
            float: left;
            height: 20px;
            width: 20px;
            margin-top: 10px;
            background: url(./down-arrow.png) no-repeat center center;
            background-size: 20px 20px;
            &.pull-down-refresh {
                background: url(./refresh-icon.png) no-repeat center center;
                background-size: 20px 20px;
                animation: rotate 2s infinite;
                animation-timing-function: linear;
            }
        }
        &--label {
            float: left;
            margin-left: 10px;
            margin-top: 10px;
        }
    }
    @keyframes rotate {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }
</style>
