/* eslint-disable jsx-a11y/no-autofocus */
import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Volunteer } from "utils/types";
import InputMask from "react-input-mask";

interface Props {
    open: boolean;
    closeDialog(): void;
    createAndRegisterVol(vol: Volunteer): void;
}

interface IFormValues {
    name: string;
    email?: string;
    phoneNumber?: string;
}

interface IErrors {
    submissionError?: boolean;
}

const VolQuickAddDialog: React.FC<Props> = function ({ open, closeDialog, createAndRegisterVol }) {
    const [values, setValues] = useState<IFormValues>({
        name: "",
    });

    const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setValues(values => ({ ...values, [event.target.id]: event.target.value }));
    };

    const handleInputMaskChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        // eslint-disable-next-line @typescript-eslint/unbound-method
        event.preventDefault();
        setValues(values => ({ ...values, ["phoneNumber"]: event.target?.value }));
    };

    return (
        <Dialog open={open} onClose={closeDialog} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Add Volunteer</DialogTitle>
            <DialogContent>
                <div>
                    <TextField
                        id="name"
                        label="Name"
                        type="text"
                        value={values.name}
                        required
                        color="secondary"
                        rowsMax={4}
                        fullWidth
                        onChange={handleTextChange}
                    />
                    <TextField
                        id="email"
                        label="Email"
                        type="text"
                        value={values.email}
                        required
                        rowsMax={4}
                        fullWidth
                        color="secondary"
                        onChange={handleTextChange}
                    />
                    <InputMask mask="(999) 999-9999" onChange={handleInputMaskChange} value={values.phoneNumber}>
                        {() => (
                            <TextField fullWidth id="phonenumber" label="Phone Number" rowsMax={4} color="secondary" />
                        )}
                    </InputMask>
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={closeDialog} color="secondary" variant="outlined">
                    Cancel
                </Button>
                <Button
                    onClick={() => {
                        createAndRegisterVol(values as Volunteer);
                    }}
                    color="primary"
                >
                    Add
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default VolQuickAddDialog;
