const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Language Controllers
exports.getAllLanguages = async (req, res) => {
    try {
        const languages = await prisma.language.findMany();
        res.json(languages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createLanguage = async (req, res) => {
    try {
        const { name } = req.body;
        const language = await prisma.language.create({
            data: { name },
        });
        res.status(201).json(language);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Category Controllers
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await prisma.category.findMany();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const category = await prisma.category.create({
            data: { name },
        });
        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
