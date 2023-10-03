import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from 'src/common/common.module';
import { PaymentsStatusService } from './payments-status.service';
import { PaymentsStatus, PaymentsStatusSchema } from 'src/models/payments-status.model';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: PaymentsStatus.name, schema: PaymentsStatusSchema }]),
        CommonModule
    ],
    providers: [PaymentsStatusService],
    exports: [PaymentsStatusService]
})
export class PaymentsStatusModule { }
