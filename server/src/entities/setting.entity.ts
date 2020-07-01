import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinTable,
} from 'typeorm';

@Entity()
export class Setting {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', charset: 'utf8mb4', default: null, select: true })
  banner: string;

  @Column({ type: 'text', charset: 'utf8mb4', default: null, select: true })
  notice: string;

  @Column({ type: 'text', charset: 'utf8mb4', default: null, select: true })
  siteConfig: string;

  @Column({ type: 'text', charset: 'utf8mb4', default: null, select: true })
  theme: string;
  @Column({ type: 'text', charset: 'utf8mb4', default: null, select: true })
  activity: string;
  @CreateDateColumn({
    type: 'datetime',
    comment: '创建时间',
    name: 'create_time',
  })
  createTime: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    comment: '更新时间',
    default: null,
    name: 'update_time',
  })
  updateTime: Date;
}
