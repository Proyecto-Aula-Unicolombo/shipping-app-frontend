import { useEffect, useRef, useState, useCallback } from 'react';

export interface WebSocketMessage {
    type: string;
    payload: unknown;
}

interface UseWebSocketOptions {
    onOpen?: (ws: WebSocket) => void;
    onMessage?: (message: WebSocketMessage) => void;
    onClose?: () => void;
    onError?: (error: Event) => void;
    reconnect?: boolean;
    reconnectInterval?: number;
    maxReconnectAttempts?: number;
}

interface UseWebSocketReturn {
    isConnected: boolean;
    lastMessage: WebSocketMessage | null;
    sendMessage: (message: WebSocketMessage) => void;
    reconnect: () => void;
}

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000/api/v1/ws';

export function useWebSocket(
    options: UseWebSocketOptions = {}
): UseWebSocketReturn {
    const {
        onOpen,
        onMessage,
        onClose,
        onError,
        reconnect: shouldReconnect = true,
        reconnectInterval = 3000,
        maxReconnectAttempts = 5,
    } = options;

    const [isConnected, setIsConnected] = useState(false);
    const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);

    const wsRef = useRef<WebSocket | null>(null);
    const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
    const reconnectAttemptsRef = useRef(0);

    const onOpenRef = useRef(onOpen);
    const onMessageRef = useRef(onMessage);
    const onCloseRef = useRef(onClose);
    const onErrorRef = useRef(onError);

    useEffect(() => {
        onOpenRef.current = onOpen;
        onMessageRef.current = onMessage;
        onCloseRef.current = onClose;
        onErrorRef.current = onError;
    }, [onOpen, onMessage, onClose, onError]);

    const connect = useCallback(() => {
        try {
            console.log('🔌 Intentando conectar a WebSocket:', WS_URL);

            const ws = new WebSocket(WS_URL);
            wsRef.current = ws;

            ws.onopen = () => {
                console.log('✅ WebSocket conectado exitosamente!');
                console.log('   URL:', WS_URL);
                console.log('   ReadyState:', ws.readyState);
                setIsConnected(true);
                reconnectAttemptsRef.current = 0;
                if (onOpenRef.current) {
                    onOpenRef.current(ws);
                }
            };

            ws.onmessage = (event) => {
                try {
                    console.log('📨 Mensaje recibido:', event.data);
                    const message: WebSocketMessage = JSON.parse(event.data);
                    console.log('📦 Mensaje parseado:', message);
                    setLastMessage(message);
                    if (onMessageRef.current) {
                        onMessageRef.current(message);
                    }
                } catch (error) {
                    console.error('❌ Error al parsear mensaje:', error);
                }
            };

            ws.onclose = (event) => {
                console.log('🔌 WebSocket desconectado');
                console.log('   Code:', event.code);
                console.log('   Reason:', event.reason);
                console.log('   Clean:', event.wasClean);
                setIsConnected(false);
                wsRef.current = null;
                if (onCloseRef.current) {
                    onCloseRef.current();
                }

                // Intentar reconectar si está habilitado
                if (
                    shouldReconnect &&
                    reconnectAttemptsRef.current < maxReconnectAttempts
                ) {
                    reconnectAttemptsRef.current++;
                    console.log(
                        `🔄 Reintentando conexión... ${reconnectAttemptsRef.current}/${maxReconnectAttempts}`
                    );
                    reconnectTimeoutRef.current = setTimeout(() => {
                        connect();
                    }, reconnectInterval);
                } else if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
                    console.error('❌ Máximo de reintentos alcanzado. No se pudo conectar al WebSocket.');
                }
            };

            ws.onerror = (error) => {
                console.error('❌ WebSocket error:', error);
                console.error('   URL que falló:', WS_URL);
                console.error('   ReadyState:', ws.readyState);
                if (onErrorRef.current) {
                    onErrorRef.current(error);
                }
            };
        } catch (error) {
            console.error('❌ Error al crear conexión WebSocket:', error);
            console.error('   URL:', WS_URL);
        }
    }, [shouldReconnect, reconnectInterval, maxReconnectAttempts]);

    const sendMessage = useCallback((message: WebSocketMessage) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify(message));
        } else {
            console.warn('WebSocket is not connected. Message not sent.');
        }
    }, []);

    const manualReconnect = useCallback(() => {
        reconnectAttemptsRef.current = 0;
        connect();
    }, [connect]);

    useEffect(() => {
        connect();

        return () => {
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, [connect]);

    return {
        isConnected,
        lastMessage,
        sendMessage,
        reconnect: manualReconnect,
    };
}
