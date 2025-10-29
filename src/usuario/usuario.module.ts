import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './usuario.entity';
import { UsuariosService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { Rol } from 'src/rol/rol.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario, Rol])],
  providers: [UsuariosService],
  controllers: [UsuarioController],
  exports: [UsuariosService],
})
export class UsuarioModule {}
