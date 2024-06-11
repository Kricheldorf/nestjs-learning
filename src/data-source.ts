import * as dotenv from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from './user/entities/user.entity';

dotenv.config({ path: './config/.env' });

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: +process.env.POSTGRES_PORT,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [User],
  synchronize: false,
  migrations: [__dirname + '/migrations/*.ts'],
};

export const AppDataSource = new DataSource(dataSourceOptions);
