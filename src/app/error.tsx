'use client';

import { useEffect } from 'react';
import { Button, ButtonLink, Container } from '@/components/primitives';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Replace with the project's error reporter when one is configured.
    console.error('[app] unhandled error', error);
  }, [error]);

  return (
    <Container>
      <div className="py-24 text-center sm:py-32">
        <p className="t-eyebrow mb-4 text-gold">Something went wrong</p>
        <h1 className="t-display-2">We hit an unexpected problem</h1>
        <p className="t-lead mx-auto mt-5 max-w-lg">
          This is on us, not on you. Try again — and if it keeps happening, tell us and we will
          look into it.
        </p>
        {error.digest ? (
          <p className="t-num mt-4 text-xs text-[color:var(--subtle-fg)]">
            Reference: {error.digest}
          </p>
        ) : null}
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Button onClick={reset}>Try again</Button>
          <ButtonLink href="/" variant="secondary">Back to the home page</ButtonLink>
        </div>
      </div>
    </Container>
  );
}
