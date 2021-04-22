import React, { useState } from "react";
import { NextPage, NextPageContext } from "next";
import Router from "next/router";
import { Event, Volunteer, EventVolunteer, PaginatedVolunteers, APIError } from "utils/types";
import UpsertEvent from "src/components/UpsertEvent";
import { getEvent, getEventVolunteers } from "server/actions/Event";
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
    Link,
    makeStyles,
    Theme,
    createStyles,
    Switch,
    Button,
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

interface Props {
    event: Event;
    pageVols: PaginatedVolunteers;
}

function orderVolunteers(vols: Volunteer[]): Volunteer[] {
    return vols
        ? vols.sort((v1, v2) => {
              // sorry typescript, need to sort
              return Number(v1.name) - Number(v2.name);
          })
        : [];
}

const ManageVolunteers: NextPage<Props> = ({ pageVols, event }) => {
    const styles = useStyles();
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [vols, setVols] = useState<Volunteer[]>(pageVols.volunteers);
    const [page, setPage] = useState<number>(1);
    const [isLastPage, setIsLastPage] = useState<boolean>(false);

    // helper func to get the vols by search query
    async function getVolsFromSearch(query: string) {
        const r = await fetch(`${urls.api.eventVolunteers(event._id, page)}&search=${query}`, {
            method: "GET",
        });
        /* eslint-disable */
        const response = await r.json();
        const newVolsData: PaginatedVolunteers = response.payload;
        /* eslint-enable */

        setVols(newVolsData.volunteers);
    }

    // helper func to get the vols for a certain page
    async function getVolsForPage(newPage: number) {
        const r = await fetch(`${urls.api.eventVolunteers(event._id, newPage)}&search=${search}`, {
            method: "GET",
        });
        if (Math.floor(r.status / 100) !== 2) {
            alert(`ERROR: ${r.status}, ${r.statusText}`);
        }
        /* eslint-disable */
        const response = await r.json();
        const newVolsData: PaginatedVolunteers = response.payload;
        /* eslint-enable */
        if (newVolsData === undefined) {
            setIsLastPage(true);
        } else {
            setVols(vols.concat(newVolsData.volunteers));
        }
        // setIsLastPage(newVolsData.isLastPage);
    }

    const handleSearchChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
        setPage(1);
        await getVolsFromSearch(event.target.value);
    };
    const handleLoadMore = async () => {
        await getVolsForPage(page + 1);
        setPage(page + 1);
    };

    const createAndRegisterVol = async function (vol: Volunteer) {
        try {
            const response = await fetch(`${urls.baseUrl}${urls.api.eventQuickadd(event._id!)}`, {
                method: "POST",
                body: JSON.stringify({
                    ...vol,
                }),
            });
            const responseJSON = (await response.json()) as { success: boolean; payload: unknown };

            if (responseJSON.success) {
                setOpen(false);
            } else {
                alert("ERROR creating vol");
            }
            setOpen(false);
        } catch (e) {
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            alert(`ERROR: ${e}`);
            console.error(e);
        }
    };

    return (
        <Container maxWidth={false} className={styles.container}>
            <div className={styles.jumbotron}>
                <Grid container spacing={0} direction="row" justify="center" style={{ width: "100%" }}>
                    <Grid item xs={12} sm={7} lg={6} className={styles.pageTitle}>
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
                                    style={{ backgroundColor: colors.orange, color: "white" }}
                                >
                                    Add +
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
            <Grid container direction="row" spacing={6} justify="center">
                <Grid item xs={10} md={8}>
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
                <Grid item xs={10} md={8} lg={6}>
                    <InfiniteScroll
                        dataLength={vols.length}
                        next={handleLoadMore}
                        hasMore={!isLastPage}
                        loader={<h4>Loading...</h4>}
                    >
                        <TableContainer component={Paper}>
                            <Table className={styles.table} aria-label="volunteer table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell style={{ fontWeight: "bold" }}>Volunteers</TableCell>
                                        <TableCell style={{ fontWeight: "bold" }} align="right">
                                            Present
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {vols.map((vol, i) => {
                                        const evol: EventVolunteer = {
                                            volunteer: vol,
                                            present: i >= pageVols.registeredCount,
                                        };
                                        return (
                                            <TableRow className={styles.tr} key={i}>
                                                <VolAttendanceListItem
                                                    eventId={event._id!}
                                                    eVol={{
                                                        present: i >= pageVols.registeredCount ? true : false,
                                                        volunteer: vol,
                                                    }}
                                                />
                                            </TableRow>
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
            minWidth: 500,
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
    });
});

export async function getServerSideProps(context: NextPageContext) {
    // get eventId from url by using context
    const eventId = context.query.eventId as string;
    const event = await getEvent(eventId);

    // this func is run on server-side, so we can safely fetch the event directly
    try {
        const volsObj = await getEventVolunteers(eventId, 1);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const paginatedVols: PaginatedVolunteers = JSON.parse(JSON.stringify(volsObj));

        console.log(volsObj);

        return {
            props: {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                event: JSON.parse(JSON.stringify(event)),
                pageVols: paginatedVols,
            },
        };
    } catch (e) {
        return {
            props: {
                event: event,
                vols: [],
            },
        };
    }
}

export default ManageVolunteers;