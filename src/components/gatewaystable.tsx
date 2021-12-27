import React, {ReactNode} from "react";
import { GatewayDto } from "../dtos/gateway.dto";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ConfirmDelete from './confirmdelete';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import Button from '@mui/material/Button';
import {GatewayService} from '../services/gateway.serv';
import TablePagination from '@mui/material/TablePagination';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import Tooltip from '@material-ui/core/Tooltip';

import TableFooter from '@mui/material/TableFooter';

type Props = {
    showForm: any;
    children?: ReactNode;
}
type State = {
    gateways: GatewayDto[];
    openDialog: boolean;
    openSnackBar: boolean;
    severity: any;
    msg: string;
    rowsPerPage: number;
    page: number;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
  ) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export class GatewaysTable extends React.Component<Props>{
    row: GatewayDto;
    rowIndex: number;

    constructor(props: Props){
        super(props);  
        
        this.state = {
            gateways: [], 
            openDialog: false, 
            openSnackBar: false,
            page: 0,
            rowsPerPage:10
        }

        this.loadCities = this.loadCities.bind(this);
        this.handleClickOpen = this.handleClickOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleCloseSB = this.handleCloseSB.bind(this);
        this.handleDelRow = this.handleDelRow.bind(this);
        this.handleAPIDelete = this.handleAPIDelete.bind(this);
        this.handleChangePage = this.handleChangePage.bind(this);
        this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
    }

    handleClickOpen (row: GatewayDto, index: number){
        this.setState({openDialog: true});
        this.row = row;
        this.rowIndex = index;
    };

    handleShowResultAlert(state: string, msg: string){
        this.setState({openSnackBar: true});
        this.setState({severity: state});
        this.setState({msg: msg});
    }
    handleClose (){
        this.setState({openDialog: false});
    };
    handleCloseSB (){
        this.setState({openSnackBar: false});
    };

    async handleDelRow(){
        this.setState({cities: await GatewayService.getGateways(), page: 0});        
    }
    
    async handleAPIDelete(){        
        try{
            const data = await GatewayService.delGateway(this.row.serial);
            this.handleDelRow();
            this.handleShowResultAlert('success', data.message);
            this.handleClose();
            console.log(data)
        }
        catch(error){
            console.log(error);
            this.handleClose();
            this.handleShowResultAlert('error', 'City could not be deleted');
        };                
    }

    loadCities(data:GatewayDto[]){ 
        const gateways:GatewayDto[] = [];
        data.forEach(element => {
            gateways.push(element)
        }); 
        this.setState({gateways});
    }

    render(){
        return <div>
                <Stack spacing={2} alignContent='left' direction="row">
                    <Button style={{margin: 5}} variant="contained" onClick={()=>this.props.showForm(new GatewayDto())}>New Gatewaty</Button>
                </Stack>
                
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} size="small" aria-label="city list">
                        <TableHead>
                            <TableRow>
                                <TableCell align="left">Action</TableCell>
                                <TableCell>Serial</TableCell>                                
                                <TableCell align="right">Human Name</TableCell>
                                <TableCell align="right">Ipv4</TableCell>
                                
                            </TableRow>
                        </TableHead>
                        <TableBody>                         
                            {((this.state as State).rowsPerPage > 0
                                ? (this.state as State).gateways.slice((this.state as State).page * (this.state as State).rowsPerPage, (this.state as State).page * (this.state as State).rowsPerPage + (this.state as State).rowsPerPage)
                                : (this.state as State).gateways
                            ).map((row, index) => (
                                <TableRow
                                    key={index}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell align="left">
                                        <Stack alignContent="right" direction="row" spacing={1}>
                                            <Tooltip title='Use Postman with POST localhost:3002/gateway/:{GW SERIAL}/peripheral using as body a JSON object as follows {"uid":1, "vendor":"EJFS", "status":"online" } or DELETE localhost:3002/gateway/:{GW SERIAL}/peripheral/:{UID})'>
                                                <IconButton color="primary" aria-label="edit">
                                                    <AddIcon/>
                                                </IconButton>
                                            </Tooltip>
                                            <IconButton color="primary" aria-label="edit" onClick={()=>this.props.showForm(row)}>
                                                <VisibilityIcon/>
                                            </IconButton>
                                        </Stack>
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        {row.serial}
                                    </TableCell>
                                    <TableCell align="right">{row.human_name}</TableCell>
                                    <TableCell align="right">{row.ipv4}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                            <TablePagination
                                rowsPerPageOptions={[10, 50, { label: 'All', value: -1 }]}
                                colSpan={3}
                                count={(this.state as State).gateways.length}
                                rowsPerPage={(this.state as State).rowsPerPage}
                                page={(this.state as State).page}
                                SelectProps={{
                                    inputProps: {
                                    'aria-label': 'rows per page',
                                    },
                                    native: true,
                                }}
                                onPageChange={this.handleChangePage}
                                onRowsPerPageChange={this.handleChangeRowsPerPage}
                            />
                            </TableRow>
                        </TableFooter>
                    </Table>
                    </TableContainer>
                    <ConfirmDelete 
                        open={(this.state as State).openDialog} 
                        handleClose = {this.handleClose}
                        handleDelete = {this.handleAPIDelete}
                        row={this.row}
                    />
                    <Stack spacing={2} sx={{ width: '100%' }}>
                        <Snackbar open={(this.state as State).openSnackBar} autoHideDuration={4000} onClose={this.handleCloseSB}>
                            <Alert onClose={this.handleCloseSB} severity={(this.state as State).severity} sx={{ width: '100%' }}>
                                {(this.state as State).msg}
                            </Alert>                        
                        </Snackbar>
                    </Stack>                    
            </div>                 
    }

    handleChangePage(
        event: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number,
    ){
        this.setState({page: newPage});
    };
    
    handleChangeRowsPerPage (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) {
        this.setState({rowsPerPage: parseInt(event.target.value, 10)});
        this.setState({page: 0});
    };

    async componentDidMount(){
        const data = await GatewayService.getGateways();
        this.loadCities(data);    
        console.log(data);
    }
}