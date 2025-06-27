const Sequelize = require("sequelize");
const dbConfig = require("../config/db.config");

const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD,
    {
        host: dbConfig.HOST,
        dialect: dbConfig.dialect || "mysql",
        port: dbConfig.PORT || 3306,
        operatorsAliases: false,
        pool: dbConfig.pool,
    }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// ✅ Models
db.user = require("./user.model")(sequelize, Sequelize.DataTypes);
db.attendance = require("./attendance.model")(sequelize, Sequelize.DataTypes);
db.Leave = require("./leave.model")(sequelize, Sequelize.DataTypes);

// ✅ Run model associations (like belongsTo)
Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

module.exports = db;
