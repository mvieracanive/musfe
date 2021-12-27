import React from 'react';
import TextField from '@mui/material/TextField';
import { ReactNode } from 'react';
import '../sass/formcity.scss';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { GatewayDto } from '../dtos/gateway.dto';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import * as L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import newMarkerIco from '../images/marker.png';
import { Landmarks } from './peripherals';
import {GatewayService} from '../services/gateway.serv';
import { PeripheralDto } from '../dtos/peripheral.dto';

const validator = require('validator');

type Props = {
    obj: GatewayDto;
    showHome: any;
    children?: ReactNode;   
}
type State = {
    obj: GatewayDto;
    name_err:boolean;
    nativename_err:boolean;
    country_err:boolean;
    continent_err:boolean;
    population_err:boolean;
    year_err:boolean;    
    disabled: boolean;
    openSnackBar: boolean;
    snackBarMsg: string;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
  ) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export class FormCity extends React.Component<Props>{
    map:any;
    marker: any;
    view: boolean;
    ipv4_value: string;
    human_value: string;
    peripherals: PeripheralDto[];
    serial_helper:string = ''
    human_helper:string = ''
    ipv4_helper:string = ''
    update: string = '';
    valid: number = 0; //fields required so false, form is not valid, conditions are for 8 bits

    constructor(props:Props){
        super(props);
        this.state = { 
            obj: props.obj,
            snackBarMsg: 'Please, review the form. Ensure you have filled all required fields. Location on the map is also required.'
        }
        this.human_value = props.obj.human_name;
        this.ipv4_value = props.obj.ipv4;
        if (props.obj.serial){
            this.valid = 63;
            this.update = props.obj.serial;
        }
            
        if (!props.obj.peripheral)
            this.peripherals = [];
        else
            this.peripherals = props.obj.peripheral;
            
        this.check = this.check.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleOnFocusLost = this.handleOnFocusLost.bind(this);
        this.handleOnSubmit = this.handleOnSubmit.bind(this);
        this.handleOnKeyPress = this.handleOnKeyPress.bind(this);
        this.handleCloseSB = this.handleCloseSB.bind(this);
        this.setLandmarks = this.setLandmarks.bind(this);
    }

    setLandmarks(data: PeripheralDto[]){
        this.peripherals = data;
    }
    check(value:any, targetid: string){
        switch(targetid){
            case 'serial': 
                (this.state as State).obj.serial = value;
                if (!value){
                    this.setState({name_err: true});
                    this.serial_helper = 'Field name cannot be empty';
                }
                else{
                    this.setState({name_err: false});
                    this.serial_helper = '';
                }
                this.valid = (this.valid ^ 1) ? (value ? this.valid | 1 : this.valid & 254) : this.valid;//for refreshing the validity state of form.
                break;
            case 'humanname': 
                (this.state as State).obj.human_name = value;
                if (!value){
                    this.setState({nativename_err: true});
                    this.human_helper = 'Field name cannot be empty';
                }
                else{
                    this.setState({nativename_err: false});
                    this.human_helper = '';
                }
                this.valid = (this.valid ^ 2) ? (value ? this.valid | 2 : this.valid & 253) : this.valid;
                break;
            case 'ipv4': 
                (this.state as State).obj.ipv4 = value;
                if (!value){
                    this.setState({country_err: true});
                    this.ipv4_helper = 'Field name cannot be empty'
                }
                else{
                    this.setState({country_err: false});
                    this.ipv4_helper = '';
                }
                this.valid = (this.valid ^ 4) ? (value ? this.valid | 4 : this.valid & 251) : this.valid;
                break;           
        }
    }

    async handleOnSubmit(e:any){
        /*if ((this.valid & 255) !== 7 || !(this.ipv4_value && this.human_value )){ //63 for 6 conditions 255 for 8
            this.setState({openSnackBar: true})
            return;
        }*/

        const obj = (this.state as State).obj;
        obj.peripheral = this.peripherals;
        try{
            
                const data:any = await GatewayService.newGateway(obj);   
                console.log(data);             
                if (data.error || data.statusCode){
                    let st = data.message;
                    if (Array.isArray(data.message))
                        st = data.message.join('. ');
                    this.setState({openSnackBar: true, snackBarMsg: st});
                }  
                else{
                    this.props.showHome(`Success`);    
                }
             
        }
        catch(e){
            console.log(e);
            this.setState({openSnackBar: true})
        }
                  
    }

    handleCloseSB (){
        this.setState({openSnackBar: false});
    };
    handleOnKeyPress(e:any){
        if (e.charCode === 13)
            this.handleOnSubmit(e);
    }
    handleChange(e:any){ 
        const v = e.target.value;
        const id = e.target.id;
        this.check(v,id);
    }
    handleOnFocusLost(e: any){
        const v = e.target.value;
        const id = e.target.id;
        this.check(v, id);
    }
    render(){
        let footer = <Stack className='ButtonCls' spacing={2} alignContent='right' >
                   
                    <Button 
                        disabled = {(this.state as State).disabled} style={{margin: 5}} variant="contained" 
                        onClick={this.handleOnSubmit}>Submit</Button>
                </Stack> ;
        if (this.update){
            footer = <Stack className='ButtonCls' spacing={2}  >
                        
                    </Stack> ;
        }
        return <div className="FormContainer">
            <Stack className='ButtonCls' spacing={2} alignContent='left' direction="row">
                <Button variant="text" onClick={()=>this.props.showHome('')}>Home</Button>
            </Stack> 
                <div>
                    <div className='FirstColumn'>
                        <div onBlur={this.handleOnFocusLost}>
                            <TextField fullWidth
                                disabled = {this.update ? true : false}
                                id="serial"
                                margin="normal"
                                required
                                label="Serial"
                                error= {(this.state as State).name_err} 
                                value={(this.state as State).obj.serial}
                                helperText={this.serial_helper}
                                onChange={this.handleChange}
                                onKeyPress={this.handleOnKeyPress}
                            />  
                        </div>
                        <div onBlur={this.handleOnFocusLost}>
                            <TextField fullWidth
                                disabled = {this.update ? true : false}
                                id="humanname"
                                margin="normal"
                                required
                                label="Human Name"
                                error= {(this.state as State).nativename_err} 
                                value={(this.state as State).obj.human_name}
                                helperText={this.human_helper}
                                onChange={this.handleChange}
                                onKeyPress={this.handleOnKeyPress}
                            />  
                        </div>
                        <div onBlur={this.handleOnFocusLost}>
                            <TextField fullWidth
                                disabled = {this.update ? true : false}
                                id="ipv4"
                                margin="normal"
                                required
                                label="IP version 4"
                                error= {(this.state as State).country_err} 
                                value={(this.state as State).obj.ipv4}
                                helperText={this.ipv4_helper}
                                onChange={this.handleChange}
                                onKeyPress={this.handleOnKeyPress}
                            />  
                        </div>                       
                        <div>
                            <Landmarks
                                data={this.peripherals}
                                setLandmarks={this.setLandmarks}
                                disable = {this.update ? true : false}
                            />
                        </div>
                        {footer} 
                    </div>

                    <div className='SecondColumn'>
                        
                    </div>
                </div>                
                
                <Stack spacing={2} sx={{ width: '100%' }}>
                    <Snackbar open={(this.state as State).openSnackBar} autoHideDuration={4000} onClose={this.handleCloseSB}>
                        <Alert onClose={this.handleCloseSB} severity='error' sx={{ width: '100%' }}>
                            {(this.state as State).snackBarMsg}                            
                        </Alert>                        
                    </Snackbar>
                </Stack> 
        </div>
    }
}

