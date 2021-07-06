const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../config/connection');

class Song extends Model {

};

Song.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        artist: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        video_id: {
            type: DataTypes.STRING,
            allowNull: false
        },
        playlist_id: {
            type: DataTypes.INTEGER,
            references: {
                model: "playlist",
                key: "id",
            }
        }

    },

    {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'songs',
    }
);


module.exports = Song;