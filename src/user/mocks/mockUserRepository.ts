export class MockUserRepository {
  find = jest.fn();
  findOne = jest.fn();
  save = jest.fn();
  remove = jest.fn();
}
