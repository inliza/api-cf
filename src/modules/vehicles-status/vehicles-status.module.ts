import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from 'src/common/common.module';
import { VehiclesStatus, VehiclesStatusSchema } from 'src/models/vehicles-status.model';
import { VehiclesStatusService } from './vehicles-status.service';
import { VehiclesStatusController } from './vehicles-status.controller';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: VehiclesStatus.name, schema: VehiclesStatusSchema }]),
        CommonModule,
    ],
    providers:[VehiclesStatusService],
    controllers: [VehiclesStatusController],
    exports:[VehiclesStatusService]
})
export class VehiclesStatusModule {}
