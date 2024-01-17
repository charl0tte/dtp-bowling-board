export interface Player {
    name: string;
    scores: number[];
    framePoints?: Frame[];
    finalScore?: number;
}

export interface Frame {
    firstMove: Move;
    secondMove: Move;
    moves: Move[];
    isSpare: number;
    totalFrameScore: number;
}

export interface Move {
    score: number;
    isStrike: boolean;
}
