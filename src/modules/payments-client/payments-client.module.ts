import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from 'src/common/common.module';
import { PaymentsClientsService } from './payments-client.service';
import { PaymentsClients, PaymentsClientsSchema } from 'src/models/payments-client.model';
import { PaymentsChannelsModule } from '../payments-channels/payments-channels.module';
import { PaymentsStatusModule } from '../payments-status/payments-status.module';
import { PaymentsTypesModule } from '../payments-types/payments-types.module';
import { HelperModule } from 'src/common/helper/helper.module';
import { PaymentsClientsController } from './payments-client.controller';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: PaymentsClients.name, schema: PaymentsClientsSchema }]),
        PaymentsChannelsModule,
        PaymentsStatusModule,
        PaymentsTypesModule,
        CommonModule,
        HelperModule
    ],
    providers: [PaymentsClientsService],
    controllers: [PaymentsClientsController],
    exports: [PaymentsClientsService]
})
export class PaymentsClientsModule { }