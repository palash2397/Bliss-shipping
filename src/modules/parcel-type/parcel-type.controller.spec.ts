import { Test, TestingModule } from '@nestjs/testing';
import { ParcelTypeController } from './parcel-type.controller';
import { ParcelTypeService } from './parcel-type.service';

describe('ParcelTypeController', () => {
  let controller: ParcelTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ParcelTypeController],
      providers: [ParcelTypeService],
    }).compile();

    controller = module.get<ParcelTypeController>(ParcelTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
