import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { lastValueFrom, map } from 'rxjs';
import { User } from '../user/entities/user.entity';

const BASE_URL = 'https://reqres.in/api';

@Injectable()
export class UsersFetcherService {
  constructor(private readonly httpService: HttpService) {}

  async fetchAllUsers(page: number = 1): Promise<User[]> {
    const results = await lastValueFrom(
      this.httpService
        .get<AxiosResponse<User[]>>(`${BASE_URL}/users?page=${page}`)
        .pipe(map((response) => response.data)),
    );
    const resultsData = results.data;

    return resultsData?.length > 0
      ? resultsData.concat(await this.fetchAllUsers(page + 1))
      : resultsData;
  }
}
