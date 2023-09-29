import { Controller } from "@nestjs/common";
import { VehiclesRentCarsService } from "./vehicles-rent-cars.service";

@Controller('api/vvehicles-rent-cars')
export class VehiclesRentCarsController {
    constructor(private service: VehiclesRentCarsService) { }

}