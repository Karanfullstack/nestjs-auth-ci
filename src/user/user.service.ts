import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user-entity/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './user-dto/user.dto';
import { UserUpdateDto } from './user-dto/user.update.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
    ) {}

    async createUser(user: CreateUserDto): Promise<UserEntity> {
        const existingUser = await this.findUserByEmail(user.email);
        if (existingUser) throw new ConflictException('User with this email already exists');
        const newUser = this.userRepository.create(user);
        return this.userRepository.save(newUser);
    }

    async findUserByEmail(email: string): Promise<UserEntity | null> {
        return await this.userRepository.findOne({ where: { email } });
    }

    async getAllUsers(): Promise<UserEntity[]> {
        return await this.userRepository.find();
    }

    async deleteUserById(id: number): Promise<boolean> {
        const user = await this.userRepository.remove({ id } as UserEntity);
        return !!user;
    }
    async updateUser(id: number, UserUpdateDto: UserUpdateDto): Promise<UserEntity> {
        return await this.userRepository.save({ id, ...UserUpdateDto });
    }

    async findUserByOrFail(id: number): Promise<UserEntity> {
        return await this.userRepository.findOneByOrFail({ id });
    }
}
