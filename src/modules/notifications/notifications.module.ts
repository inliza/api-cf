import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { HelperModule } from 'src/common/helper/helper.module';
import { NotificationsService } from './notifications.service';

@Module({
    imports: [
        CommonModule,
        HelperModule
    ],
    providers: [NotificationsService],
    exports: [NotificationsService]
}
)
export class NotificationsModule { }
