import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { of } from 'rxjs';
import { UsersFetcherService } from './users-fetcher.service';
import { mockUserWithoutId } from '../user/mocks/mock-user-without-id';

describe('UsersFetcherService', () => {
  let service: UsersFetcherService;
  let httpService: HttpService;

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
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should fetch all users', async () => {
    const mockUsersList = [
      {
        ...mockUserWithoutId,
        id: 1,
      },
      {
        ...mockUserWithoutId,
        id: 2,
      },
    ];
    const getAxiosResponse = (usersList): AxiosResponse<unknown, any> => {
      return {
        data: {
          data: usersList,
        },
        headers: {},
        // @ts-expect-error Ignoring type error because it is not used
        config: {
          url: '',
        },
        status: 200,
        statusText: 'OK',
      };
    };
    jest.spyOn(httpService, 'get').mockImplementation((url) => {
      if (url.includes('page=1')) {
        return of(getAxiosResponse(mockUsersList));
      }
      return of(getAxiosResponse([]));
    });
    const users = await service.fetchAllUsers();

    expect(users.length).toBe(2);
    expect(users).toStrictEqual(mockUsersList);
  });
});
