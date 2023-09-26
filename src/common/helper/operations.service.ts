import { Injectable } from "@nestjs/common";
import { ObjectId } from 'mongodb';

@Injectable()
export class OperationsService {


    compareMongoDBIds(id1: string, id2: string): boolean {
        try {
          const objectId1 = new ObjectId(id1);
          const objectId2 = new ObjectId(id2);
          return objectId1.equals(objectId2);
        } catch (error) {
          return false;
        }
      }
}