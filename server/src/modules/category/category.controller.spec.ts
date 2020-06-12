import { Test, TestingModule } from '@nestjs/testing';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';

describe('CategoryController', () => {
  let controller: CategoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [CategoryService]
    }).compile();

    controller = module.get<CategoryController>(CategoryController);
  });
  describe('root', () => {
    it('should return []', () => {
      expect(controller.get).toBeDefined();
    });
  });
});
