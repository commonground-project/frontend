export interface KnownErrorResponse {
    type: string;
    title: string;
    status: number;
    detail: string;
    instance: string; // Path of the API call
}
