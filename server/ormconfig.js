module.exports = {
    "type": "mysql",
    "host": "localhost",
    "port": 3306,
    "username": "boycot2017",
    "password": "zch17184",
    "database": "nest_blog",
    "entities": ["dist/**/*.entity{.ts,.js}"],
    "charset": "utf8mb4", // 设置数据库编码格式为utf8mb4
    "collation": "utf8mb4_unicode_ci", // 设置数据库表编码格式为utf8mb4_unicode_ci
    "synchronize": true
}