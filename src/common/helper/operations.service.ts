import { Injectable } from "@nestjs/common";
import { ObjectId } from 'mongodb';

@Injectable()
export class OperationsService {


  public compareMongoDBIds(id1: string, id2: string): boolean {
    try {
      const objectId1 = new ObjectId(id1);
      const objectId2 = new ObjectId(id2);
      return objectId1.equals(objectId2);
    } catch (error) {
      return false;
    }
  }

  public maskEmail(email) {
    const [name, domain] = email.split("@");
    const { length: len } = name;
    const maskedName = name[3] + "***" + name[len - 1];
    const maskedEmail = maskedName + "@" + domain;
    return maskedEmail;
  }



}