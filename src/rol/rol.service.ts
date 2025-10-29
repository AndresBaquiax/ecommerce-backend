import { Injectable } from '@nestjs/common';
import { Rol } from './rol.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class RolService {
  constructor(
    @InjectRepository(Rol) private rolRepo: Repository<Rol>,
  ) {}

  findAll() {
    return this.rolRepo.find();
  }
}