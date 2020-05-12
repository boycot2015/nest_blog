import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToMany,
    CreateDateColumn,
    UpdateDateColumn
} from 'typeorm';

@Entity()
export class File {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'text', default: null, charset: 'utf8mb4', select: true })
    fileName: string;

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