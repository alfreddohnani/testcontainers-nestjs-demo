import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '~/user/entities/user.entity';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {
    super();
  }

  serializeUser(
    user: User,
    done: (arg1: User | null, arg2: User | null) => void,
  ) {
    done(null, user);
  }

  async deserializeUser(
    payload: User,
    done: (arg1: User | null, arg2: User | null) => void,
  ) {
    const user = await this.userRepo.findOneBy({ id: payload.id });
    return user ? done(null, user) : done(null, null);
  }
}
