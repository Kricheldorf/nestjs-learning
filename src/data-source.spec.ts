import { AppDataSource } from './data-source';

describe('AppDataSource', () => {
  beforeAll(async () => {
    await AppDataSource.initialize();
  });

  afterAll(async () => {
    await AppDataSource.destroy();
  });

  it('should initialize the data source', async () => {
    expect(AppDataSource.isInitialized).toBe(true);
  });

  it('should have the correct entities', () => {
    const entities = AppDataSource.entityMetadatas.map((entity) => entity.name);
    expect(entities).toContain('User');
  });
});
