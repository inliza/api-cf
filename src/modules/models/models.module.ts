import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from 'src/common/common.module';
import { Models, ModelsSchema } from 'src/models/models.model';
import { ModelsService } from './models.service';
import { ModelsController } from './models.controller';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Models.name, schema: ModelsSchema }]),
        CommonModule,
    ],
    providers:[ModelsService],
    controllers: [ModelsController],
    exports:[ModelsService]
})
export class ModelsModule {}
