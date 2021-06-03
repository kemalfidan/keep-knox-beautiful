import React, { useState } from "react";
import { NextPage, NextPageContext } from "next";
import Router from "next/router";
import Link from "next/link";
import { Event, Volunteer, EventVolunteer, PaginatedVolunteers, ApiResponse } from "utils/types";
import UpsertEvent from "src/components/UpsertEvent";
import { getEvent, getEventVolunteers, getAttendedCount } from "server/actions/Event";
import {
    Container,
    Grid,
    TextField,
    InputAdornment,
    TableContainer,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    makeStyles,
    Theme,
    createStyles,
    Switch,
    Button,
    LinearProgress,
} from "@material-ui/core";
import { Search } from "@material-ui/icons";
import { styles } from "@material-ui/pickers/views/Calendar/Calendar";
import colors from "src/components/core/colors";
import urls from "utils/urls";
import { addVolunteer, markVolunteerNotPresent, markVolunteerPresent } from "server/actions/Volunteer";
import VolAttendanceListItem from "src/components/VolAttendanceListItem";
import CoreTypography from "src/components/core/typography";
import VolQuickAddDialog from "src/components/VolQuickAddDialog";
import InfiniteScroll from "react-infinite-scroll-component";
import constants from "utils/constants";
import AddIcon from "@material-ui/icons/Add";

interface Props {
    event: Event;
    regCount: number;
    pageVols: PaginatedVolunteers;
}

const ManageVolunteers: NextPage<Props> = ({ pageVols, event, regCount }) => {
    const styles = useStyles();
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [vols, setVols] = useState<Volunteer[]>(pageVols.volunteers);
    const [numReg, setNumReg] = useState(pageVols.registeredCount);
    const [page, setPage] = useState<number>(1);
    const [isLastPage, setIsLastPage] = useState<boolean>(vols.length < 5); // vols per page const
    const [working, setWorking] = useState(false);
    const [volsAdded, setVolsAdded] = useState(0);
    const [changeRegistered, setChangedRegistered] = useState(0);

    // helper func to get the vols by search query
    async function getVolsFromSearch(query: string) {
        setPage(1);
        const r = await fetch(`${urls.api.eventVolunteers(event._id!, page)}&search=${query}`, {
            method: "GET",
        });
        const response = (await r.json()) as ApiResponse;
        const newVolsData: PaginatedVolunteers = response.payload as PaginatedVolunteers;

        // reset
        setVols(newVolsData.volunteers);
        setNumReg(newVolsData.registeredCount);
        setIsLastPage(vols.length < 5);
        setWorking(false);
    }

    async function refreshVols() {
        setWorking(true);
        const r = await fetch(`${urls.api.eventVolunteers(event._id!, 1)}&search=${search}`, {
            method: "GET",
        });
        if (Math.floor(r.status / 100) !== 2) {
            alert(`Error: ${r.status}, ${r.statusText}`);
        }

        const response = (await r.json()) as ApiResponse;
        const newVolsData: PaginatedVolunteers = response.payload as PaginatedVolunteers;
        // check if resp vols are empty
        if (!newVolsData || newVolsData.volunteers.length === 0) {
            setIsLastPage(true);
        } else {
            setVols(newVolsData.volunteers);
            setPage(1);
            setNumReg(newVolsData.registeredCount);
            setIsLastPage(vols.length < 5);
        }
        setWorking(false);
    }

    const handleSearchChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
        setPage(1);
        await getVolsFromSearch(event.target.value);
    };
    const handleLoadMore = async () => {
        setWorking(true);
        const r = await fetch(`${urls.api.eventVolunteers(event._id!, page + 1)}&search=${search}`, {
            method: "GET",
        });
        if (Math.floor(r.status / 100) !== 2) {
            alert(`Error: ${r.status}, ${r.statusText}`);
        }

        const response = (await r.json()) as ApiResponse;
        const newVolsData: PaginatedVolunteers = response.payload as PaginatedVolunteers;
        // check if resp vols are empty
        if (!newVolsData || newVolsData.volunteers.length === 0) {
            setIsLastPage(true);
        } else {
            setPage(page + 1);
            setVols(vols.concat(newVolsData.volunteers)); // join arrays
            setNumReg(newVolsData.registeredCount + numReg); // add reg nums
            setIsLastPage(vols.length < 5);
        }
        setWorking(false);
    };

    const createAndRegisterVol = async function (vol: Volunteer) {
        setWorking(true);
        try {
            const r = await fetch(`${urls.baseUrl}${urls.api.eventQuickadd(event._id!)}`, {
                method: "POST",
                body: JSON.stringify({
                    ...vol,
                }),
            });
            const response = (await r.json()) as ApiResponse;

            if (response.success) {
                setOpen(false);
            } else {
                alert(`Error: ${response.message}`);
            }
            setOpen(false);
            setVolsAdded(volsAdded + 1);

            // refresh the table
            await refreshVols();
        } catch (e) {
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            alert(`Error: ${e}`);
            console.error(e);
            setWorking(false);
        }
    };

    interface ShowProps {
        show: boolean;
    }

    // linear progress loader that is conditionally rendered
    const LineLoader = function ({ show }: ShowProps) {
        if (show) {
            return <LinearProgress />;
        }
        return null;
    };

    return (
        <Container maxWidth={false} className={styles.container}>
            <div className={styles.jumbotron}>
                <Grid container spacing={0} direction="row" justify="center" style={{ width: "100%" }}>
                    <Grid item xs={10} sm={7} lg={6} className={styles.pageTitle}>
                        <CoreTypography variant="h1" style={{ color: "white", textAlign: "center" }}>
                            {event.name}
                        </CoreTypography>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container spacing={0} direction="row" justify="flex-end" style={{ width: "100%" }}>
                            <Grid item xs={4}>
                                <Button
                                    onClick={() => {
                                        setOpen(true);
                                    }}
                                    variant="contained"
                                    className={styles.addVolunteerButton}
                                >
                                    Add<AddIcon></AddIcon>
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
            <Grid container direction="row" justify="center">
                <Grid item xs={12} lg={9}>
                    <Grid container direction="row" justify="flex-end">
                        <TextField
                            variant="outlined"
                            label="Search"
                            margin="dense"
                            size="small"
                            style={{ margin: 30 }}
                            color="secondary"
                            onChange={handleSearchChange}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                </Grid>
                <Grid item xs={10} sm={8} md={6} lg={5}>
                    <InfiniteScroll
                        dataLength={vols.length}
                        next={handleLoadMore}
                        hasMore={!isLastPage}
                        loader={<h4 style={{ textAlign: "center" }}>Loading...</h4>}
                    >
                        <TableContainer component={Paper} className={styles.table}>
                            <LineLoader show={working} />
                            <Table aria-label="volunteer table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell style={{ fontWeight: "bold" }}>
                                            <CoreTypography variant="h3">
                                                Volunteers (
                                                {event.volunteerCount ? event.volunteerCount + volsAdded : ""})
                                            </CoreTypography>
                                        </TableCell>
                                        <TableCell style={{ fontWeight: "bold" }} align="right">
                                            <CoreTypography variant="h3">
                                                Present ({regCount + changeRegistered})
                                            </CoreTypography>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {vols.map((vol, i) => {
                                        const ev: EventVolunteer = {
                                            volunteer: vol,
                                            present: i >= numReg,
                                        };
                                        return (
                                            <Link href={urls.pages.volunteer(vol._id!)}>
                                                <TableRow className={styles.tr} key={i}>
                                                    <VolAttendanceListItem
                                                        eventId={event._id!}
                                                        eVol={ev}
                                                        refreshFunc={async () => {
                                                            // refresh the table
                                                            setWorking(true);
                                                            await refreshVols();
                                                            setChangedRegistered(
                                                                ev.present ? changeRegistered - 1 : changeRegistered + 1
                                                            );    
                                                            setWorking(false);
                                                        }}
                                                    />
                                                </TableRow>
                                            </Link>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </InfiniteScroll>
                </Grid>
            </Grid>
            <VolQuickAddDialog
                open={open}
                closeDialog={() => {
                    setOpen(false);
                }}
                createAndRegisterVol={createAndRegisterVol}
            />
        </Container>
    );
};

const useStyles = makeStyles((theme: Theme) => {
    return createStyles({
        table: {
            marginBottom: 50,
        },
        container: {
            width: "100%",
            padding: 0,
        },
        tr: {
            cursor: "pointer",
            hover: {
                backgroundColor: colors.lightGray,
            },
        },
        jumbotron: {
            width: "100%",
            height: "25vh",
            backgroundColor: theme.palette.primary.main,
            marginBottom: 50,
        },
        pageTitle: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            marginTop: "20px",
            [theme.breakpoints.down("xs")]: {
                alignItems: "center",
            },
        },
        addVolunteerButton: {
            backgroundColor: theme.palette.accent.main,
            color: colors.white,
            marginTop: "10px",
            width: "100px",
            height: "35px",
            "&:hover": {
                backgroundColor: theme.palette.accent.main,
            },
            [theme.breakpoints.down("xs")]: {
                marginLeft: "0px",
            },
        },
    });
});

export async function getServerSideProps(context: NextPageContext) {
    // get eventId from url by using context
    const eventId = context.query.eventId as string;

    // this func is run on server-side, so we can safely fetch the event directly
    try {
        const eventPromise = getEvent(eventId);
        const volsObjPromise = getEventVolunteers(eventId, 1);
        const regCountPromise = getAttendedCount(eventId);
        const [event, volsObj, regCount] = await Promise.all([eventPromise, volsObjPromise, regCountPromise]);

        if (!event) {
            throw new Error("Event not found.");
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const paginatedVols: PaginatedVolunteers = JSON.parse(JSON.stringify(volsObj));

        return {
            props: {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                event: JSON.parse(JSON.stringify(event)),
                regCount: regCount,
                pageVols: paginatedVols,
            },
        };
    } catch (e) {
        return {
            notFound: true,
        };
    }
}

export default ManageVolunteers;
