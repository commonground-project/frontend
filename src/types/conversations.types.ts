export interface Issue {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    description: string;
    insight: string;
    authorId: string;
    authorName: string;
    authorAvatar: string;
    facts: Fact[];
}

export interface FactReference {
    id: string;
    createdAt: Date;
    url: string;
    title: string;
    icon: string;
}

export interface Fact {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    authorAvatar: string;
    authorId: string;
    authorName: string;
    references: FactReference[];
}

export enum Reaction {
    NONE = "NONE",
    LIKE = "LIKE",
    REASONABLE = "REASONABLE",
    DISLIKE = "DISLIKE",
}

export interface ViewPoint {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    content: string;
    authorId: string;
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
