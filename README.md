# vue-pull-refresh
[![Build Status](https://travis-ci.org/lakb248/vue-pull-refresh.svg?branch=master)](https://travis-ci.org/lakb248/vue-pull-refresh)

> A pull down refresh component implements by vuejs 2.0 for mobile.

## Demo

[Demo](https://lakb248.github.io/vue-pull-refresh)

PS: Please use browsers that support Promise

## Usage

### Install

```bash
npm install vue-pull-refresh --save
```

### CommonJS

```javascript
var VuePullRefresh = require('vue-pull-refresh');

new Vue({
    components: {
        'vue-pull-refresh': VuePullRefresh
    },
    data: function () {
        return {};
    },
    methods: {
        onRefresh: function() {
            return new Promise(function (resolve, reject) {
                setTimeout(function () {
                    resolve();
                }, 1000);
            });
        }
    },
    template: '<vue-pull-refresh :on-refresh="onRefresh"></vue-pull-refresh>'
});
```

### ES6
```javascript
import VuePullRefresh from 'vue-pull-refresh';

new Vue({
    components: {
        'vue-pull-refresh': VuePullRefresh
    },
    data: function () {
        return {};
    },
    methods: {
        onRefresh: function() {
            return new Promise(function (resolve, reject) {
                setTimeout(function () {
                    resolve();
                }, 1000);
            });
        }
    },
    template: '<vue-pull-refresh :on-refresh="onRefresh"></vue-pull-refresh>'
});
```

### Props
| Property | Description |
|:--|:--|
| onRefresh | refresh event;Should return a promise. |
| config | {<br>errorLabel: label shows when error<br>startLabel: label shows when pull down start<br>readyLabel: label shows when ready to refresh<br>loadingLabel: label shows when loading<br>pullDownHeight: the height toggle pull down refresh action<br>} |

## Contribution
First, install dependencies
```
npm install
```
Second, setup development environment
```
npm run dev
```

## License

[MIT](http://opensource.org/licenses/MIT)
