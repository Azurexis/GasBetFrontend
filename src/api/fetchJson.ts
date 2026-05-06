type RequestFunction = typeof fetch;

export async function fetchJson<T>(
    input: RequestInfo | URL,
    fallbackMessage: string,
    init?: RequestInit,
    request: RequestFunction = fetch
): Promise<T> {
    const response = await request(input, init);

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || fallbackMessage);
    }

    return response.json() as Promise<T>;
}
