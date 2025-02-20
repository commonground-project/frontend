import type { ViewPoint } from "@/types/conversations.types";
import { parseJsonWhileHandlingErrors } from "../transformers";
import { generateRequestHeaders } from "../generateRequestHeaders";

export const getViewpointByID = async (
    id: string,
    auth_token: string,
): Promise<ViewPoint> => {
    return await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/viewpoint/${id}`,
        {
            method: "GET",
            headers: generateRequestHeaders(auth_token),
        },
    )
        .then(parseJsonWhileHandlingErrors)
        .then((data) => ({
            ...data,
            createdAt: new Date(data.createdAt),
            updatedAt: new Date(data.updatedAt),
        }));
};
