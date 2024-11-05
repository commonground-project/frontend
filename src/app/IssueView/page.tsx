const issue = {
    id: 1,
    title: "網路上能買到管制藥？使蒂諾斯「偽官網」與黑市中的安眠詐騙及成癮危機",
    summary: "Issue Description",
}
const fact = {
    id: 1,
    title: "台灣安眠藥用量已在 2023 突破十億顆",
    icon: "favicon.ico",
    website: "reporter.com",
}
const view = {
    id: 1,
    username: "Ben",
    userimage: "favicon.ico",
    created: "2021-09-01",
    title: "View Title",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa voluptatum soluta quasi dolorum quia cum asperiores ipsam provident! Fuga, distinctio. Suscipit eum at asperiores omnis veniam sequi nobis, sit velit?",
    like: 4,
    dislike: 1,
    up: 3,
    factlist: [fact, fact, fact],
}
const viewlist = [view, view, view, view, view]

export default function IssueView() {
    return(
        <div className="flex min-h-screen flex-col bg-neutral-200">
            <main className="flex flex-grow flex-col items-center p-8">
            {/* issue */}
            <div className="w-7/12 rounded-md bg-neutral-100 p-5 text-black mb-6">
                <h1 className="py-1 text-2xl font-bold font-sans">
                    {issue.title}
                </h1>
                <h1 className="mt-3 text-lg font-semibold">事件簡述</h1>
                <p className="text-lg font-normal">{issue.summary}</p>
                <div className="mt-3">
                    <a href="" className="text-lg font-semibold hover:text-green-400">查看所有事實</a>
                </div>
            </div>
            {/* view */}
            <div className="w-7/12 rounded-md bg-neutral-100 p-5 text-black">
                <h1 className="text-xl font-semibold">查看所有觀點</h1>
                {/* text */}
                <div className="float-left w-9/12">
                    <img className="w-4 h-4 rounded-full inline-block" src={view.userimage} alt="userimage"/>
                    <h1 className="inline-block ml-2 text-xs text-neutral-600 font-normal">{view.username}</h1>
                    <h1 className="inline-block ml-3 text-xs text-neutral-600 font-normal">{view.created}</h1>
                    <h1 className="text-lg font-semibold text-neutral-700">{view.title}</h1>
                    <p className="text-base font-normal text-black">{view.description}</p>
                </div>
                <div className="float-right w-3/12 px-1">
                    <h1 className="text-xs font-normal text-black mb-2">引注事實</h1>
                    {view.factlist.map((fact, index) => (
                        <>
                        <div key={index} className="flex">
                            <h1 className="inline-block text-xs font-normal text-black">[{index+1}]</h1>
                            <div className="inline-block px-1">
                                <h1 className="text-xs font-normal text-black">{fact.title}</h1>
                                <img className="inline-block w-3 h-3 rounded-full" src={fact.icon} />
                                <h1 className="inline-block font-sans font-normal text-neutral-500 text-xs pl-1">{fact.website}</h1>
                            </div>
                        </div>
                        <hr className="my-1 border-neutral-400" />
                        </>
                    ))}
                </div>
            </div>
            </main>
            
        </div>
    )
}