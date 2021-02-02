import createMuiTheme from "@material-ui/core/styles/createMuiTheme";

import colors from "./colors";
import { orange } from "@material-ui/core/colors";

const theme = createMuiTheme({
    palette: {
        primary: {
            main: colors.primary.purple[500],
        },
        secondary: {
            main: colors.secondary.green[300],
        },
        background: {
            paper: colors.white,
        },
    },
});

export default theme;
