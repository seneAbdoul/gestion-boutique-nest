import { Test, TestingModule } from '@nestjs/testing';
import { DetteController } from './dette.controller';

describe('DetteController', () => {
  let controller: DetteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DetteController],
    }).compile();

    controller = module.get<DetteController>(DetteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
