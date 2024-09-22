import { Test, TestingModule } from '@nestjs/testing';
import { DetteService } from './dette.service';

describe('DetteService', () => {
  let service: DetteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DetteService],
    }).compile();

    service = module.get<DetteService>(DetteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
