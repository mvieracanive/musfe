import React from 'react';
import Box from '@mui/material/Box';
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

const validator = require('validator');

type Props = {
    obj: CityDto;
    showHome: any;
    children?: ReactNode;
}
type State = {
    name_value: string;
    name_err:boolean;
    nativename_value: string;
    nativename_err:boolean;
    country_value: string;
    country_err:boolean;
    continent_value: string;
    continent_err:boolean;
    population_value: string;
    population_err:boolean;
    year_value: string;
    year_err:boolean;    
    disabled: boolean;
    openSnackBar: boolean;
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
    name_helper:string = ''
    nativename_helper:string = ''
    country_helper:string = ''
    continent_helper:string = ''
    population_helper:string = ''
    year_helper:string = ''
    valid: number = 0; //fields required so false, form is not valid, conditions are for 8 bits

    constructor(props:Props){
        super(props);
        this.state = { 
            obj: props.obj           
        }

        this.check = this.check.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleOnFocusLost = this.handleOnFocusLost.bind(this);
        this.handleOnSubmit = this.handleOnSubmit.bind(this);
        this.handleOnKeyPress = this.handleOnKeyPress.bind(this);
        this.handleCloseSB = this.handleCloseSB.bind(this);
        this.loadMap = this.loadMap.bind(this);
        this.addMarker = this.addMarker.bind(this);
    }

    check(value:any, targetid: string){
        switch(targetid){
            case 'name': 
                (this.state as State).name_value = value;
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
                (this.state as State).nativename_value = value;
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
                (this.state as State).country_value = value;
                if (!value){
                    this.setState({country_err: true});
                    this.country_helper = 'Field name cannot be empty';
                }
                else{
                    this.setState({country_err: false});
                    this.country_helper = '';
                }
                this.valid = (this.valid ^ 4) ? (value ? this.valid | 4 : this.valid & 251) : this.valid;
                break;
            case 'continent': 
                (this.state as State).continent_value = value;
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
                (this.state as State).population_value = value;
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
                    this.population_helper += '';
                }
                this.valid = (this.valid ^ 16) ? (validator.isInt(value) ? this.valid | 16 : this.valid & 239) : this.valid;
                break;                
            case 'year': 
                (this.state as State).year_value = value;
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
                }
                this.valid = (this.valid ^ 32) ? (validator.isInt(value) ? this.valid | 32 : this.valid & 223) : this.valid;
                break;                
        }
    }

    handleOnSubmit(e:any){
        if ((this.valid & 255) !== 63 || !(this.lat_value && this.lng_value)){ //63 for 6 conditions 255 for 8
            this.setState({openSnackBar: true})
            return;
        }
        //this.setState({disabled: true});
        fetch('http://maiatest.domain.com:3002/dscity', {
                method: 'POST',
                body: JSON.stringify(this.props.obj), // data can be `string` or {object}!
                headers:{
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {                
                if (!data.status){
                    this.setState({openSnackBar: true});
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
            <form> 
                <div>
                    <div className='FirstColumn'>
                        <div onBlur={this.handleOnFocusLost}>
                            <TextField
                                id="name"
                                margin="normal"
                                required
                                label="Name"
                                error= {(this.state as State).name_err} 
                                value={(this.state as State).name_value}
                                helperText={this.name_helper}
                                onChange={this.handleChange}
                                onKeyPress={this.handleOnKeyPress}
                            />  
                        </div>
                        <div onBlur={this.handleOnFocusLost}>
                            <TextField
                                id="nativename"
                                margin="normal"
                                required
                                label="Native Name"
                                error= {(this.state as State).nativename_err} 
                                value={(this.state as State).nativename_value}
                                helperText={this.nativename_helper}
                                onChange={this.handleChange}
                                onKeyPress={this.handleOnKeyPress}
                            />  
                        </div>
                        <div onBlur={this.handleOnFocusLost}>
                            <TextField
                                id="country"
                                margin="normal"
                                required
                                label="Country"
                                error= {(this.state as State).country_err} 
                                value={(this.state as State).country_value}
                                helperText={this.country_helper}
                                onChange={this.handleChange}
                                onKeyPress={this.handleOnKeyPress}
                            />  
                        </div>
                        <div onBlur={this.handleOnFocusLost}>
                            <TextField
                                id="continent"
                                margin="normal"
                                required
                                label="Continent"
                                error= {(this.state as State).continent_err} 
                                value={(this.state as State).continent_value}
                                helperText={this.continent_helper}
                                onChange={this.handleChange}
                                onKeyPress={this.handleOnKeyPress}
                            />  
                        </div>
                        <div onBlur={this.handleOnFocusLost}>
                            <TextField
                                id="population"
                                margin="normal"
                                required
                                label="Population"
                                error= {(this.state as State).population_err} 
                                value={(this.state as State).population_value}
                                helperText={this.population_helper}
                                onChange={this.handleChange}
                                onKeyPress={this.handleOnKeyPress}
                            />  
                        </div>
                        <div onBlur={this.handleOnFocusLost}>
                            <TextField
                                id="year"
                                margin="normal"
                                required
                                label="Foundation Year"
                                error= {(this.state as State).year_err} 
                                value={(this.state as State).year_value}
                                helperText={this.year_helper}
                                onChange={this.handleChange}
                                onKeyPress={this.handleOnKeyPress}
                            />  
                        </div> 
                    </div>

                    <div className='SecondColumn'>
                        <p>Click on the map to select the city</p>
                        <div id='map'></div>
                    </div>
                </div>
                <Stack className='ButtonCls' spacing={2} alignContent='left' direction="row-reverse">
                    <Button disabled = {(this.state as State).disabled} style={{margin: 5}} variant="contained" 
                        onClick={this.handleOnSubmit}>Submit</Button>
                </Stack>  
                <Stack spacing={2} sx={{ width: '100%' }}>
                    <Snackbar open={(this.state as State).openSnackBar} autoHideDuration={4000} onClose={this.handleCloseSB}>
                        <Alert onClose={this.handleCloseSB} severity='error' sx={{ width: '100%' }}>
                            Please, review the form. Ensure you have filled all required fields. Location on the map is also required.
                        </Alert>                        
                    </Snackbar>
                </Stack>                          
            </form>
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

