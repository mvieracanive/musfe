import * as React from 'react';
import { styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import TagFacesIcon from '@mui/icons-material/TagFaces';
import TextField from '@mui/material/TextField';
import { Label } from '@mui/icons-material';
import { Avatar, List, Stack } from '@mui/material';
import { Button } from '@material-ui/core';

interface ChipData {
  key: number;
  label: string;
  obj: any;
}
type Props = {
    data: any[];
    setLandmarks: any;
    disable: boolean;
}
type State = {
    chipData: ChipData[];
    error: boolean;
    helper: string;
    uid: string;
    status:string;
    vendor:string;
}

export class Landmarks extends React.Component<Props>{
    key: number;
    

    constructor(props:Props){
        super(props);
        const datachips = props.data.map((c, i)=>({key: i, label: c.uid, obj: c}));
        this.state = {chipData: datachips, error: false, helper: ''};
        this.key = datachips.length;


        this.handleOnKeyPress = this.handleOnKeyPress.bind(this);
        this.handleOnClick= this.handleOnClick.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleOnFocusLost = this.handleOnFocusLost.bind(this);
        this.handleOnChange= this.handleOnChange.bind(this);
    }

    handleDelete (chipToDelete: ChipData){
        const newchips = (this.state as State).chipData.filter((chip) => chip.key !== chipToDelete.key);
        this.props.setLandmarks(newchips.map((v)=>v.obj));
        this.setState({chipData: newchips});
        /*if (newchips.length == 0)
            this.setState({error: true, helper: 'Peripherals list cannot be empty'})*/ 
    };

    handleOnKeyPress(e:any){
        if (e.charCode === 13){
            const v = e.target.value.trim();

            if (!v)
                return;
            e.target.value = '';
            const data = (this.state as State).chipData;
            data.push({key: this.key++, label: v, obj: {uid: v}});
            this.props.setLandmarks(data.map((v)=>v.obj));
            this.setState({chipData: data});
            this.setState({error: false, helper: ''})
        }
    }
    handleOnChange(e:any){
        const v = e.target.value.trim();
        if (e.target.id == 'uid')
            this.setState({uid: v});
        if (e.target.id == 'status')
            this.setState({status: v});
        if (e.target.id == 'vendor')
            this.setState({vendor: v});
        
    }
    handleOnClick(){
        const uid = (this.state as State).uid;
        const status = (this.state as State).status;
        const vendor = (this.state as State).vendor;

        const data = (this.state as State).chipData;
        data.push({key: this.key++, label: uid ? uid : '', obj: {uid, status, vendor}});
        this.props.setLandmarks(data.map((v)=>v.obj));
        this.setState({chipData: data});
        this.setState({error: false, helper: ''})
        this.setState({uid: '', status:'', vendor: ''});
    }
    handleOnFocusLost(){
        /*if ((this.state as State).chipData.length != 0)
            return;
        this.setState({error: true, helper: 'Peripheral list cannot be empty'})*/
    }
    render(){
        if (true){
            const li = this.props.data.map((v)=>
            <List style={{color: "gray"}} component="nav" aria-label="main mailbox folders">
                <ListItem>
                    {v.uid}, {v.vendor}, <em>{v.status}</em>
                </ListItem>
            </List>);
            return <ul>{li}</ul>
        }
        return <div className='LandmarksContainer' >
            <h6>Peripherals</h6>
            <div onBlur={this.handleOnFocusLost}>
                <TextField fullWidth
                    id="uid"
                    required
                    size="small"
                    margin="normal"
                    label="UID"
                    error={(this.state as State).error}
                    helperText={(this.state as State).helper}
                    value={(this.state as State).uid}
                    onChange={this.handleOnChange}
                    //onKeyPress={this.handleOnKeyPress}
                />
                <TextField fullWidth
                    id="vendor"
                    required
                    size="small"
                    margin="normal"
                    label="Vendor"
                    error={(this.state as State).error}
                    helperText={(this.state as State).helper}
                    value={(this.state as State).vendor}
                    onChange={this.handleOnChange}
                    //onKeyPress={this.handleOnKeyPress}
                />
                <TextField fullWidth
                    id="status"
                    required
                    size="small"
                    margin="normal"
                    label="Status"
                    error={(this.state as State).error}
                    helperText={(this.state as State).helper}
                    value={(this.state as State).status}
                    onChange={this.handleOnChange}
                    //onKeyPress={this.handleOnKeyPress}
                />
                <Stack spacing={2}  >
                        <Button variant="text" onClick={()=>this.handleOnClick()}>Add</Button>
                </Stack>
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