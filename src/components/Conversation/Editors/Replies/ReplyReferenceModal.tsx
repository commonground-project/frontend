import { useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useCookies } from "react-cookie";
import { Modal, Select } from "@mantine/core";
import { toast } from "sonner";

import { getPaginatedFacts } from "@/lib/requests/facts/getFacts";

import type { Fact } from "@/types/conversations.types";

type ReplyReferenceModalProps = {
    isModalOpen: boolean;
    setIsModalOpen: (value: boolean) => void;
    replyFactList: Fact[];
};

export default function ReplyReferenceModal({
    isModalOpen,
    setIsModalOpen,
    replyFactList,
}: ReplyReferenceModalProps) {
    const [cookie] = useCookies(["auth_token"]);

    const { data, error } = useInfiniteQuery({
        queryKey: ["facts"],
        queryFn: ({ pageParam }) =>
            getPaginatedFacts(pageParam, 200, cookie.auth_token),

        initialPageParam: 0,
        getNextPageParam: (lastPage) => {
            if (lastPage.page.number + 1 < lastPage.page.totalPage)
                return lastPage.page.number + 1;
        },
    });

    useEffect(() => {
        if (!error) return;
        toast.error("無法獲取事實列表，請重新整理頁面");
    }, [error]);

    return (
        <Modal
            opened={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            classNames={{
                title: "font-bold text-black",
            }}
            title="引註事實"
            size="lg"
        >
            <div>引用</div>
        </Modal>
    );
}
