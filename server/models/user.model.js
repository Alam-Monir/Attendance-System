module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("User", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            validate: {
                isEmail: true,
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        role: {
            type: DataTypes.ENUM("admin", "employee"),
            defaultValue: "employee",
        },
    }, {
        tableName: "Users",
    });

    User.associate = (models) => {
        User.hasMany(models.attendance, {
            foreignKey: "userId",
            onDelete: "CASCADE",
        });
    };

    return User;
};
