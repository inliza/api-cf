import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema()
export class VehicleRentCar {
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

  @Prop({
    type: {
      _id: { type: mongoose.Schema.Types.ObjectId },
      name: { type: String, required: true },
    },
    required: true,
  })
  make: {
    _id: mongoose.Schema.Types.ObjectId;
    name: string;
  };

  @Prop({ type: Number, required: true, min: 2000 })
  year: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  companyId: mongoose.Schema.Types.ObjectId;

  @Prop({ type: Number, min: 0, required: true })
  priceByDay: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'VehiclesTypes', required: true })
  vehiclesTypes: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'VehiclesFuel', required: true })
  vehiclesFuel: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'VehiclesStatus', required: true })
  vehiclesStatus: mongoose.Schema.Types.ObjectId;

  @Prop({ type: String, required: true })
  coinType: string;

  @Prop({ type: String, required: true })
  placa: string;

  @Prop([
    {
      publicId: { type: String },
      url: { type: String },
      secureUrl: { type: String },
      publicIdThumbnail: { type: String },
      urlThumbnail: { type: String },
      secureUrlThumbnail: { type: String },
    },
  ])
  images: Array<{
    publicId: string;
    url: string;
    secureUrl: string;
    publicIdThumbnail: string;
    urlThumbnail: string;
    secureUrlThumbnail: string;
  }>;

  @Prop({ type: Date, default: Date.now, required: true })
  createDate: Date;

  @Prop({ type: Boolean, default: false, required: true })
  deleted: boolean;
}

export const VehicleRentCarSchema = SchemaFactory.createForClass(VehicleRentCar);
