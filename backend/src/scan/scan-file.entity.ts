import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Scan } from './scan.entity';

@Entity('scan_files')
export class ScanFile {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Scan, { onDelete: 'CASCADE' })
  scan!: Scan;

  @Column()
  filename!: string;

  @Column({ type: 'longtext' })
  source!: string;

  @Column({ type: 'longtext' })
  parse!: string;
}
