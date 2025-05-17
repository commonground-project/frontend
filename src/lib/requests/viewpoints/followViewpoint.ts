import { parseJsonWhileHandlingErrors } from "../transformers";

type FollowViewpointParams = {
    viewpointId: string;
    auth_token: string;
};

type FollowViewpointResponse = {
    follow: boolean;
    updatedAt: Date;
};

export async function followViewpoint({
    viewpointId,
    auth_token,
}: FollowViewpointParams): Promise<FollowViewpointResponse> {
    return await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/viewpoint/${viewpointId}/follow/me`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${auth_token}`,
            },
            body: JSON.stringify({
                follow: true,
            }),
        },
    )
        .then(parseJsonWhileHandlingErrors)
        .then((res: FollowViewpointResponse) => {
            return {
                ...res,
                updatedAt: new Date(res.updatedAt),
            };
        });
}
