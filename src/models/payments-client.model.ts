import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class PaymentsClients extends Document {
    
    @Prop({ type: 'ObjectId', ref: 'Clients', required: true })
    clientId: string;

    @Prop({ type: 'ObjectId', ref: 'Vehicles', required: true })
    vehicleId: string;

    @Prop({ type: 'ObjectId', ref: 'Companies', required: true })
    companyId: string;

    @Prop({ type: 'ObjectId', ref: 'Bookings', required: true })
    bookingId: string;

    @Prop({ type: Number, min: 0, required: true })
    amount: number;

    @Prop({ required: true, minlength: 1, maxlength: 50 })
    coinType: string;

    @Prop({ required: true})
    transactionId: string;

    @Prop({ required: true})
    transactionGuid: string;

    @Prop({ required: true})
    paymentNonce: string;

    @Prop({ required: true})
    paymentInfo: string;

    @Prop({ type: 'ObjectId', ref: 'paymentstypes', required: true })
    paymentType: string;

    @Prop({ type: 'ObjectId', ref: 'paymentstatus', required: true })
    paymentStatus: string;

    @Prop({ type: 'ObjectId', ref: 'paymentschannels', required: true })
    paymentChannel: string;

    @Prop({ type: Date, default: Date.now, required: true })
    createdDate: Date;

    @Prop({ type: Boolean, default: false, required: true })
    deleted: boolean;
}

export const PaymentsClientsSchema = SchemaFactory.createForClass(PaymentsClients);
