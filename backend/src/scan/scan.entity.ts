import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { Application } from '../application/application.entity';
import { ScanFile } from './scan-file.entity';

export type ScanStatus = 'scanning' | 'completed' | 'error';

@Entity('repository_scans')
export class Scan {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Application, { onDelete: 'CASCADE' })
  application!: Application;

  @Column({ default: 'scanning' })
  status!: ScanStatus;

  @Column({ nullable: true })
  stage?: string;

  @Column({ type: 'int', default: 0 })
  progress!: number;

  @Column({ type: 'longtext', nullable: true })
  output?: string;

  @OneToMany(() => ScanFile, file => file.scan)
  files!: ScanFile[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
