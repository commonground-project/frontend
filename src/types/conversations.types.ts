import { UserRepresentation } from "./users.types";

export interface Issue {
    id: number;
    title: string;
    summary: string;
}

export interface FactSource {
    id: number;
    title: string;
    icon: string;
    website: string;
}

export interface Fact {
    id: number;
    title: string;
    sources: FactSource[];
}

export interface ViewPoint {
    id: number;
    title: string;
    user: UserRepresentation;
    created: Date;
    content: string;
    facts: Fact[];
    thumbsup: number;
    up: number;
    thumbsdown: number;
}
