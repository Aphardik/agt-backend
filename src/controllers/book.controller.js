const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const transformBook = (req, book) => ({
    ...book,
    frontImage: book.frontImage ? `${req.protocol}://${req.get("host")}/api/books/${book.id}/image/front` : null,
    backImage: book.backImage ? `${req.protocol}://${req.get("host")}/api/books/${book.id}/image/back` : null,
});

// exports.getAllBooks = async (req, res) => {
//     try {
//         const page = parseInt(req.query.page) || 1;
//         const limit = parseInt(req.query.limit) || 10;
//         const search = req.query.search || "";
//         const skip = (page - 1) * limit;

//         const where = search ? {
//             OR: [
//                 { title: { contains: search, mode: "insensitive" } },
//                 { author: { contains: search, mode: "insensitive" } },
//                 { bookCode: isNaN(parseInt(search)) ? undefined : parseInt(search) }
//             ].filter(Boolean)
//         } : {};

//         const [books, total] = await Promise.all([
//             prisma.book.findMany({
//                 where,
//                 skip,
//                 take: limit,
//                 include: {
//                     Language: true,
//                     Category: true,
//                 },
//                 orderBy: { createdAt: "desc" }
//             }),
//             prisma.book.count({ where })
//         ]);

//         res.json({
//             books,
//             pagination: {
//                 total,
//                 page,
//                 limit,
//                 totalPages: Math.ceil(total / limit)
//             }
//         });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

exports.getAllBooks = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || "";
        const skip = (page - 1) * limit;

        // 1. Extract new filter parameters from query
        const {
            languageId, categoryId, isAvailable,
            kabatNumber, minPages, maxPages, bookSize,
            yearAD, vikramSamvat, veerSamvat
        } = req.query;

        // 2. Build a dynamic WHERE clause using AND
        const where = {
            AND: [
                // Search logic (keep your existing logic)
                search ? {
                    OR: [
                        { title: { contains: search, mode: "insensitive" } },
                        { author: { contains: search, mode: "insensitive" } },
                        { bookCode: isNaN(parseInt(search)) ? undefined : parseInt(search) }
                    ].filter(Boolean)
                } : {},

                // Language filter (handles single ID or array of IDs)
                languageId ? {
                    languageId: Array.isArray(languageId)
                        ? { in: languageId.map(id => parseInt(id)) }
                        : parseInt(languageId)
                } : {},

                // Category filter (handles single ID or array of IDs)
                categoryId ? {
                    categoryId: Array.isArray(categoryId)
                        ? { in: categoryId.map(id => parseInt(id)) }
                        : parseInt(categoryId)
                } : {},

                // Availability filter (converts string "true"/"false" to boolean)
                isAvailable !== undefined ? {
                    isAvailable: isAvailable === "true"
                } : {},
                // Kabat Number
                kabatNumber ? { kabatNumber: { contains: kabatNumber, mode: "insensitive" } } : {},
                // Book Size
                bookSize ? { bookSize: { contains: bookSize, mode: "insensitive" } } : {},
                // Pages Range
                (minPages || maxPages) ? {
                    pages: {
                        gte: minPages ? parseInt(minPages) : undefined,
                        lte: maxPages ? parseInt(maxPages) : undefined
                    }
                } : {},
                // Various Calendars
                yearAD ? { yearAD: parseInt(yearAD) } : {},
                vikramSamvat ? { vikramSamvat: parseInt(vikramSamvat) } : {},
                veerSamvat ? { veerSamvat: parseInt(veerSamvat) } : {}
            ].filter(q => Object.keys(q).length > 0) // Remove empty objects
        };

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
            books: books.map(book => transformBook(req, book)),
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
        res.json(transformBook(req, book));
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
                frontImage: req.files && req.files["frontImage"] ? req.files["frontImage"][0].buffer : null,
                backImage: req.files && req.files["backImage"] ? req.files["backImage"][0].buffer : null,
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
        res.status(201).json(transformBook(req, book));
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
            frontImage: frontImage || null,
            backImage: backImage || null,
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
                data.frontImage = req.files["frontImage"][0].buffer;
            }
            if (req.files["backImage"]) {
                data.backImage = req.files["backImage"][0].buffer;
            }
        }

        const book = await prisma.book.update({
            where: { id: parseInt(id) },
            data,
        });
        res.json(transformBook(req, book));
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

// exports.createMultipleBooks = async (req, res) => {
//     try {
//         const books = req.body;
//         if (!Array.isArray(books)) {
//             return res.status(400).json({ error: "Data must be an array of books" });
//         }

//         const parseIntSafe = (v) => {
//             const parsed = parseInt(v);
//             return isNaN(parsed) ? null : parsed;
//         };

//         const preparedBooks = books.map((item) => {
//             const {
//                 bookCode, kabatNumber, bookSize, title, description, frontImage, backImage, author,
//                 tikakar, prakashak, sampadak, anuvadak, vishay, shreni1,
//                 shreni2, shreni3, pages, yearAD, vikramSamvat, veerSamvat,
//                 price, prakar, edition, isAvailable, featured, languageId,
//                 categoryId, stockQty
//             } = item;

//             return {
//                 bookCode: parseIntSafe(bookCode) || 0,
//                 kabatNumber: parseIntSafe(kabatNumber),
//                 bookSize: bookSize || null,
//                 title: title || "Untitled",
//                 description: description || null,
//                 frontImage: frontImage || null,
//                 backImage: backImage || null,
//                 author: author || null,
//                 tikakar: tikakar || null,
//                 prakashak: prakashak || null,
//                 sampadak: sampadak || null,
//                 anuvadak: anuvadak || null,
//                 vishay: vishay || null,
//                 shreni1: shreni1 || null,
//                 shreni2: shreni2 || null,
//                 shreni3: shreni3 || null,
//                 pages: parseIntSafe(pages),
//                 yearAD: parseIntSafe(yearAD),
//                 vikramSamvat: parseIntSafe(vikramSamvat),
//                 veerSamvat: parseIntSafe(veerSamvat),
//                 price: price ? parseFloat(price) : 0,
//                 prakar: prakar || null,
//                 edition: parseIntSafe(edition),
//                 isAvailable: isAvailable === "true" || isAvailable === true,
//                 featured: featured === "true" || featured === true,
//                 languageId: parseIntSafe(languageId),
//                 categoryId: parseIntSafe(categoryId),
//                 stockQty: parseIntSafe(stockQty) ?? 0
//             };
//         });

//         // Filter out items that are missing mandatory title or bookCode
//         const validBooks = preparedBooks.filter(b => b.title && b.bookCode);

//         if (validBooks.length === 0) {
//             return res.status(400).json({ error: "No valid books found in the input data" });
//         }

//         const createdBooks = await prisma.book.createMany({
//             data: validBooks,
//             skipDuplicates: true,
//         });

//         res.status(201).json({
//             message: `${createdBooks.count} books created successfully`,
//             count: createdBooks.count,
//             totalProcessed: preparedBooks.length,
//             ignored: preparedBooks.length - validBooks.length
//         });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };


exports.createMultipleBooks = async (req, res) => {
    try {
        const books = req.body.books; // Expecting books array in req.body.books
        
        if (!Array.isArray(books)) {
            return res.status(400).json({ error: "Data must be an array of books" });
        }

        const parseIntSafe = (v) => {
            const parsed = parseInt(v);
            return isNaN(parsed) ? null : parsed;
        };

        // Helper to get buffer from either req.files OR Base64 string in JSON body
        const getBuffer = (index, key, base64Data) => {
            // 1. Check if file exists in multipart/form-data (files)
            if (req.files && req.files[`books[${index}][${key}]`]) {
                return req.files[`books[${index}][${key}]`][0].buffer;
            }
            // 2. Check if image was sent as Base64 string in JSON body
            if (base64Data && typeof base64Data === 'string' && base64Data.startsWith('data:image')) {
                const base64String = base64Data.split(';base64,').pop();
                return Buffer.from(base64String, 'base64');
            }
            return null;
        };

        const createdBooks = [];
        const errors = [];

        // Process each book individually to handle file uploads
        for (let i = 0; i < books.length; i++) {
            try {
                const item = books[i];
                const {
                    bookCode, kabatNumber, bookSize, title, description, 
                    frontImage, backImage, author, tikakar, prakashak, 
                    sampadak, anuvadak, vishay, shreni1, shreni2, shreni3, 
                    pages, yearAD, vikramSamvat, veerSamvat, price, prakar, 
                    edition, isAvailable, featured, languageId, categoryId, 
                    stockQty
                } = item;

                // Skip if missing mandatory fields
                if (!title || !bookCode) {
                    errors.push({ index: i, error: "Missing title or bookCode" });
                    continue;
                }

                // Handle file uploads - check for both multipart files and Base64
                const frontImageBuffer = getBuffer(i, 'frontImage', frontImage);
                const backImageBuffer = getBuffer(i, 'backImage', backImage);

                const book = await prisma.book.create({
                    data: {
                        title,
                        description: description || null,
                        frontImage: frontImageBuffer,
                        backImage: backImageBuffer,
                        stockQty: parseIntSafe(stockQty) ?? 0,
                        isAvailable: isAvailable === "true" || isAvailable === true,
                        featured: featured === "true" || featured === true,
                        languageId: parseIntSafe(languageId),
                        categoryId: parseIntSafe(categoryId),
                        bookCode: parseIntSafe(bookCode) || 0,
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
                        price: price ? parseFloat(price) : 0,
                        prakar: prakar || null,
                        edition: parseIntSafe(edition)
                    }
                });

                createdBooks.push(transformBook(req, book));
            } catch (error) {
                errors.push({ index: i, error: error.message });
            }
        }

        res.status(201).json({
            message: `${createdBooks.length} books created successfully`,
            count: createdBooks.length,
            totalProcessed: books.length,
            failed: errors.length,
            createdBooks: createdBooks,
            errors: errors.length > 0 ? errors : undefined
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getBookImage = async (req, res) => {
    try {
        const { id, type } = req.params;
        const book = await prisma.book.findUnique({
            where: { id: parseInt(id) },
            select: {
                frontImage: type === 'front',
                backImage: type === 'back'
            }
        });

        if (!book) return res.status(404).json({ error: "Book not found" });

        const image = type === 'front' ? book.frontImage : book.backImage;
        if (!image) return res.status(404).json({ error: "Image not found" });

        // You might want to store/detect the mime type, but usually images are jpeg/png
        // For simplicity, we'll try to detect from the buffer or just serve as image/jpeg
        res.set('Content-Type', 'image/jpeg'); // Defaulting to jpeg, browser usually handles it
        res.send(image);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
