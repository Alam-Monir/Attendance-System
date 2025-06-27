module.exports = (sequelize, DataTypes) => {
    const Attendance = sequelize.define("Attendance", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: "Users",
                key: "id",
            },
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        checkInTime: DataTypes.TIME,
        lunchOutTime: DataTypes.TIME,
        lunchInTime: DataTypes.TIME,
        checkOutTime: DataTypes.TIME,
        location: DataTypes.TEXT,
    }, {
        tableName: "Attendances",
    });

    Attendance.associate = (models) => {
        Attendance.belongsTo(models.user, {
            foreignKey: "userId",
            onDelete: "CASCADE",
        });
    };

    return Attendance;
};
