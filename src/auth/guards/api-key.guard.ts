import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../auth.service';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const apiKeyHeader = request.header('X-API-Key');

    if (!apiKeyHeader) {
      throw new UnauthorizedException('API Key requerida');
    }

    const isValid = await this.authService.isValidApiKey(apiKeyHeader);
    if (!isValid) {
      throw new UnauthorizedException('API Key inválida');
    }

    return true;
  }
}
