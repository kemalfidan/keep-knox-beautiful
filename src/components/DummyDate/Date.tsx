import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: 250,
    },
  }),
);

export default function DateAndTimePickers() {
  const classes = useStyles();

  const printDate = (e:any) => {
    console.log(e.target.value);
  };

  return (
    <form className={classes.container} noValidate>
      <TextField
        id="datetime-local"
        label="Event Start"
        type="datetime-local"
        defaultValue="2021-05-24T10:30"
        className={classes.textField}
        InputLabelProps={{
          shrink: true,
        }}
        onChange={printDate}
      />
    </form>
  );
}
