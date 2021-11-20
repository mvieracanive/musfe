import React, {ReactNode} from "react";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

type Props = {
    children?: ReactNode;
}
type State = {
    open: boolean;
}

export default function ConfirmDelete(props: any) {
  return (
    <div>
      <Dialog open={props.open} onClose={props.handleClose}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you really want to delete data of: <strong>{props.row ? props.row.name : ''}</strong>?
          </DialogContentText>          
        </DialogContent>
        <DialogActions>
          <Button onClick={props.handleClose}>Cancel</Button>
          <Button color='warning' onClick={props.handleDelete}>Delete</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}