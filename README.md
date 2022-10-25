# Cobra-Framework Tracking Plugin
Vue/Nuxt module integration for tracking functions with the THIS companion. Requires a minimal version of nuxt 2.15+ and the Cobra-Framework 0.2.22+


### Requirements
- Nuxt


### Usage in Nuxt

Install plugin dependencies
``` bash
$ npm install @this/cobra-framework-tracking-plugin
```

Add module in nuxt.config.js
``` js
buildModules: [
    '@this/cobra-framework-tracking-plugin'
]
```

The tool automatically extends the c-component to include download tracking and add all available tracking endpoints to the vue instance. 
You can call the endpoints it with a new instance variable called $tracking: 

``` js
this.$tracking
```

In order to track the pages, a Vue mixin can be integrated on the corresponding pages.

``` js
import tracking from '@this/cobra-framework-tracking-plugin/src/plugins/mixins/tracking';

export default {
    mixins: [
        tracking
    ]
}
```


