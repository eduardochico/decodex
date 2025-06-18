import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn } from 'typeorm';
import { Application } from '../application/application.entity';

export type ScanStatus = 'scanning' | 'completed' | 'error';

@Entity('repository_scans')
export class Scan {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Application, { onDelete: 'CASCADE' })
  application!: Application;

  @Column({ default: 'scanning' })
  status!: ScanStatus;

  @Column({ type: 'longtext', nullable: true })
  output?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
