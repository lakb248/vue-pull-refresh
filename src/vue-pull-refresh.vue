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
    // status of pull down
    const STATUS_ERROR = -1;
    const STATUS_START = 0;
    const STATUS_READY = 1;
    const STATUS_REFRESH = 2;
    // labels of pull down
    const LABELS = ['数据异常', '下拉刷新数据', '松开刷新数据', '数据刷新中...'];
    const PULL_DOWN_HEIGHT = 60;
    /**
     * reset the status of pull down
     * @param {Object} pullDown the pull down
     */
    let resetPullDown = pullDown => {
        pullDown.height = 0;
        pullDown.status = STATUS_START;
    };

    export default {
        props: {
            onRefresh: {
                type: Function
            },
            config: {
                type: Object,
                default: function() {
                    return {};
                }
            }
        },
        data() {
            return {
                pullDown: {
                    status: 0,
                    height: 0,
                    msg: ''
                }
            };
        },
        computed: {
            label() {
                // label of pull down
                if (this.pullDown.status === STATUS_ERROR) {
                    return this.pullDown.msg;
                }
                return this.customLabels[this.pullDown.status + 1];
            },
            customLabels() {
                let errorLabel = this.config.errorLabel || LABELS[0];
                let startLabel = this.config.startLabel || LABELS[1];
                let readyLaebl = this.config.readyLabel || LABELS[2];
                let loadingLabel = this.config.loadingLabel || LABELS[3];
                return [errorLabel, startLabel, readyLaebl, loadingLabel];
            },
            iconClass() {
                // icon of pull down
                if (this.pullDown.status === STATUS_REFRESH) {
                    return 'pull-down-refresh';
                } else if (this.pullDown.status === STATUS_ERROR) {
                    return 'pull-down-error';
                }
                return '';
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

                /**
                 * bind touchmove event, do the following:
                 * first, update the height of pull down
                 * finally, update the status of pull down based on the distance
                 */
                el.addEventListener('touchmove', e => {
                    var distance = e.touches.item(0).pageY - touchPosition.start;
                    // limit the height of pull down to 180
                    distance = distance > 180 ? 180 : distance;
                    // update touchPosition and the height of pull down
                    touchPosition.distance = distance;
                    this.pullDown.height = distance;
                    /**
                     * if distance is bigger than the height of pull down
                     * set the status of pull down to STATUS_READY
                     */
                    if (distance > PULL_DOWN_HEIGHT) {
                        this.pullDown.status = STATUS_READY;
                        icon.style.transform = 'rotate(180deg)';
                    } else {
                        /**
                         * else set the status of pull down to STATUS_START
                         * and rotate the icon based on distance
                         */
                        this.pullDown.status = STATUS_START;
                        icon.style.transform = 'rotate(' + distance / PULL_DOWN_HEIGHT * 180 + 'deg)';
                    }
                });

                // bind touchend event
                el.addEventListener('touchend', e => {
                    pullDownHeader.style.transition = 'height .2s ease';
                    // reset icon rotate
                    icon.style.transform = '';
                    // if distance is bigger than 60
                    if (touchPosition.distance > PULL_DOWN_HEIGHT) {
                        this.pullDown.height = PULL_DOWN_HEIGHT;
                        this.pullDown.status = STATUS_REFRESH;
                        // trigger refresh callback
                        if (this.onRefresh && typeof this.onRefresh === 'function') {
                            var res = this.onRefresh();
                            // if onRefresh return promise
                            if (res && res.then && typeof res.then === 'function') {
                                res.then(result => {
                                    resetPullDown(this.pullDown);
                                }, error => {
                                    // show error and hide the pull down after 1 second
                                    this.pullDown.msg = error || this.customLabels[0];
                                    this.pullDown.status = STATUS_ERROR;
                                    setTimeout(() => {
                                        resetPullDown(this.pullDown);
                                    }, 1000);
                                });
                            } else {
                                resetPullDown(this.pullDown);
                            }
                        } else {
                            resetPullDown(this.pullDown);
                            console.warn('please use :on-refresh to pass onRefresh callback');
                        }
                    } else {
                        resetPullDown(this.pullDown);
                    }
                    // reset touchPosition
                    touchPosition.distance = 0;
                    touchPosition.start = 0;
                });
                // remove transition when transitionend
                pullDownHeader.addEventListener('transitionend', () => {
                    pullDownHeader.style.transition = '';
                });
                pullDownHeader.addEventListener('webkitTransitionEnd', () => {
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
        max-width: 90%;
        bottom: 10px;
        left: 50%;
        transform: translateX(-50%);
        height: 40px;
        color: #d5d5d5;
        text-align: center;
        border-left: 20px solid transparent;
        font-family: "noto-thin", "Helvetica Neue", Helvetica, Arial, sans-serif;
        font-size: 14px;
        &--icon {
            float: left;
            height: 20px;
            width: 20px;
            margin-top: 10px;
            margin-left: -20px;
            background: url(./down-arrow.png) no-repeat center center;
            background-size: 20px 20px;
            &.pull-down-refresh {
                background: url(./refresh-icon.png) no-repeat center center;
                background-size: 20px 20px;
                animation: rotate 2s infinite;
                animation-timing-function: linear;
            }
            &.pull-down-error {
                background: url(./error-icon.png) no-repeat center center;
                background-size: 20px 20px;
            }
        }
        &--label {
            float: left;
            height: 20px;
            line-height: 20px;
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
