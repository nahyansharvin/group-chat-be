export const validateData = (schema) => async (req, res, next) => {
    try {
        schema.parse(req.body);
        next();
    } catch (error) {
        const errorMessage = error.errors.map((err) => ({
            field: err.path.join("."),
            message: err.message
        }));
        res.status(400).json({ error: "Invalid data", message: errorMessage });
    }
}