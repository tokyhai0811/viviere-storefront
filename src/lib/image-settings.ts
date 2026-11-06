/**
 * Image sizes and quality for the product page, in one place to tune.
 *
 * Images are resized on Vercel from the master in S3 (up to 3840px wide, set
 * in viviere-backend's src/modules/s3-webp/compress.ts). Widths must be one of
 * Next.js's sizes (640, 750, 828, 1080, 1200, 1920, 2048, 3840) and quality
 * one of `images.qualities` in next.config.ts.
 */
export const PRODUCT_PAGE_IMAGES = {
  quality: 90,
  // The smallest copy ever served, whatever the screen. 1920px at quality 90
  // is roughly 300 KB or more for a product photo.
  minWidthDesktop: 1920,
  minWidthMobile: 1200,
} as const
