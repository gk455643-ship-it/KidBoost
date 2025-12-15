import { useStore } from '../store';
import { AgeBand } from '../types';

export const useAgeStyling = () => {
    const currentChild = useStore(state => state.currentChild);
    const band = currentChild?.ageBand || AgeBand.PRESCHOOL;

    switch (band) {
        case AgeBand.TODDLER:
            return {
                title: "text-4xl md:text-6xl font-black",
                body: "text-2xl font-bold leading-relaxed",
                button: "text-4xl px-10 py-8 rounded-[2rem]",
                iconContainer: "w-32 h-32 text-6xl",
                gridGap: "gap-6",
                card: "rounded-[2rem] border-8"
            };
        case AgeBand.PRESCHOOL:
            return {
                title: "text-3xl md:text-5xl font-bold",
                body: "text-xl font-medium leading-relaxed",
                button: "text-3xl px-8 py-5 rounded-2xl",
                iconContainer: "w-24 h-24 text-5xl",
                gridGap: "gap-4",
                card: "rounded-2xl border-4"
            };
        case AgeBand.SCHOOL:
        default:
            return {
                title: "text-2xl md:text-4xl font-bold",
                body: "text-lg leading-relaxed",
                button: "text-xl px-6 py-3 rounded-xl",
                iconContainer: "w-16 h-16 text-3xl",
                gridGap: "gap-3",
                card: "rounded-xl border-2"
            };
    }
};