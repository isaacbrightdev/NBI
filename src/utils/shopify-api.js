import { createStorefrontClient } from '@shopify/hydrogen-react';
import log from 'loglevel';

const client = createStorefrontClient({
  publicStorefrontToken: import.meta.env.VITE_PUBLIC_STOREFRONT_API_TOKEN,
  storeDomain: `https://${import.meta.env.VITE_PUBLIC_STORE_DOMAIN}`,
  storefrontApiVersion: import.meta.env.VITE_PUBLIC_STOREFRONT_API_VERSION
});

client.query = async (query, variables = {}) => {
  const storefrontApiUrl = client.getStorefrontApiUrl();
  try {
    const response = await fetch(storefrontApiUrl, {
      body: JSON.stringify({
        query,
        variables
      }),
      // Generate the headers using the private token. Additionally, you can pass in the buyer's IP address from the request object to help prevent bad actors from overloading your store.
      headers: client.getPublicTokenHeaders(),
      method: 'POST'
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const { data, errors } = await response.json();

    if (errors) {
      throw errors;
    }

    return data;
  } catch (error) {
    log.error('Shopify client error:', {
      error,
      storefrontApiUrl,
      query,
      variables
    });
    return error;
  }
};

export const getStorefrontApiUrl = client.getStorefrontApiUrl;
export const getPrivateTokenHeaders = client.getPrivateTokenHeaders;

export default client;
