type PaginatedPage<T> = {
    content: T[];
    page: {
        size: number;
        totalElement: number;
        totalPage: number;
        number: number;
    };
};

export function prependPaginatedQueryData<T>(
    data: T,
    pages: PaginatedPage<T>[],
    size: number = 10,
): PaginatedPage<T>[] {
    const newQueryData = pages.map((page, i, arr) => {
        if (i === 0)
            return {
                ...page,
                content: [data, ...page.content],
            };
        else if (i === arr.length - 1)
            return {
                ...page,
                content: [
                    arr[i - 1].content[arr[i - 1].content.length - 1],
                    ...page.content,
                ],
            };
        else
            return {
                ...page,
                content: [
                    arr[i - 1].content[arr[i - 1].content.length - 1],
                    ...page.content.slice(0, -1),
                ],
            };
    });

    const lastPage = newQueryData[newQueryData.length - 1].content;
    if (lastPage.length > 10) {
        newQueryData.push({
            content: lastPage.slice(10),
            page: {
                size: lastPage.length - 10,
                totalElement: 0,
                totalPage: 0,
                number: newQueryData.length,
            },
        });
        newQueryData[newQueryData.length - 2].content = lastPage.slice(0, 10);
    }
    const totalItems = newQueryData.reduce(
        (acc, page) => acc + page.content.length,
        0,
    );
    return newQueryData.map((page) => ({
        ...page,
        page: {
            ...page.page,
            totalElement: totalItems,
            totalPage: Math.ceil(totalItems / size),
        },
    }));
}
