import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from 'src/common/common.module';
import { HelperModule } from 'src/common/helper/helper.module';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionsController } from './subscriptions.controller';
import { Subscriptions, subscriptionsSchema } from 'src/models/subscriptions.model';
import { SubscriptionsPlansModule } from '../subscriptions-plans/subscriptions-plans.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Subscriptions.name, schema: subscriptionsSchema }]),
        CommonModule,
        HelperModule,
        SubscriptionsPlansModule
    ],
    providers: [SubscriptionsService],
    controllers: [SubscriptionsController],
    exports: [SubscriptionsService]
})
export class SubscriptionsModule { }
