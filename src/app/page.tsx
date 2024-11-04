import HomePageCard from "../components/HomePageCard";

const issueArray = [
    {
        id: 1,
        title: "美國突襲珍珠港",
        description:
            "美國突襲珍珠港，到底應該如何實現。動機，可以說是最單純的力量。那麼，俗話說的好，掌握思考過程，也就掌握了美國突襲珍珠港。看看別人，再想想自己，會發現問題的核心其實就在你身旁。探討美國突襲珍珠港時，如果發現非常複雜，那麼想必不簡單。",
    },
    {
        id: 2,
        title: "愛講冷笑話可能是心理疾病! 專家揭 3 關鍵症狀，快看看身邊朋友中了幾個",
        description:
            "我們都有個共識，若問題很困難，那就勢必不好解決。若無法徹底理解愛講冷笑話可能是心理疾病! 專家揭 3 關鍵症狀，快看看身邊朋友中了幾個，恐怕會是人類的一大遺憾。問題的核心究竟是什麼？現在，正視愛講冷笑話可能是心理疾病! 專家揭 3 關鍵症狀，快看看身邊朋友中了幾個的問題，是非常非常重要的。因為，由於，培根說過一句經典的名言，聰明的人造就機會多於碰機會。但願各位能從這段話中獲得心靈上的滋長。",
    },
];
const UserName = "Anonymous";

export default function Page() {
    return (
        <div className="flex min-h-screen flex-col bg-neutral-200">
            <main className="flex flex-grow flex-col items-center p-8">
                <h1 className="w-7/12 pb-3 text-2xl font-semibold text-neutral-900">
                    {UserName}, 歡迎來到 CommonGround
                </h1>
                <HomePageCard issues={issueArray} />
            </main>
        </div>
    );
}
