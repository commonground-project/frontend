import type { UserProfile } from "./users.types";

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

export interface ViewPoint {
    id: number;
    title: string;
    user: UserProfile;
    created: Date;
    content: string;
    facts: Fact[];
    like: number;
    reasonable: number;
    dislike: number;
}
