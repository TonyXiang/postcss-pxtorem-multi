# postcss-pxtorem-multi [![NPM version](https://badge.fury.io/js/postcss-pxtorem-multi.svg)](http://badge.fury.io/js/postcss-pxtorem-multi)

This is a fork based on [postcss-pxtorem](https://github.com/cuth/postcss-pxtorem). The difference is `postcss-pxtorem-multi` supports multiple rules.

## Install

```shell
$ npm install postcss-pxtorem-multi --save-dev
```

### options

Type: `Object | Null`  
Default:
```js
{
    include: null,
    exclude: null,
    rootValue: 16,
    unitPrecision: 5,
    propList: ['font', 'font-size', 'line-height', 'letter-spacing'],
    selectorBlackList: [],
    replace: true,
    mediaQuery: false,
    minPixelValue: 0,
    rules: []
}
```
- `include` (String|RegExp|Array<String|RegExp>) Files to include
- `exclude` (String|RegExp|Array<String|RegExp>) Files to exclude
- `rootValue` (Number) The root element font size.
- `unitPrecision` (Number) The decimal numbers to allow the REM units to grow to.
- `propList` (Array) The properties that can change from px to rem.
    - Values need to be exact matches.
    - Use wildcard `*` to enable all properties. Example: `['*']`
    - Use `*` at the start or end of a word. (`['*position*']` will match `background-position-y`)
    - Use `!` to not match a property. Example: `['*', '!letter-spacing']`
    - Combine the "not" prefix with the other prefixes. Example: `['*', '!font*']` 
- `selectorBlackList` (Array) The selectors to ignore and leave as px.
    - If value is string, it checks to see if selector contains the string.
        - `['body']` will match `.body-class`
    - If value is regexp, it checks to see if the selector matches the regexp.
        - `[/^body$/]` will match `body` but not `.body`
- `replace` (Boolean) replaces rules containing rems instead of adding fallbacks.
- `mediaQuery` (Boolean) Allow px to be converted in media queries.
- `minPixelValue` (Number) Set the minimum pixel value to replace.
- `rules`: (Object) Supporting all the above parameters.


### Use with gulp-postcss (**Gulp**)

```js
var gulp = require('gulp');
var postcss = require('gulp-postcss');
var pxtorem = require('postcss-pxtorem-multi');

gulp.task('css', function () {

    var processors = [
        pxtorem({
            rootValue: 16,
            rules: [
                {
                    include: 'common.css',
                    rootValue: 32,
                }
            ]
        })
    ];

    return gulp.src(['build/css/**/*.css'])
        .pipe(postcss(processors))
        .pipe(gulp.dest('build/css'));
});
```

### Use with postcss-loader (**Webpack**)
`postcss.config.js`
```js
module.exports = {
    plugins: {
        "pxtorem-multi": {
            rootValue: 75,
            propList: ['*'],
            rules: [
                {
                    include: ['/node_modules/vant/'],
                    rootValue: 37.5,
                    propList: ['*'],
                }
            ]
        }
    }
}
```

### A message about ignoring properties
Currently, the easiest way to have a single property ignored is to use a capital in the pixel unit declaration.

```css
// `px` is converted to `rem`
.convert {
    font-size: 16px; // converted to 1rem
}

// `Px` or `PX` is ignored by `postcss-pxtorem-multi` but still accepted by browsers
.ignore {
    border: 1Px solid; // ignored
    border-width: 2PX; // ignored
}
```
