import React, { ReactNode } from 'react';
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
            content: ''
        }
    }
    
    render() {
        let scontent:ReactNode = null;
        switch (this.props.content_id) {
            case 'home':
                scontent = <CitiesTable />;
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