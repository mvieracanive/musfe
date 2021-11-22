import {ServerPath} from '../config';
import { CityDto } from '../dtos/city.dto';

export class CityService {
    static getCities() {
      return fetch(`${ServerPath}/dscity`)
    }  

    static delCities(name: string) {
        return fetch(`${ServerPath}/dscity/`+name, {
            method: 'DELETE'
        })
    }
    static newCity(obj: CityDto){
        return fetch(`${ServerPath}/dscity`, {
            method: 'POST',
            body: JSON.stringify(obj),
            headers:{
                'Content-Type': 'application/json'
            }
        })
    } 

    static updCity(name: string, obj: CityDto){
        return fetch(`${ServerPath}/dscity/${name}`, {
            method: 'POST',
            body: JSON.stringify(obj),
            headers:{
                'Content-Type': 'application/json'
            }
        })
    } 
}