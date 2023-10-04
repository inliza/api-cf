import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { VehiclesImagesService } from './vehicle-images.service';
import { ImagesController } from './vehicle-images.controller';
import { HelperModule } from 'src/common/helper/helper.module';

@Module({
    imports: [CommonModule, HelperModule],
    providers: [VehiclesImagesService],
    controllers: [ImagesController],
    exports: [VehiclesImagesService]
})
export class VehicleImagesModule {}
