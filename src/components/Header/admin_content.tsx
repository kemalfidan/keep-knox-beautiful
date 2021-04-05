import React from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import constants from "utils/constants";
import { Button, Link } from "@material-ui/core";
import colors from "../core/colors";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        link: {
            color: colors.white,
        },
    })
);

const AdminHeader: React.FC = () => {
    const styles = useStyles();

    return (
        <>
            <Link href="/admin/events">
                <Button className={styles.link}>Events</Button>
            </Link>
            <Link href="/admin/volunteers">
                <Button className={styles.link}>Volunteers</Button>
            </Link>
        </>
    );
};

export default AdminHeader;
