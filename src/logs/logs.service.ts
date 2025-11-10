import { Injectable } from '@nestjs/common';
import { CreateLogDto } from './dto/create-log.dto';
import { UpdateLogDto } from './dto/update-log.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Logs } from './logs.entity';
import { Repository } from 'typeorm';
import { Usuario } from 'src/usuario/usuario.entity';

@Injectable()
export class LogsService {
  constructor(
    @InjectRepository(Logs) private readonly logsRepo: Repository<Logs>,
    @InjectRepository(Usuario) private readonly usuarioRepo: Repository<Usuario>,
  ) {}
  async create(createLogDto: CreateLogDto) {
    const usuario = await this.usuarioRepo.findOne({ where: { id_usuario: createLogDto.id_usuario } });
    if (!usuario) {
      throw new Error('Usuario not found');
    }
    return this.logsRepo.save({
      ...createLogDto,
      usuario: usuario
    });
  }

  findAll() {
    return this.logsRepo.find();
  }

  findOne(id: number) {
    return this.logsRepo.findOne({ where: { id_log: id } });
  }

  async update(id: number, updateLogDto: UpdateLogDto) {
    const log = await this.logsRepo.findOne({ where: { id_log: id } });
    if (!log) {
      throw new Error('Log not found');
    }
    Object.assign(log, updateLogDto);
    return this.logsRepo.save(log);
  }

  async remove(id: number) {
    const log = await this.logsRepo.findOne({ where: { id_log: id } });
    if (!log) {
      throw new Error('Log not found');
    }
    return this.logsRepo.delete(id);
  }
}
