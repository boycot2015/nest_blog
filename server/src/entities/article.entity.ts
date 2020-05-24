import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    ManyToMany,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
    JoinTable
} from 'typeorm';
import { Users } from './users.entity';
import { Tag } from './tag.entity';
import { Comment } from './comment.entity';
import { Category } from './category.entity';

@Entity()
export class Article {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'text', default: null, charset: 'utf8mb4', select: true })
    title: string

    @ManyToMany(
        () => Tag,
        tag => tag.articles
    )
    @JoinTable()
    tags: Array<Tag>

    @Column({ type: 'boolean', default: false })
    isDelete: boolean

    @Column({ type: 'text', default: null, charset: 'utf8mb4', select: true })
    content: string

    @Column({ type: 'text', default: null, charset: 'utf8mb4', select: true })
    category: string

    @Column({ type: 'text', default: null, charset: 'utf8mb4', select: true })
    categoryName: string
    
    @Column('enum', {
        enum: [1001, 1002, 1003]
    })
    status: string; // 文章状态

    @Column({ type: 'text', default: null, charset: 'utf8mb4', select: true })
    visitor: number; // 文章访问记录

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

    // , { cascade: true }
    @ManyToOne(() => Users, user => user.article)
    @JoinTable()
    user: Users

    @OneToMany(() => Comment, comment => comment.article)
    @JoinTable()
    comment: Array<Comment>

    // @ManyToOne(() => Category, category => category.article)
    // @JoinTable()
    // category: Category
}