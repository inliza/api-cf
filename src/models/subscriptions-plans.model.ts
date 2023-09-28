import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class SubscriptionsPlans extends Document {
    @Prop({ required: true, minlength: 1, maxlength: 100 })
    name: string;

    @Prop({ required: true, min: 0 })
    price: number;

    @Prop({ required: true })
    coinType: string;

    @Prop({ required: true, minlength: 1, maxlength: 100 })
    paypalPlanId: string;

    @Prop({ required: true, min: 0 })
    carQty: number;

    @Prop({ required: true, min: 0 })
    imgQty: number;

    @Prop({ required: true, default: true })
    deleted: Boolean
}

export const subscriptionsPlansSchema = SchemaFactory.createForClass(SubscriptionsPlans);
