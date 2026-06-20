// Types partagés entre App, LoadingScreen et SettingsView (desktop).

// Miroir du payload de la commande Rust get_server_info (server.rs).
export interface ServerInfo {
  ip: string;
  port: number;
  ws_url: string;
  listening: boolean;
}

// Miroir de la commande Rust detect_sc_install (sc_detect.rs).
export interface ScInstall {
  path: string | null;
  channel: string | null;
  detected: boolean;
  // "manual" = chemin choisi par l'utilisateur (prioritaire), "auto" = auto-détecté.
  source: "manual" | "auto" | null;
}

export interface LogEntry {
  key: number;
  time: string;
  actionId: string;
  label: string;
  detail: string;
  kind: "ok" | "unassigned" | "error";
}

export interface Device {
  clientId: number;
  addr: string;
}

export type StepStatus = "done" | "current" | "upcoming" | "error";
export interface LoadStep {
  label: string;
  status: StepStatus;
}
