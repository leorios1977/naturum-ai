import type { Metadata } from 'next'
import Link from 'next/link'
import { EmailCaptureForm } from '@/components/email-capture-form'

export const metadata: Metadata = {
  title: 'Naturum.ai — Nature\'s Gathering Place for Natural Medicine',
  description:
    'The world\'s knowledge of natural medicine — plants, fungi, foods, and traditional practices — personalized for your body by AI. Join the waitlist.',
  openGraph: {
    title: 'Naturum.ai — Nature\'s Gathering Place',
    description:
      'AI-personalized natural medicine recommendations from a global database of plants, fungi, and traditional remedies.',
    url: 'https://naturum.ai',
    siteName: 'Naturum.ai',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Naturum.ai',
    description: 'AI-personalized natural medicine, from a global database.',
  },
}

const valueProps = [
  {
    title: 'Personalized by AI',
    body: 'Tell us your health profile. Our AI cross-references thousands of plants, fungi, and compounds against your goals — and gives you a protocol made for your body.',
    icon: '🧬',
  },
  {
    title: 'Global Plant Database',
    body: 'From milk thistle to lion\'s mane, from Schisandra to moringa — every entry includes evidence, dosing, sourcing, and what to avoid. All in plain language.',
    icon: '🌿',
  },
  {
    title: 'Built by a Global Community',
    body: 'Travelers, herbalists, and integrative doctors share what they\'ve learned. Live expeditions document plants in their native regions and bring that knowledge back to you.',
    icon: '🌍',
  },
]

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-stone-50 to-emerald-50">
      {/* Hero */}
      <section className="container mx-auto px-6 pt-20 pb-16 max-w-5xl">
        <div className="text-center">
          <p className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-sm font-medium mb-6">
            Now in early access · Free to join
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-stone-900 leading-tight mb-6">
            Nature&apos;s gathering place — <br className="hidden sm:block" />
            <span className="text-emerald-800">personalized for you.</span>
          </h1>
          <p className="text-lg sm:text-xl text-stone-700 max-w-2xl mx-auto mb-10 leading-relaxed">
            The world&apos;s knowledge of natural medicine — plants, fungi, foods,
            and traditional practices — organized by AI and tailored to your body.
          </p>

          <EmailCaptureForm source="hero" />

          <p className="text-sm text-stone-500 mt-4">
            No spam. Unsubscribe anytime. We&apos;ll only email when we launch.
          </p>
        </div>
      </section>

      {/* Value props */}
      <section className="container mx-auto px-6 py-20 max-w-6xl">
        <div className="grid md:grid-cols-3 gap-8">
          {valueProps.map((vp) => (
            <div
              key={vp.title}
              className="bg-white rounded-2xl p-8 shadow-sm border border-stone-200 hover:shadow-md transition"
            >
              <div className="text-4xl mb-4">{vp.icon}</div>
              <h3 className="text-xl font-serif font-bold text-stone-900 mb-3">
                {vp.title}
              </h3>
              <p className="text-stone-600 leading-relaxed">{vp.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured products placeholder — wire to DB in Block E */}
      <section className="container mx-auto px-6 py-20 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 mb-4">
            Where to start
          </h2>
          <p className="text-stone-600 max-w-2xl mx-auto">
            Three of the most-researched, beginner-friendly natural medicines.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { name: 'Milk Thistle', slug: 'milk-thistle', desc: 'Liver protection and regeneration. The most-studied liver herb.' },
            { name: 'Turmeric + Black Pepper', slug: 'turmeric-black-pepper', desc: 'Whole-body inflammation support. Curcumin needs pepper to absorb.' },
            { name: 'Lion\'s Mane', slug: 'lions-mane', desc: 'Cognitive support and nerve repair. A mushroom that grows on your brain too.' },
          ].map((p) => (
            <Link
              key={p.slug}
              href={`/products/${p.slug}`}
              className="block bg-white rounded-2xl p-6 border border-stone-200 hover:border-emerald-300 hover:shadow-md transition"
            >
              <h3 className="text-lg font-serif font-bold text-stone-900 mb-2">
                {p.name}
              </h3>
              <p className="text-sm text-stone-600 mb-4">{p.desc}</p>
              <span className="text-sm font-medium text-emerald-700">
                Learn more →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="container mx-auto px-6 py-20 max-w-3xl">
        <div className="bg-emerald-800 rounded-3xl p-10 sm:p-14 text-center">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-4">
            Join the gathering.
          </h2>
          <p className="text-emerald-100 mb-8 max-w-xl mx-auto">
            Get the launch invite, early-access perks, and the first 30 plant guides
            delivered to your inbox.
          </p>
          <EmailCaptureForm source="footer_cta" />
        </div>
      </section>

      <footer className="border-t border-stone-200 mt-10">
        <div className="container mx-auto px-6 py-8 max-w-5xl text-center text-sm text-stone-500">
          <p>
            Naturum.ai is an educational platform. Content does not constitute medical
            advice. Always consult a qualified healthcare professional before starting
            any supplement or herbal protocol.
          </p>
          <p className="mt-3">© {new Date().getFullYear()} Agent Flow LLC. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}
