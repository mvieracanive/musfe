import {ServerPath} from '../config';
import { GatewayDto } from '../dtos/gateway.dto';
import axios from 'axios';
import { ConstructionOutlined } from '@mui/icons-material';
import { PeripheralDto } from '../dtos/peripheral.dto';

export class GatewayService {
    static async getGateways() {
        try{
            const res = await axios.get(`${ServerPath}/gateway`);
            return res.data;
        }
        catch(ex){
            console.log(ex);
            return [];
        }       
    }  

    static async delGateway(name: string) {
        const res = await axios.delete(`${ServerPath}/gateway/`+name);
        return await res.data;
    }
    static async newGateway(obj: GatewayDto){
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
            }
          };
        try{
            const res = await axios.post(`${ServerPath}/gateway`, {serial:obj.serial, human_name: obj.human_name, ipv4: obj.ipv4}, axiosConfig);
            console.log("AAAAAAAAAAAAAAAAAAa",res);
            return res.data;
        }
        catch(ex:any){
            return ex.response.data;
        }
        
    } 
    static async addGateway(name: string, obj: PeripheralDto){
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
            }
          };
        
        const res = await axios.post(`${ServerPath}/gateway/${name}/peripheral`, obj, axiosConfig);
        
        return await res.data;               
    } 
}