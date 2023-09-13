import { Module } from '@nestjs/common';
import { UserTypesController } from './user-types.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from 'src/common/common.module';
import { HelperModule } from 'src/common/helper/helper.module';
import { UserTypesService } from './user-types.service';
import { UserTypes, UserTypesSchema } from 'src/models/user-types.model';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: UserTypes.name, schema: UserTypesSchema }]),
        CommonModule,
        HelperModule
    ],
    providers: [UserTypesService],
    controllers: [UserTypesController]
})
export class UserTypesModule { }
