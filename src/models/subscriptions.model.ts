import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Subscriptions extends Document {
    @Prop({ required: true, minlength: 1, maxlength: 100 })
    paypalSubscriptionId: string;

    @Prop({ required: true, minlength: 1, maxlength: 100 })
    paypalOrderId: string;

    @Prop({ type: 'ObjectId', ref: 'Companies' })
    companyId: string;

    @Prop({ type: 'ObjectId', ref: 'SubscriptionsPlans' })
    planId: string;

    @Prop({ required: true })
    subscriberId: string;

    @Prop({ required: true, default: false })
    deleted: Boolean

    @Prop({ default: Date.now, required: true })
    createDate: Date;
}

export const subscriptionsSchema = SchemaFactory.createForClass(Subscriptions);
