export interface Game {
  id: string,
  name: string,
  owner_id: string,
  status: GameStatus,
  type: GameTypes,
  description?: string,
  fail_weight?: number,
  timer?: number,
  show_answer_status?: boolean,
  show_answers?: boolean,
  standalone?: boolean,
}

export enum GameTypes {
  INDIVIDUAL = 'INDIVIDUAL',
  COLLECTIVE = 'COLLECTIVE',
}

export enum GameStatus {
  IN_GAME = 'IN_GAME',
  WAITING_FOR_START = 'WAITING_FOR_START',
  PUBLISHED = 'PUBLISHED',
  CREATED = 'CREATED',
  DELETED = 'DELETED',
}
