import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from 'src/common/common.module';
import { VehiclesTypes, VehiclesTypesSchema } from 'src/models/vehicles-types.model';
import { VehiclesTypesService } from './vehicles-types.service';
import { VehiclesTypesController } from './vehicles-types.controller';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: VehiclesTypes.name, schema: VehiclesTypesSchema }]),
        CommonModule,
    ],
    providers:[VehiclesTypesService],
    controllers: [VehiclesTypesController],
    exports:[VehiclesTypesService]
})
export class VehiclesTypesModule {}
