type args = (string | null | boolean | undefined)[];

export const clsx = (...args: args) => {
    return args.filter(item => item).join(" ")
}