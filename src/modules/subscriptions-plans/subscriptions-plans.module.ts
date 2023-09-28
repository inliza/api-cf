import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from 'src/common/common.module';
import { SubscriptionsPlans, subscriptionsPlansSchema } from 'src/models/subscriptions-plans.model';
import { SubscriptionsPlansService } from './subscriptions-plans.service';
import { SubscriptionsPlansController } from './subscriptions-plans.controller';
import { HelperModule } from 'src/common/helper/helper.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: SubscriptionsPlans.name, schema: subscriptionsPlansSchema }]),
        CommonModule,
        HelperModule
    ],
    providers: [SubscriptionsPlansService],
    controllers: [SubscriptionsPlansController],
    exports: [SubscriptionsPlansService]
})
export class SubscriptionsPlansModule { }
