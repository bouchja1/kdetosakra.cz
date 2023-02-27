export function api(apiOptions: any, params?: {}): Promise<any>;
export function pagination(apiOptions: any, params: any, parseResults: any): Promise<{
    results: any;
    query: any;
    next(): Promise<any>;
}>;
export function aggregatePagination(pagination: any, previousResults?: any[]): any;
export function aggregate(apiOptions: any, params: any, list: any, key: any, prefix: any, results?: any[]): any;
export function parseContent(source: any): never[];
