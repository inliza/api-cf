import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from 'src/common/common.module';
import { HelperModule } from 'src/common/helper/helper.module';
import { CitiesPickupService } from './cities-pickup.service';
import { CitiesPickupController } from './cities-pickup.controller';
import { CitiesPickUp, CitiesPickupSchema } from 'src/models/cities-pickup.model';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: CitiesPickUp.name, schema: CitiesPickupSchema }]),
        CommonModule,
        HelperModule
    ],
    providers: [CitiesPickupService],
    controllers: [CitiesPickupController],
})
export class CitiesPickupModule {}
