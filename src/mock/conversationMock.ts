import {
    Fact,
    Issue,
    ViewPoint,
    FactReference,
    Reaction,
} from "@/types/conversations.types";
import { User } from "@/types/users.types";

const mockFactReference1: FactReference = {
    id: "1",
    createdAt: new Date(),
    url: "https://www.google.com",
    icon: "/favicon.ico",
    title: "battery",
};

const mockFactReference2: FactReference = {
    id: "2",
    createdAt: new Date(),
    url: "https://google.com",
    icon: "/favicon.ico",
    title: "energy",
};

export const mockFact1: Fact = {
    id: "1",
    createdAt: new Date(),
    updatedAt: new Date(),
    title: "This development could disrupt the EV market",
    authorId: "1",
    authorName: "John Doe",
    authorAvatar: "/favicon.ico",
    references: [mockFactReference1, mockFactReference2],
};

export const mockFact2: Fact = {
    id: "2",
    createdAt: new Date(),
    updatedAt: new Date(),
    title: "This development could disrupt the car market",
    authorId: "2",
    authorName: "Jane Doe",
    authorAvatar: "/favicon.ico",
    references: [mockFactReference1, mockFactReference2],
};

export const mockFact3: Fact = {
    id: "3",
    createdAt: new Date(),
    updatedAt: new Date(),
    title: "This development could disrupt the Electric vehicle market",
    authorId: "3",
    authorName: "Alice Smith",
    authorAvatar: "/favicon.ico",
    references: [mockFactReference1, mockFactReference2],
};

export const allFacts: Fact[] = [mockFact1, mockFact2, mockFact3];

export const mockIssue: Issue = {
    id: "1",
    createdAt: new Date(),
    updatedAt: new Date(),
    title: "Breakthrough in Electric Vehicle Battery Technology Announced",
    description:
        "San Francisco, CA — In a significant leap forward for electric vehicle (EV) technology, researchers at GreenTech Innovations announced today the development of a new battery that could revolutionize the industry. The new design promises to double the range of EVs while reducing charging time to under 15 minutes.The breakthrough was made possible by a novel combination of advanced materials that increase energy density while ensuring battery stability. GreenTech CEO, Michael Foster, stated, “We believe this advancement will accelerate the mass adoption of electric vehicles and contribute significantly to reducing carbon emissions globally.”Experts have pointed out that while the technology shows promise, it will take time to scale up production and integrate it into the existing infrastructure. Additionally, questions remain about the long-term environmental impact of mining the rare materials used in the batteries.",
    insight: "This is an example insight.",
    authorId: "1",
    authorName: "Michael Foster",
    authorAvatar: "/favicon.ico",
    facts: [mockFact1, mockFact2, mockFact3],
};

export const mockEmptyIssue: Issue = {
    id: "2",
    createdAt: new Date(),
    updatedAt: new Date(),
    title: "CommonGround, A New Social Media Platform Game Changer!",
    description: "",
    insight: "",
    authorId: "2",
    authorName: "Sarah Fields",
    authorAvatar: "/favicon.ico",
    facts: [],
};

export const mockUser: User = {
    id: "1",
    username: "sarah",
    nickname: "Sarah",
    avatar: "/favicon.ico",
};

export const mockViewPoint1: ViewPoint = {
    id: "1",
    createdAt: new Date(),
    updatedAt: new Date(),
    title: "We should not lose sight of the fact that sustainable sourcing of materials is crucial for true environmental benefits.",
    content:
        "This could be the game-changer we’ve been waiting for in the EV space,” said Dr. Susan Martin, an energy storage expert at Stanford University. “However, we need to ensure that the production process is as sustainable as the vehicles themselves.\nThis is the second paragraph.",
    authorId: "1",
    authorName: "John Doe",
    authorAvatar: "/favicon.ico",
    userReaction: {
        reaction: Reaction.LIKE,
    },
    likeCount: 23,
    reasonableCount: 4,
    dislikeCount: 2,
    facts: [mockFact1, mockFact2, mockFact3],
};

export const mockViewPoint2: ViewPoint = {
    id: "2",
    createdAt: new Date(),
    updatedAt: new Date(),
    title: "We should not lose sight of the fact that sustainable sourcing of materials is crucial for true environmental benefits.",
    content:
        "This could be the game-changer we’ve been waiting for in the EV space,” said Dr. Susan Martin, an energy storage expert at Stanford University. “However, we need to ensure that the production process is as sustainable as the vehicles themselves.",
    authorId: "2",
    authorName: "Jane Doe",
    authorAvatar: "/favicon.ico",
    userReaction: {
        reaction: Reaction.REASONABLE,
    },
    likeCount: 23,
    reasonableCount: 4,
    dislikeCount: 2,
    facts: [mockFact1, mockFact2, mockFact3],
};

export const mockViewPoint3: ViewPoint = {
    id: "3",
    createdAt: new Date(),
    updatedAt: new Date(),
    title: "We should not lose sight of the fact that sustainable sourcing of materials is crucial for true environmental benefits.",
    content:
        "This could be the game-changer we’ve been waiting for in the EV space,” said Dr. Susan Martin, an energy storage expert at Stanford University. “However, we need to ensure that the production process is as sustainable as the vehicles themselves.",
    authorId: "3",
    authorName: "Alice Smith",
    authorAvatar: "/favicon.ico",
    userReaction: {
        reaction: Reaction.DISLIKE,
    },
    likeCount: 23,
    reasonableCount: 4,
    dislikeCount: 2,
    facts: [mockFact1, mockFact2, mockFact3],
};

export const mockViewPointList: ViewPoint[] = [
    mockViewPoint1,
    mockViewPoint2,
    mockViewPoint3,
];
