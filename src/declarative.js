// Declarative Data Attribute System for Shopify Headless App
import * as Collections from './collections.js';
import * as Products from './products.js';
import * as Search from './search.js';
import * as Cart from './cart.js';

export class ShopifyDeclarativeLoader {
  constructor() {
    this.selectors = {
      containers: '[data-shopify]',
      templates: 'template[id]',
      addToCart: '[data-add-to-cart]',
      variantSelector: '[data-variant-selector]',
      pagination: '[data-pagination]',
    };

    this.templateCache = new Map();
    this.init();
  }

  async init() {
    // Load templates into cache
    this.loadTemplates();

    // Process all shopify containers
    await this.processContainers();

    // Set up event listeners
    this.setupEventListeners();

    console.log('Shopify Declarative System initialized');
  }

  loadTemplates() {
    const templates = document.querySelectorAll(this.selectors.templates);
    templates.forEach((template) => {
      this.templateCache.set(template.id, template.innerHTML);
    });
  }

  async processContainers() {
    const containers = document.querySelectorAll(this.selectors.containers);

    for (const container of containers) {
      try {
        await this.processContainer(container);
      } catch (error) {
        console.error('Error processing container:', container, error);
        this.renderError(container, error.message);
      }
    }
  }

  async processContainer(container) {
    const type = container.dataset.shopify;
    const templateId = container.dataset.template;

    if (!templateId || !this.templateCache.has(templateId)) {
      throw new Error(`Template "${templateId}" not found`);
    }

    // Show loading state
    this.renderLoading(container);

    let data;
    switch (type) {
      case 'products':
        data = await this.fetchProducts(container);
        break;
      case 'product':
        data = await this.fetchProduct(container);
        break;
      case 'collections':
        data = await this.fetchCollections(container);
        break;
      case 'search':
        data = await this.fetchSearch(container);
        break;
      case 'cart':
        data = await this.fetchCart(container);
        break;
      default:
        throw new Error(`Unknown shopify type: ${type}`);
    }

    this.render(container, templateId, data);
  }

  async fetchProducts(container) {
    const collection = container.dataset.collection;
    const limit = parseInt(container.dataset.limit) || 10;
    const sort = container.dataset.sort || 'COLLECTION_DEFAULT';

    if (!collection) {
      throw new Error('data-collection is required for products');
    }

    // Note: Current API doesn't support limit/sort parameters
    // TODO: Enhance the API to support these parameters
    const allProducts = await Collections.fetchProductsByCollection(collection);

    // Apply client-side limit for now
    const products = allProducts.slice(0, limit);

    return { products, collection };
  }

  async fetchProduct(container) {
    const handle = container.dataset.handle;
    const id = container.dataset.id;

    if (!handle && !id) {
      throw new Error('data-handle or data-id is required for product');
    }

    const product = handle
      ? await Products.fetchProductByHandle(handle)
      : await Products.fetchProductById(id);

    return { product };
  }

  async fetchCollections(container) {
    // Note: fetchCollections doesn't currently support limit parameter
    const collections = await Collections.fetchCollections();
    return { collections };
  }

  async fetchSearch(container) {
    const query = container.dataset.query;
    const limit = parseInt(container.dataset.limit) || 10;

    if (!query) {
      throw new Error('data-query is required for search');
    }

    // Note: Current API doesn't support limit parameter
    const allResults = await Search.searchProducts(query);

    // Apply client-side limit for now
    const results = allResults.slice(0, limit);

    return { results, query };
  }

  async fetchCart(container) {
    const cart = await Cart.getCart();
    return { cart };
  }

  render(container, templateId, data) {
    const template = this.templateCache.get(templateId);
    let html = template;

    // Simple template engine
    if (data.products) {
      html = this.renderList(template, data.products);
    } else if (data.collections) {
      html = this.renderList(template, data.collections);
    } else if (data.results) {
      html = this.renderList(template, data.results);
    } else if (data.product) {
      html = this.renderSingle(template, data.product);
    } else if (data.cart) {
      html = this.renderCart(template, data.cart);
    }

    container.innerHTML = html;

    // Add pagination if needed
    this.addPagination(container, data);
  }

  renderList(template, items) {
    return items.map((item) => this.renderSingle(template, item)).join('');
  }

  renderSingle(template, item) {
    let html = template;

    // Replace simple variables {{variable}}
    html = html.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      const value = this.getNestedProperty(item, key);
      // Only log if value is missing for important fields
      if (!value && ['image', 'price'].includes(key)) {
        console.warn(
          `Missing ${key} for item:`,
          item.title || item.id
        );
      }
      return value || '';
    });

    // Handle arrays {{#each array}}...{{/each}}
    html = html.replace(
      /\{\{#each (\w+)\}\}(.*?)\{\{\/each\}\}/gs,
      (match, arrayKey, innerTemplate) => {
        let array = this.getNestedProperty(item, arrayKey);

        // Handle different array structures
        if (arrayKey === 'images' && array && array.edges) {
          // Convert GraphQL edges structure to simple array of URLs
          array = array.edges.map((edge) => edge.node.url);
        } else if (arrayKey === 'variants' && array && array.edges) {
          // Convert GraphQL edges structure for variants
          array = array.edges.map((edge) => edge.node);
        }

        if (!Array.isArray(array)) {
          console.warn(`Array ${arrayKey} is not an array:`, array);
          return '';
        }

        return array
          .map((arrayItem, index) => {
            let itemHtml = innerTemplate;

            // For simple string values (like image URLs), replace {{this}}
            if (typeof arrayItem === 'string') {
              itemHtml = itemHtml.replace(/\{\{this\}\}/g, arrayItem);
            }
            // For object values (like variants), handle properties
            else if (typeof arrayItem === 'object') {
              itemHtml = itemHtml.replace(
                /\{\{(\w+)\}\}/g,
                (propMatch, propKey) => {
                  if (propKey === 'this') return String(arrayItem);

                  // Handle nested properties like price.amount
                  if (propKey === 'price' && arrayItem.price) {
                    return parseFloat(arrayItem.price.amount).toFixed(2);
                  }

                  return arrayItem[propKey] || '';
                }
              );
            }

            return itemHtml;
          })
          .join('');
      }
    );

    return html;
  }

  renderCart(template, cart) {
    if (!cart.lines || cart.lines.length === 0) {
      return '<p>Your cart is empty</p>';
    }

    return this.renderList(template, cart.lines);
  }

  getNestedProperty(obj, path) {
    return path.split('.').reduce((current, key) => {
      if (current && typeof current === 'object') {
        // Handle special formatting for Shopify data structure
        if (key === 'price') {
          // Try different possible price structures

          let price = null;

          // First try priceRange (most reliable for display)
          if (current.priceRange && current.priceRange.minVariantPrice) {
            price = current.priceRange.minVariantPrice.amount;
          }
          // Then try variants with edges/node structure
          else if (
            current.variants &&
            current.variants.edges &&
            current.variants.edges.length > 0
          ) {
            price = current.variants.edges[0].node.price.amount;
          }
          // Then try direct variants array
          else if (
            current.variants &&
            current.variants.length > 0 &&
            current.variants[0].price
          ) {
            price = current.variants[0].price.amount;
          }

          // Format price properly
          if (price && price !== '0.0') {
            return parseFloat(price).toFixed(2);
          }

          return '0.00';
        }
        if (key === 'image') {
          // Try different possible image structures

          // For collections: direct image object
          if (current.image && current.image.url) {
            return current.image.url;
          }

          // For products: images array with edges/node structure
          if (
            current.images &&
            current.images.edges &&
            current.images.edges.length > 0
          ) {
            return current.images.edges[0].node.url;
          }

          // For products: direct images array
          if (
            current.images &&
            Array.isArray(current.images) &&
            current.images.length > 0
          ) {
            return current.images[0].url || current.images[0];
          }

          // Log when we can't find an image (for debugging)
          if (!current.title || current.title.includes('Debug')) {
            console.warn('No image found for:', current.title || current.id);
          }

          // Fallback to a placeholder image if no image found
          return 'https://placehold.co/600x400?text=No+Image';
        }
        if (key === 'variantId') {
          // Try different possible variant structures
          if (
            current.variants &&
            current.variants.edges &&
            current.variants.edges.length > 0
          ) {
            return current.variants.edges[0].node.id;
          }
          if (current.variants && current.variants.length > 0) {
            return current.variants[0].id;
          }
        }
        return current[key];
      }
      return null;
    }, obj);
  }

  renderLoading(container) {
    container.innerHTML = '<div class="shopify-loading">Loading...</div>';
  }

  renderError(container, message) {
    container.innerHTML = `<div class="shopify-error">Error: ${message}</div>`;
  }

  setupEventListeners() {
    // Add to cart buttons
    document.addEventListener('click', async (e) => {
      if (e.target.matches(this.selectors.addToCart)) {
        e.preventDefault();
        await this.handleAddToCart(e.target);
      }
    });

    // Pagination
    document.addEventListener('click', (e) => {
      if (e.target.matches('[data-pagination-page]')) {
        e.preventDefault();
        this.handlePagination(e.target);
      }
    });
  }

  async handleAddToCart(button) {
    const variantId =
      button.dataset.addToCart ||
      (button.dataset.variantFromSelector && this.getSelectedVariant(button));
    const quantity = parseInt(button.dataset.quantity) || 1;

    if (!variantId) {
      alert('Please select a variant');
      return;
    }

    try {
      button.textContent = 'Adding...';
      button.disabled = true;

      await Cart.addToCart(variantId, quantity);

      button.textContent = 'Added!';
      setTimeout(() => {
        button.textContent = 'Add to Cart';
        button.disabled = false;
      }, 2000);

      // Refresh cart displays
      this.refreshCartDisplays();
    } catch (error) {
      console.error('Add to cart error:', error);
      button.textContent = 'Error';
      setTimeout(() => {
        button.textContent = 'Add to Cart';
        button.disabled = false;
      }, 2000);
    }
  }

  getSelectedVariant(button) {
    const container = button.closest('[data-shopify="product"]');
    const selector = container?.querySelector(this.selectors.variantSelector);
    return selector?.value;
  }

  async refreshCartDisplays() {
    const cartContainers = document.querySelectorAll('[data-shopify="cart"]');
    for (const container of cartContainers) {
      await this.processContainer(container);
    }
  }

  addPagination(container, data) {
    const paginationContainer = container.querySelector('[data-pagination]');
    if (!paginationContainer || !data.hasNextPage) return;

    // Simple pagination implementation
    paginationContainer.innerHTML = `
      <button data-pagination-page="next" ${
        !data.hasNextPage ? 'disabled' : ''
      }>
        Load More
      </button>
    `;
  }
}

// Auto-initialize when DOM is ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      new ShopifyDeclarativeLoader();
    });
  } else {
    new ShopifyDeclarativeLoader();
  }
}

export default ShopifyDeclarativeLoader;
