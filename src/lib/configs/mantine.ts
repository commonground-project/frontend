import { createTheme } from "@mantine/core";
import type { MantineColorsTuple } from "@mantine/core";
import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "@tailwind-config";

const fullConfig = resolveConfig(tailwindConfig);

function isMantineColorsTuple(
    shades: readonly string[],
): shades is MantineColorsTuple {
    return shades.length >= 10;
}

const convertTailwindToMantineColors = (
    config: ReturnType<typeof resolveConfig>,
) => {
    const colors: Record<string, MantineColorsTuple> = {};
    for (const [key, value] of Object.entries(config.theme.colors)) {
        if (typeof value === "string") continue;

        const shades: string[] = Object.values(value);
        if (isMantineColorsTuple(shades)) {
            colors[key] = shades;
        }
    }
    return colors;
};

export const CommonGroundMantineTheme = createTheme({
    colors: convertTailwindToMantineColors(fullConfig),
    primaryShade: 6,
});
