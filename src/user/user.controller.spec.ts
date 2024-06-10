import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { MockUserRepository } from './mocks/mock-user-repository';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;
  const mockUserWithoutId: CreateUserDto = {
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@example.com',
    avatar: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: MockUserRepository,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a user', async () => {
    jest.spyOn(service, 'create').mockImplementation(async (user) => {
      return {
        id: 1,
        ...user,
      };
    });

    expect(await controller.create(mockUserWithoutId)).toEqual({
      id: 1,
      ...mockUserWithoutId,
    });
    expect(service.create).toHaveBeenCalledWith(mockUserWithoutId);
    expect(service.create).toHaveBeenCalledTimes(1);
  });

  it('should find all users', async () => {
    const mockUsersList = [
      {
        id: 1,
        ...mockUserWithoutId,
      },
      {
        id: 2,
        ...mockUserWithoutId,
      },
    ];
    jest.spyOn(service, 'findAll').mockImplementation(async () => {
      return mockUsersList;
    });

    expect(await controller.findAll()).toEqual(mockUsersList);
    expect(service.findAll).toHaveBeenCalledTimes(1);
  });

  it('should find one user by id', async () => {
    jest.spyOn(service, 'findOne').mockImplementation(async (id) => {
      return {
        id,
        ...mockUserWithoutId,
      };
    });
    expect(await controller.findOne('1')).toEqual({
      id: 1,
      ...mockUserWithoutId,
    });
    expect(service.findOne).toHaveBeenCalledWith(1);
    expect(service.findOne).toHaveBeenCalledTimes(1);
  });

  it('should update a user', async () => {
    jest
      .spyOn(service, 'update')
      .mockImplementation(async (id, user: User): Promise<User> => {
        return {
          id,
          ...user,
        };
      });
    expect(await controller.update('1', mockUserWithoutId)).toEqual({
      id: 1,
      ...mockUserWithoutId,
    });
    expect(service.update).toHaveBeenCalledWith(1, mockUserWithoutId);
    expect(service.update).toHaveBeenCalledTimes(1);
  });

  it('should throw NotFoundException if user to update is not found', async () => {
    jest.spyOn(service, 'update').mockImplementation(async () => {
      return null;
    });
    await expect(controller.update('2', mockUserWithoutId)).rejects.toThrow(
      NotFoundException,
    );
    expect(service.update).toHaveBeenCalledWith(2, mockUserWithoutId);
    expect(service.update).toHaveBeenCalledTimes(1);
  });

  it('should remove a user', async () => {
    jest.spyOn(service, 'remove').mockImplementation();

    expect(await controller.remove('1')).not.toBeDefined();
    expect(service.remove).toHaveBeenCalledWith(1);
    expect(service.remove).toHaveBeenCalledTimes(1);
  });
});
