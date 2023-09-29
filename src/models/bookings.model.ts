import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema()
export class Bookings {
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  clientId: mongoose.Types.ObjectId;

  @Prop({
    type: {
      _id: mongoose.Schema.Types.ObjectId,
      name: { type: String, required: true },
      image: {
        publicId: String,
        url: String,
        secureUrl: String,
        publicIdThumnail: String,
        urlThumnail: String,
        secureUrlThumnail: String,
      },
    },
    required: true,
  })
  vehicle: {
    _id: mongoose.Schema.Types.ObjectId;
    name: string;
    image: {
      publicId: string;
      url: string;
      secureUrl: string;
      publicIdThumnail: string;
      urlThumnail: string;
      secureUrlThumnail: string;
    };
  };

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  companyId: mongoose.Types.ObjectId;

  @Prop({ type: Number, min: 0, required: true })
  priceByDay: number;

  @Prop({ type: Number, min: 0, required: true })
  days: number;

  @Prop({ type: Number, min: 0, required: true })
  rcTotal: number;

  @Prop({ type: Number, min: 0, required: true })
  serviceFee: number;

  @Prop({ type: Number, min: 0, required: true })
  subTotal: number;

  @Prop({ type: Number, min: 0, required: true })
  itbis: number;

  @Prop({ type: Number, min: 0, required: true })
  total: number;

  @Prop({ required: true })
  coinType: string;

  @Prop({ type: Date, required: true })
  fromDate: Date;

  @Prop({ type: Date, default: Date.now, required: true })
  toDate: Date;

  @Prop({
    type: {
      _id: mongoose.Schema.Types.ObjectId,
      name: { type: String, required: true },
    },
    required: true,
  })
  pickupSite: { _id: mongoose.Schema.Types.ObjectId; name: string };

  @Prop({
    type: {
      _id: mongoose.Schema.Types.ObjectId,
      name: { type: String, required: true },
    },
    required: true,
  })
  deliverSite: { 
    _id: mongoose.Schema.Types.ObjectId; name: string };

  @Prop({ type: 'ObjectId', ref: 'bookingstatus' })
  bookingStatus: string;

  @Prop({ type: Date, default: Date.now, required: true })
  createdDate: Date;

  @Prop({ type: Boolean, default: false, required: true })
  deleted: boolean;
}

export const BookingSchema = SchemaFactory.createForClass(Bookings);
