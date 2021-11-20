import React, {ReactNode} from "react";

type Props = {
    children?: ReactNode;
}
type State = {
}

export class FormCity extends React.Component<Props>{
    constructor(props: Props){
        super(props);        
    }

    render(){
        return <div>
            FORM CITY    
            </div>                 
    }
}