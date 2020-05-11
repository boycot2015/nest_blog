module.exports = {
    "type": "mysql",
    "host": "localhost",
    "port": 3306,
    "username": "root",
    "password": "root",
    "database": "nest_blog",
    "entities": ["dist/**/*.entity{.ts,.js}"],
    "charset": "utf8mb4", // 设置数据库编码格式为utf8mb4
    "collation": "utf8mb4_unicode_ci", // 设置数据库表编码格式为utf8mb4_unicode_ci
    "synchronize": true
}