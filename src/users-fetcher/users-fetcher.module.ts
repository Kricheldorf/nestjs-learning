import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { UsersFetcherService } from './users-fetcher.service';

@Module({
  imports: [HttpModule],
  providers: [UsersFetcherService],
})
export class UsersFetcherModule {}
