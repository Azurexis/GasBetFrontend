import { useEffect, useEffectEvent, useReducer } from "react";

type AsyncDataResult<T> = {
    data: T;
    errorMessage: string;
    isLoading: boolean;
};

type AsyncDataState<T> = AsyncDataResult<T>;

type AsyncDataAction<T> =
    | { type: "loadStarted" }
    | { type: "loadSucceeded"; payload: T }
    | { type: "loadFailed"; payload: string };

function createInitialState<T>(initialData: T): AsyncDataState<T> {
    return {
        data: initialData,
        errorMessage: "",
        isLoading: true
    };
}

function asyncDataReducer<T>(state: AsyncDataState<T>, action: AsyncDataAction<T>): AsyncDataState<T> {
    switch (action.type) {
        case "loadStarted":
            return {
                ...state,
                errorMessage: "",
                isLoading: true
            };
        case "loadSucceeded":
            return {
                data: action.payload,
                errorMessage: "",
                isLoading: false
            };
        case "loadFailed":
            return {
                ...state,
                errorMessage: action.payload,
                isLoading: false
            };
        default:
            return state;
    }
}

export function useAsyncData<T>(
    initialData: T,
    load: () => Promise<T>,
    reloadKey?: unknown
): AsyncDataResult<T> {
    const [state, dispatch] = useReducer(
        asyncDataReducer<T>,
        initialData,
        createInitialState
    );

    const runLoad = useEffectEvent(async (isActive: () => boolean) => {
        dispatch({ type: "loadStarted" });

        try {
            const nextData = await load();

            if (isActive()) {
                dispatch({ type: "loadSucceeded", payload: nextData });
            }
        } catch (error) {
            if (!isActive()) {
                return;
            }

            if (error instanceof Error) {
                dispatch({ type: "loadFailed", payload: error.message });
            } else {
                dispatch({ type: "loadFailed", payload: "An unknown error occurred." });
            }
        }
    });

    useEffect(() => {
        let isActive = true;

        void runLoad(() => isActive);

        return () => {
            isActive = false;
        };
    }, [reloadKey]);

    return state;
}
