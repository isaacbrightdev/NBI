export const mapProductIds = (arr) => arr.map((product) => `${product.id}`);

export const mapProductVariantIds = (arr) =>
  arr.flatMap((products) => mapProductIds(products.variants));
