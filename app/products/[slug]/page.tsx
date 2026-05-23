import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { TrackedAffiliateLink } from '@/components/tracked-affiliate-link'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()

  const { data: product } = await supabase
    .from('affiliate_products')
    .select('product_name, ai_generated_description, description, image_url')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (!product) {
    return { title: 'Product not found · Naturum.ai' }
  }

  const description =
    product.description ||
    product.ai_generated_description?.slice(0, 160) ||
    'Natural medicine product on Naturum.ai'

  return {
    title: `${product.product_name} — Naturum.ai`,
    description,
    openGraph: {
      title: product.product_name,
      description,
      images: product.image_url ? [product.image_url] : [],
    },
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: product, error } = await supabase
    .from('affiliate_products')
    .select(`
      *,
      related_source:natural_sources(
        id, primary_name, scientific_name, slug,
        plain_language_summary, primary_health_conditions,
        safety_warnings, daily_dose_safe, evidence_tier
      )
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error || !product) {
    notFound()
  }

  const retailers = [
    product.amazon_affiliate_url && { name: 'Amazon', url: product.amazon_affiliate_url, color: 'bg-orange-600 hover:bg-orange-700' },
    product.iherb_affiliate_url && { name: 'iHerb', url: product.iherb_affiliate_url, color: 'bg-green-600 hover:bg-green-700' },
    product.mountain_rose_affiliate_url && { name: 'Mountain Rose Herbs', url: product.mountain_rose_affiliate_url, color: 'bg-emerald-700 hover:bg-emerald-800' },
    product.yunnan_sourcing_url && { name: 'Yunnan Sourcing', url: product.yunnan_sourcing_url, color: 'bg-amber-700 hover:bg-amber-800' },
  ].filter(Boolean) as Array<{ name: string; url: string; color: string }>

  return (
    <main className="min-h-screen bg-stone-50">
      <div className="container mx-auto px-6 py-12 max-w-5xl">

        <nav className="text-sm text-stone-500 mb-6">
          <Link href="/" className="hover:text-emerald-700">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/products" className="hover:text-emerald-700">Products</Link>
          <span className="mx-2">/</span>
          <span className="text-stone-700">{product.product_name}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-10 mb-12">
          {product.image_url && (
            <div className="bg-white rounded-2xl p-6 border border-stone-200">
              <img
                src={product.image_url}
                alt={product.product_name}
                className="w-full h-auto rounded-xl object-cover"
              />
            </div>
          )}

          <div>
            {product.brand && (
              <p className="text-sm font-medium text-stone-500 uppercase tracking-wide mb-2">
                {product.brand}
              </p>
            )}
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 mb-3">
              {product.product_name}
            </h1>

            {product.related_source && (
              <p className="text-sm text-stone-600 mb-6">
                Made from{' '}
                <Link
                  href={`/sources/${product.related_source.slug}`}
                  className="text-emerald-700 hover:underline font-medium"
                >
                  {product.related_source.primary_name}
                </Link>
                {product.related_source.scientific_name && (
                  <em className="text-stone-500"> ({product.related_source.scientific_name})</em>
                )}
              </p>
            )}

            {product.average_price && (
              <p className="text-2xl font-bold text-stone-900 mb-2">
                ~${product.average_price.toFixed(2)}
              </p>
            )}

            {product.quality_rating && (
              <p className="text-sm text-stone-600 mb-6">
                Our quality rating:{' '}
                <span className="font-medium text-emerald-700">
                  {product.quality_rating}/10
                </span>
              </p>
            )}

            <div className="space-y-3">
              {retailers.map((r) => (
                <TrackedAffiliateLink
                  key={r.name}
                  productId={product.id}
                  retailer={r.name}
                  url={r.url}
                  className={`block w-full text-center px-6 py-3 rounded-lg text-white font-medium transition ${r.color}`}
                >
                  Buy on {r.name} →
                </TrackedAffiliateLink>
              ))}
            </div>

            <p className="text-xs text-stone-500 mt-4">
              Naturum earns a commission when you buy through these links.
              This does not affect what we recommend.
            </p>
          </div>
        </div>

        {(product.ai_generated_description || product.description) && (
          <section className="bg-white rounded-2xl p-8 border border-stone-200 mb-8">
            <h2 className="text-2xl font-serif font-bold text-stone-900 mb-4">
              About this product
            </h2>
            <div className="prose prose-stone max-w-none whitespace-pre-wrap">
              {product.ai_generated_description || product.description}
            </div>
          </section>
        )}

        {product.our_recommendation_notes && (
          <section className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 mb-8">
            <h2 className="text-xl font-serif font-bold text-emerald-900 mb-3">
              Our take
            </h2>
            <p className="text-emerald-900 leading-relaxed">
              {product.our_recommendation_notes}
            </p>
          </section>
        )}

        {product.related_source && (
          <section className="bg-white rounded-2xl p-8 border border-stone-200 mb-8">
            <h2 className="text-2xl font-serif font-bold text-stone-900 mb-4">
              About {product.related_source.primary_name}
            </h2>
            {product.related_source.plain_language_summary && (
              <p className="text-stone-700 leading-relaxed mb-6">
                {product.related_source.plain_language_summary}
              </p>
            )}
            {product.related_source.primary_health_conditions?.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-stone-900 mb-2">Commonly used for:</h3>
                <div className="flex flex-wrap gap-2">
                  {product.related_source.primary_health_conditions.map((c: string) => (
                    <span key={c} className="px-3 py-1 bg-stone-100 rounded-full text-sm text-stone-700">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {product.related_source.daily_dose_safe && (
              <p className="text-sm text-stone-700 mb-2">
                <strong className="text-stone-900">Typical safe dose:</strong>{' '}
                {product.related_source.daily_dose_safe}
              </p>
            )}
            {product.related_source.safety_warnings?.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
                <p className="text-sm font-semibold text-amber-900 mb-2">⚠️ Safety notes:</p>
                <ul className="list-disc list-inside text-sm text-amber-900 space-y-1">
                  {product.related_source.safety_warnings.map((w: string, i: number) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
              </div>
            )}
            <Link
              href={`/sources/${product.related_source.slug}`}
              className="inline-block mt-6 text-emerald-700 font-medium hover:underline"
            >
              Full plant profile →
            </Link>
          </section>
        )}

        <div className="border-t border-stone-200 pt-6 mt-12 text-xs text-stone-500 leading-relaxed">
          <p>
            <strong>Educational use only.</strong> Naturum.ai is an educational
            information platform. Nothing on this page constitutes medical advice,
            diagnosis, or treatment. Always consult a qualified healthcare
            professional before starting any supplement or herbal protocol.
            Individual results vary.
          </p>
        </div>
      </div>
    </main>
  )
}