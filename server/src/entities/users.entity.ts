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
export class Users {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'text', charset: 'utf8mb4', default: null, select: true })
    username: string;

    @Column({ type: 'text', charset: 'utf8mb4', default: null, select: true })
    avatar: string;

    @Column({ type: 'text', default: null, select: false })
    password: string;

    @Column({ type: 'text', default: null, select: true })
    email: string;

    @Column({ type: 'text', default: null, select: true })
    cipher: string;

    @Column({ type: 'boolean', default: false, select: true })
    administrator: boolean;

    @Column('enum', {
        enum: [1001, 1002]
    })
    status: object; // 用户状态

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

    // , { cascade: true }
    @ManyToOne(() => Article, artitle => artitle.user)
    @JoinTable()
    article: Article;
}