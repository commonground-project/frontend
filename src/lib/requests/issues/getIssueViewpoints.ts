type getIssueViewpointsProps = {
    issueId: string;
    pageParam: number;
    auth_token: string;
};

export const getIssueViewpoints = async ({
    issueId,
    pageParam,
    auth_token,
}: getIssueViewpointsProps) => {
    return await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/issue/${issueId}/viewpoints?size=10&page=${pageParam}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${auth_token}`,
            },
        },
    ).then((res) => {
        if (!res.ok)
            throw new Error(`Error fetching issue viewpoints: ${res.status}`);
        else return res.json();
    });
};
