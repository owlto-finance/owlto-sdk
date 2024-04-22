/**
 * Sleep for ms
 * @param ms
 * @returns
 */
export async function Sleep(ms: number) : Promise<void> {
    if (ms == 0) return;
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}
