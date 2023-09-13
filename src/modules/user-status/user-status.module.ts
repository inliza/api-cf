import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { HelperModule } from 'src/common/helper/helper.module';
import { UserStatusService } from './user-status.service';
import { UserStatusController } from './user-status.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserStatus, UserStatusSchema } from 'src/models/user-status.model';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: UserStatus.name, schema: UserStatusSchema }]),
        CommonModule,
        HelperModule
    ],
    providers: [UserStatusService],
    controllers: [UserStatusController]
})
export class UserStatusModule { }
