import { Module } from '@nestjs/common';
import { DocumentsTypesController } from './documents-types.controller';
import { DocumentsTypesService } from './documents-types.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from 'src/common/common.module';
import { HelperModule } from 'src/common/helper/helper.module';
import { DocumentsTypes, DocumentsTypesSchema } from 'src/models/documents-types.model';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: DocumentsTypes.name, schema: DocumentsTypesSchema }]),
        CommonModule,
        HelperModule
    ],
    providers: [DocumentsTypesService],
    controllers: [DocumentsTypesController]
})
export class DocumentsTypesModule { }
