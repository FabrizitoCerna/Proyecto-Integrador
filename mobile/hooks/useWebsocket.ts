import { useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';

const WS_URL = 'http://192.168.56.1:8080/ws/websocket';

export const useWebSocket = (usuarioId: number, onMensaje: (mensaje: any) => void) => {
  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    if (!usuarioId) return;

    const client = new Client({
      brokerURL: WS_URL,
      reconnectDelay: 5000,
      onConnect: () => {
        console.log('WebSocket conectado');

        // Suscribirse a notificaciones del usuario
        client.subscribe(`/topic/usuario/${usuarioId}`, (message) => {
          const data = JSON.parse(message.body);
          onMensaje(data);
        });
      },
      onDisconnect: () => {
        console.log('WebSocket desconectado');
      },
      onStompError: (error) => {
        console.log('Error WebSocket:', error);
      }
    });

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, [usuarioId]);

  // Suscribirse a categoría (para especialista)
  const suscribirCategoria = (categoriaId: number) => {
    if (clientRef.current?.connected) {
      clientRef.current.subscribe(`/topic/categoria/${categoriaId}`, (message) => {
        const data = JSON.parse(message.body);
        onMensaje(data);
      });
    }
  };

  return { suscribirCategoria };
};