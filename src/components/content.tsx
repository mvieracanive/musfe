import React, { ReactNode } from 'react';
import { CityDto } from '../dtos/city.dto';
import {CitiesTable} from './citiestable';
import {FormCity} from './formcity';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

type Props = {
    content_id: string;
    children?: ReactNode;
}
type State = {
    openSnackBar: boolean;
    content: string;
    formmsg: string;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
  ) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export class Content extends React.Component<Props> {
    city: CityDto;
    formmsg: string;

    constructor(props:Props){
        super(props);
        this.state={
            content: 'home'
        }

        this.showForm = this.showForm.bind(this);
        this.showHome = this.showHome.bind(this);
        this.handleCloseSB = this.handleCloseSB.bind(this);
    }

    showForm(dto: CityDto){
        this.setState({content: 'new'})
        this.city = dto;
    }

    showHome(msg: string){
        this.setState({content: 'home'})
        if (!msg)
            return;
        this.setState({formmsg: msg})
        this.setState({openSnackBar: true})
    }
    
    handleCloseSB (){
        this.setState({openSnackBar: false});
    };

    render() {
        let scontent:ReactNode = null;
        switch ((this.state as State).content) {
            case 'home':
                scontent = <CitiesTable showForm={this.showForm}/>;
                break;
            case 'new':
                scontent = <FormCity obj = {this.city} showHome={this.showHome}/>;
                break;
        }

        return <div className = "Content">                    
                    {scontent}
                    <Stack spacing={2} sx={{ width: '100%' }}>
                        <Snackbar open={(this.state as State).openSnackBar} autoHideDuration={4000} onClose={this.handleCloseSB}>
                            <Alert onClose={this.handleCloseSB} severity='success' sx={{ width: '100%' }}>
                                {(this.state as State).formmsg}
                            </Alert>                        
                        </Snackbar>
                    </Stack>
                </div>;                
    }
    
    componentDidMount() {  }
    componentWillUnmount() {  }
} 