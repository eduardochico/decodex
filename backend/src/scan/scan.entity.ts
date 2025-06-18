import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn } from 'typeorm';
import { Application } from '../application/application.entity';

export type ScanStatus = 'success' | 'error';

@Entity('repository_scans')
export class Scan {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Application, { onDelete: 'CASCADE' })
  application!: Application;

  @Column({ default: 'success' })
  status!: ScanStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
