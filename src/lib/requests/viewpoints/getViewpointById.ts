import type { ViewPoint } from "@/types/conversations.types";
import { parseJsonWhileHandlingErrors } from "../transformers";

export const getViewpointByID = async (
    id: string,
    token: string,
): Promise<ViewPoint> => {
    return await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/viewpoint/${id}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        },
    )
        .then(parseJsonWhileHandlingErrors)
        .then((data) => ({
            ...data,
            createdAt: new Date(data.createdAt),
            updatedAt: new Date(data.updatedAt),
        }));
};
