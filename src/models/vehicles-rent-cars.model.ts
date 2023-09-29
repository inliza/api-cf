import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema()
export class VehicleRentCar extends Document {
  @Prop({
    type: {
      _id: { type: mongoose.Schema.Types.ObjectId },
      name: { type: String, required: true },
    },
    required: true,
  })
  model: {
    _id: mongoose.Schema.Types.ObjectId;
    name: string;
  };

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Makes', required: true })
  make: mongoose.Schema.Types.ObjectId;

  @Prop({ type: Number, required: true, min: 2000 })
  year: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  companyId: mongoose.Schema.Types.ObjectId;

  @Prop({ type: Number, min: 0, required: true })
  priceByDay: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'VehicleTypes', required: true })
  vehicleType: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'VehicleFuels', required: true })
  vehicleFuelType: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'VehicleStatus', required: true })
  vehicleStatus: mongoose.Schema.Types.ObjectId;

  @Prop({ type: String, required: true })
  coinType: string;

  @Prop({ type: String, required: true })
  placa: string;

  @Prop([
    {
      publicId: { type: String },
      url: { type: String },
      secureUrl: { type: String },
      publicIdThumnail: { type: String },
      urlThumnail: { type: String },
      secureUrlThumnail: { type: String },
    },
  ])
  images: Array<{
    publicId: string;
    url: string;
    secureUrl: string;
    publicIdThumnail: string;
    urlThumnail: string;
    secureUrlThumnail: string;
  }>;

  @Prop({ type: Date, default: Date.now, required: true })
  createDate: Date;

  @Prop({ type: Boolean, default: false, required: true })
  deleted: boolean;
}

export const VehicleRentCarSchema = SchemaFactory.createForClass(VehicleRentCar);
