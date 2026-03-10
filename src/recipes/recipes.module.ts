import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipesController } from './recipes.controller';
import { RecipesService } from './recipes.service';
import { Recipe } from './entities/recipe.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Recipe])],
	controllers: [RecipesController],
	providers: [RecipesService],
})
export class RecipesModule {}
