import { mockCommentList } from "@/mock/conversationMock";
import CommentCard from "./CommentCard";

type CommentListProps = {
    viewpointId: string;
};

export default function CommentList({ viewpointId }: CommentListProps) {
    console.log(`getting commentlist for viewpoint ${viewpointId}`);
    const commentList = mockCommentList;

    return (
        <div className="w-full max-w-3xl rounded-md bg-neutral-100 p-5 text-black">
            <h1 className="mb-2 text-xl font-semibold">查看所有回覆</h1>
            <div className="flex-col">
                {commentList.map((comment, index) => (
                    <div key={comment.id}>
                        <CommentCard comment={comment} />
                        {index !== commentList.length - 1 && (
                            <hr className="my-4 w-full border-neutral-500" />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
