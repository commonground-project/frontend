"use server";
import { Reaction } from "@/types/conversations.types";

export async function mock() {
    return { reaction: Reaction.LIKE };
}
