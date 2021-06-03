import React, { useState } from "react";
import { TableCell, Button, CircularProgress } from "@material-ui/core";
import { EventVolunteer, ApiResponse } from "utils/types";
import urls from "utils/urls";
import CheckIcon from "@material-ui/icons/Check";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import colors from "src/components/core/colors";
import CoreTypography from "../core/typography";

interface Props {
    eventId: string;
    eVol: EventVolunteer;
    refreshFunc(): void;
}

const VolAttendanceListItem: React.FC<Props> = ({ eventId, eVol, refreshFunc }) => {
    const styles = useStyles();
    const [loading, setLoading] = useState(false);

    const getCheckBox = () => {
        if (loading) {
            return (
                <Button onClick={toggleAttendance} className={styles.uncheckedBox}>
                    <CircularProgress size={25} style={{ color: "black" }} />
                </Button>
            );
        }

        if (eVol.present) {
            return (
                <Button onClick={toggleAttendance} className={styles.checkedBox}>
                    <CheckIcon style={{ fontSize: "2em" }} />
                </Button>
            );
        } else {
            return <Button onClick={toggleAttendance} className={styles.uncheckedBox}></Button>;
        }
    };

    const toggleAttendance = async function () {
        const fetchOpts: RequestInit = {
            method: "POST",
            mode: "same-origin",
        };

        setLoading(true);
        if (eVol.present) {
            const resp = await fetch(urls.baseUrl + urls.api.markNotPresent(eventId, eVol.volunteer._id!), fetchOpts);
            const response = (await resp.json()) as ApiResponse;
            if (resp.status == 200) {
                refreshFunc();
            } else {
                alert(`Error: ${response.message || "Unexpected error."}`);
            }
        } else {
            const resp = await fetch(urls.baseUrl + urls.api.markPresent(eventId, eVol.volunteer._id!), fetchOpts);
            const response = (await resp.json()) as ApiResponse;
            if (resp.status == 200) {
                refreshFunc();
            } else {
                alert(`Error: ${response.message || "Unexpected error."}`);
            }
        }
        setLoading(false);
    };
    return (
        <React.Fragment>
            <TableCell>
                <CoreTypography variant="body1">{eVol.volunteer.name}</CoreTypography>
            </TableCell>
            <TableCell align="right">{getCheckBox()}</TableCell>
        </React.Fragment>
    );
};

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        checkedBox: {
            backgroundColor: colors.green,
            border: "2px solid black",
            width: "50px",
            height: "64px",
            borderRadius: "50%",
            "&:hover": {
                backgroundColor: colors.green,
            },
        },
        uncheckedBox: {
            backgroundColor: colors.white,
            border: "2px solid black",
            width: "50px",
            height: "64px",
            borderRadius: "50%",
            "&:hover": {
                backgroundColor: colors.white,
            },
        },
    })
);

export default VolAttendanceListItem;
