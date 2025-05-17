import type {
    Fact,
    Issue,
    ViewPoint,
    FactReference,
    Reply,
    TimelineNode,
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
    userFollow: {
        follow: false,
    },
    viewpointCount: 5,
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
    userFollow: {
        follow: false,
    },
    viewpointCount: 0,
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
    replyCount: 3,
    readStatus: false,
    facts: [mockFact],
};

export const mockViewPointList: ViewPoint[] = [mockViewPoint, mockViewPoint];

export const mockReply: Reply = {
    id: "00000000-0000-0000-0000-000000000008",
    createdAt: new Date(),
    updatedAt: new Date(),
    content: "This is an example reply content.",
    authorId: "00000000-0000-0000-0000-000000000009",
    authorName: "Bob Johnson",
    authorAvatar: "https://example.com/avatar.png",
    userReaction: {
        reaction: Reaction.LIKE,
    },
    likeCount: 5,
    reasonableCount: 2,
    dislikeCount: 1,
    facts: [],
    quotes: [],
    readStatus: false,
    title: "Example Reply",
};

export const mockTimeline: TimelineNode[] = [
    {
        id: "00000000-0000-0000-0000-000000000010",
        createdAt: new Date(),
        updatedAt: new Date(),
        title: "Example Timeline Node 1",
        description: "This is an example timeline node description.",
        date: new Date(2023, 9, 1, 12, 0, 0),
    },
    {
        id: "00000000-0000-0000-0000-000000000011",
        createdAt: new Date(),
        updatedAt: new Date(),
        title: "Example Timeline Node 2",
        description: "This is an example timeline node description.",
        date: new Date(2020, 0, 1, 12, 0, 0),
    },
    {
        id: "00000000-0000-0000-0000-000000000012",
        createdAt: new Date(),
        updatedAt: new Date(),
        title: "Example Timeline Node 3",
        description: "This is an example timeline node description.",
        date: new Date(2024, 4, 9, 5, 0, 0),
    },
    {
        id: "00000000-0000-0000-0000-000000000013",
        createdAt: new Date(),
        updatedAt: new Date(),
        title: "Example Timeline Node 4",
        description:
            "This is an example timeline node description. A longer description to test the layout. lorem ipsum dolor sit amet, consectetur adipiscing elit. lorem ipsum dolor sit amet, consectetur adipiscing elit. lorem ipsum dolor sit amet, consectetur adipiscing elit",
        date: new Date(2023, 1, 8, 7, 23, 1),
    },
    {
        id: "00000000-0000-0000-0000-000000000014",
        createdAt: new Date(),
        updatedAt: new Date(),
        title: "Example Timeline Node 5",
        description: "This is an example timeline node description.",
        date: new Date(2025, 0, 20, 4, 30, 0, 0),
    },
    {
        id: "00000000-0000-0000-0000-000000000015",
        createdAt: new Date(),
        updatedAt: new Date(),
        title: "Example Timeline Node 6",
        description: "This is an example timeline node description.",
        date: new Date(2024, 10, 27, 11, 27, 0, 0),
    },
    {
        id: "00000000-0000-0000-0000-000000000016",
        createdAt: new Date(),
        updatedAt: new Date(),
        title: "Example Timeline Node 7",
        description: "This is an example timeline node description.",
        date: new Date(2023, 0, 1, 1, 1, 1, 1),
    },
    {
        id: "00000000-0000-0000-0000-000000000017",
        createdAt: new Date(),
        updatedAt: new Date(),
        title: "Example Timeline Node 8",
        description: "This is an example timeline node description.",
        date: new Date(2023, 0, 5, 6, 7, 8, 8),
    },
];
