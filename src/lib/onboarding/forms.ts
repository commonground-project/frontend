import { z } from "zod";

export type OnboardingUserInfo = {
    username: string;
    nickname: string;
    birthYear: number | null;
    gender: string | null;
    occupation: string | null;
};

export type OnboardingUserInfoComplete = {
    username: string;
    nickname: string;
    birthYear: number;
    gender: string;
    occupation: string;
};

export const onboardingUserInfoSchema = z.object({
    username: z
        .string()
        .min(4, "請輸入至少 4 個字元")
        .max(15, "請輸入至多 15 個字元")
        .regex(/^[a-zA-Z0-9_]+$/, "使用者名稱只能包含英文字母、數字或底線"),
    nickname: z.string().min(2, "請輸入至少 2 個字元"),
    birthYear: z
        .number({ message: "請輸入您的出生年" })
        .min(1900)
        .max(new Date().getFullYear()),
    gender: z.enum(["MALE", "FEMALE", "NON_BINARY", "PREFER_NOT_TO_SAY"], {
        message: "請選擇您的性別",
    }),
    occupation: z.string({ message: "請選擇您的職業" }).min(1),
});

export const OnboardingOccupations = [
    {
        value: "STUDENTS",
        label: "學生",
    },
    {
        value: "FREELANCERS_SELF_EMPLOYED",
        label: "自由職業者 / 自僱人士",
    },
    {
        value: "EDUCATION_ACADEMIA",
        label: "教育與學術",
    },
    {
        value: "HEALTHCARE_HEALTH",
        label: "醫療與健康",
    },
    {
        value: "TECHNOLOGY_ENGINEERING",
        label: "科技與工程",
    },
    { value: "ARTS_DESIGN", label: "藝術與設計" },
    { value: "FINANCE_LAW", label: "金融與法律" },
    {
        value: "PUBLIC_SERVICE",
        label: "公共服務",
    },
    { value: "BUSINESS_SALES", label: "商業與銷售" },
    {
        value: "MEDIA_COMMUNICATION",
        label: "媒體與傳播",
    },
    {
        value: "TRAVEL_HOSPITALITY",
        label: "旅遊與服務業",
    },
    {
        value: "ENVIRONMENTAL_SCIENCE_POLICY",
        label: "環境科學與政策",
    },
    {
        value: "ENERGY_INFRASTRUCTURE",
        label: "能源與公共基礎設施",
    },
    {
        value: "CONSTRUCTION_BUILDING",
        label: "建築與施工",
    },
    {
        value: "LOGISTICS_SUPPLY_CHAIN_MANAGEMENT",
        label: "物流與供應鏈管理",
    },
    {
        value: "TRANSPORTATION_SERVICES",
        label: "交通與運輸服務",
    },
    {
        value: "AGRICULTURAL_WORKERS",
        label: "農業工作者",
    },
    {
        value: "ENVIRONMENTAL_CONSERVATION_RESOURCE_MANAGEMENT",
        label: "環境保育與自然資源管理",
    },
    {
        value: "RETIRED_NOT_WORKING",
        label: "退休 / 暫不工作",
    },
];

export type InterestStatus = "INTEREST" | "DISINTEREST" | null;

export const onboardingInterestsSchema = z.record(
    z.string(),
    z.enum(["INTEREST", "DISINTEREST"]).nullable(),
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
        id: "163db9fc-795d-42f3-965c-8190162492ca",
        username: "User",
        content:
            "首先有一個大原則：不可以把快樂建立在別人的痛苦上。我覺得這是人類的道德底線。\n地獄梗的初衷是一種黑色幽默，但是以別人的不幸作為基礎，形成一種會心一笑的笑點。本身對於受害者是一種二次傷害。這裡就要帶出我的第二個思考點：如過受害者沒有看到那個地獄梗呢？\n人類只會看到眼前所見，看不到就等同不存在，同意吧？那受害者沒看到地獄梗就沒有任何二次傷害，不就皆大歡喜？也沒有違背第一條原則，因為沒有人受傷。\n所以我覺得只是在一個封閉圈圈傳又沒有問題。換句話說[問題不是地獄梗本身，問題是被傳出去。",
    },
    {
        id: "4be8059a-192a-4c9e-89ef-bd868be0e2e1",
        username: "User",
        content:
            "根據 IZA 勞動經濟研究所的研究報告，美國在大幅減少接收難民後對經濟和財政是有很大的負面影響的\n\n像是經濟損失平均約為三萬美元/難民，而財務損失近六千美元/難民\n\n雖然接收難民對於初期的成本開銷是大的，但長期創造的經濟價值會高於初期成本",
    },
    {
        id: "488c0af5-252e-4ed1-a45d-8d4455a9146f",
        username: "User",
        content:
            "當本國人因為高房價、高物價而被生活壓的喘不過氣的時後，政府卻花了四千多億美金在非法移民身上、又基於人道主義在2024年花了34億美金在邊境大興土木興建庇護讓非法移民能在邊境暫時居住。身為納稅者不會覺得很不公平嗎？自己的生活都過得很辛苦了，國家卻把錢花在外國人身上，明明設有合法的移民管道，卻被這些插隊的人破壞了原有的移民體制，還造成國家的財政負擔。所以我認為應該直接關閉邊境、把非法移民全部遣返，是時候把國家資源放在本國人身上了。",
    },
    {
        id: "73e0e18f-a37e-4bac-846e-723570eec736",
        username: "User",
        content:
            "近年來我國和解放軍的軍力差距越來越大，我國自從軍力被中國超越之後就一直奉行不對稱作戰的策略，而不對稱作戰中重要的一環就是潛艦。解放軍已有12艘核動力潛艇和54艘常規動力潛艦。我國雖然不需要核動力潛艦，但我國擁有的常規動力潛艦都是二戰時期留下來的老古董，在戰時幾乎不構成戰力。2004至2006年期間我國的潛艦預算被國民黨擋了69次，原本應該在2019年成軍的8艘潛艦也隨之破滅。\n\n軍武國造的好處就是能避免被外國掐著脖子，讓自己的命運被掌握在自己手裡，而現在好不容易有國造潛艦下水測試，卻被自己人一擋再擋，或許支持刪除預算的人會說現在的國造潛艦自製率不夠高所以沒必要繼續編列預算。\n但如果沒有開始何來的進步？從最初的幾艘潛艦累積經驗並培養相關產業人才。持續的資金挹注能讓這整條產業鏈持續發展並留住相關產業的人才，實現真正的自己自足，而不是斷斷續續的預算讓國造軍武在發展的路上綁手綁腳。",
    },
    {
        id: "70b84f33-da53-422c-b45c-3c9ef4892204",
        username: "User",
        content:
            "我認為教育領域更不該裹足不前，而是應該主動迎接，教導學生如何正確使用這項工具。禁止使用只會讓教育與世界脫節，錯失培養未來人才的契機。就像 Google 剛普及時，也會有人擔心學生會因此不再查書、不再思考，但最後我們學到的不是禁止使用，而是如何辨別資訊、跨來源比對和培養資訊素養等等。生成式 AI 也是同樣的情況，它是新工具，教育的責任是教學生怎麼善用，而不是選擇封鎖。拒絕只會讓我們在教育上落後於時代。",
    },
    {
        id: "c60568d7-56e1-4f67-a968-08d1d29a425e",
        username: "User",
        content:
            "雖然目前在美國本土還沒有發生大規模的事件\n但之前在德國發生的卡車恐怖事件還是讓人心有餘悸\n我們難以否認, 恐怖份子有可能以尋求庇護等理由合法待在美國策劃與實行恐怖攻擊\n在接納難民的那一刻, 災難的種子便已經被種下了",
    },
    {
        id: "4e988a16-05d7-41ee-9a48-a7ee32392559",
        username: "User",
        content:
            "隨著嬰兒潮世代逐漸步入退休階段，美國的勞動人口快速減少，進而導致生產力下滑，這使得填補勞動力缺口成為一項迫切的挑戰。在這樣的情境下，移民將扮演關鍵角色，成為維持勞動力供應的重要來源。移民勞工具備多元技能與不同的人口結構特徵，能夠有效補充並擴展美國經濟，與本地出生的勞工形成互補關係，而非競爭者。因此，移民並非會奪走工作機會或壓低工資，而是在勞動市場中滿足經濟需求，並刺激市場發展。關鍵在於如何制定合理且完善的移民政策，確保移民的引入不僅不損害本地出生勞工的利益，還能促進整體經濟成長。與其一味禁止移民，應採取更具前瞻性的政策，平衡各方利益，實現勞動市場的長期穩定與發展。",
    },
    {
        id: "d186aa73-a26c-4805-b85d-505d145f2194",
        username: "User",
        content:
            "要怎麼加選修都可以，但我不認為訂成必修有甚麼優點，我學地理跟我未來出社會應該是沒有甚麼關係才對。現在的社會科內容對培養批判性思維的效益不高，大多都還是背背背，對於是否能真的幫助了解時事我是打上一個問號。",
    },
    {
        id: "9de08cda-292a-408c-8bdf-694cea84c290",
        username: "User",
        content:
            "現在台灣教育的問題就是沒給學生選擇！都是硬要把所有東西塞到學生的腦袋什麼都要好，像是 108 課剛又有一堆素養的東西，[根本沒有用](0)。\n公民課有教法律與經濟還會用到，但是像地理、地科之類的根本之後不會用到，我出去玩當然是查天氣預報，又不會自己做天氣預報。\n",
    },
    {
        id: "62655e8a-5444-428c-aee6-ee63545b1c05",
        username: "User",
        content:
            "在當今快速變遷的社會中，單一學科的知識已難以應對複雜的問題。理組學生透過修習社會科課程，如歷史、地理、公民等，能夠培養批判性思維、系統性分析及人文關懷等素養，這些都是設計思考的核心元素。例如，麗山高中在地理課程中引入居住安全議題，結合法律、歷史與文化觀點，讓學生從多角度思考問題，提升其跨領域整合能力。",
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
    "避免使用帶有侮辱、歧視、或具有潛在騷擾意涵的文字",
    "聚焦於觀點、論據和邏輯，而非針對發言者的個人特質、動機或背景進行討論",
    "在表達個人感受或情緒的同時，清晰地闡述這些情緒背後的具體原因",
    "提出論點或主張時，盡可能提供可查證的事實、數據、或引用可靠的資訊來源作為支撐",
    "承認個人知識的局限性，並對自己觀點中可能存在的錯誤或偏見抱持開放和反思的態度",
];
