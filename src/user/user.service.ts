import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersFetcherService } from '../users-fetcher/users-fetcher.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private usersFetcherService: UsersFetcherService,
  ) {}

  create(createUserDto: CreateUserDto) {
    return this.usersRepository.save(createUserDto);
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(id: number): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User | null> {
    const updateResponse = await this.usersRepository.update(id, updateUserDto);
    if (updateResponse.affected > 0) {
      return this.usersRepository.findOneBy({ id });
    }

    return null;
  }

  async updateUsersFromDomain(): Promise<void> {
    const usersList = await this.usersFetcherService.fetchAllUsers();

    for (const user of usersList) {
      const existingUser = await this.usersRepository.findOneBy({
        external_id: user.id,
      });
      const newUser = {
        ...user,
        external_id: user.id,
      };

      if (existingUser) {
        await this.usersRepository.update(existingUser.id, newUser);
      } else {
        await this.usersRepository.save(newUser);
      }
    }
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
