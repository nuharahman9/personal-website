import type { AnchorHTMLAttributes } from 'react';

type ExternalLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'target' | 'rel'> & {
  href: string;
};

/** Opens in a new tab; announces that to screen readers. */
export function ExternalLink({ children, ...rest }: ExternalLinkProps) {
  return (
    <a {...rest} target="_blank" rel="noreferrer">
      {children}
      <span className="visually-hidden"> (opens in new tab)</span>
    </a>
  );
}
