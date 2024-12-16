// cartFunctions.js
import log from 'loglevel';
import { CREATE_CART_SUB_MUTATION } from '@/graphql/cart';
import shopify from '@/utils/shopify-api';

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
};

const setCookie = (name, value, days) => {
  let expires = '';
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = `; expires=${date.toUTCString()}`;
  }
  document.cookie = `${name}=${value || ''}${expires}; path=/`;
};

export const fetchCartIdOnLoad = () => {
  return new Promise((resolve, reject) => {
    const storedCartId = getCookie('shopifyCartId');
    if (storedCartId) {
      resolve(storedCartId);
    } else {
      log.error('No cart ID found in cookies.');
      reject('No cart ID found in cookies.');
    }
  });
};

// Function to fetch or create cart ID
export const fetchOrCreateCartId = async () => {
  let cartId = getCookie('shopifyCartId');
  if (!cartId) {
    try {
      const response = await shopify.query(CREATE_CART_SUB_MUTATION, {
        input: {}
      }); // Assumed minimal input for cart creation

      if (response.errors && response.errors.length > 0) {
        log.error('Error creating new cart:', response.errors);
        throw new Error('Failed to create new cart');
      }

      const newCartId = response.result?.cart?.id; // Adjust according to actual response structure
      if (!newCartId) {
        log.error('No cart ID returned from creation mutation:', response);
        throw new Error('No cart ID returned from creation mutation');
      }

      cartId = newCartId;
      setCookie('shopifyCartId', cartId, 7);
    } catch (error) {
      log.error('Error during cart creation:', error);
      throw error;
    }
  }
  return cartId;
};
