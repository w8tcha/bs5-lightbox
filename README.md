# Lightbox for Bootstrap 5

A pure JavaScript Bootstrap 5 lightbox that supports images, galleries, YouTube, Vimeo, and Instagram—built around Bootstrap's Modal and Carousel plugins.

Have you been using [Lightbox for Bootstrap (ekko-lightbox)](https://github.com/ashleydw/lightbox) but recently moved to Bootstrap 5? This is your replacement.

Documentation: https://trvswgnr.github.io/bs5-lightbox/

<sub>If you enjoy using Bootstrap 5 Lightbox please star this repo.</sub>

### Development on [Version 2](https://github.com/trvswgnr/bs5-lightbox/tree/full-rework) has started—currently looking for contributors!

Use [Issues](https://github.com/trvswgnr/bs5-lightbox/issues) to request new features. If you would like to contribute, send me an email at [lightbox@travisaw.com](mailto:lightbox@travisaw.com).


## Installation
##### Install with NPM:
```shell
npm i bs5-lightbox
```

Lightbox for Bootstrap 5 will automatically initialize on import:
```js
import 'bs5-lightbox'
```
By default it will target elements with the `data-toggle="lightbox"` attribute.

If you want to target a different element, import the `Lightbox` class and instantiate it:
```js
import Lightbox from 'bs5-lightbox'

for (const el of document.querySelectorAll('.my-lightbox-toggle')) {
  el.addEventListener('click', Lightbox.initialize)
}
```

## Contributing
Lightbox for Bootstrap 5 is written in pure JavaScript.
Modify the src/index.js file, run `npm run build` and create a pull request.

You can help make this project even better and keep it up to date by making a small contribution! [Fund this project](https://github.com/sponsors/trvswgnr).

## Copyright and license

Code released under [the MIT license](https://github.com/trvswgnr/bs5-lightbox/blob/main/LICENSE).
