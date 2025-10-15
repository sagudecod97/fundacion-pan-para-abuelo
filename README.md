# README

## Icons

### Overview

This project uses SVG sprites to efficiently manage and display vector icons across the site.
The icons are based on the Tabler Icons library (MIT-licensed), which provides clean and consistent outline-style SVG icons.

All icons are combined into a single SVG sprite sheet using the svgstore.

### Generating the Sprite Sheet

Run the following command to build or update your SVG sprite:

- npx svgstore -o src/assets/icons/icons-sprite.svg src/assets/icons/tabler/\*.svg

This command takes all individual SVG icons from the src/assets/icons/tabler folder
and bundles them into a single optimized file named icons-sprite.svg.
Each original icon becomes a <symbol> inside that file, using the SVG’s filename as its id.

### Using Icons in HTML

Once the sprite is generated, you can reference any icon directly in your HTML using the <use> element:

```html
<svg class="icon">
  <use href="/src/assets/icons/icons-sprite.svg#heart"></use>
</svg>
```

- href points to the path of the sprite file followed by the icon’s id (#heart
  in this example). - You can replace heart with any other icon name based on the
  Tabler SVG filename (e.g. #home, #user, #hand-giving, etc.). - The icons
  automatically inherit text color when using stroke="currentColor".
