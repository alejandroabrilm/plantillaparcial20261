import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { Post } from './entities/post.entity';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
  ) {}

  create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create({
      username: createUserDto.username,
      bio: createUserDto.bio ?? null,
      followers: createUserDto.followers ?? 0,
    });
    return this.usersRepository.save(user);
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find({ relations: { posts: true } });
  }

  async createPost(userId: number, createPostDto: CreatePostDto): Promise<Post> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const post = this.postsRepository.create({
      caption: createPostDto.caption,
      likes: createPostDto.likes ?? 0,
      user,
    });
    return this.postsRepository.save(post);
  }

  async findPostsByUser(userId: number): Promise<Post[]> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return this.postsRepository.find({
      where: { user: { id: userId } },
      relations: { comments: true },
    });
  }
}
