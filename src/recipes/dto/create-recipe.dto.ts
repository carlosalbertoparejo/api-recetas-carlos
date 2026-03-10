import { IsIn, IsInt, IsNotEmpty, IsString, MaxLength, Min } from 'class-validator';

export class CreateRecipeDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  nombre: string;

  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @IsString()
  @IsNotEmpty()
  ingredientes: string;

  @IsInt()
  @Min(1)
  tiempo_min: number;

  @IsString()
  @IsIn(['facil', 'media', 'dificil'])
  dificultad: 'facil' | 'media' | 'dificil';
}
