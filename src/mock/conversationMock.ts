import {
    Fact,
    Issue,
    ViewPoint,
    FactReference,
    Reaction,
} from "@/types/conversations.types";
import { User } from "@/types/users.types";

export const mockUser: User = {
    id: "00000000-0000-0000-0000-000000000000",
    username: "Sarah",
    nickname: "sarah",
    avatar: "",
};

const mockFactReference: FactReference = {
    id: "00000000-0000-0000-0000-000000000001",
    createdAt: new Date(),
    url: "https://example.com",
    icon: "https://example.com/icon.png",
    title: "Example Fact Reference",
};

export const mockFact: Fact = {
    id: "00000000-0000-0000-0000-000000000002",
    createdAt: new Date(),
    updatedAt: new Date(),
    title: "Example Fact",
    authorId: "00000000-0000-0000-0000-000000000003",
    authorName: "John Doe",
    authorAvatar: "https://example.com/avatar.png",
    references: [mockFactReference],
};

export const mockFact1: Fact = {
    id: "00000000-0000-0000-0000-000000000003",
    createdAt: new Date(),
    updatedAt: new Date(),
    title: "Example Fact Hello",
    authorId: "00000000-0000-0000-0000-000000000003",
    authorName: "John Doe",
    authorAvatar: "https://example.com/avatar.png",
    references: [mockFactReference],
};

export const mockFact2: Fact = {
    id: "00000000-0000-0000-0000-000000000004",
    createdAt: new Date(),
    updatedAt: new Date(),
    title: "Example Fact Hello World",
    authorId: "00000000-0000-0000-0000-000000000003",
    authorName: "John Doe",
    authorAvatar: "https://example.com/avatar.png",
    references: [mockFactReference],
};

export const mockFact3: Fact = {
    id: "00000000-0000-0000-0000-000000000005",
    createdAt: new Date(),
    updatedAt: new Date(),
    title: "Example Fact Hello World!",
    authorId: "00000000-0000-0000-0000-000000000003",
    authorName: "John Doe",
    authorAvatar: "https://example.com/avatar.png",
    references: [mockFactReference],
};

export const allFacts = [mockFact1, mockFact2, mockFact3];

export const mockIssue: Issue = {
    id: "00000000-0000-0000-0000-000000000004",
    createdAt: new Date(),
    updatedAt: new Date(),
    title: "Example Issue",
    description: "This is an example issue description.",
    insight: "This is an example insight.",
    authorId: "00000000-0000-0000-0000-000000000005",
    authorName: "Jane Doe",
    authorAvatar: "https://example.com/avatar.png",
    facts: [mockFact, mockFact],
};

export const mockEmptyIssue: Issue = {
    id: "00000000-0000-0000-0000-000000000003",
    title: "CommonGround, A New Social Media Platform Game Changer!",
    facts: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "",
    insight: "",
    authorId: "00000000-0000-0000-0000-000000000001",
    authorName: "",
    authorAvatar: "",
};

export const mockViewPoint: ViewPoint = {
    id: "00000000-0000-0000-0000-000000000006",
    createdAt: new Date(),
    updatedAt: new Date(),
    title: "Example ViewPoint",
    content: "This is an example viewpoint content.",
    authorId: "00000000-0000-0000-0000-000000000007",
    authorName: "Alice Smith",
    authorAvatar: "https://example.com/avatar.png",
    userReaction: {
        reaction: Reaction.LIKE,
    },
    likeCount: 10,
    reasonableCount: 5,
    dislikeCount: 2,
    facts: [mockFact],
};

export const mockViewPointList: ViewPoint[] = [mockViewPoint, mockViewPoint];
