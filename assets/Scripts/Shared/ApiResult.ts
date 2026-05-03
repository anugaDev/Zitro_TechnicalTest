export type ApiResult<T> =
    | { readonly status: 'loading' }
    | { readonly status: 'success'; readonly data: T }
    | { readonly status: 'error';   readonly message: string };

export const ApiResult = {
    loading: <T>(): ApiResult<T> =>
        ({ status: 'loading' }),

    success: <T>(data: T): ApiResult<T> =>
        ({ status: 'success', data }),

    error: <T>(message: string): ApiResult<T> =>
        ({ status: 'error', message }),

    isSuccess: <T>(r: ApiResult<T>): r is { status: 'success'; data: T } =>
        r.status === 'success',

    isError: <T>(r: ApiResult<T>): r is { status: 'error'; message: string } =>
        r.status === 'error',
};
