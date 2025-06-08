import { GrpcWebFetchTransport } from "@protobuf-ts/grpcweb-transport";
import { useMemo, useRef } from "react";
import { CodeCompletionClient } from "./grpc/generated/code-completion.client";
import { RpcStatus } from "@protobuf-ts/runtime-rpc";
import { GetCompletionReply, GetDescriptionReply, GetDiagnosticsReply } from "./grpc/generated/code-completion";

export type SessionStatus = 'offline' | 'starting' | 'stopping' | 'active' | 'processing';

export interface UseCodeCompletionService {
    sessionId: string | undefined;
    status: SessionStatus,
    updateSession: (code: string, caretPosition: number) => Promise<void>;
    getCompletion: () => Promise<GetCompletionReply>;
    getDescription: (wordAtPosition: string) => Promise<GetDescriptionReply>;
    getDiagnostics: () => Promise<GetDiagnosticsReply>;
}

export function useCodeCompletionService(serverAddres: string): UseCodeCompletionService {
    const transport = useMemo(() => new GrpcWebFetchTransport({
        baseUrl: serverAddres
    }), [serverAddres]);
    const client = useMemo(() => new CodeCompletionClient(transport), [transport]);

    const sessionId = useRef<string | undefined>();
    const status = useRef<SessionStatus>('offline');

    useMemo(async () => {
        if (status.current !== 'offline') {
            return;
        }

        status.current = 'starting';
        await startSession();
        status.current = 'active';

        return async () => {
            await stopSession();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    async function startSession(): Promise<RpcStatus> {
        const { status, response } = await client.startSession({ code: '', caretPosition: 0 });
        sessionId.current = response.uuid;
        console.log(sessionId.current);
        return status;
    }

    async function stopSession(): Promise<void> {
        if (!sessionId.current ||
            status.current === 'stopping' ||
            status.current === 'offline') {
            return;
        }

        const { status: localStatus } = await client.stopSession({ uuid: sessionId.current });
        console.log(localStatus);
    }

    async function updateSession(code: string, caretPosition: number): Promise<void> {
        if (!sessionId.current ||
            status.current !== 'active'
        ) {
            return;
        }

        await client.updateSession({
            sessionUuid: sessionId.current,
            code,
            caretPosition
        });
    }

    async function getCompletion(): Promise<GetCompletionReply> {
        if (!sessionId.current) {
            throw 'The current session doesn\'t have a Id';
        }

        const { response } = await client.getCompletion({
            uuid: sessionId.current
        });
        return response;
    }

    async function getDescription(wordAtPosition: string): Promise<GetDescriptionReply> {
        if (!sessionId.current) {
            throw 'The current session doesn\'t have a Id!';
        }

        const { response } = await client.getDescription({
            sessionUuid: sessionId.current,
            activeWord: wordAtPosition
        });

        return response;
    }

    async function getDiagnostics(): Promise<GetDiagnosticsReply> {
        if (!sessionId.current) {
            throw 'The current session doesn\'t have a Id!';
        }

        const { response } = await client.getDiagnostics({
            uuid: sessionId.current
        });

        return response;
    }

    return { sessionId: sessionId.current, status: status.current, updateSession, getCompletion, getDescription, getDiagnostics }
}