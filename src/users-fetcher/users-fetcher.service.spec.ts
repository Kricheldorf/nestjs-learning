import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { UsersFetcherService } from './users-fetcher.service';

describe('UsersFetcherService', () => {
  let service: UsersFetcherService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersFetcherService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersFetcherService>(UsersFetcherService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
