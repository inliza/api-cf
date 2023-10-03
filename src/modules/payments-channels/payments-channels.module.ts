import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from 'src/common/common.module';
import { PaymentsChannel, PaymentsChannelSchema } from 'src/models/payments-channels.model';
import { PaymentsChannelsService } from './payments-channels.service';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: PaymentsChannel.name, schema: PaymentsChannelSchema }]),
        CommonModule
    ],
    providers: [PaymentsChannelsService],
    exports: [PaymentsChannelsService]  
})
export class PaymentsChannelsModule {}
