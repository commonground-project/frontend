export interface KnownErrorResponse {
    type: string;
    title: string;
    status: number;
    detail: string;
    instance: string; // Path of the API call
}

export type PaginatedPage<T> = {
    content: T[];
    page: {
        size: number;
        totalElement: number;
        totalPage: number;
        number: number;
    };
};
