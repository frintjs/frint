# Transpilers

We use Babel for transpiling ES6/JSX code to browser compatible ES5. Since we already ship our own Babel preset, all you need to do is create a new `.babelrc` file in your root directory with this content:

```json
{
  "presets": [
    "travix"
  ]
}
```

## JSX

If you want to avoid pointing to frint's JSX pragma function in every file that involves JSX, you can do:

```json
{
  "presets": [
    "travix"
  ],
  "plugins": [
    ["transform-react-jsx", {
      "pragma": "h"
    }]
  ]
}
```

More discussed in [Component](./Component.md) page.
