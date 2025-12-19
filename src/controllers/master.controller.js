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

exports.deleteLanguage = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.language.delete({
            where: { id: parseInt(id) },
        });
        res.json({ message: "Language deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update Language
exports.updateLanguage = async (req, res) => {
    try {
        const { id } = req.params
        const { name } = req.body

        if (!name) {
            return res.status(400).json({ error: "Name is required" })
        }

        const updatedLanguage = await prisma.language.update({
            where: { id: parseInt(id) },
            data: { name },
        })

        res.json(updatedLanguage)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

// Update Category
exports.updateCategory = async (req, res) => {
    try {
        const { id } = req.params
        const { name } = req.body

        if (!name) {
            return res.status(400).json({ error: "Name is required" })
        }

        const updatedCategory = await prisma.category.update({
            where: { id: parseInt(id) },
            data: { name },
        })

        res.json(updatedCategory)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}


exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.category.delete({
            where: { id: parseInt(id) },
        });
        res.json({ message: "Category deleted successfully" });
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
