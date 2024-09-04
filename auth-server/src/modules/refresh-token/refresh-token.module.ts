import { Module } from '@nestjs/common';
import { RefreshTokenService } from './refresh-token.service';
import { UserModule } from '../user/user.module';
import { RefreshTokenRepository } from './refresh-token.repository';
import { JwtModule } from '@nestjs/jwt';

@Module({
  providers: [RefreshTokenService, RefreshTokenRepository],
  exports: [RefreshTokenService],
  imports: [UserModule, JwtModule],
})
export class RefreshTokenModule {}
