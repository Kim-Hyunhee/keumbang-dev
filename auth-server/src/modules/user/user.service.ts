import { BadRequestException, Injectable } from '@nestjs/common';
import { InsertUser, UserRepository } from './user.repository';
import { exclude } from 'src/helper/exclude';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private repository: UserRepository) {}

  async fetchUser({ userName }: { userName: string }) {
    return await this.repository.findUser({ where: { userName } });
  }

  async createUser(data: InsertUser) {
    const hasUser = await this.fetchUser({ userName: data.userName });
    if (hasUser) {
      throw new BadRequestException('이미 존재하는 userName 입니다.');
    }

    // 비밀번호 제약 조건
    // 1. 숫자, 문자, 특수 문자 중 2가지 이상을 포함해야 합니다.
    const condition = new RegExp(
      /^(?=(.*[a-zA-Z])(?=.*\d)|(?=.*[a-zA-Z])(?=.*[!@#$%^&*\(\)_\+\-=\[\]\{\};\':\"\\|,.<>\/\?])|(?=.*\d)(?=.*[!@#$%^&*\(\)_\+\-=\[\]\{\};\':\"\\|,.<>\/\?]))/,
    );

    const passCondition = condition.test(data.password);
    if (!passCondition) {
      throw new BadRequestException(
        '비밀번호는 숫자, 문자, 특수 문자 중 2가지 이상을 포함해야 합니다.',
      );
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.repository.insertUser({
      ...data,
      password: hashedPassword,
    });

    return exclude(user, ['password']);
  }
}
