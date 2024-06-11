import { CreateUserDto } from '../dto/create-user.dto';

export const mockUserWithoutId: CreateUserDto = {
  first_name: 'John',
  last_name: 'Doe',
  email: 'john.doe@example.com',
  avatar: null,
  external_id: null,
};
