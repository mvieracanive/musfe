import {ServerPath} from '../config';
import { CityDto } from '../dtos/city.dto';

export class CityService {
    static getCities() {
      return fetch(`${ServerPath}/dscity`)
    }  

    static async delCities(name: string) {
        const res = await fetch(`${ServerPath}/dscity/`+name, {
            method: 'DELETE'
        });
        return await res.json();
    }
    static async newCity(obj: CityDto){
        const res = await fetch(`${ServerPath}/dscity`, {
            method: 'POST',
            body: JSON.stringify(obj),
            headers:{
                'Content-Type': 'application/json'
            }
        })
        return await res.json();
    } 
    static async updCity(name: string, obj: CityDto){
        const res = await fetch(`${ServerPath}/dscity/${name}`, {
            method: 'POST',
            body: JSON.stringify(obj),
            headers:{
                'Content-Type': 'application/json'
            }
        })
        return await res.json();
    } 
}