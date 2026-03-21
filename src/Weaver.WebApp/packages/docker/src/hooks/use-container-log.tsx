import { useEffect, useState, useRef } from 'react';
import useDocker from './use-docker';

export function useContainerLogs(
    identifier: string,
    params?: { follow?: boolean; timestamps?: boolean; tail?: string }
) {
    const { dockerApiAddress } = useDocker();
    const [lines, setLines] = useState<string[]>([]);
    const [error, setError] = useState<Error | null>(null);
    const [isStreaming, setIsStreaming] = useState(false);
    const abortRef = useRef<AbortController | null>(null);

    useEffect(() => {
        abortRef.current = new AbortController();
        setLines([]);
        setError(null);
        setIsStreaming(true);

        const query = new URLSearchParams({
            follow: String(params?.follow ?? true),
            timestamps: String(params?.timestamps ?? false),
            tail: params?.tail ?? '100',
        });

        (async () => {
            try {
                const response = await fetch(
                    `${dockerApiAddress}/Container/${identifier}/logs?${query}`,
                    {
                        signal: abortRef.current!.signal
                    },

                );

                if (!response.ok) {
                    console.error(`HTTP ${response.status}`);
                    return;
                }
                if (!response.body) {
                    console.error('No response body');
                    return;
                }

                const reader = response.body
                    .pipeThrough(new TextDecoderStream())
                    .getReader();

                while (!abortRef.current?.signal.aborted) {
                    const result = await reader.read();
                    if (result.done) break;

                    const newLines = result.value
                        .split('\n')
                        .filter(l => l.length > 0);

                    setLines(prev => {
                        const combined = [...prev, ...newLines];
                        const maxTail = params?.tail === 'all' ? combined.length : parseInt(params?.tail ?? '100', 10);
                        const excess = combined.length - maxTail;
                        return excess > 0 ? combined.slice(excess) : combined;
                    });
                }
            } catch (err) {
                if ((err as Error).name !== 'AbortError') {
                    setError(err as Error);
                }
            }
            setIsStreaming(false);
        })();

        return () => abortRef.current?.abort();
    }, [identifier, params?.follow, params?.timestamps, params?.tail]);

    return { lines, error, isStreaming };
}