import { Module } from '@nestjs/common';
import { UserTypesController } from './user-types.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from 'src/common/common.module';
import { UserTypesService } from './user-types.service';
import { UserTypes, UserTypesSchema } from 'src/models/user-types.model';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: UserTypes.name, schema: UserTypesSchema }]),
        CommonModule,
    ],
    providers: [UserTypesService],
    controllers: [UserTypesController],
    exports: [UserTypesService]
})
export class UserTypesModule { }
