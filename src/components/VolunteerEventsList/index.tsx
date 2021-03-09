import React, { useState } from "react";
import { Event, Volunteer } from "utils/types";
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
import Pagination from "@material-ui/lab/Pagination";

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
            minWidth: "300px",
            padding: "10px 8px",
            backgroundColor: colors.white,
        },
        eventRow: {
            borderBottom: `2px solid ${theme.palette.text.secondary}`,
        },
        tableFooter: {
            marginTop: "45px",
            height: "35px",
            width: "100%",
            display: "flex",
            alignItems: "end",
            justifyContent: "space-between",
        },
        pageArrow: {
            background: "none",
            border: "none",
        },
    })
);

// create dummy data for design purposes -- comment out to use volId data
function createData(name: string, endDate: Date, hours: number) {
    return { name, endDate, hours };
}

const rows = [
    createData("February Saturday Spruce Up", new Date("2021-02-15"), 2),
    createData("2021 North Knoxville Community Clean Up", new Date("2021-02-16"), 4),
    createData("Keep the TN River Beautiful Knoxville Clean Up", new Date("2021-02-12"), 3),
    createData("February Saturday Spruce Up 2", new Date("2021-02-05"), 2),
    createData("2021 North Knoxville Community Clean Up 2", new Date("2021-02-15"), 1),
    createData("Keep the TN River Beautiful Knoxville Clean Up 2", new Date("2021-02-22"), 2),
    createData("February Saturday Spruce Up 3", new Date("2021-02-20"), 2),
    createData("January Saturday Spruce Up", new Date("2021-01-10"), 1),
    createData("2020 North Knoxville Community Clean Up", new Date("2020-02-16"), 4),
    createData("Keep the Little River Beautiful Knoxville Clean Up", new Date("2020-04-12"), 3),
    createData("February Saturday Spruce Up 5", new Date("2021-02-05"), 2),
    createData("2021 South Knoxville Community Clean Up", new Date("2021-03-1"), 1),
    createData("Keep the TN River Beautiful Knoxville Clean Up 2", new Date("2021-02-22"), 2),
    createData("February Saturday Spruce Up 3", new Date("2021-02-20"), 2),
    createData("February Saturday Spruce Up", new Date("2021-02-15"), 2),
    createData("2021 North Knoxville Community Clean Up", new Date("2021-02-16"), 4),
    createData("Keep the TN River Beautiful Knoxville Clean Up", new Date("2021-02-12"), 3),
    createData("February Saturday Spruce Up 2", new Date("2021-02-05"), 2),
    createData("2021 North Knoxville Community Clean Up 2", new Date("2021-02-15"), 1),
    createData("Keep the TN River Beautiful Knoxville Clean Up 2", new Date("2021-02-22"), 2),
    createData("February Saturday Spruce Up 3", new Date("2021-02-20"), 2),
];

// create attended events table for current volunteer
export default function VolunteerEventsList(props: Volunteer) {
    const classes = useStyles();
    const eventsPerPage = 5;
    const [page, setPage] = useState(1);

    const handleChange = (event: React.ChangeEvent<unknown>, newPage: number) => {
        setPage(newPage);
    };

    // Uncomment to use actual volunteer data for volId from server
    //const rows: Array<Event> = props.attendedEvents ? props.attendedEvents : [];

    const numPages = rows.length > 0 ? Math.ceil(rows.length / eventsPerPage) : 0;

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
                    {(numPages > 0
                        ? rows.slice((page - 1) * eventsPerPage, (page - 1) * eventsPerPage + eventsPerPage)
                        : rows
                    ).map(row => (
                        <TableRow key={row.name} className={classes.eventRow}>
                            <TableCell component="th" scope="row">
                                <CoreTypography variant="body2">{row.name}</CoreTypography>
                            </TableCell>
                            <TableCell align="center">
                                <CoreTypography variant="body2">
                                    {row.endDate?.toLocaleDateString("en-us", {
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
                </TableBody>
            </Table>
            <div className={classes.tableFooter}>
                <div />
                <div>
                    <Pagination count={numPages} page={page} onChange={handleChange} />
                </div>
                <div />
            </div>
        </TableContainer>
    );
}
