import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export type Status = 'ok' | 'error' | 'warning';

@Entity('applications')
export class Application {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  repository!: string;

  @Column({ name: 'git_url' })
  gitUrl!: string;

  @Column()
  language!: string;

  @Column({ default: 'ok' })
  status!: Status;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
