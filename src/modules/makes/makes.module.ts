import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from 'src/common/common.module';
import { Makes, MakesSchema } from 'src/models/makes.model';
import { MakesService } from './makes.service';
import { MakesController } from './makes.controller';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Makes.name, schema: MakesSchema }]),
        CommonModule,
    ],
    providers:[MakesService],
    controllers: [MakesController],
    exports:[MakesService]
})
export class MakesModule {}
