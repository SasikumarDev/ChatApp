const useLocalStorage = () => {

    const setValue = (key: string, value: any) => {
        window.localStorage.setItem(key, value)
    }

    const getValue = (key: string) => {
        return window.localStorage.getItem(key)
    }
    return { setValue, getValue };
}

export default useLocalStorage;