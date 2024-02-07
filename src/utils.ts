/**
 * Sleep function.
 * @param milliseconds
 */
function sleep(milliseconds: number) {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export {
    sleep
};
