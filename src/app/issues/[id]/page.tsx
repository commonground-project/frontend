import AddViewPointCard from "@/components/Conversation/AddViewPointBar";
import IssueCard from "@/components/Conversation/IssueCard";
import ViewPointCard from "@/components/Conversation/ViewPointCard";
import { PlusIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import {
    mockIssue,
    mockViewPointList,
    mockEmptyIssue,
} from "@/mock/conversationMock";
import EmptyViewPointCard from "@/components/Conversation/EmptyViewPointCard";
import ViewPointList from "@/components/Conversation/ViewPointList";

type IssueViewProps = {
    params: {
        id: string;
    };
};

export default function IssueView({ params }: IssueViewProps) {
    const { id } = params;
    console.log(id);
    const issue = id == "1" ? mockIssue : mockEmptyIssue;
    const viewpoints = id == "1" ? mockViewPointList : [];
    return (
        <div className="flex min-h-screen flex-col bg-neutral-200">
            <main className="flex flex-grow flex-col items-center p-8 pb-12">
                {/* issue */}
                <IssueCard issue={issue} />
                {/* view */}
                <ViewPointList viewpoints={viewpoints} issueid={id} />
            </main>
            {/* textbar */}
            <AddViewPointCard id={id} />
        </div>
    );
}
