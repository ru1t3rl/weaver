import { isRouteErrorResponse } from 'react-router-dom';

interface useErrorDetail {
  title: string;
  subtitle: string;
  message: string;
  stack: string | undefined;
}

export const useErrorDetail = (error: unknown): useErrorDetail => {
  if (isRouteErrorResponse(error)) {
    const map: Record<number, [string, string]> = {
      404: ["404 — You're completely lost", 'This page packed its bags and left. We have no idea where it went.'],
      401: ['401 — Who goes there?', 'You need to be logged in to see this. The bouncer said no.'],
      403: ['403 — Nope.', "Access denied. This page is VIP-only and you're not on the list."],
      503: ["503 — We're taking a nap", 'The server is temporarily unavailable. Poke it again in a moment.'],
    };
    const [title, subtitle] = map[error.status] ?? [
      `${error.status} — Something's off`,
      error.statusText || 'An unexpected error occurred.',
    ];
    return {
      title,
      subtitle,
      message: error.data?.message ?? error.statusText ?? `HTTP ${error.status}`,
      stack: undefined,
    };
  }

  if (error instanceof Error) {
    return {
      title: '500 — Oops, we tripped',
      subtitle: 'Something unexpected broke. Our little guy is as confused as you are.',
      message: error.message,
      stack: error.stack,
    };
  }

  return {
    title: '500 — Mystery error',
    subtitle: 'Something went wrong and we have absolutely no idea what.',
    message: String(error),
    stack: undefined,
  };
};

export default useErrorDetail;