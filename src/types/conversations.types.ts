export interface Issue {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    description: string;
    insight: string;
    userFollow: {
        follow: boolean;
    };
    viewpointCount: number;
    authorId: string;
    authorName: string;
    authorAvatar: string;
    facts: Fact[];
}

export interface FactReference {
    id: string;
    createdAt: Date;
    url: string;
    icon: string;
    title: string;
}

export interface Fact {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    authorId: string;
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
    replyCount: number;
    facts: Fact[];
}

export interface Quote {
    replyId: string;
    authorId: string;
    authorName: string;
    authorAvatar: string;
    content: string;
    start: number;
    end: number;
}

export interface Reply {
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
    quotes: Quote[];
    facts: Fact[];
}

export interface TimelineNode {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    description: string;
    date: Date;
}

export interface ReadObject {
    userId: number;
    objectId: string;
    readStatus: boolean;
    updatedAt: string;
}
