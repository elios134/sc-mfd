// @sc-mfd/shared — protocole de messages tablette → desktop.
// Transport WebSocket prévu plus tard ; ici seulement la forme des messages.

/** Version du protocole. À incrémenter en cas de changement non rétrocompatible. */
export const PROTOCOL_VERSION = "1";

/**
 * Demande d'exécution d'une action (l'identifiant correspond à `MfdAction.id`).
 * Le desktop résout l'`actionId` en touche réelle et l'envoie au jeu.
 */
export interface CommandMessage {
  type: "command";
  actionId: string;
}

/**
 * Union de tous les messages émis par la tablette vers le desktop.
 *
 * Discriminée par le champ littéral `type` : on ajoutera `handshake`, `ping`,
 * etc. en étendant simplement cette union, sans toucher au reste du code
 * (les `switch (msg.type)` resteront exhaustifs grâce au typage).
 */
export type ClientMessage = CommandMessage;
