import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'recipes', schema: 'public' })
export class Recipe {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 120 })
  nombre: string;

  @Column({ type: 'text' })
  descripcion: string;

  @Column({ type: 'text' })
  ingredientes: string;

  @Column({ type: 'int' })
  tiempo_min: number;

  @Column({ type: 'varchar', length: 20 })
  dificultad: 'facil' | 'media' | 'dificil';

  @Column({ type: 'varchar', length: 300, nullable: true })
  image_url: string | null;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
