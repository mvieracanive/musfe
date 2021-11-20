import React, { ReactNode } from 'react';
import { CityDto } from '../dtos/city.dto';
import {CitiesTable} from './citiestable';
import {FormCity} from './formcity';

type Props = {
    content_id: string;
    children?: ReactNode;
}
type State = {
    content: string;
}
export class Content extends React.Component<Props> {

    constructor(props:Props){
        super(props);
        this.state={
            content: 'home'
        }

        this.showForm = this.showForm.bind(this);
    }

    showForm(dto: CityDto){
        this.setState({content: 'new'})
        console.log(dto);
    }
    
    render() {
        let scontent:ReactNode = null;
        switch ((this.state as State).content) {
            case 'home':
                scontent = <CitiesTable showForm={this.showForm}/>;
                break;
            case 'new':
                scontent = <FormCity />;
                break;
        }

        return <div className = "Content">                    
                    {scontent}
                </div>;
    }
    
    componentDidMount() {  }
    componentWillUnmount() {  }
} 