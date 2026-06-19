// Connexion WebSocket tablette → desktop.
// Envoie des CommandMessage au format de @sc-mfd/shared (source unique du format).
// Pas de scan QR ici (reporté au packaging Capacitor) : saisie manuelle de l'adresse.

import { useCallback, useEffect, useRef, useState } from "react";
import type { CommandMessage } from "@sc-mfd/shared";

export type ConnState = "disconnected" | "connecting" | "connected" | "error";

const DEFAULT_PORT = 8420;
const RECONNECT_MS = 2500; // intervalle de retry de la reconnexion auto

/** Normalise une saisie utilisateur en URL ws complète.
 *  Accepte "ws://host:port", "host:port", "host" → "ws://host:port". */
export function normalizeWsUrl(raw: string): string {
  let s = raw.trim().replace(/^wss?:\/\//i, "");
  if (!s) return "";
  if (!/:\d+$/.test(s)) s += `:${DEFAULT_PORT}`;
  return `ws://${s}`;
}

/**
 * @param autoReconnect quand true, retente automatiquement la connexion (toutes
 *   les RECONNECT_MS) si le lien tombe APRÈS avoir été établi. S'arrête sur
 *   déconnexion volontaire ou si l'option est désactivée.
 */
export function useConnection(autoReconnect: boolean = false) {
  const [state, setState] = useState<ConnState>("disconnected");
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  // Refs pour la reconnexion auto (lues dans les closures des handlers WS).
  const autoReconnectRef = useRef(autoReconnect);
  const lastUrlRef = useRef<string>("");
  const voluntaryRef = useRef(false); // déconnexion demandée par l'utilisateur
  const wasConnectedRef = useRef(false); // a-t-on déjà été connecté à cette URL ?
  const retryTimerRef = useRef<number | null>(null);

  const clearRetry = useCallback(() => {
    if (retryTimerRef.current !== null) {
      window.clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }
  }, []);

  const cleanup = useCallback(() => {
    const ws = wsRef.current;
    if (ws) {
      ws.onopen = ws.onclose = ws.onerror = ws.onmessage = null;
      ws.close();
      wsRef.current = null;
    }
  }, []);

  const connect = useCallback(
    (rawUrl: string) => {
      const url = normalizeWsUrl(rawUrl);
      if (!url) {
        setError("Adresse vide");
        setState("error");
        return;
      }
      clearRetry();
      voluntaryRef.current = false;
      lastUrlRef.current = url;
      cleanup();
      setError(null);
      setState("connecting");
      try {
        const ws = new WebSocket(url);
        wsRef.current = ws;
        ws.onopen = () => {
          wasConnectedRef.current = true;
          setState("connected");
        };
        ws.onerror = () => {
          setError("Connexion impossible");
          setState("error");
        };
        ws.onclose = () => {
          // Reconnexion auto : seulement si le lien était établi et que la coupure
          // n'est pas volontaire. Évite de marteler une adresse jamais joignable.
          if (
            autoReconnectRef.current &&
            !voluntaryRef.current &&
            wasConnectedRef.current &&
            lastUrlRef.current
          ) {
            setState("connecting"); // « reconnexion en cours »
            clearRetry();
            retryTimerRef.current = window.setTimeout(() => {
              retryTimerRef.current = null;
              connect(lastUrlRef.current);
            }, RECONNECT_MS);
            return;
          }
          // Sinon : ne pas écraser un état d'erreur déjà posé.
          setState((prev) => (prev === "error" ? prev : "disconnected"));
        };
      } catch (e) {
        setError(String(e));
        setState("error");
      }
    },
    [cleanup, clearRetry]
  );

  const disconnect = useCallback(() => {
    voluntaryRef.current = true;
    wasConnectedRef.current = false;
    clearRetry();
    cleanup();
    setState("disconnected");
    setError(null);
  }, [cleanup, clearRetry]);

  /** Envoie un CommandMessage. Retourne false si non connecté (le caller garde
   *  alors le comportement local). */
  const sendCommand = useCallback((actionId: string): boolean => {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) return false;
    const msg: CommandMessage = { type: "command", actionId };
    ws.send(JSON.stringify(msg));
    return true;
  }, []);

  // Garde la ref à jour ; si on désactive l'auto-reconnexion, on stoppe tout retry
  // en attente (sans toucher l'état de connexion courant).
  useEffect(() => {
    autoReconnectRef.current = autoReconnect;
    if (!autoReconnect) clearRetry();
  }, [autoReconnect, clearRetry]);

  // Ferme proprement la socket et annule les retries au démontage.
  useEffect(() => {
    return () => {
      clearRetry();
      cleanup();
    };
  }, [cleanup, clearRetry]);

  return { state, error, connect, disconnect, sendCommand };
}
