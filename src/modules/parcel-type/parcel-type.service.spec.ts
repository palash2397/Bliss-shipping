import { Test, TestingModule } from '@nestjs/testing';
import { ParcelTypeService } from './parcel-type.service';

describe('ParcelTypeService', () => {
  let service: ParcelTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ParcelTypeService],
    }).compile();

    service = module.get<ParcelTypeService>(ParcelTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
