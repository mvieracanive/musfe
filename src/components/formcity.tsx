import React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { ReactNode } from 'react';
import '../sass/formcity.scss';
const validator = require('validator');

type Props = {
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
}
export class FormCity extends React.Component<Props>{
    name_helper:string = ''
    nativename_helper:string = ''
    country_helper:string = ''
    continent_helper:string = ''
    population_helper:string = ''
    year_helper:string = ''

    constructor(props:Props){
        super(props);
        this.state = {
            name_value:'',
            name_value_err: false,            
        }

        this.check = this.check.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleOnFocusLost = this.handleOnFocusLost.bind(this);
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
                if (!validator.isInt(value)){
                    this.setState({population_err: true});
                    this.population_helper += 'Field must be an integer';
                }
                else{
                    this.setState({population_err: false});
                    this.population_helper += '';
                }
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
                if (!validator.isInt(value)){
                    this.setState({year_err: true});
                    this.year_helper += 'Field must be an integer';
                }
                else{
                    this.setState({year_err: false});
                    this.year_helper += '';
                }
                break;                
        }
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
                    />  
                </div>             
            </form>
        </div>
    }
}