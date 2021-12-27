import { PeripheralDto } from "./peripheral.dto";

export class GatewayDto{
    serial:string;

    human_name: string;
    
    ipv4: string;

    peripheral: PeripheralDto[];
}