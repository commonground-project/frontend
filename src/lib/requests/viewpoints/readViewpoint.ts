import { parseJsonWhileHandlingErrors } from "../transformers";
import type { ReadObject } from "@/types/conversations.types";

type ReadViewpointParams = {
    viewpointId: string;
    auth_token: string;
};

export const readViewpoint = async ({
    viewpointId,
    auth_token,
}: ReadViewpointParams): Promise<ReadObject> => {
    return await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/read/viewpoint/${viewpointId}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${auth_token}`,
            },
        },
    ).then(parseJsonWhileHandlingErrors);
};
