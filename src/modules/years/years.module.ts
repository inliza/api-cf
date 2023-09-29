import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from 'src/common/common.module';
import { YearsService } from './years.service';
import { YearsController } from './years.controller';
import { Years, YearsSchema } from 'src/models/years.model';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Years.name, schema: YearsSchema }]),
        CommonModule,
    ],
    providers:[YearsService],
    controllers: [YearsController],
    exports:[YearsService]
})
export class YearsModule {}
