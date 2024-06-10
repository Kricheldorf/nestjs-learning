import { validate } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

describe('CreateUserDto', () => {
  it('should validate a valid DTO', async () => {
    const dto = new CreateUserDto();
    dto.first_name = 'John';
    dto.last_name = 'Doe';
    dto.email = 'john.doe@example.com';
    dto.avatar = 'http://example.com/avatar.jpg';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail if first_name is empty', async () => {
    const dto = new CreateUserDto();
    dto.first_name = '';
    dto.last_name = 'Doe';
    dto.email = 'john.doe@example.com';
    dto.avatar = 'http://example.com/avatar.jpg';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('first_name');
  });

  it('should fail if email is invalid', async () => {
    const dto = new CreateUserDto();
    dto.first_name = 'John';
    dto.last_name = 'Doe';
    dto.email = 'invalid-email';
    dto.avatar = 'http://example.com/avatar.jpg';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('email');
  });

  it('should pass if avatar is optional', async () => {
    const dto = new CreateUserDto();
    dto.first_name = 'John';
    dto.last_name = 'Doe';
    dto.email = 'john.doe@example.com';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail if first_name is missing', async () => {
    const dto = new CreateUserDto();
    dto.last_name = 'Doe';
    dto.email = 'john.doe@example.com';
    dto.avatar = 'http://example.com/avatar.jpg';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('first_name');
  });
});
