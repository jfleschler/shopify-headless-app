# Shopify Declarative System Documentation

The Shopify Declarative System allows you to build dynamic Shopify storefronts using only HTML data attributes - no JavaScript coding required!

## 🚀 Quick Start

```html
<!-- Load products from a collection -->
<div
  data-shopify="products"
  data-collection="shirts"
  data-template="product-card"
  data-limit="6"
></div>

<!-- Define how products should look -->
<template id="product-card">
  <div class="product">
    <img src="{{image}}" alt="{{title}}" />
    <h3>{{title}}</h3>
    <p>${{price}}</p>
    <button data-add-to-cart="{{variantId}}">Add to Cart</button>
  </div>
</template>

<!-- Load the Shopify Headless App -->
<script src="./dist/shopify-headless-app.js"></script>
```

That's it! The system will automatically:

1. Find all elements with `data-shopify` attributes
2. Fetch the appropriate data from Shopify
3. Apply the specified template
4. Handle add-to-cart functionality

## 📋 Data Attributes Reference

### Core Attributes

| Attribute       | Required | Description                   |
| --------------- | -------- | ----------------------------- |
| `data-shopify`  | ✅       | Type of content to load       |
| `data-template` | ✅       | ID of template element to use |

### Content Types

#### Products (`data-shopify="products"`)

Load products from a collection.

```html
<div data-shopify="products"
     data-collection="shirts"          <!-- Required: collection handle -->
     data-template="product-card"      <!-- Required: template ID -->
     data-limit="12"                   <!-- Optional: number of products (default: 10) -->
     data-sort="PRICE_DESC">           <!-- Optional: sort order -->
</div>
```

**Sort Options:**

- `COLLECTION_DEFAULT` (default)
- `BEST_SELLING`
- `CREATED_DESC`
- `PRICE_ASC`
- `PRICE_DESC`
- `TITLE_ASC`
- `TITLE_DESC`

#### Single Product (`data-shopify="product"`)

Load a single product by handle or ID.

```html
<!-- By handle (recommended) -->
<div data-shopify="product" data-handle="cool-t-shirt" <!-- Product handle -->
  data-template="product-detail">
</div>

<!-- By ID -->
<div
  data-shopify="product"
  data-id="gid://shopify/Product/123"
  <!--
  Product
  id
  --
>
  data-template="product-detail">
</div>
```

#### Collections (`data-shopify="collections"`)

Load all collections.

```html
<div data-shopify="collections"
     data-template="collection-card"   <!-- Required: template ID -->
     data-limit="20">                  <!-- Optional: number of collections (default: 20) -->
</div>
```

#### Search (`data-shopify="search"`)

Search for products.

```html
<div data-shopify="search"
     data-query="summer dress"         <!-- Required: search query -->
     data-template="product-card"      <!-- Required: template ID -->
     data-limit="10">                  <!-- Optional: number of results (default: 10) -->
</div>
```

#### Cart (`data-shopify="cart"`)

Display cart contents.

```html
<div data-shopify="cart" data-template="cart-item">
  <!-- Required: template ID -->
</div>
```

## 🎨 Template System

Templates use HTML `<template>` elements with a simple variable replacement system.

### Basic Variables

| Variable          | Description                    | Example                                     |
| ----------------- | ------------------------------ | ------------------------------------------- |
| `{{title}}`       | Product/collection title       | `<h3>{{title}}</h3>`                        |
| `{{price}}`       | Product price (numeric)        | `<p>${{price}}</p>`                         |
| `{{image}}`       | First product image URL        | `<img src="{{image}}">`                     |
| `{{description}}` | Product/collection description | `<p>{{description}}</p>`                    |
| `{{handle}}`      | Product/collection handle      | `<a href="/products/{{handle}}">`           |
| `{{variantId}}`   | First variant ID               | `<button data-add-to-cart="{{variantId}}">` |

### Arrays with `{{#each}}`

For multiple items like images or variants:

```html
<template id="product-detail">
  <div class="product">
    <h1>{{title}}</h1>

    <!-- Multiple images -->
    <div class="images">
      {{#each images}}
      <img src="{{this}}" alt="Product image" />
      {{/each}}
    </div>

    <!-- Variant selector -->
    <select data-variant-selector>
      {{#each variants}}
      <option value="{{id}}">{{title}} - ${{price}}</option>
      {{/each}}
    </select>
  </div>
</template>
```

### Template Examples

#### Product Card Template

```html
<template id="product-card">
  <div class="product-card">
    <img src="{{image}}" alt="{{title}}" />
    <h3>{{title}}</h3>
    <p class="price">${{price}}</p>
    <button data-add-to-cart="{{variantId}}" data-quantity="1">
      Add to Cart
    </button>
  </div>
</template>
```

#### Product Detail Template

```html
<template id="product-detail">
  <div class="product-detail">
    <div class="product-images">
      {{#each images}}
      <img src="{{this}}" alt="Product image" />
      {{/each}}
    </div>
    <div class="product-info">
      <h1>{{title}}</h1>
      <p class="price">${{price}}</p>
      <div class="description">{{description}}</div>

      <select data-variant-selector>
        {{#each variants}}
        <option value="{{id}}">{{title}} - ${{price}}</option>
        {{/each}}
      </select>

      <button data-add-to-cart data-variant-from-selector>Add to Cart</button>
    </div>
  </div>
</template>
```

#### Collection Card Template

```html
<template id="collection-card">
  <div class="collection-card">
    <img src="{{image}}" alt="{{title}}" />
    <h3>{{title}}</h3>
    <p>{{description}}</p>
    <a href="/collections/{{handle}}">View Collection</a>
  </div>
</template>
```

#### Cart Item Template

```html
<template id="cart-item">
  <div class="cart-item">
    <img src="{{image}}" alt="{{title}}" />
    <div class="item-info">
      <h4>{{title}}</h4>
      <p>Quantity: {{quantity}}</p>
      <p>Price: ${{price}}</p>
    </div>
    <button data-remove-cart-item="{{id}}">Remove</button>
  </div>
</template>
```

## 🛒 Interactive Elements

### Add to Cart

#### Static Variant ID

```html
<button data-add-to-cart="{{variantId}}" data-quantity="1">Add to Cart</button>
```

#### Dynamic Variant Selection

```html
<select data-variant-selector>
  {{#each variants}}
  <option value="{{id}}">{{title}} - ${{price}}</option>
  {{/each}}
</select>
<button data-add-to-cart data-variant-from-selector>Add to Cart</button>
```

### Cart Management

#### Remove from Cart

```html
<button data-remove-cart-item="{{id}}">Remove</button>
```

## 🎯 Complete Examples

### Simple Product Grid

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Product Grid</title>
    <style>
      .product-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 1rem;
      }
      .product-card {
        border: 1px solid #ddd;
        padding: 1rem;
        text-align: center;
      }
      .product-card img {
        width: 100%;
        height: 200px;
        object-fit: cover;
      }
    </style>
  </head>
  <body>
    <h1>Our Products</h1>

    <div
      class="product-grid"
      data-shopify="products"
      data-collection="all"
      data-template="simple-card"
      data-limit="12"
    ></div>

    <template id="simple-card">
      <div class="product-card">
        <img src="{{image}}" alt="{{title}}" />
        <h3>{{title}}</h3>
        <p>${{price}}</p>
        <button data-add-to-cart="{{variantId}}">Add to Cart</button>
      </div>
    </template>

    <script src="./dist/shopify-headless-app.js"></script>
  </body>
</html>
```

### Product Detail Page

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Product Detail</title>
  </head>
  <body>
    <!-- Single product loaded by handle -->
    <div
      data-shopify="product"
      data-handle="awesome-t-shirt"
      data-template="product-detail"
    ></div>

    <template id="product-detail">
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
        <div>
          {{#each images}}
          <img src="{{this}}" style="width: 100%; margin-bottom: 1rem;" />
          {{/each}}
        </div>
        <div>
          <h1>{{title}}</h1>
          <p style="font-size: 1.5rem; color: #e74c3c;">${{price}}</p>
          <p>{{description}}</p>

          <select
            data-variant-selector
            style="margin: 1rem 0; padding: 0.5rem;"
          >
            {{#each variants}}
            <option value="{{id}}">{{title}} - ${{price}}</option>
            {{/each}}
          </select>

          <br />
          <button
            data-add-to-cart
            data-variant-from-selector
            style="padding: 1rem 2rem; background: #3498db; color: white; border: none;"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </template>

    <script src="./dist/shopify-headless-app.js"></script>
  </body>
</html>
```

## 🔧 Advanced Features

### Loading States

The system automatically shows loading and error states:

```css
.shopify-loading {
  padding: 2rem;
  text-align: center;
  color: #666;
}

.shopify-error {
  padding: 1rem;
  background: #fee;
  color: #c33;
  border: 1px solid #fcc;
}
```

### Manual Initialization

If you need to manually control when the system initializes:

```javascript
// Disable auto-initialization by loading script after DOM ready
document.addEventListener('DOMContentLoaded', () => {
  // Your custom logic here

  // Then manually initialize
  new ShopifyDeclarativeLoader();
});
```

### Cache Management

The system uses localStorage caching. To debug or clear cache:

```javascript
// Debug cache state
ShopifyHeadlessApp.debugCache();

// Clear cache
ShopifyHeadlessApp.clearCache();
```

## 🎨 Styling Tips

### CSS Grid for Product Layouts

```css
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}
```

### Responsive Images

```css
.product-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 4px;
}
```

### Button States

```css
button {
  transition: all 0.3s ease;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

button:hover:not(:disabled) {
  transform: translateY(-1px);
}
```

## 🚨 Troubleshooting

### Common Issues

1. **"Template not found"** - Make sure your `<template>` element has the correct `id`
2. **"Collection not found"** - Verify the collection handle exists in your Shopify store
3. **"Configuration error"** - Check your `.env` file has the correct Shopify credentials
4. **Products not loading** - Open browser developer tools to check for API errors

### Debug Mode

Load the development build for more detailed error messages:

```html
<script src="./dist/shopify-headless-app.dev.js"></script>
```

## 🎉 That's It!

The declarative system makes it incredibly easy to build dynamic Shopify storefronts. Just add data attributes, define templates, and everything works automatically!

For more advanced usage, you can still access the JavaScript API directly:

```javascript
ShopifyHeadlessApp.Products.getProductByHandle('my-product');
```
