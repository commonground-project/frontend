import { Fact, Issue, ViewPoint } from "@/types/conversations.types";

export const mockIssue: Issue = {
    id: 1,
    title: "Breakthrough in Electric Vehicle Battery Technology Announced",
    summary:
        "San Francisco, CA — In a significant leap forward for electric vehicle (EV) technology, researchers at GreenTech Innovations announced today the development of a new battery that could revolutionize the industry. The new design promises to double the range of EVs while reducing charging time to under 15 minutes.The breakthrough was made possible by a novel combination of advanced materials that increase energy density while ensuring battery stability. GreenTech CEO, Michael Foster, stated, “We believe this advancement will accelerate the mass adoption of electric vehicles and contribute significantly to reducing carbon emissions globally.”Experts have pointed out that while the technology shows promise, it will take time to scale up production and integrate it into the existing infrastructure. Additionally, questions remain about the long-term environmental impact of mining the rare materials used in the batteries.",
};

export const mockFact: Fact = {
    id: 1,
    title: "This development could disrupt the EV market",
    sources: [
        {
            id: 1,
            title: "battery",
            icon: "/favicon.ico",
            website: "cutedge.com",
        },
        {
            id: 2,
            title: "energy",
            icon: "/favicon.ico",
            website: "science.tw",
        },
    ],
};

export const mockViewPoint: ViewPoint = {
    id: 1,
    title: "We should not lose sight of the fact that sustainable sourcing of materials is crucial for true environmental benefits.",
    user: {
        username: "Sarah Fields",
        profile: "/favicon.ico",
    },
    created: new Date(),
    content:
        "This could be the game-changer we’ve been waiting for in the EV space,” said Dr. Susan Martin, an energy storage expert at Stanford University. “However, we need to ensure that the production process is as sustainable as the vehicles themselves.",
    facts: [mockFact, mockFact, mockFact, mockFact],
    thumbsup: 23,
    up: 4,
    thumbsdown: 2,
};
