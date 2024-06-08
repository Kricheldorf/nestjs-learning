import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersTable1717879131148 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE "user"
        (
            id        SERIAL PRIMARY KEY,
            email     VARCHAR(255) NOT NULL,
            firstName VARCHAR(255) NOT NULL,
            lastName  VARCHAR(255) NOT NULL,
            avatar    VARCHAR(255)
        );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DROP TABLE "user";
    `);
  }
}
