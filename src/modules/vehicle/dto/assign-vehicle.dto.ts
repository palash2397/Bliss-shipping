import { IsMongoId } from 'class-validator';

export class AssignVehicleDto {
  @IsMongoId()
  vehicleId: string;
}