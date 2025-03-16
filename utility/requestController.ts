import pool from '../middlewares/databasePool';
import { User, Tables, Aggregator } from './DataType';

const transformEmptyToNull = <T>(data: T): T => {
    const jsonString = JSON.stringify(data, (key, value) => value === "" ? null : value);
    return JSON.parse(jsonString);
};

const requestController = {

    find: async (whereArgument: String, fields: Array<string>, table: Tables, where?: string): Promise<any> => {
        const connection = await pool.getConnection();
        try {
            const result = await connection.query(`
                SELECT ${fields.join(', ')} FROM ${table} WHERE ${where ? where : "id"} = ?
            `, [whereArgument]);

            if(!result[0]) return false;

            else return JSON.parse(JSON.stringify(result[0], (key, value) =>
                typeof value === 'bigint'
                    ? Number(value)
                    : value
            ));
        } finally {
            connection.release();
        }
    },

    insert: async (data: Aggregator, type: Tables): Promise<Boolean> => {
        let connection;
        try {
            connection = await pool.getConnection();

            data = transformEmptyToNull(data);

            const columns = Object.keys(data);
            
            if (columns.length === 0) {
                throw new Error('Aucun champ valide à insérer');
            }
    
            const placeholders = columns.map(() => '?').join(', ');
            const columnNames = columns.join(', ');
            const values = columns.map(col => data[col as keyof typeof data]);
    
            const query = `INSERT INTO ${type} (${columnNames}) VALUES (${placeholders})`;
    
            const result = await connection.query(query, values);
            return result[0] !== undefined;
        } finally {
            console.log("FINALLY")
            if (connection) connection.release();
        }
    },

    updateByUuid: async (id: string, fields: Aggregator, type: Tables): Promise<boolean> => {
        let connection;
        try {
            connection = await pool.getConnection();

            fields = transformEmptyToNull(fields);

            const fieldsToUpdate = Object.entries(fields).filter(
                ([key]) => [ 'status', 'validation_date' ].includes(key)
            );

            if (fieldsToUpdate.length === 0) {
                throw new Error('Aucun champ valide à mettre à jour');
            }

            const setClause = fieldsToUpdate.map(([key]) => `${key} = ?`).join(', ');
            const values = fieldsToUpdate.map(([, value]) => value);
            const query = `UPDATE ${type} SET ${setClause} WHERE id = ?`;

            try {
                const rows = await connection.query(query, [...values, id]);
                if (rows.affectedRows > 0) {
                    console.log("Requête exécutée avec succès. Lignes affectées :", rows.affectedRows);
                    return true;
                } else {
                    console.log("Aucune ligne affectée.");
                    return false;
                }
            } catch (error: any) {
                console.error("Erreur :", error.code, "-", error.message);
                return false;
            }
        } catch (error) {
            console.error('Erreur lors de la mise à jour de l\'utilisateur :', error);
            return false;
        } finally {
            console.log("FINALLY")
            if (connection) connection.release();
        }
    },

    listAll: async (type: Tables): Promise<User[]> => {
        const connection = await pool.getConnection();
        try {
            const result = await connection.query(`
                SELECT * FROM ${type} LIMIT 40
            `);
            return result;
        } finally {
            connection.release();
        }
    },
};

export default requestController;