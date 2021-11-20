import React, {ReactNode} from "react";
import { Header } from './header';
import { Footer } from './footer';
import { Content } from './content';

type Props = {
    children?: ReactNode;
}
type State = {
    content_id: string;
}

export class Template extends React.Component<Props>{
    fresh: boolean;
    responseMsg: string;

    constructor(props: Props){
        super(props);
        (this.state as State) = {content_id: 'home'};
        this.fresh = true;
        this.responseMsg = '';
 
        this.funOnChangeContent = this.funOnChangeContent.bind(this);
        this.funShowResponse = this.funShowResponse.bind(this);
    }

    funShowResponse(msg: string){
        this.responseMsg = msg;
        this.setState({content_id: 'response'});
    }

    funOnChangeContent(content_id: string){
        if (content_id != ((this.state as State) as State).content_id)
            this.setState({content_id: content_id});
    }

    render(){
        return <div>
                <Header/>
                <Content content_id = {(this.state as State).content_id}/>
                <Footer/>
            </div>                 
    }

    shouldComponentUpdate(nextprops:any, nextstate:any){
        if ((this.state as State).content_id != nextstate.content_id)
            document.documentElement.scrollTop = 0;
           
        return true;
    }
    componentDidMount() {
        this.fresh = false;
    }
}
