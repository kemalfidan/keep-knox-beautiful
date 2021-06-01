import React, { useState, useEffect } from "react";
import { Event, Volunteer, ApiResponse } from "utils/types";
import CoreTypography from "src/components/core/typography/CoreTypography";
import colors from "src/components/core/colors";
import { createStyles, makeStyles, Theme, withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import SortIcon from "@material-ui/icons/Sort";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import urls from "utils/urls";

const VolunteerEventsList = (vol: Volunteer) => {
    const classes = useStyles();
    const eventsPerPage = 5;
    const [page, setPage] = useState<number>(1);
    const [attendedEvents, setAttendedEvents] = useState<Event[]>([]);
    const [prevAvailable, setPrevAvailable] = useState<boolean>(false);
    const [nextAvailable, setNextAvailable] = useState<boolean>(false);
    const volId = vol._id || "";
    const totalEvents = vol.attendedEvents?.length || 0;

    /* get the attended events for current page */
    useEffect(() => {
        const getPaginatedEvents = async () => {
            try {
                const r = await fetch(`${urls.api.volunteerEvents(volId)}?page=${page}`, { method: "GET" });
                const response = (await r.json()) as ApiResponse;
                const newAttendedEvents: Event[] = response.payload as Event[];
                setAttendedEvents(newAttendedEvents);

                /* determine if next and prev buttons should be available to click, opacity to .4 if not */
                if (prevAvailable && page === 1) {
                    setPrevAvailable(false);
                } else if (!prevAvailable && page > 1) {
                    setPrevAvailable(true);
                }
                if (totalEvents >= eventsPerPage * page) {
                    setNextAvailable(true);
                } else {
                    setNextAvailable(false);
                }
            } catch (error) {
                console.log(error);
            }
        };
        void getPaginatedEvents();
    }, [volId, page, prevAvailable, nextAvailable, totalEvents]); //only rerun when page changes

    /* logic to handle clicks and whether next or prev pages are available */
    const handlePageChange = (direction: string) => {
        switch (direction) {
            case "next":
                if (nextAvailable) {
                    setPage(page + 1);
                }
                break;
            case "prev":
                if (prevAvailable) {
                    setPage(page - 1);
                }
                break;
            default:
                break;
        }
    };

    const emptyRows = attendedEvents ? eventsPerPage - attendedEvents.length : eventsPerPage;

    return (
        <TableContainer component={Paper} className={classes.tableContainer}>
            <Table aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <StyledTableCell>
                            <CoreTypography variant="h4">
                                Event Name&nbsp;&nbsp;
                                <SortIcon style={{ verticalAlign: "middle" }} />
                            </CoreTypography>
                        </StyledTableCell>
                        <StyledTableCell align="center">
                            <CoreTypography variant="h4">Date</CoreTypography>
                        </StyledTableCell>
                        <StyledTableCell>
                            <CoreTypography variant="h4" style={{ textAlign: "center" }}>
                                Hours&nbsp;&nbsp;
                                <SortIcon style={{ verticalAlign: "middle" }} />
                            </CoreTypography>
                        </StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {attendedEvents.length > 0 &&
                        attendedEvents.map(row => (
                            <TableRow key={row.name} className={classes.eventRow}>
                                <TableCell component="th" scope="row">
                                    <CoreTypography variant="body2">{row.name}</CoreTypography>
                                </TableCell>
                                <TableCell align="center">
                                    <CoreTypography variant="body2">
                                        {new Date(row.startDate || "").toLocaleDateString("en-US", {
                                            month: "2-digit",
                                            day: "2-digit",
                                            year: "numeric",
                                        })}
                                    </CoreTypography>
                                </TableCell>
                                <TableCell align="center">
                                    <CoreTypography variant="body2">{row.hours}</CoreTypography>
                                </TableCell>
                            </TableRow>
                        ))}
                    {emptyRows > 0 && emptyRows != eventsPerPage && (
                        <TableRow style={{ height: 58 * emptyRows }}>
                            <TableCell colSpan={3} style={{ border: "none" }} />
                        </TableRow>
                    )}
                    {page == 1 && emptyRows == eventsPerPage && (
                        <TableRow style={{ height: 58 * emptyRows }}>
                            <TableCell
                                colSpan={3}
                                style={{
                                    border: "none",
                                }}
                            >
                                <CoreTypography variant="body1">No Attended Events</CoreTypography>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <div className={classes.tableFooter}>
                <div />
                <div>
                    <button
                        className={classes.iconButton}
                        style={prevAvailable ? { opacity: "1" } : { opacity: ".4" }}
                        onClick={() => handlePageChange("prev")}
                    >
                        <ChevronLeftIcon />
                    </button>
                    <button
                        className={classes.iconButton}
                        style={nextAvailable ? { opacity: "1" } : { opacity: ".4" }}
                        onClick={() => handlePageChange("next")}
                    >
                        <ChevronRightIcon />
                    </button>
                </div>
                <div />
            </div>
        </TableContainer>
    );
};

// style attended event table header row cells
const StyledTableCell = withStyles((theme: Theme) =>
    createStyles({
        head: {
            backgroundColor: theme.palette.primary.light,
            color: theme.palette.text.primary,
            padding: "10px",
            verticalAlign: "middle",
        },
    })
)(TableCell);

// style attended event table container and cells
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        tableContainer: {
            border: `1px solid ${theme.palette.primary.light}`,
            width: "90vw",
            minWidth: "300px",
            maxWidth: "1400px",
            minHeight: "300px",
            padding: "10px 8px",
            backgroundColor: colors.white,
        },
        eventRow: {
            borderBottom: `2px solid ${theme.palette.text.secondary}`,
        },
        tableFooter: {
            marginTop: "90px",
            height: "35px",
            width: "100%",
            display: "flex",
            alignItems: "end",
            justifyContent: "space-between",
        },
        iconButton: {
            background: "inherit",
            outline: "none",
            borderStyle: "none",
            "&:active": {
                border: "none",
                outline: "none",
            },
        },
    })
);

export default VolunteerEventsList;
