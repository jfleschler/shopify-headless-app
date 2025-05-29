import { CLASS_NAMES } from './constants.js';
import { addToCart } from './cart.js';

export const renderProducts = (products) => {
  const container = document.getElementById('product-list');
  if (!container) return;
  container.innerHTML = '';
  products.forEach((product) => {
    const card = document.createElement('div');
    card.className = CLASS_NAMES.PRODUCT_CARD;
    const imageUrl =
      product.product?.images?.edges?.[0]?.node?.url ||
      product.images?.edges?.[0]?.node?.url ||
      'https://via.placeholder.com/300x200?text=No+Image';
    const title = product.product?.title || product.title;
    const price =
      product.product?.variants?.edges?.[0]?.node?.price?.amount ||
      product.variants?.edges?.[0]?.node?.price?.amount ||
      '0.00';
    const variantId =
      product.product?.variants?.edges?.[0]?.node?.id ||
      product.variants?.edges?.[0]?.node?.id;

    card.innerHTML = `
      <img src="${imageUrl}" alt="${title}" class="${CLASS_NAMES.PRODUCT_IMAGE}" />
      <h3 class="${CLASS_NAMES.PRODUCT_TITLE}">${title}</h3>
      <p class="${CLASS_NAMES.PRODUCT_PRICE}">$${price}</p>
      <button class="${CLASS_NAMES.ADD_TO_CART_BTN}" data-variant-id="${variantId}">Add to Cart</button>
    `;

    // Add event listener for add to cart button
    const addToCartBtn = card.querySelector(`.${CLASS_NAMES.ADD_TO_CART_BTN}`);
    addToCartBtn.addEventListener('click', () => {
      if (variantId) {
        addToCart(variantId, 1);
        addToCartBtn.textContent = 'Added!';
        setTimeout(() => {
          addToCartBtn.textContent = 'Add to Cart';
        }, 2000);
      }
    });

    container.appendChild(card);
  });
};

export const renderProductDetails = (product) => {
  const container = document.getElementById(
    CLASS_NAMES.PRODUCT_DETAIL_CONTAINER
  );
  if (!container || !product) return;

  const imageUrl =
    product.images?.edges?.[0]?.node?.url ||
    'https://via.placeholder.com/500x400?text=No+Image';
  const price = product.variants?.edges?.[0]?.node?.price?.amount || '0.00';
  const variantId = product.variants?.edges?.[0]?.node?.id;

  container.innerHTML = `
    <h2>${product.title}</h2>
    <img src="${imageUrl}" alt="${product.title}" class="${
    CLASS_NAMES.PRODUCT_IMAGE
  }" />
    <p>${product.description || 'No description available'}</p>
    <p class="${CLASS_NAMES.PRODUCT_PRICE}">Price: $${price}</p>
    <button class="${
      CLASS_NAMES.ADD_TO_CART_BTN
    }" data-variant-id="${variantId}">Add to Cart</button>
  `;

  // Add event listener
  const addToCartBtn = container.querySelector(
    `.${CLASS_NAMES.ADD_TO_CART_BTN}`
  );
  if (addToCartBtn && variantId) {
    addToCartBtn.addEventListener('click', () => {
      addToCart(variantId, 1);
      addToCartBtn.textContent = 'Added!';
      setTimeout(() => {
        addToCartBtn.textContent = 'Add to Cart';
      }, 2000);
    });
  }
};

export const renderSearchResults = (results) => {
  const container = document.getElementById('search-results');
  if (!container) return;
  container.innerHTML = '';
  results.forEach((item) => {
    const resultItem = document.createElement('div');
    resultItem.className = CLASS_NAMES.SEARCH_ITEM;
    resultItem.innerHTML = `<a href="/products/${item.handle}">${item.title}</a>`;
    container.appendChild(resultItem);
  });
};

export const renderCollections = (cols) => {
  const container = document.getElementById('collections-list');
  if (!container) return;
  container.innerHTML = '';
  cols.forEach((col) => {
    const link = document.createElement('a');
    link.href = `/collections/${col.handle}`;
    link.textContent = col.title;
    link.className = CLASS_NAMES.COLLECTION_LINK;
    container.appendChild(link);
  });
};

export const renderCartItems = (items) => {
  const container = document.getElementById('cart-items');
  if (!container) return;
  container.innerHTML = '';
  items.forEach((item) => {
    const line = document.createElement('div');
    line.className = CLASS_NAMES.CART_ITEM;
    line.innerHTML = `
      <span>${item.product.title}</span>
      <input type="number" value="${item.quantity}" min="1" data-variant-id="${
      item.variantId
    }" class="${CLASS_NAMES.CART_QTY_INPUT}" />
      <span>$${(item.price * item.quantity).toFixed(2)}</span>
      <button class="${CLASS_NAMES.REMOVE_CART_ITEM_BTN}" data-variant-id="${
      item.variantId
    }">Remove</button>
    `;
    container.appendChild(line);
  });
};

export const renderPaginationControls = (page) => {
  const container = document.getElementById(CLASS_NAMES.PAGINATION_CONTAINER);
  if (!container) return;
  container.innerHTML = '';
  const prev = document.createElement('button');
  prev.textContent = 'Previous';
  prev.disabled = page <= 1;
  prev.onclick = () =>
    window.dispatchEvent(new CustomEvent('paginate', { detail: page - 1 }));
  const next = document.createElement('button');
  next.textContent = 'Next';
  next.onclick = () =>
    window.dispatchEvent(new CustomEvent('paginate', { detail: page + 1 }));
  container.append(prev, document.createTextNode(` Page ${page} `), next);
};
