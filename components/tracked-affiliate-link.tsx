'use client'

import { useCallback } from 'react'

type Props = {
  productId: string
  retailer: string
  url: string
  className?: string
  children: React.ReactNode
}

export function TrackedAffiliateLink({
  productId,
  retailer,
  url,
  className,
  children,
}: Props) {
  const handleClick = useCallback(() => {
    fetch('/api/affiliate-click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, retailer }),
      keepalive: true,
    }).catch(() => {})
  }, [productId, retailer])

  return (
    <a
      href={url}
      target="_blank"
      rel="sponsored noopener noreferrer"
      onClick={handleClick}
      className={className}
    >
      {children}
    </a>
  )
}