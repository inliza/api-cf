import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from 'src/common/common.module';
import { PaymentsTypes, PaymentsTypesSchema } from 'src/models/payments-types.model';
import { PaymentsTypesService } from './payments-types.service';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: PaymentsTypes.name, schema: PaymentsTypesSchema }]),
        CommonModule
    ],
    providers: [PaymentsTypesService],
    exports: [PaymentsTypesService]
})
export class PaymentsTypesModule { }
