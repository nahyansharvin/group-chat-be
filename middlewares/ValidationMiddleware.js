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

export const validateParams = (schema) => async (req, res, next) => {
    try {
        schema.parse(req.params);
        next();
    } catch (error) {
        const errorMessage = error.errors.map((err) => ({
            param: err.path.join("."),
            message: err.message
        }));
        res.status(400).json({ error: "Invalid parameter(s)", message: errorMessage });
    }
}