import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import '../../sass/_vars.scss';
import validator from 'validator';

export class TextFieldValidator extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      value: props.value || '',
      errors: '',
    };
    this.refreshed = false;
    this.forcedValidation = false;

    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleOnFocusLost = this.handleOnFocusLost.bind(this);
    this.validate = this.validate.bind(this);
    if (props.required && props.informValidity)
      props.informValidity(props.componentId, false);
  }

  refresh(){
    this.setState({
      value: '',
      errors: '',
    });
    this.forcedValidation = false;    
    if (this.props.required && this.props.informValidity)
      this.props.informValidity(this.props.componentId, false);
    
    this.refreshed = true;
  }

  validate(value, validations){
    let res = [];
    if (validations){
      validations.forEach(element => {
        const v = element;
        
        try{
          const args = v.args;
          let flag = true;
          if (!args || args.length == 0){
            flag = validator[v.handle](value);
          }
          else{
            flag = validator[v.handle](value, ...args);
          } 
          if (v.not)
            flag = !flag;
  
          if (!flag)         
            res.push(v.errorMsg ? v.errorMsg : "Error in: " + v.handle);
        }
        catch(e){
          console.log(e);
          res.push('CRITICAL ERROR, PLEASE CHECK LOGS. You may be calling a non-existing validator or using the wrong arguments.');
        }
      });
    }
    
    if (res.length==0){
      this.setState({errors: ''});
    }
    else{
      const msg = res.join('\n');
      this.setState({errors: msg});
    } 

    if(this.props.informValidity){
      this.props.informValidity(this.props.componentId, res.length == 0);
    }
    this.forcedValidation = true;
  }

  handleOnChange(event) {
    this.setState({value: event.target.value});
    this.validate(event.target.value, this.props.validations);
    
    if (this.props.informData)  
      this.props.informData(event.target.value);         
  }

  handleOnFocusLost(e){
    this.validate(e.target.value, this.props.validations);
  }

  render(){    
    return <div onBlur={this.handleOnFocusLost}>
        <TextFieldControlled
            id={this.props.id}
            label={this.props.label}
            multiline={this.props.rows && this.props.rows > 1}
            maxRows={this.props.rows}
            value={this.state.value}
            error={this.state.errors}
            required={this.props.required}
            disabled={this.props.disabled}
            name={this.props.name}
            onChange={this.handleOnChange}
            onKeyPress={this.props.onKeyPress}
        />
      </div>;
  }

  shouldComponentUpdate(nextProps, nextState){
    if(nextProps.forceValidation && !this.forcedValidation){
      this.validate(this.state.value, this.props.validations); 
      return false;     
    }
    if(nextProps.refresh && !this.refreshed){      
      this.refresh();
      return false;
    }
    if(!nextProps.refresh && this.refreshed){
      this.refreshed = false;
    }
    return true;
  } 
}

const useStyles = makeStyles((theme) => ({
  root: {
      margin: theme.spacing(1),
      width: '100%',
      '& > p': {
        whiteSpace: 'pre-wrap'
      }      
    },
}));

const TextFieldControlled = function (props) {
  const classes = useStyles(); 

  return (  
        <TextField className={classes.root}
          id={props.id ? props.id : props.name}
          label={props.label}
          multiline={props.multiline}
          maxRows={props.maxRows}
          value={props.value}
          error={props.error && props.error != '' ? true : false}
          helperText={props.error}
          required={props.required}
          disabled={props.disabled}
          inputProps={{ 
            'aria-label': 'description', 
            'name': props.name,
          }}
          onChange={props.onChange}
          onKeyPress={props.onKeyPress}      
        />
  );
}