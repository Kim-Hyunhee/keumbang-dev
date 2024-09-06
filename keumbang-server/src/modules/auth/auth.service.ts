import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable, lastValueFrom } from 'rxjs';

interface AuthServiceClient {
  VerifyToken(data: { token: string }): Observable<any>;
}

@Injectable()
export class AuthService implements OnModuleInit {
  private authService: AuthServiceClient;

  constructor(@Inject('AUTH_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.authService = this.client.getService<AuthServiceClient>('AuthService');
  }

  async verifyToken({ token }: { token: string }) {
    const response = this.authService.VerifyToken({ token });
    try {
      const result = await lastValueFrom(response);
      // console.log('Response from verifyToken:', result);
      return result;
    } catch (error) {
      throw new error();
      // console.error('Error during gRPC call:', error);
    }
  }
}
