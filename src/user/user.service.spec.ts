import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpService } from '@nestjs/axios';
import { User } from './entities/user.entity';
import { MockUserRepository } from './mocks/mock-user-repository';
import { mockUserWithoutId } from './mocks/mock-user-without-id';
import { UsersFetcherService } from '../users-fetcher/users-fetcher.service';

describe('UserService', () => {
  let service: UserService;
  let repository: MockUserRepository;
  let usersFetcherService: UsersFetcherService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersFetcherService,
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: MockUserRepository,
        },
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<MockUserRepository>(getRepositoryToken(User));
    usersFetcherService = module.get<UsersFetcherService>(UsersFetcherService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user', async () => {
    repository.save.mockReturnValue(mockUserWithoutId);
    const user = await service.create(mockUserWithoutId);

    expect(repository.save).toHaveBeenCalledTimes(1);
    expect(repository.save).toHaveBeenCalledWith(mockUserWithoutId);
    expect(user).toEqual(mockUserWithoutId);
  });

  it('should find all users', async () => {
    const mockUsersList = [
      { ...mockUserWithoutId, id: 1 },
      { ...mockUserWithoutId, id: 2 },
    ];
    repository.find.mockReturnValue(mockUsersList);
    const users = await service.findAll();

    expect(repository.find).toHaveBeenCalledTimes(1);
    expect(users).toEqual(mockUsersList);
  });

  it('should find an user by id', async () => {
    const mockUser = { ...mockUserWithoutId, id: 1 };
    repository.findOneBy.mockReturnValue(mockUser);
    const user = await service.findOne(1);

    expect(repository.findOneBy).toHaveBeenCalledTimes(1);
    expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    expect(user).toEqual(mockUser);
  });

  it('should remove an user by id', async () => {
    await service.remove(1);
    expect(repository.delete).toHaveBeenCalledTimes(1);
    expect(repository.delete).toHaveBeenCalledWith(1);
  });

  describe('update', () => {
    it('should update an user by id', async () => {
      const updatedMockUser = {
        ...mockUserWithoutId,
        first_name: 'Jane',
        id: 1,
      };
      const mockUpdateResponse = { affected: 1 };
      repository.update.mockReturnValue(mockUpdateResponse);
      repository.findOneBy.mockReturnValue(updatedMockUser);
      const user = await service.update(1, updatedMockUser);

      expect(repository.update).toHaveBeenCalledTimes(1);
      expect(repository.update).toHaveBeenCalledWith(1, updatedMockUser);
      expect(repository.findOneBy).toHaveBeenCalledTimes(1);
      expect(user).toEqual(updatedMockUser);
    });

    it('should return null if user is not found for update', async () => {
      const updatedMockUser = {
        ...mockUserWithoutId,
        first_name: 'Jane',
        id: 1,
      };
      const mockUpdateResponse = { affected: 0 };
      repository.update.mockReturnValue(mockUpdateResponse);
      const user = await service.update(1, updatedMockUser);

      expect(repository.update).toHaveBeenCalledTimes(1);
      expect(repository.update).toHaveBeenCalledWith(1, updatedMockUser);
      expect(repository.findOneBy).not.toHaveBeenCalled();
      expect(user).toEqual(null);
    });

    it('should update existing users and create new users from external domain', async () => {
      const mockUsersList = [
        { ...mockUserWithoutId, id: 1, external_id: 1 },
        { ...mockUserWithoutId, id: 2, external_id: 2 },
      ];
      const mockExistingUser = {
        ...mockUserWithoutId,
        id: 1,
        external_id: 1,
      };
      const mockNewUser = {
        ...mockUserWithoutId,
        id: 2,
        external_id: 2,
      };
      usersFetcherService.fetchAllUsers = jest
        .fn()
        .mockReturnValue(mockUsersList);
      repository.findOneBy = jest.fn().mockImplementation((query) => {
        if (query.external_id === mockExistingUser.external_id) {
          return mockExistingUser;
        }
        return null;
      });

      await service.updateUsersFromDomain();

      expect(usersFetcherService.fetchAllUsers).toHaveBeenCalledTimes(1);
      expect(repository.findOneBy).toHaveBeenCalledTimes(mockUsersList.length);
      expect(repository.findOneBy).toHaveBeenCalledWith({
        external_id: mockExistingUser.external_id,
      });
      expect(repository.findOneBy).toHaveBeenCalledWith({
        external_id: mockNewUser.external_id,
      });
      expect(repository.update).toHaveBeenCalledTimes(1);
      expect(repository.update).toHaveBeenCalledWith(
        mockExistingUser.id,
        mockExistingUser,
      );
      expect(repository.save).toHaveBeenCalledTimes(1);
      expect(repository.save).toHaveBeenCalledWith(mockNewUser);
    });
  });
});
