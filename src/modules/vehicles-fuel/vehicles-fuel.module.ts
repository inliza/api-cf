import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from 'src/common/common.module';
import { VehiclesFuel, VehiclesFuelSchema } from 'src/models/vehicles-fuel.model';
import { VehiclesFuelService } from './vehicles-fuel.service';
import { VehiclesFuelController } from './vehicles-fuel.controller';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: VehiclesFuel.name, schema: VehiclesFuelSchema }]),
        CommonModule,
    ],
    providers:[VehiclesFuelService],
    controllers: [VehiclesFuelController],
    exports:[VehiclesFuelService]
})
export class VehiclesFuelModule {}
