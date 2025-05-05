import { parseJsonWhileHandlingErrors as __ } from "../transformers";

type FollowViewpointParams = {
    viewpointId: string;
    auth_token: string;
};

type FollowViewpointResponse = {
    follow: boolean;
    updatedAt: Date;
};

export async function followViewpoint({
    viewpointId: __issueId,
    auth_token: __auth_token,
}: FollowViewpointParams): Promise<FollowViewpointResponse> {
    // return await fetch(
    //     `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/viewpoint/${viewpointId}/follow/me`,
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
