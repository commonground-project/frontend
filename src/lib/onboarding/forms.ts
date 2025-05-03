import { z } from "zod";

export type OnboardingUserInfo = {
    username: string;
    nickname: string;
    birthYear: number | null;
    gender: string | null;
    occupation: string | null;
};

export const onboardingUserInfoSchema = z.object({
    username: z
        .string()
        .min(3, "請輸入至少 3 個字元")
        .max(20, "請輸入至多 20 個字元")
        .regex(
            /^[a-zA-Z0-9._-]+$/,
            "使用者名稱只能包含英文字母、數字或半形句點、底線與減號",
        ),
    nickname: z.string().min(2, "請輸入至少 2 個字元"),
    birthYear: z
        .number({ message: "請輸入您的出生年" })
        .min(1900)
        .max(new Date().getFullYear()),
    gender: z.enum(["male", "female", "other", "preferNotToSay"], {
        message: "請選擇您的性別",
    }),
    occupation: z.string({ message: "請選擇您的職業" }).min(1),
});

export const OnboardingOccupations = [
    {
        value: "freelancer",
        label: "自由職業者 / 自僱人士",
        description: "Freelancers / Self-employed",
    },
    {
        value: "education",
        label: "教育與學術",
        description: "Education & Academia",
    },
    {
        value: "healthcare",
        label: "醫療與健康",
        description: "Healthcare & Health",
    },
    {
        value: "technology",
        label: "科技與工程",
        description: "Technology & Engineering",
    },
    { value: "arts", label: "藝術與設計", description: "Arts & Design" },
    { value: "finance", label: "金融與法律", description: "Finance & Law" },
    {
        value: "public_service",
        label: "公共服務",
        description: "Public Service",
    },
    { value: "business", label: "商業與銷售", description: "Business & Sales" },
    {
        value: "media",
        label: "媒體與傳播",
        description: "Media & Communication",
    },
    {
        value: "travel",
        label: "旅遊與服務業",
        description: "Travel & Hospitality",
    },
    {
        value: "environmental_science",
        label: "環境科學與政策",
        description: "Environmental Science & Policy",
    },
    {
        value: "energy",
        label: "能源與公共基礎設施",
        description: "Energy & Infrastructure",
    },
    {
        value: "construction",
        label: "建築與施工",
        description: "Construction & Building",
    },
    {
        value: "logistics",
        label: "物流與供應鏈管理",
        description: "Logistics & Supply Chain Management",
    },
    {
        value: "transportation",
        label: "交通與運輸服務",
        description: "Transportation Services",
    },
    {
        value: "agriculture",
        label: "農業工作者",
        description: "Agricultural Workers",
    },
    {
        value: "conservation",
        label: "環境保育與自然資源管理",
        description: "Environmental Conservation & Resource Management",
    },
    {
        value: "retired",
        label: "退休 / 暫不工作",
        description: "Retired / Not Working",
    },
];

export type InterestStatus = "interested" | "non_interested" | null;

export const onboardingInterestsSchema = z.record(
    z.string(),
    z.enum(["interested", "non_interested"]).nullable(),
);

export type OnboardingInterests = {
    [key: string]: InterestStatus;
};

export const OnboardingInterests: {
    id: string;
    username: string;
    content: string;
}[] = [
    {
        id: "1",
        username: "John Doe",
        content:
            "Pariatur mollit minim eiusmod voluptate mollit sit nulla est fugiat.",
    },
    {
        id: "2",
        username: "Jane Doe",
        content:
            "Pariatur mollit minim eiusmod voluptate mollit sit nulla est fugiat.",
    },
    {
        id: "3",
        username: "John Doe",
        content:
            "Pariatur mollit minim eiusmod voluptate mollit sit nulla est fugiat.",
    },
    {
        id: "4",
        username: "Jane Doe",
        content:
            "Pariatur mollit minim eiusmod voluptate mollit sit nulla est fugiat.",
    },
    {
        id: "5",
        username: "John Doe",
        content:
            "Pariatur mollit minim eiusmod voluptate mollit sit nulla est fugiat.",
    },
    {
        id: "6",
        username: "Jane Doe",
        content:
            "Pariatur mollit minim eiusmod voluptate mollit sit nulla est fugiat.",
    },
];

export const onboardingNotificationSchema = z.object({
    pushNotifications: z.boolean(),
});

export type OnboardingNotificationPreferences = {
    pushNotifications: boolean;
};

export const beforeWeStartSchema = z.array(
    z.object({
        message: z.string(),
        accepted: z.boolean(),
    }),
);

export type BeforeWeStartForm = z.infer<typeof beforeWeStartSchema>;

export const BeforeWeStartItems = [
    "我已閱讀並同意使用條款",
    "我已閱讀並同意隱私政策",
    "我已閱讀並同意社群守則",
];
