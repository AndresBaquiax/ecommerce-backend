import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioService } from './register.service';
import { UsuarioController } from './register.controller';
import { RegisterUsuario } from './register.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RegisterUsuario])],
  controllers: [UsuarioController],
  providers: [UsuarioService],
})
export class UsuarioModule {}