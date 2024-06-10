import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { MockUserRepository } from './mocks/mock-user-repository';
import { CreateUserDto } from './dto/create-user.dto';

describe('UserService', () => {
  let service: UserService;
  let repository: MockUserRepository;
  const mockUserWithoutId: CreateUserDto = {
    first_name: 'John',
    last_name: 'Doe',
    email: '',
    avatar: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: MockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<MockUserRepository>(getRepositoryToken(User));
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
  });
});
