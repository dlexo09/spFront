import { supabase } from '../lib/supabase';

function isBannerActive(banner, now = new Date()) {
  if (Number(banner?.status) !== 1) return false;

  const startValue = banner?.fhInicio;
  const endValue = banner?.fhFin;

  if (!startValue && !endValue) return true;

  const startDate = startValue ? new Date(startValue) : null;
  const endDate = endValue ? new Date(endValue) : null;

  if (
    (startDate && Number.isNaN(startDate.getTime())) ||
    (endDate && Number.isNaN(endDate.getTime()))
  ) {
    return true;
  }

  if (startDate && now < startDate) return false;
  if (endDate && now > endDate) return false;

  return true;
}

function sortBanners(banners) {
  return [...banners].sort((left, right) => {
    const leftOrder = left.idBannerProducts ?? 0;
    const rightOrder = right.idBannerProducts ?? 0;

    return Number(leftOrder) - Number(rightOrder);
  });
}

function normalizeBanner(banner) {
  const imageUrl = banner.imgUrl || '';
  const title = banner.title || 'Banner Siscoprint';

  return {
    ...banner,
    imgUrl: imageUrl,
    image: imageUrl,
    title,
    alt: title,
    idProducto: banner.idProducto ?? null,
  };
}

export function fillBannerSlots(banners, slots) {
  if (!slots || slots <= 0) return banners;
  if (!banners.length) return Array(slots).fill(null);

  const filled = [];

  while (filled.length < slots) {
    filled.push(...banners);
  }

  return filled.slice(0, slots);
}

export async function getActiveBanners() {
  const { data, error } = await supabase
    .from('banners')
    .select('idBannerProducts, title, imgUrl, sku, idProducto, fhInicio, fhFin, status')
    .eq('status', 1);

  if (error) {
    console.error('Error al obtener banners:', error);
    return [];
  }

  const activeBanners = sortBanners(data || []).filter((banner) => isBannerActive(banner));

  return activeBanners.map((banner) => normalizeBanner(banner));
}