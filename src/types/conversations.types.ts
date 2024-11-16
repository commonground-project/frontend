import { UserRepresentation } from "./users.types";

export interface Issue {
    id: number;
    title: string;
    summary: string;
    facts: Fact[];
}

export interface FactReference {
    id: number;
    title: string;
    icon: string;
    url: string;
}

export interface Fact {
    id: number;
    title: string;
    references: FactReference[];
}

export interface ViewPoint {
    id: number;
    title: string;
    user: UserRepresentation;
    created: Date;
    content: string;
    facts: Fact[];
    like: number;
    reasonable: number;
    dislike: number;
}
