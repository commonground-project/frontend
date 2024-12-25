import { UUID } from "crypto";

export interface Issue {
    id: UUID;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    description: string;
    insight: string;
    authorId: UUID;
    authorName: string;
    authorAvatar: string;
    facts: Fact[];
}

export interface FactReference {
    id: UUID;
    createdAt: Date;
    url: string;
    icon: string;
    title: string;
}

export interface Fact {
    id: UUID;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    authorId: UUID;
    authorName: string;
    authorAvatar: string;
    references: FactReference[];
}

export enum Reaction {
    NONE = "NONE",
    LIKE = "LIKE",
    REASONABLE = "REASONABLE",
    DISLIKE = "DISLIKE",
}

export interface ViewPoint {
    id: UUID;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    content: string;
    authorId: UUID;
    authorName: string;
    authorAvatar: string;
    userReaction: {
        reaction: Reaction;
    };
    likeCount: number;
    reasonableCount: number;
    dislikeCount: number;
    facts: Fact[];
}
