import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    JoinTable
} from 'typeorm';
import { Article } from './article.entity';

@Entity()
export class Comment {
    @PrimaryGeneratedColumn('uuid')
    id: number

    @Column({ type: 'text', charset: 'utf8mb4', default: null, select: true })
    name: string;

    @Column({ type: 'text', default: null, select: true })
    parentId: string;

    @Column({ type: 'text', charset: 'utf8mb4', default: null, select: true })
    ip: string;

    @Column({ type: 'text', charset: 'utf8mb4', default: null, select: true })
    avatar: string;

    @Column({ type: 'text', charset: 'utf8mb4', default: null, select: true })
    content: string;

    @Column({ type: 'text', charset: 'utf8mb4', default: null, select: true })
    userAgent: string;

    @Column('enum', {
        enum: [1001, 1002],
        select: true
    })
    status: string; // 标签状态

    @Column({ type: 'text', default: null, select: true })
    email: string;

    @CreateDateColumn({
        type: 'datetime',
        comment: '创建时间',
        name: 'create_time'
    })
    createTime: Date;

    @UpdateDateColumn({
        type: 'timestamp',
        comment: '更新时间',
        default: null,
        name: 'update_time'
    })
    updateTime: Date;

    @ManyToOne(
        () => Article,
        article => article.comment
    )
    article: Article;
}