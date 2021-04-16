import React from "react";
import PropTypes from "prop-types";
import Head from "next/head";
import { AppProps } from "next/app";
import { ThemeProvider } from "@material-ui/core/styles";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import CssBaseline from "@material-ui/core/CssBaseline";
import theme from "utils/theme";
import Header from "src/components/Header";
import Footer from "src/components/Footer";
import constants from "utils/constants";
import "../../public/App.css";

export default function MyApp({ Component, pageProps, router }: AppProps) {
    let admin = false;
    if (router.pathname.includes("admin")) admin = true;

    React.useEffect(() => {
        // Remove the server-side injected CSS.
        const jssStyles = document.querySelector("#jss-server-side");
        if (jssStyles) {
            jssStyles?.parentElement?.removeChild(jssStyles);
        }
    }, []);

    return (
        <React.Fragment>
            <Head>
                <title>{constants.org.name.full}</title>
                <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <ThemeProvider theme={theme}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <CssBaseline />
                    <div className="container">
                        <Header isAdmin={admin} />
                        <div className="body">
                            <Component {...pageProps} />
                        </div>
                        <Footer />
                    </div>
                </MuiPickersUtilsProvider>
            </ThemeProvider>
        </React.Fragment>
    );
}

MyApp.propTypes = {
    Component: PropTypes.elementType.isRequired,
    pageProps: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
};
