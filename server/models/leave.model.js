module.exports = (sequelize, DataTypes) => {
    const Leave = sequelize.define("leave", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        startDate: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        endDate: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        reason: {
            type: DataTypes.TEXT,
        },
        status: {
            type: DataTypes.ENUM("pending", "approved", "rejected"),
            defaultValue: "pending",
        },
    }, {
        tableName: "leaves",
        timestamps: true,
        createdAt: "createdAt",
        updatedAt: "updatedAt"
    });

    Leave.associate = (models) => {
        Leave.belongsTo(models.user, {
            foreignKey: "userId",
            onDelete: "CASCADE",
        });
    };

    return Leave;
};
