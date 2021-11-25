import {ServerPath} from '../config';
import { CityDto } from '../dtos/city.dto';
import axios from 'axios';

export class CityService {
    static async getCities() {
        const res = await axios.get(`${ServerPath}/dscity`)
        return res.data;
    }  

    static async delCities(name: string) {
        const res = await axios.delete(`${ServerPath}/dscity/`+name);
        return await res.data;
    }
    static async newCity(obj: CityDto){
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
            }
          };
        const res = await axios.post(`${ServerPath}/dscity`, obj, axiosConfig)
        return await res.data;
    } 
    static async updCity(name: string, obj: CityDto){
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
            }
          };
        const res = await axios.post(`${ServerPath}/dscity/${name}`, obj, axiosConfig)
        return await res.data;               
    } 
}