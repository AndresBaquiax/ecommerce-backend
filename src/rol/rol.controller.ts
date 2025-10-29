import { Controller } from '@nestjs/common';
import { RolService } from './rol.service';
import { Get } from '@nestjs/common';

@Controller('rol')
export class RolController {
  constructor(private readonly rolService: RolService) {}

  @Get()
  findAll() {
    return this.rolService.findAll();
  }
}