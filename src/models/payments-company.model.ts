import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class PaymentsToCompany extends Document {

    @Prop({ type: 'ObjectId', ref: 'Companies', required: true })
    companyId: string;

    @Prop({ required: true})
    subscriberId: string;

    @Prop({ type: 'ObjectId', ref: 'Bookings', required: true })
    bookingId: string;

    @Prop({ type: Number, min: 0, required: true })
    amount: number;

    @Prop({ required: true, minlength: 1, maxlength: 50 })
    coinType: string;

    @Prop({ required: true})
    description: string;

    @Prop({ required: true})
    transactionGuid: string;

    @Prop({ required: true })
    batch_id: string;

    @Prop({ required: true})
    payout_batch_id: string;

    @Prop({ type: 'ObjectId', ref: 'paymentstatus', required: true })
    paymentStatus: string;

    @Prop({ type: Date, default: Date.now, required: true })
    createdDate: Date;

    @Prop({ type: Boolean, default: false, required: true })
    deleted: boolean;
}

export const PaymentsCompanySchema = SchemaFactory.createForClass(PaymentsToCompany);
