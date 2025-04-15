import { createStorefrontApiClient } from "@shopify/storefront-api-client";
import { LATEST_API_VERSION } from "@shopify/shopify-api";

const storefrontClient = createStorefrontApiClient({
  storeDomain: process.env.NEXT_PUBLIC_API_URL || "",
  apiVersion: LATEST_API_VERSION,
  publicAccessToken: process.env.NEXT_PUBLIC_ACCESS_TOKEN,
});

export const getProductDetailsFromVariantId = async (variantId: string) => {
  const query = `
  query getProductNameFromVariant($variantId: ID!) {
    node(id: $variantId) {
      ... on ProductVariant {
        product {
          id
          title
          images(first: 1) {
            nodes {
              url
            }
          }
        }
      }
    }
  }`;

  const res = await storefrontClient.request(query, {
    variables: { variantId },
  });

  return res.data.node;
};
