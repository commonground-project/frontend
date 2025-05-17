import { parseJsonWhileHandlingErrors } from "../transformers";

type FollowIssueParams = {
    issueId: string;
    auth_token: string;
    follow: boolean;
};

type FollowIssueResponse = {
    follow: boolean;
    updatedAt: Date;
};

export async function followIssue({
    issueId,
    auth_token,
    follow,
}: FollowIssueParams): Promise<FollowIssueResponse> {
    return await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/issue/${issueId}/follow/me`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${auth_token}`,
            },
            body: JSON.stringify({
                follow: follow,
                updated_at: new Date().toISOString(),
            }),
        },
    )
        .then(parseJsonWhileHandlingErrors)
        .then((res: FollowIssueResponse) => {
            return {
                ...res,
                updatedAt: new Date(res.updatedAt),
            };
        });
}
