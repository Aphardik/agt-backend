const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getAllBooks = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || "";
        const skip = (page - 1) * limit;

        const where = search ? {
            OR: [
                { title: { contains: search, mode: "insensitive" } },
                { author: { contains: search, mode: "insensitive" } },
                { bookCode: isNaN(parseInt(search)) ? undefined : parseInt(search) }
            ].filter(Boolean)
        } : {};

        const [books, total] = await Promise.all([
            prisma.book.findMany({
                where,
                skip,
                take: limit,
                include: {
                    Language: true,
                    Category: true,
                },
                orderBy: { createdAt: "desc" }
            }),
            prisma.book.count({ where })
        ]);

        res.json({
            books,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getBookById = async (req, res) => {
    try {
        const { id } = req.params;
        const book = await prisma.book.findUnique({
            where: { id: parseInt(id) },
            include: {
                Language: true,
                Category: true,
            },
        });
        if (!book) return res.status(404).json({ error: "Book not found" });
        res.json(book);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createBook = async (req, res) => {
    try {
        const { title, description, frontImage, backImage, stockQty, isAvailable, featured, languageId, categoryId, bookCode, kabatNumber, bookSize, author, tikakar, prakashak, sampadak, anuvadak, vishay, shreni1, shreni2, shreni3, pages, yearAD, vikramSamvat, veerSamvat, price, prakar, edition } = req.body;

        const parseIntSafe = (v) => {
            const parsed = parseInt(v);
            return isNaN(parsed) ? null : parsed;
        };

        const book = await prisma.book.create({
            data: {
                title,
                description: description || null,
                frontImage: req.files && req.files["frontImage"] ? `${req.protocol}://${req.get("host")}/uploads/${req.files["frontImage"][0].filename}` : frontImage || null,
                backImage: req.files && req.files["backImage"] ? `${req.protocol}://${req.get("host")}/uploads/${req.files["backImage"][0].filename}` : backImage || null,
                stockQty: parseIntSafe(stockQty) || 0,
                isAvailable: isAvailable === "true" || isAvailable === true,
                featured: featured === "true" || featured === true,
                languageId: parseIntSafe(languageId),
                categoryId: parseIntSafe(categoryId),
                bookCode: parseIntSafe(bookCode),
                kabatNumber: parseIntSafe(kabatNumber),
                bookSize: bookSize || null,
                author: author || null,
                tikakar: tikakar || null,
                prakashak: prakashak || null,
                sampadak: sampadak || null,
                anuvadak: anuvadak || null,
                vishay: vishay || null,
                shreni1: shreni1 || null,
                shreni2: shreni2 || null,
                shreni3: shreni3 || null,
                pages: parseIntSafe(pages),
                yearAD: parseIntSafe(yearAD),
                vikramSamvat: parseIntSafe(vikramSamvat),
                veerSamvat: parseIntSafe(veerSamvat),
                price: parseFloat(price) || 0,
                prakar: prakar || null,
                edition: parseIntSafe(edition)
            },
        });
        res.status(201).json(book);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateBook = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, frontImage, backImage, stockQty, isAvailable, featured, languageId, categoryId, bookCode, kabatNumber, bookSize, author, tikakar, prakashak, sampadak, anuvadak, vishay, shreni1, shreni2, shreni3, pages, yearAD, vikramSamvat, veerSamvat, price, prakar, edition } = req.body;

        const parseIntSafe = (v) => {
            const parsed = parseInt(v);
            return isNaN(parsed) ? null : parsed;
        };

        const data = {
            title,
            description: description || null,
            stockQty: parseIntSafe(stockQty) ?? 0,
            isAvailable: isAvailable === "true" || isAvailable === true,
            featured: featured === "true" || featured === true,
            languageId: parseIntSafe(languageId),
            categoryId: parseIntSafe(categoryId),
            bookCode: parseIntSafe(bookCode),
            kabatNumber: parseIntSafe(kabatNumber),
            bookSize: bookSize || null,
            author: author || null,
            tikakar: tikakar || null,
            prakashak: prakashak || null,
            sampadak: sampadak || null,
            anuvadak: anuvadak || null,
            vishay: vishay || null,
            shreni1: shreni1 || null,
            shreni2: shreni2 || null,
            shreni3: shreni3 || null,
            pages: parseIntSafe(pages),
            yearAD: parseIntSafe(yearAD),
            vikramSamvat: parseIntSafe(vikramSamvat),
            veerSamvat: parseIntSafe(veerSamvat),
            price: parseFloat(price) || 0,
            prakar: prakar || null,
            edition: parseIntSafe(edition)
        };

        if (req.files) {
            if (req.files["frontImage"]) {
                data.frontImage = `${req.protocol}://${req.get("host")}/uploads/${req.files["frontImage"][0].filename}`;
            }
            if (req.files["backImage"]) {
                data.backImage = `${req.protocol}://${req.get("host")}/uploads/${req.files["backImage"][0].filename}`;
            }
        }

        const book = await prisma.book.update({
            where: { id: parseInt(id) },
            data,
        });
        res.json(book);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteBook = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.book.delete({
            where: { id: parseInt(id) },
        });
        res.json({ message: "Book deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createMultipleBooks = async (req, res) => {
    try {
        const books = req.body;
        if (!Array.isArray(books)) {
            return res.status(400).json({ error: "Data must be an array of books" });
        }

        const preparedBooks = books.map((item) => {
            const { bookCode, kabatNumber, bookSize, title, description, author, tikakar, prakashak, sampadak, anuvadak, vishay, shreni1, shreni2, shreni3, pages, yearAD, vikramSamvat, veerSamvat, price, prakar, edition, isAvailable, featured, languageId, categoryId, stockQty } = item;

            return {
                bookCode: parseInt(bookCode),
                kabatNumber: kabatNumber ? parseInt(kabatNumber) : null,
                bookSize: bookSize || null,
                title: title,
                description: description || null,
                author: author || null,
                tikakar: tikakar || null,
                prakashak: prakashak || null,
                sampadak: sampadak || null,
                anuvadak: anuvadak || null,
                vishay: vishay || null,
                shreni1: shreni1 || null,
                shreni2: shreni2 || null,
                shreni3: shreni3 || null,
                pages: pages ? parseInt(pages) : null,
                yearAD: yearAD ? parseInt(yearAD) : null,
                vikramSamvat: vikramSamvat ? parseInt(vikramSamvat) : null,
                veerSamvat: veerSamvat ? parseInt(veerSamvat) : null,
                price: price ? parseFloat(price) : null,
                prakar: prakar || null,
                edition: edition ? parseInt(edition) : null,
                isAvailable: isAvailable ?? true,
                featured: featured ?? false,
                languageId: languageId ? parseInt(languageId) : 1,
                categoryId: categoryId ? parseInt(categoryId) : null,
                stockQty: stockQty ? parseInt(stockQty) : 1
            };
        });

        const createdBooks = await prisma.book.createMany({
            data: preparedBooks,
            skipDuplicates: true,
        });

        res.status(201).json({
            message: `${createdBooks.count} books created successfully`,
            count: createdBooks.count
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
