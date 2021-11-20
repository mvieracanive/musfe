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
import { breadcrumbsClasses } from "@mui/material";

type Props = {
    children?: ReactNode;
}
type State = {
    cities: CityDto[];
    openDialog: boolean;
}

export class CitiesTable extends React.Component<Props>{
    row: CityDto;
    rowIndex: number;

    constructor(props: Props){
        super(props);  
        
        this.state = {cities: [], openDialog: false}

        this.loadCities = this.loadCities.bind(this);
        this.handleClickOpen = this.handleClickOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleDelRow = this.handleDelRow.bind(this);
        this.handleAPIDelete = this.handleAPIDelete.bind(this);
    }

    handleClickOpen (row: CityDto, index: number){
        this.setState({openDialog: true});
        this.row = row;
        this.rowIndex = index;
    };

    handleClose (){
        this.setState({openDialog: false});
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
        this.handleClose(); 
        this.setState({cities});        
    }
    
    handleAPIDelete(){
        console.log('http://maiatest.domain.com:3002/dscity/'+this.row.name);
        fetch('http://maiatest.domain.com:3002/dscity/'+this.row.name, {
                method: 'DELETE'
            })
            .then(response => response.json())
            .then(data => {
                this.handleDelRow();
                console.log(data)
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
                                            <IconButton color="primary" aria-label="edit">
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
            </div>                 
    }

    componentDidMount(){
        fetch('http://maiatest.domain.com:3002/dscity')
            .then(response => response.json())
            .then(data => this.loadCities(data));    
    }
}