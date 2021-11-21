import React, {ReactNode} from "react";
import { CityDto } from "../dtos/city.dto";
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

type Props = {
    showForm: any;
    children?: ReactNode;
}
type State = {
    cities: CityDto[];
    openDialog: boolean;
    openSnackBar: boolean;
    severity: any;
    msg: string;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
  ) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export class CitiesTable extends React.Component<Props>{
    row: CityDto;
    rowIndex: number;

    constructor(props: Props){
        super(props);  
        
        this.state = {cities: [], openDialog: false, openSnackBar: false}

        this.loadCities = this.loadCities.bind(this);
        this.handleClickOpen = this.handleClickOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleCloseSB = this.handleCloseSB.bind(this);
        this.handleDelRow = this.handleDelRow.bind(this);
        this.handleAPIDelete = this.handleAPIDelete.bind(this);
    }

    handleClickOpen (row: CityDto, index: number){
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

    handleDelRow(){
        const first = (this.state as State).cities.slice(0, this.rowIndex);
        const second = (this.state as State).cities.slice(this.rowIndex+1);
        let cities: CityDto[] = [];
        switch(this.rowIndex){
            case 0: 
                cities = second;
                break;
            case (this.state as State).cities.length-1:
                cities = first;
                break;
            default:
                cities = first.concat(second);
        }
         
        this.setState({cities});        
    }
    
    handleAPIDelete(){        
        fetch('http://maiatest.domain.com:3002/dscity/'+this.row.name, {
                method: 'DELETE'
            })
            .then(response => response.json())
            .then(data => {
                this.handleDelRow();
                this.handleShowResultAlert('success', data.message);
                this.handleClose();
                console.log(data)
            })
            .catch((error) => {
                console.log(error);
                this.handleClose();
                this.handleShowResultAlert('error', 'City could not be deleted');
            });                
    }

    loadCities(data:CityDto[]){ 
        const cities:CityDto[] = [];
        data.forEach(element => {
            cities.push(element)
        }); 
        this.setState({cities});
    }

    render(){
        return <div>
                <Stack spacing={2} alignContent='left' direction="row">
                    <Button style={{margin: 5}} variant="contained" onClick={()=>this.props.showForm(new CityDto())}>New City</Button>
                </Stack>
                
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} size="small" aria-label="city list">
                        <TableHead>
                            <TableRow>
                                <TableCell align="left">Action</TableCell>
                                <TableCell>Name</TableCell>                                
                                <TableCell align="right">Native Name</TableCell>
                                <TableCell align="right">Country</TableCell>
                                <TableCell align="right">Continent</TableCell>
                                <TableCell align="right">Population</TableCell>
                                
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {(this.state as State).cities.map((row, index) => (
                                <TableRow
                                    key={row.name}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell align="left">
                                        <Stack alignContent="right" direction="row" spacing={1}>
                                            <IconButton onClick={()=>this.handleClickOpen(row, index)} color="primary" aria-label="delete">
                                                <DeleteIcon />
                                            </IconButton>
                                            <IconButton color="primary" aria-label="edit" onClick={()=>this.props.showForm(row)}>
                                                <EditIcon/>
                                            </IconButton>
                                        </Stack>
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        {row.name}
                                    </TableCell>
                                    <TableCell align="right">{row.name_native}</TableCell>
                                    <TableCell align="right">{row.country}</TableCell>
                                    <TableCell align="right">{row.continent}</TableCell>
                                    <TableCell align="right">{row.population}</TableCell>                                    
                                </TableRow>
                            ))}
                        </TableBody>
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

    componentDidMount(){
        fetch('http://maiatest.domain.com:3002/dscity')
            .then(response => response.json())
            .then(data => this.loadCities(data));    
    }
}