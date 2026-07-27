TAN ANGELTON is a licensed font and is not bundled in this repository.

The website will use TAN ANGELTON automatically when it is installed locally. Otherwise, it falls back to Fraunces. To self-host a licensed copy, place the preferred `.woff2` file in this folder and add its URL to the `@font-face` declaration in `css/style.css`:

```css
src:
  local('TAN Angelton'),
  local('TAN-ANGELTON'),
  url('../fonts/tan-angelton.woff2') format('woff2');
```

Only publish the font file when its license permits web embedding.
