import React from 'react';
import TextField from '@mui/material/TextField';
import { ReactNode } from 'react';
import '../sass/formcity.scss';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { CityDto } from '../dtos/city.dto';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import newMarkerIco from '../images/marker.png';
import { Landmarks } from './landmarks';
import {CityService} from '../services/city.serv';

const validator = require('validator');

type Props = {
    obj: CityDto;
    showHome: any;
    children?: ReactNode;
}
type State = {
    obj: CityDto;
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
    lat_value: number;
    lng_value: number;
    landmarks: string[];
    name_helper:string = ''
    nativename_helper:string = ''
    country_helper:string = ''
    continent_helper:string = ''
    population_helper:string = ''
    year_helper:string = ''
    update: string = '';
    valid: number = 0; //fields required so false, form is not valid, conditions are for 8 bits

    constructor(props:Props){
        super(props);
        this.state = { 
            obj: props.obj,
            snackBarMsg: 'Please, review the form. Ensure you have filled all required fields. Location on the map is also required.'
        }
        this.lng_value = props.obj.longitude;
        this.lat_value = props.obj.latitude;
        if (props.obj.name){
            this.valid = 63;
            this.update = props.obj.name;
        }
            
        if (!props.obj.landmarks)
            this.landmarks = [];
        else
            this.landmarks = props.obj.landmarks;

        this.check = this.check.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleOnFocusLost = this.handleOnFocusLost.bind(this);
        this.handleOnSubmit = this.handleOnSubmit.bind(this);
        this.handleOnKeyPress = this.handleOnKeyPress.bind(this);
        this.handleCloseSB = this.handleCloseSB.bind(this);
        this.loadMap = this.loadMap.bind(this);
        this.addMarker = this.addMarker.bind(this);
        this.setLandmarks = this.setLandmarks.bind(this);
    }

    setLandmarks(data: string[]){
        this.landmarks = data;
    }
    check(value:any, targetid: string){
        switch(targetid){
            case 'name': 
                (this.state as State).obj.name = value;
                if (!value){
                    this.setState({name_err: true});
                    this.name_helper = 'Field name cannot be empty';
                }
                else{
                    this.setState({name_err: false});
                    this.name_helper = '';
                }
                this.valid = (this.valid ^ 1) ? (value ? this.valid | 1 : this.valid & 254) : this.valid;//for refreshing the validity state of form.
                break;
            case 'nativename': 
                (this.state as State).obj.name_native = value;
                if (!value){
                    this.setState({nativename_err: true});
                    this.nativename_helper = 'Field name cannot be empty';
                }
                else{
                    this.setState({nativename_err: false});
                    this.nativename_helper = '';
                }
                this.valid = (this.valid ^ 2) ? (value ? this.valid | 2 : this.valid & 253) : this.valid;
                break;
            case 'country': 
                (this.state as State).obj.country = value;
                if (!value){
                    this.setState({country_err: true});
                    this.country_helper = 'Field name cannot be empty'
                }
                else{
                    this.setState({country_err: false});
                    this.country_helper = '';
                }
                this.valid = (this.valid ^ 4) ? (value ? this.valid | 4 : this.valid & 251) : this.valid;
                break;
            case 'continent': 
                (this.state as State).obj.continent = value;
                if (!value){
                    this.setState({continent_err: true});
                    this.continent_helper = 'Field name cannot be empty';
                }
                else{
                    this.setState({continent_err: false});
                    this.continent_helper = '';
                }
                this.valid = (this.valid ^ 8) ? (value ? this.valid | 8 : this.valid & 247) : this.valid;
                break;
            case 'population':                 
                if (!value){
                    this.setState({population_err: true});
                    this.population_helper = 'Field name cannot be empty\n';
                }
                else{
                    this.setState({population_err: false});
                    this.population_helper = '';
                }                
                this.valid = (this.valid ^ 16) ? (value ? this.valid | 16 : this.valid & 239) : this.valid;
                
                if (!validator.isInt(value)){
                    this.setState({population_err: true});
                    this.population_helper += 'Field must be an integer';
                }
                else{
                    this.setState({population_err: false});
                    (this.state as State).obj.population = parseInt(value);
                    this.population_helper += '';
                }
                this.valid = (this.valid ^ 16) ? (validator.isInt(value) ? this.valid | 16 : this.valid & 239) : this.valid;                
                break;                
            case 'year':                 
                if (!value){
                    this.setState({year_err: true});
                    this.year_helper = 'Field name cannot be empty\n';
                }
                else{
                    this.setState({year_err: false});
                    this.year_helper = '';
                }
                this.valid = (this.valid ^ 32) ? (validator.isInt(value) ? this.valid | 32 : this.valid & 223) : this.valid;

                if (!validator.isInt(value)){
                    this.setState({year_err: true});
                    this.year_helper += 'Field must be an integer';
                }
                else{
                    this.setState({year_err: false});
                    this.year_helper += '';
                    (this.state as State).obj.founded = parseInt(value);
                }
                this.valid = (this.valid ^ 32) ? (validator.isInt(value) ? this.valid | 32 : this.valid & 223) : this.valid;                
                break;              
        }
    }

    handleOnSubmit(e:any){
        if ((this.valid & 255) !== 63 || !(this.lat_value && this.lng_value && this.landmarks.length!=0)){ //63 for 6 conditions 255 for 8
            this.setState({openSnackBar: true})
            return;
        }
        const obj = (this.state as State).obj;
        obj.latitude = this.lat_value;
        obj.longitude = this.lng_value;
        obj.landmarks = this.landmarks;
        const o = JSON.stringify(obj);
        let promise = CityService.newCity(obj);
        if (this.update){
            promise = CityService.updCity(this.update, obj)
        }
        promise.then(response => response.json())
            .then(data => {                
                if (!data.status || data.error){
                    const st = data.message.join('. ')
                    this.setState({openSnackBar: true, snackBarMsg: st});
                }  
                else{
                    this.props.showHome(`${data.message}`);    
                }
                
            })
            .catch((error) => {
                console.log(error);
                this.setState({openSnackBar: true})
            });                  
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
        return <div className="FormContainer">
            <Stack className='ButtonCls' spacing={2} alignContent='left' direction="row">
                <Button variant="text" onClick={()=>this.props.showHome('')}>Home</Button>
            </Stack> 
                <div>
                    <div className='FirstColumn'>
                        <div onBlur={this.handleOnFocusLost}>
                            <TextField fullWidth
                                id="name"
                                margin="normal"
                                required
                                label="Name"
                                error= {(this.state as State).name_err} 
                                value={(this.state as State).obj.name}
                                helperText={this.name_helper}
                                onChange={this.handleChange}
                                onKeyPress={this.handleOnKeyPress}
                            />  
                        </div>
                        <div onBlur={this.handleOnFocusLost}>
                            <TextField fullWidth
                                id="nativename"
                                margin="normal"
                                required
                                label="Native Name"
                                error= {(this.state as State).nativename_err} 
                                value={(this.state as State).obj.name_native}
                                helperText={this.nativename_helper}
                                onChange={this.handleChange}
                                onKeyPress={this.handleOnKeyPress}
                            />  
                        </div>
                        <div onBlur={this.handleOnFocusLost}>
                            <TextField fullWidth
                                id="country"
                                margin="normal"
                                required
                                label="Country"
                                error= {(this.state as State).country_err} 
                                value={(this.state as State).obj.country}
                                helperText={this.country_helper}
                                onChange={this.handleChange}
                                onKeyPress={this.handleOnKeyPress}
                            />  
                        </div>
                        <div onBlur={this.handleOnFocusLost}>
                            <TextField fullWidth
                                id="continent"
                                margin="normal"
                                required
                                label="Continent"
                                error= {(this.state as State).continent_err} 
                                value={(this.state as State).obj.continent}
                                helperText={this.continent_helper}
                                onChange={this.handleChange}
                                onKeyPress={this.handleOnKeyPress}
                            />  
                        </div>
                        <div onBlur={this.handleOnFocusLost}>
                            <TextField fullWidth
                                id="population"
                                margin="normal"
                                required
                                label="Population"
                                error= {(this.state as State).population_err} 
                                value={(this.state as State).obj.population}
                                helperText={this.population_helper}
                                onChange={this.handleChange}
                                onKeyPress={this.handleOnKeyPress}
                            />  
                        </div>
                        <div onBlur={this.handleOnFocusLost}>
                            <TextField fullWidth
                                id="year"
                                margin="normal"
                                required
                                label="Foundation Year"
                                error= {(this.state as State).year_err} 
                                value={(this.state as State).obj.founded}
                                helperText={this.year_helper}
                                onChange={this.handleChange}
                                onKeyPress={this.handleOnKeyPress}
                            />  
                        </div> 
                        <div>
                            <Landmarks
                                data={this.landmarks}
                                setLandmarks={this.setLandmarks}
                            />
                        </div>
                    </div>

                    <div className='SecondColumn'>
                        <p>Click on the map to select the city</p>
                        <div id='map'></div>
                    </div>
                </div>                
                <Stack className='ButtonCls' spacing={2} alignContent='left' direction="row-reverse">
                    <Button variant="text" onClick={()=>this.props.showHome('')}>Home</Button>
                    <Button disabled = {(this.state as State).disabled} style={{margin: 5}} variant="contained" 
                        onClick={this.handleOnSubmit}>Submit</Button>
                </Stack>  
                <Stack spacing={2} sx={{ width: '100%' }}>
                    <Snackbar open={(this.state as State).openSnackBar} autoHideDuration={4000} onClose={this.handleCloseSB}>
                        <Alert onClose={this.handleCloseSB} severity='error' sx={{ width: '100%' }}>
                            {(this.state as State).snackBarMsg}                            
                        </Alert>                        
                    </Snackbar>
                </Stack> 
        </div>
    }

    componentDidMount(){
        this.loadMap();
    }

    loadMap(){
        this.map = L.map('map').setView([0, 0], 2);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);

        let DefaultIcon = L.icon({
            iconUrl: icon,
            shadowUrl: iconShadow
        });
        L.Marker.prototype.options.icon = DefaultIcon;       

        this.map.on('click', (e:any)=>this.addMarker(e.latlng));

        if (this.lat_value && this.lng_value){
            let myicon = L.icon({
                iconUrl: newMarkerIco,
                iconSize: [15, 15],
                popupAnchor: [0,-7],
                className: 'MapMarker'
            });
            this.marker = L.marker([this.lat_value, this.lng_value], {icon: myicon});
            this.map.addLayer(this.marker);
            this.map.flyTo([this.lat_value, this.lng_value], 2)
        }
    }

    addMarker(latlng: any){  
        if (this.marker){//delete the previous point
            this.map.removeLayer(this.marker);
        } 

        let myicon = L.icon({
            iconUrl: newMarkerIco,
            iconSize: [15, 15],
            popupAnchor: [0,-7],
            className: 'MapMarker'
        });
        this.marker = L.marker(latlng, {icon: myicon});
        this.map.addLayer(this.marker);
        this.lat_value = latlng.lat;
        this.lng_value = latlng.lng;
        this.marker.bindPopup(`[${latlng.lat}, ${latlng.lng}]`)
                .openPopup();
    }
}

