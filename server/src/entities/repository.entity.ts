import { Entity, Column, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity('repositories')
@Unique(['name', 'owner'])
export class RepositoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  owner: string;

  @Column()
  stars: number;
}
