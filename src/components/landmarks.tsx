import * as React from 'react';
import { styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import TagFacesIcon from '@mui/icons-material/TagFaces';
import TextField from '@mui/material/TextField';

interface ChipData {
  key: number;
  label: string;
}
type Props = {
    data: any[];
    setLandmarks: any;
}
type State = {
    chipData: ChipData[];
}

export class Landmarks extends React.Component<Props>{
    key: number;
    constructor(props:Props){
        super(props);
        const datachips = props.data.map((c, i)=>({key: i, label: c}));
        this.state = {chipData: datachips};
        this.key = datachips.length;

        this.handleOnKeyPress = this.handleOnKeyPress.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }

    handleDelete (chipToDelete: ChipData){
        const newchips = (this.state as State).chipData.filter((chip) => chip.key !== chipToDelete.key);
        this.props.setLandmarks(newchips.map((v)=>v.label));
        this.setState({chipData: newchips});
    };

    handleOnKeyPress(e:any){
        if (e.charCode === 13){
            const v = e.target.value.trim();
            e.target.value = '';
            const data = (this.state as State).chipData;
            data.push({key: this.key++, label: v});
            this.props.setLandmarks(data.map((v)=>v.label));
            this.setState({chipData: data});
        }
    }
    render(){
        return <div className='LandmarksContainer' >
            <div>
                <TextField fullWidth
                    id="name"
                    required
                    margin="normal"
                    label="Landmarks"
                    onKeyPress={this.handleOnKeyPress}
                />
            </div>
            <div>
                <ChipsArray 
                    data={(this.state as State).chipData}
                    funDel={this.handleDelete}
                />
            </div>
        </div>
    }
}

const ListItem = styled('li')(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

type Props2 = {
    data: any[];
    funDel: any;
}

class ChipsArray extends React.Component<Props2> {
    render(){
        return <Paper
            sx={{
                display: 'flex',
                justifyContent: 'center',
                flexWrap: 'wrap',
                listStyle: 'none',
                p: 0.5,
                m: 0,
            }}
            component="ul"
            >
            {this.props.data.map((data) => {
                let icon;
                return (
                    <ListItem key={data.key}>
                        <Chip
                            label={data.label}
                            onDelete={()=>this.props.funDel(data)}
                        />
                    </ListItem>
                );
            })}
        </Paper>;
    };
}