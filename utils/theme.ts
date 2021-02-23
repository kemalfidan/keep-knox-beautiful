import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import colors from "src/components/core/colors";
import { typographyStyles } from "src/components/core/typography/CoreTypography";

const theme = createMuiTheme({
    palette: {
        primary: {
            main: colors.green,
            light: colors.lightGreen,
        },
        secondary: {
            main: colors.blue,
        },
        accent: {
            main: colors.pink,
        },
        background: {
            paper: colors.white,
        },
        text: {
            primary: colors.grays["80"],
            secondary: colors.grays["60"],
            disabled: colors.grays["40"],
        },
    },
    typography: typographyStyles,
});

// custom fields in palette
declare module "@material-ui/core/styles/createPalette" {
    interface Palette {
        accent: Palette["primary"];
    }
    interface PaletteOptions {
        accent: PaletteOptions["primary"];
    }
}

export default theme;
