import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToMany,
    CreateDateColumn,
    UpdateDateColumn
} from 'typeorm';
import { Article } from './article.entity';

@Entity()
export class Tag {
    @PrimaryGeneratedColumn()
    id: number
    @Column({ type: 'text', default: null, charset: 'utf8mb4', select: true })
    label: string;

    @Column({ type: 'text', default: null, charset: 'utf8mb4', select: true })
    value: string;

    @Column('enum', {
        enum: [1001, 1002],
        select: true
    })
    status: string; // 标签状态

    @ManyToMany(
        () => Article,
        article => article.tags
    )
    articles: Array<Article>;

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