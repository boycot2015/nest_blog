import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn
} from 'typeorm';
import { Article } from './article.entity';

@Entity()
export class Category {
    @PrimaryGeneratedColumn('uuid')
    id: number

    @Column({ type: 'text', default: null, charset: 'utf8mb4', select: true })
    label: string;

    @Column({ type: 'text', default: null, charset: 'utf8mb4', select: true })
    value: string;

    @Column({ type: 'text', default: null, select: true })
    parentId: number;

    @Column('enum', {
        enum: [1001, 1002],
        select: true
    })
    status: string; // 标签状态

    @OneToMany(
        () => Article,
        article => article.category
    )
    article: Array<Article>;

    @CreateDateColumn({
        type: 'datetime',
        comment: '创建时间',
        name: 'create_time'
    })
    createTime: Date;

    @UpdateDateColumn({
        type: 'datetime',
        comment: '更新时间',
        name: 'update_time'
    })
    updateTime: Date;
}