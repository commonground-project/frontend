import type {
    Fact,
    Issue,
    ViewPoint,
    FactReference,
    Comment,
} from "@/types/conversations.types";
import { Reaction } from "@/types/conversations.types";
import type { User } from "@/types/users.types";

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

export const mockViewPoint1: ViewPoint = {
    id: "00000000-0000-0000-0000-000000000007",
    createdAt: new Date(),
    updatedAt: new Date(),
    title: "Example ViewPoint 1",
    content:
        "This is an [c i t e](0) example viewpoint content. [cite](1) And this is the first paragraph. lorem ipsum dolor sit amet.\nThis is the second paragraph. [CITE](2) lorem ipsum dolor sit amet.",
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

export const mockViewPoint2: ViewPoint = {
    id: "00000000-0000-0000-0000-000000000009",
    createdAt: new Date(),
    updatedAt: new Date(),
    title: "Example ViewPoint 2",
    content: "This is an example viewpoint content 2.",
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

export const mockViewPoint3: ViewPoint = {
    id: "00000000-0000-0000-0000-000000000012",
    createdAt: new Date(),
    updatedAt: new Date(),
    title: "Example ViewPoint 3",
    content: "This is an example viewpoint content 3.",
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

export const mockViewPointList: ViewPoint[] = [mockViewPoint, mockViewPoint1];

export const mockComment1: Comment = {
    id: "00000000-0000-0000-0000-000000000008",
    createdAt: new Date(),
    updatedAt: new Date(),
    title: "I agree",
    content: "This is an example comment 1.",
    authorId: "00000000-0000-0000-0000-000000000009",
    authorName: "Bob Johnson",
    authorAvatar: "https://example.com/avatar.png",
    userReaction: {
        reaction: Reaction.NONE,
    },
    likeCount: 0,
    reasonableCount: 0,
    dislikeCount: 0,
};

export const mockComment2: Comment = {
    id: "00000000-0000-0000-0000-000000000009",
    createdAt: new Date(),
    updatedAt: new Date(),
    title: "I agree",
    content: "I don't agree",
    authorId: "00000000-0000-0000-0000-000000000009",
    authorName: "Bob Johnson",
    authorAvatar: "https://example.com/avatar.png",
    userReaction: {
        reaction: Reaction.NONE,
    },
    likeCount: 0,
    reasonableCount: 0,
    dislikeCount: 0,
};

export const mockComment3: Comment = {
    id: "00000000-0000-0000-0000-000000000012",
    createdAt: new Date(),
    updatedAt: new Date(),
    title: "I agree",
    content: "I don't know",
    authorId: "00000000-0000-0000-0000-000000000009",
    authorName: "Bob Johnson",
    authorAvatar: "https://example.com/avatar.png",
    userReaction: {
        reaction: Reaction.NONE,
    },
    likeCount: 0,
    reasonableCount: 0,
    dislikeCount: 100,
};

export const mockCommentList: Comment[] = [
    mockComment1,
    mockComment2,
    mockComment3,
];
