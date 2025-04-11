import {useCallback, useEffect, useState} from 'react'

interface useAppwriteProps<T, P extends Record<string, string | number>> {
    fn:(params: P) => Promise<T>;
    params?: P;
    enabled?: boolean;
}

interface useAppwriteReturn<T, P> {
    data: T | null;
    loading: boolean;
    error: string | null;
    refetch: (params?: P) => Promise<void>;
}

export const useAppwrite = <T, P extends Record<string, string | number>>({fn, params = {} as P, enabled = false}: useAppwriteProps<T, P>) : useAppwriteReturn<T, P> => {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async (fetchParams? : P) => {
        setLoading(true);
        setError(null);
        try {
            const result = await fn({fetchParams});
            setData(result)
        } catch (error) {
            setError(error as string)
        } finally {
            setLoading(false)
        }
    }, [fn])

    useEffect(() => {
        if(!enabled) {
            fetchData(params)
        }
    }, [])

    const refetch = async (fetchParams?: P) => await fetchData(fetchParams);

    return {data, loading, error, refetch}

}