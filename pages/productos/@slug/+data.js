function createHeaders() {
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
  return {
    apikey: anonKey,
    Authorization: `Bearer ${anonKey}`,
  }
}

async function fetchBySku(baseUrl, slug, headers) {
  const url = `${baseUrl}/rest/v1/productos?select=idProducto,sku,nombre,descripcionLarga,descripcionCorta,precio,precio_oferta,imagen,marca,pn&sku=eq.${encodeURIComponent(slug)}&limit=1`
  const response = await fetch(url, { headers })
  if (!response.ok) throw new Error(`Supabase request failed with ${response.status}`)
  const rows = await response.json()
  return rows?.[0] || null
}

async function fetchById(baseUrl, slug, headers) {
  const url = `${baseUrl}/rest/v1/productos?select=idProducto,sku,nombre,descripcionLarga,descripcionCorta,precio,precio_oferta,imagen,marca,pn&idProducto=eq.${encodeURIComponent(slug)}&limit=1`
  const response = await fetch(url, { headers })
  if (!response.ok) throw new Error(`Supabase request failed with ${response.status}`)
  const rows = await response.json()
  return rows?.[0] || null
}

export async function data(pageContext) {
  const baseUrl = import.meta.env.VITE_SUPABASE_URL
  const slug = pageContext.routeParams.slug

  if (!baseUrl || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
    return {
      product: null,
      slug,
      missingConfig: true,
    }
  }

  const headers = createHeaders()

  let product = await fetchBySku(baseUrl, slug, headers)
  if (!product && /^\d+$/.test(slug)) {
    product = await fetchById(baseUrl, slug, headers)
  }

  return {
    product,
    slug,
    missingConfig: false,
  }
}
