const db = require('../config/db');

exports.getAllReports = async (req, res) => {
    try {
        const query = 'SELECT * FROM saved_reports ORDER BY created_at DESC';
        const result = await db.query(query);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getReportById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query('SELECT * FROM saved_reports WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Report not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createReport = async (req, res) => {
    try {
        const { name, configuration } = req.body;
        if (!name || !configuration) {
            return res.status(400).json({ error: 'Name and configuration are required' });
        }
        const query = `
            INSERT INTO saved_reports (name, configuration)
            VALUES ($1, $2)
            RETURNING *
        `;
        const result = await db.query(query, [name, JSON.stringify(configuration)]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateReport = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, configuration } = req.body;
        const query = `
            UPDATE saved_reports
            SET name = $1, configuration = $2, updated_at = CURRENT_TIMESTAMP
            WHERE id = $3
            RETURNING *
        `;
        const result = await db.query(query, [name, JSON.stringify(configuration), id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Report not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteReport = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM saved_reports WHERE id = $1', [id]);
        res.json({ message: 'Report deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
