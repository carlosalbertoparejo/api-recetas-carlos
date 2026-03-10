import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { Recipe } from './entities/recipe.entity';

@Injectable()
export class RecipesService {
  constructor(
    @InjectRepository(Recipe)
    private readonly recipesRepository: Repository<Recipe>,
    private readonly configService: ConfigService,
  ) {}

  create(dto: CreateRecipeDto) {
    const recipe = this.recipesRepository.create(dto);
    return this.recipesRepository.save(recipe);
  }

  findAll() {
    return this.recipesRepository.find({ order: { id: 'ASC' } });
  }

  async findOne(id: number) {
    const recipe = await this.recipesRepository.findOne({ where: { id } });
    if (!recipe) throw new NotFoundException(`Recipe ${id} no existe`);
    return recipe;
  }

  async update(id: number, dto: UpdateRecipeDto) {
    const recipe = await this.findOne(id);
    const merged = this.recipesRepository.merge(recipe, dto);
    return this.recipesRepository.save(merged);
  }

  async remove(id: number) {
    const recipe = await this.findOne(id);
    await this.recipesRepository.remove(recipe);
    return { message: `Recipe ${id} eliminada` };
  }

  async attachImage(id: number, fileName: string) {
    const recipe = await this.findOne(id);
    const appUrl = this.configService.get<string>('APP_URL', 'http://localhost:3000');
    recipe.image_url = `${appUrl}/files/${fileName}`;
    return this.recipesRepository.save(recipe);
  }
}
