import { parseJsonWhileHandlingErrors as __ } from "../transformers";

type FollowIssueParams = {
    issueId: string;
    auth_token: string;
};

type FollowIssueResponse = {
    follow: boolean;
    updatedAt: Date;
};

export async function followIssue({
    issueId: __issueId,
    auth_token: __auth_token,
}: FollowIssueParams): Promise<FollowIssueResponse> {
    // return await fetch(
    //     `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/issue/${issueId}/follow/me`,
    //     {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json",
    //             Authorization: `Bearer ${auth_token}`,
    //         },
    //     },
    // )
    //     .then(parseJsonWhileHandlingErrors)
    //     .then((res: FollowIssueResponse) => {
    //         return {
    //             ...res,
    //             updatedAt: new Date(res.updatedAt),
    //         };
    //     });
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                follow: true,
                updatedAt: new Date(),
            });
        }, 1000);
    });
}
